
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    ArrowLeft,
    ImagePlus,
    Scissors,
    Clock,
    Tag,
    DollarSign,
    FileText,
    Loader2,
    Upload,
    X,
    Activity,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddServicePage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");

    // New: Service Status (Default Active)
    const [status, setStatus] = useState("active");

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Image Selection
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB.");
            return;
        }

        setError("");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // Remove Selected Image
    const removeImage = () => {
        setImage(null);
        setPreview("");
    };

    // Upload Image to ImgBB
    const uploadImage = async (): Promise<string> => {
        if (!image) return "";

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            throw new Error("ImgBB API Key is missing.");
        }

        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Image upload failed.");
        }

        return result.data.url;
    };

    // Submit Service Form
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !name.trim() ||
            !description.trim() ||
            !category ||
            !price ||
            !duration
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (Number(price) < 0 || !Number.isFinite(Number(price))) {
            setError("Please enter a valid price.");
            return;
        }

        if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
            setError("Please enter a valid duration.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Step 1: Upload Image
            const imageUrl = await uploadImage();

            // Step 2: Prepare Service Data
            const serviceData = {
                name: name.trim(),
                description: description.trim(),
                category,
                price: Number(price),
                duration: Number(duration),
                image: imageUrl,
                status,
            };

            // Step 3: Send Data to Backend
            // Step 3: Get Authentication Token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            // Step 4: Send Data to Backend
            const response = await fetch(`${API_URL}/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${tokenData.token}`,
                },
                body: JSON.stringify(serviceData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add service.");
            }

            setSuccess("Service added successfully!");

            // Step 4: Go Back to Services Page
            setTimeout(() => {
                router.push("/dashboard/admin/services");
                router.refresh();
            }, 1000);

        } catch (error) {
            console.error("Add Service Error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="mx-auto max-w-5xl space-y-7">

            {/* Heading */}
            <section>
                <Link
                    href="/dashboard/admin/services"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8c5968] transition hover:text-[#542d38]"
                >
                    <ArrowLeft size={17} />
                    Back to Services
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8e5] text-[#754653]">
                        <Scissors size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#3d222c] sm:text-3xl">
                            Add New Service
                        </h1>

                        <p className="mt-1 text-sm text-[#907d81]">
                            Create a new service for your salon.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-[#eee5e0] bg-white shadow-sm"
            >

                <div className="border-b border-[#eee5e0] px-6 py-5 sm:px-8">
                    <h2 className="font-bold text-[#542d38]">
                        Service Information
                    </h2>

                    <p className="mt-1 text-xs text-[#9b898d]">
                        Enter the details of your new salon service.
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:p-8">

                    {/* Service Name */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                            Service Name *
                        </label>

                        <div className="relative">
                            <Scissors
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Premium Hair Cutting"
                                required
                                maxLength={100}
                                className="w-full rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none transition focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                            Description *
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                className="absolute left-4 top-4 text-[#a4777d]"
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your salon service..."
                                rows={4}
                                required
                                maxLength={1000}
                                className="w-full resize-none rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none transition focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10"
                            />
                        </div>
                    </div>

                    {/* Category, Price, Duration */}
                    <div className="grid gap-5 sm:grid-cols-3">

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                                Category *
                            </label>

                            <div className="relative">
                                <Tag
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                />

                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="w-full appearance-none rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-10 pr-3 text-sm text-[#542d38] outline-none focus:border-[#8c5968]"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Hair">Hair</option>
                                    <option value="Skin">Skin</option>
                                    <option value="Nails">Nails</option>
                                    <option value="Makeup">Makeup</option>
                                    <option value="Spa">Spa</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                                Price (BDT) *
                            </label>

                            <div className="relative">
                                <DollarSign
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                />

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="500"
                                    required
                                    className="w-full rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-10 pr-3 text-sm text-[#542d38] outline-none focus:border-[#8c5968]"
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                                Duration (Minutes) *
                            </label>

                            <div className="relative">
                                <Clock
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                />

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="30"
                                    required
                                    className="w-full rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-10 pr-3 text-sm text-[#542d38] outline-none focus:border-[#8c5968]"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Service Status */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                            Service Status *
                        </label>

                        <div className="relative">
                            <Activity
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                className="w-full appearance-none rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none transition focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <p className="mt-2 text-xs text-[#9b898d]">
                            Only active services will be available for customers to book.
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#542d38]">
                            Service Image
                        </label>

                        <div className="rounded-xl border-2 border-dashed border-[#e6d6d1] bg-[#fdfaf8] p-5">

                            {preview ? (
                                <div className="relative mx-auto max-w-sm">
                                    <Image
                                        src={preview}
                                        alt="Service preview"
                                        className="h-52 w-full rounded-xl object-cover"
                                        width={400}
                                        height={400}
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:bg-red-50"
                                        aria-label="Remove image"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center py-8 text-center">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e8e5] text-[#754653]">
                                        <ImagePlus size={27} />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-[#542d38]">
                                        Click to upload service image
                                    </p>

                                    <p className="mt-2 text-xs text-[#9b898d]">
                                        PNG, JPG or JPEG (Maximum 5MB)
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#eaded9] bg-white px-4 py-2 text-xs font-semibold text-[#754653]">
                                        <Upload size={15} />
                                        Choose Image
                                    </span>

                                </label>
                            )}

                        </div>

                        <p className="mt-2 text-xs text-[#9b898d]">
                            Image is optional. You can add it now or later.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                </div>

                {/* Form Buttons */}
                <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee5e0] bg-[#fdfaf8] px-6 py-5 sm:flex-row sm:px-8">

                    <Link
                        href="/dashboard/admin/services"
                        className="inline-flex items-center justify-center rounded-xl border border-[#eaded9] bg-white px-6 py-3 text-sm font-semibold text-[#754653] transition hover:bg-[#f7eeea]"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#542d38] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754653] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving Service...
                            </>
                        ) : (
                            <>
                                <Upload size={17} />
                                Save Service
                            </>
                        )}
                    </button>

                </div>

            </form>

        </main>
    );
};

export default AddServicePage;
