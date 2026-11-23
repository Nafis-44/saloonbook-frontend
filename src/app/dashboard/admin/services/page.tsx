
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
    Plus,
    Scissors,
    Search,
    Trash2,
    Pencil,
    Clock,
    RefreshCw,
    ImageIcon,
    AlertCircle,
    Power,
} from "lucide-react";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type Service = {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    image?: string;
    status?: string;
    createdAt: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

const ServicesPage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Status Updating State
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

    // Custom Delete Modal State
    const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

    // Fetch All Services
    const fetchServices = async () => {
        try {
            setIsLoading(true);
            setError("");

            // Get Authentication Token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(`${API_URL}/services`, {
                headers: {
                    authorization: `Bearer ${tokenData.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load services");
            }

            const data: Service[] = await response.json();

            setServices(data);

        } catch (error) {
            console.error("Fetch Services Error:", error);

            setError(
                "Services load করা যায়নি। Backend Server চালু আছে কি না পরীক্ষা করুন।"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);


    const handleToggleStatus = async (service: Service) => {
        const currentStatus = service.status || "active";

        const newStatus =
            currentStatus === "active" ? "inactive" : "active";

        try {
            setIsUpdatingStatus(service._id);

            // Get Authentication Token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(
                `${API_URL}/services/${service._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({
                        name: service.name,
                        description: service.description,
                        category: service.category,
                        price: service.price,
                        duration: service.duration,
                        image: service.image,
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update service status."
                );
            }

            // Update Local State
            setServices((prev) =>
                prev.map((item) =>
                    item._id === service._id
                        ? { ...item, status: newStatus }
                        : item
                )
            );

            toast.success(
                newStatus === "active"
                    ? "Service activated successfully!"
                    : "Service deactivated successfully!"
            );

        } catch (error) {
            console.error("Update Service Status Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong!"
            );
        } finally {
            setIsUpdatingStatus(null);
        }
    };


    // Delete Service
const handleDelete = async (id: string) => {
    try {
        setIsDeleting(id);

        // Get Authentication Token
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
            throw new Error("Failed to get authentication token.");
        }

        // Send Delete Request
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${tokenData.token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete service.");
        }

        setServices((prev) =>
            prev.filter((service) => service._id !== id)
        );

        setDeleteServiceId(null);

        toast.success("Service deleted successfully!");
    } catch (error) {
        console.error("Delete Service Error:", error);

        toast.error(
            error instanceof Error
                ? error.message
                : "Something went wrong!"
        );
    } finally {
        setIsDeleting(null);
    }
};
    // Search Services
    const filteredServices = services.filter((service) => {
        const search = searchTerm.toLowerCase();

        return (
            service.name.toLowerCase().includes(search) ||
            service.category.toLowerCase().includes(search)
        );
    });

    return (
        <main className="space-y-7">

            {/* Page Heading */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#a4777d]">
                        <Scissors size={15} />
                        Service Management
                    </div>

                    <h1 className="mt-2 text-2xl font-bold text-[#3d222c] sm:text-3xl">
                        Manage Services
                    </h1>

                    <p className="mt-2 text-sm text-[#907d81]">
                        Add, view and manage your salon services.
                    </p>
                </div>

                <Link
                    href="/dashboard/admin/services/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#542d38] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754653]"
                >
                    <Plus size={19} />
                    Add New Service
                </Link>

            </section>

            {/* Summary and Search */}
            <section className="rounded-2xl border border-[#eee5e0] bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>
                        <p className="text-sm text-[#907d81]">
                            Total Services
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-[#542d38]">
                            {services.length}
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search services..."
                                className="w-full rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3 pl-10 pr-4 text-sm text-[#542d38] outline-none transition focus:border-[#8c5968] sm:w-64"
                            />
                        </div>

                        <button
                            onClick={fetchServices}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eaded9] px-4 py-3 text-sm font-medium text-[#542d38] transition hover:bg-[#fdf7f4] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={isLoading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                    </div>

                </div>

            </section>

            {/* Services List */}
            <section className="overflow-hidden rounded-2xl border border-[#eee5e0] bg-white shadow-sm">

                <div className="border-b border-[#eee5e0] px-5 py-5 sm:px-6">
                    <h2 className="text-lg font-bold text-[#3d222c]">
                        All Services
                    </h2>

                    <p className="mt-1 text-xs text-[#9b898d]">
                        Manage all services available in your salon.
                    </p>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />

                        <p className="text-sm text-[#907d81]">
                            Loading services...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">

                        <AlertCircle size={35} className="text-red-500" />

                        <p className="mt-3 text-sm font-medium text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={fetchServices}
                            className="mt-4 rounded-lg bg-[#542d38] px-5 py-2 text-sm font-semibold text-white"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && services.length === 0 && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7eeea] text-[#754653]">
                            <Scissors size={29} />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[#542d38]">
                            No Services Added Yet
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#9b898d]">
                            Your salon services will appear here.
                            Start by adding your first service.
                        </p>

                        <Link
                            href="/dashboard/admin/services/add"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#542d38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                        >
                            <Plus size={18} />
                            Add Your First Service
                        </Link>

                    </div>
                )}

                {/* No Search Result */}
                {!isLoading &&
                    !error &&
                    services.length > 0 &&
                    filteredServices.length === 0 && (
                        <div className="flex min-h-[200px] flex-col items-center justify-center px-5 text-center">
                            <Search size={30} className="text-[#a4777d]" />

                            <p className="mt-3 text-sm font-semibold text-[#542d38]">
                                No matching services found
                            </p>

                            <p className="mt-1 text-xs text-[#9b898d]">
                                Try searching with another name or category.
                            </p>
                        </div>
                    )}

                {/* Service Cards */}
                {!isLoading && !error && filteredServices.length > 0 && (
                    <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">

                        {filteredServices.map((service) => {
                            const isActive = (service.status || "active") === "active";

                            return (
                                <article
                                    key={service._id}
                                    className="overflow-hidden rounded-2xl border border-[#eee5e0] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* Service Image */}
                                    <div className="relative h-48 bg-[#f7eeea]">

                                        {service.image ? (
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                className="h-full w-full object-cover"
                                                width={500}
                                                height={500}
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[#b38d95]">
                                                <ImageIcon size={42} />
                                            </div>
                                        )}

                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#754653] shadow-sm">
                                            {service.category}
                                        </span>

                                        {/* Status Badge */}
                                        <span
                                            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {isActive ? "Active" : "Inactive"}
                                        </span>

                                    </div>

                                    {/* Service Information */}
                                    <div className="p-5">

                                        <h3 className="text-lg font-bold text-[#542d38]">
                                            {service.name}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#907d81]">
                                            {service.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between border-t border-[#f0e8e4] pt-4">

                                            <div>
                                                <p className="text-xs text-[#9b898d]">
                                                    Service Price
                                                </p>

                                                <p className="mt-1 text-lg font-bold text-[#542d38]">
                                                    ৳{service.price.toLocaleString("en-BD")}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#8c5968]">
                                                <Clock size={15} />
                                                {service.duration} min
                                            </div>

                                        </div>

                                        {/* Status Toggle Button */}
                                        <button
                                            onClick={() => handleToggleStatus(service)}
                                            disabled={
                                                isUpdatingStatus !== null ||
                                                isDeleting !== null
                                            }
                                            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                                                ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                                                : "border border-green-100 bg-green-50 text-green-700 hover:bg-green-100"
                                                }`}
                                        >
                                            <Power size={16} />

                                            {isUpdatingStatus === service._id
                                                ? "Updating..."
                                                : isActive
                                                    ? "Deactivate Service"
                                                    : "Activate Service"}
                                        </button>

                                        {/* Edit and Delete Actions */}
                                        <div className="mt-3 grid grid-cols-2 gap-3">

                                            {/* Edit Button */}
                                            <Link
                                                href={`/dashboard/admin/services/edit/${service._id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-2.5 text-sm font-semibold text-[#754653] transition hover:bg-[#f3e8e5]"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => setDeleteServiceId(service._id)}
                                                disabled={
                                                    isDeleting !== null ||
                                                    isUpdatingStatus !== null
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </section>

            {/* Custom Delete Confirmation Modal */}
            {deleteServiceId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="text-red-600" size={24} />
                        </div>

                        <h2 className="text-xl font-bold text-[#3d222c]">
                            Delete Service?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you want to delete this service?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() => setDeleteServiceId(null)}
                                disabled={isDeleting !== null}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleDelete(deleteServiceId)}
                                disabled={isDeleting !== null}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting === deleteServiceId
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    );
};

export default ServicesPage;
