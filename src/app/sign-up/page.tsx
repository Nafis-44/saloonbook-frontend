
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    UserRound,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ImagePlus,
    Scissors,
    ArrowRight,
    Sparkles,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Sign Up Form
    const handleEmailSignUp = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formElement = e.currentTarget;

        setLoading(true);

        try {
            const formData = new FormData(formElement);

            const name = String(formData.get("name") || "");
            const email = String(formData.get("email") || "");
            const password = String(formData.get("password") || "");
            const imageFile = formData.get("image");

            let imageUrl = "";

            // Step 1: Upload Profile Image to ImgBB
            if (imageFile instanceof File && imageFile.size > 0) {
                const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

                if (!apiKey) {
                    throw new Error(
                        "ImgBB API Key not found. Check your .env.local file."
                    );
                }

                const uploadData = new FormData();
                uploadData.append("image", imageFile);

                const imageResponse = await fetch(
                    `https://api.imgbb.com/1/upload?key=${apiKey}`,
                    {
                        method: "POST",
                        body: uploadData,
                    }
                );

                const imageResult = await imageResponse.json();

                if (!imageResponse.ok || !imageResult.success) {
                    throw new Error(
                        imageResult.error?.message ||
                        "Profile image upload failed."
                    );
                }

                imageUrl = imageResult.data.url;
            }

            // Step 2: Create User with Better Auth
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                ...(imageUrl ? { image: imageUrl } : {}),
            });

            // Step 3: Handle Error
            if (error) {
                console.error("Signup Error:", error);

                toast.error(error.message || "Registration failed.");

                return;
            }

            // Step 4: Successful Registration
            console.log("Signup Successful:", data);
            console.log("Registered User:", data?.user);
            console.log("Token:", data?.token);

            // Show Success Toast
            toast.success("Account created successfully!", {
                description: "Welcome to SalonBook!",
            });

            // Reset Form
            formElement.reset();
            setImageName("");
            setShowPassword(false);

            // Redirect to Homepage
            setTimeout(() => {
                router.push("/");
            }, 1200);

        } catch (error) {
            console.error("Registration Error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";

            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    const handlegoogleSignUp = async () => {
            const data = await authClient.signIn.social({
                provider: "google",
            });
            console.log(data);
        }

    return (
        <main className="min-h-screen bg-[#fbf7f3] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

                {/* Left Side */}
                <div className="hidden md:flex flex-col justify-between bg-[#3d222c] text-[#f8eee9] p-12 relative overflow-hidden">

                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#704653] opacity-40" />
                    <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#704653] opacity-30" />

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-[#f8eee9] p-2 rounded-xl">
                                <Scissors className="text-[#3d222c]" size={25} />
                            </div>

                            <span className="text-2xl font-bold tracking-wide">
                                SalonBook
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2 text-[#e7b9a9]">
                            <Sparkles size={20} />

                            <span className="text-sm font-medium tracking-widest uppercase">
                                Your Beauty Journey Starts Here
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-serif leading-tight">
                            Beauty begins with
                            <span className="block italic text-[#e7b9a9]">
                                a little self-care.
                            </span>
                        </h1>

                        <p className="text-[#e6d6d1] leading-7 max-w-md">
                            Create your SalonBook account and discover a better way to
                            experience salon services. Your next beauty appointment
                            is just a few steps away.
                        </p>

                        <div className="pt-4 border-t border-white/20">
                            <p className="text-sm text-[#d8c2bd]">
                                Discover. Book. Relax. Repeat.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-[#cbb5b0]">
                        © 2026 SalonBook. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Sign Up Form */}
                <div className="px-6 py-10 sm:px-12 lg:px-16">
                    <div className="max-w-md mx-auto">

                        <div className="mb-8">
                            <Link
                                href="/"
                                className="md:hidden flex items-center gap-2 mb-8 text-[#3d222c]"
                            >
                                <Scissors size={24} />
                                <span className="text-xl font-bold">
                                    SalonBook
                                </span>
                            </Link>

                            <p className="text-sm text-[#a4777d] font-semibold tracking-widest uppercase mb-3">
                                Join Our Community
                            </p>

                            <h2 className="text-3xl font-bold text-[#3d222c]">
                                Create Account
                            </h2>

                            <p className="text-gray-500 mt-2 text-sm">
                                Sign up to explore and book your favorite salon services.
                            </p>
                        </div>

                        <form
                            className="space-y-5"
                            onSubmit={handleEmailSignUp}
                        >

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#3d222c] mb-2">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                    />

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        required
                                        autoComplete="name"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#3d222c] mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        autoComplete="email"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-[#3d222c] mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                    />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a strong password"
                                        minLength={8}
                                        maxLength={128}
                                        pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Password must contain at least 8 characters, one uppercase and one lowercase letter."
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d222c]"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Minimum 8 characters, including one uppercase and one lowercase letter.
                                </p>
                            </div>

                            {/* Profile Image */}
                            <div>
                                <label className="block text-sm font-semibold text-[#3d222c] mb-2">
                                    Profile Image
                                </label>

                                <label className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-dashed border-[#c9aeb0] bg-[#fdfaf8] cursor-pointer hover:bg-[#f8eee9] transition">
                                    <div className="p-2 bg-[#f1e4df] rounded-lg">
                                        <ImagePlus size={20} className="text-[#704653]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#3d222c]">
                                            Upload your profile image
                                        </p>

                                        <p className="text-xs text-gray-400 truncate">
                                            {imageName || "PNG, JPG or JPEG"}
                                        </p>
                                    </div>

                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        accept="image/png,image/jpeg,image/jpg"
                                        className="hidden"
                                        onChange={(e) =>
                                            setImageName(e.target.files?.[0]?.name || "")
                                        }
                                    />
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-[#3d222c] hover:bg-[#593442] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition duration-300 shadow-md shadow-[#3d222c]/10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={19} className="animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-[#eaded9] flex-1" />

                                <span className="text-xs text-gray-400">
                                    OR CONTINUE WITH
                                </span>

                                <div className="h-px bg-[#eaded9] flex-1" />
                            </div>

                            {/* Google Sign Up */}
                            <button
                            onClick={handlegoogleSignUp}
                                type="button"
                                className="w-full flex items-center justify-center gap-3 border border-[#eaded9] hover:bg-[#fdf8f5] text-[#3d222c] font-medium py-3 rounded-xl transition"
                            >
                                <svg viewBox="0 0 48 48" className="w-5 h-5">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.2 5.59c4.21-3.88 6.56-9.59 6.56-17.24z" />
                                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19C.93 17.48 0 20.63 2.56 34.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.2-5.59c-2 1.35-4.54 2.15-8.71 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>

                                Sign Up with Google
                            </button>

                            {/* Sign In Link */}
                            <p className="text-center text-sm text-gray-500 pt-2">
                                Already have an account?{" "}
                                <Link
                                    href="/sign-in"
                                    className="font-bold text-[#8c5968] hover:text-[#3d222c] transition"
                                >
                                    Sign In
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;
