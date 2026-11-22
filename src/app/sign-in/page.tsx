
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//     Mail,
//     LockKeyhole,
//     Eye,
//     EyeOff,
//     Scissors,
//     ArrowRight,
//     Sparkles,
// } from "lucide-react";

// const SignInPage = () => {
//     const [showPassword, setShowPassword] = useState(false);

// }

// const handleSignin = async (e: React.FormEvent<HTMLFormElement>) =>{
//     e.preventDefault();
//     const formdata = new FormData(e.target)
//     const user = Object.fromEntries()

//     return (
//         <main className="min-h-screen bg-[#fbf7f3] flex items-center justify-center px-4 py-12">
//             <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

//                 {/* Left Side */}
//                 <div className="hidden md:flex flex-col justify-between bg-[#3d222c] text-[#f8eee9] p-12 relative overflow-hidden">

//                     <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#704653] opacity-40" />

//                     <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#704653] opacity-30" />

//                     {/* Logo */}
//                     <div className="relative z-10">
//                         <Link href="/" className="flex items-center gap-3">
//                             <div className="bg-[#f8eee9] p-2 rounded-xl">
//                                 <Scissors className="text-[#3d222c]" size={25} />
//                             </div>

//                             <span className="text-2xl font-bold tracking-wide">
//                                 SalonBook
//                             </span>
//                         </Link>
//                     </div>

//                     {/* Welcome Content */}
//                     <div className="relative z-10 space-y-6">

//                         <div className="flex items-center gap-2 text-[#e7b9a9]">
//                             <Sparkles size={20} />

//                             <span className="text-sm font-medium tracking-widest uppercase">
//                                 Welcome Back
//                             </span>
//                         </div>

//                         <h1 className="text-4xl lg:text-5xl font-serif leading-tight">
//                             Your beauty
//                             <span className="block italic text-[#e7b9a9]">
//                                 journey continues.
//                             </span>
//                         </h1>

//                         <p className="text-[#e6d6d1] leading-7 max-w-md">
//                             Sign in to your SalonBook account and manage your
//                             appointments, explore salon services, and enjoy
//                             a more personalized beauty experience.
//                         </p>

//                         <div className="pt-4 border-t border-white/20">
//                             <p className="text-sm text-[#d8c2bd]">
//                                 Discover. Book. Relax. Repeat.
//                             </p>
//                         </div>

//                     </div>

//                     {/* Copyright */}
//                     <div className="relative z-10 text-xs text-[#cbb5b0]">
//                         © 2026 SalonBook. All rights reserved.
//                     </div>

//                 </div>

//                 {/* Right Side - Sign In Form */}
//                 <div className="px-6 py-12 sm:px-12 lg:px-16 flex items-center">

//                     <div className="max-w-md mx-auto w-full">

//                         {/* Mobile Logo */}
//                         <Link
//                             href="/"
//                             className="md:hidden flex items-center gap-2 mb-10 text-[#3d222c]"
//                         >
//                             <Scissors size={24} />
//                             <span className="text-xl font-bold">SalonBook</span>
//                         </Link>

//                         {/* Heading */}
//                         <div className="mb-9">

//                             <p className="text-sm text-[#a4777d] font-semibold tracking-widest uppercase mb-3">
//                                 Welcome Back
//                             </p>

//                             <h2 className="text-3xl font-bold text-[#3d222c]">
//                                 Sign In
//                             </h2>

//                             <p className="text-gray-500 mt-2 text-sm">
//                                 Enter your details to access your SalonBook account.
//                             </p>

//                         </div>

//                         <form className="space-y-6">

//                             {/* Email */}
//                             <div>

//                                 <label className="block text-sm font-semibold text-[#3d222c] mb-2">
//                                     Email Address
//                                 </label>

//                                 <div className="relative">

//                                     <Mail
//                                         size={18}
//                                         className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
//                                     />

//                                     <input
//                                         id="email"
//                                         type="email"
//                                         name="email"
//                                         placeholder="Enter your email"
//                                         required
//                                         className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
//                                     />

//                                 </div>

//                             </div>

//                             {/* Password */}
//                             <div>

//                                 <div className="flex justify-between items-center mb-2">

//                                     <label className="block text-sm font-semibold text-[#3d222c]">
//                                         Password
//                                     </label>

//                                 </div>

//                                 <div className="relative">

//                                     <LockKeyhole
//                                         size={18}
//                                         className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
//                                     />

//                                     <input
//                                         id="password"
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         placeholder="Enter your password"
//                                         required
//                                         className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
//                                     />

//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d222c]"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff size={19} />
//                                         ) : (
//                                             <Eye size={19} />
//                                         )}
//                                     </button>

//                                 </div>

//                             </div>

//                             {/* Sign In Button */}
//                             <button
//                                 type="button"
//                                 className="w-full flex items-center justify-center gap-2 bg-[#3d222c] hover:bg-[#593442] text-white font-semibold py-3.5 rounded-xl transition duration-300 shadow-md shadow-[#3d222c]/10"
//                             >
//                                 Sign In
//                                 <ArrowRight size={18} />
//                             </button>

//                             {/* Divider */}
//                             <div className="flex items-center gap-4">

//                                 <div className="h-px bg-[#eaded9] flex-1" />

//                                 <span className="text-xs text-gray-400">
//                                     OR CONTINUE WITH
//                                 </span>

//                                 <div className="h-px bg-[#eaded9] flex-1" />

//                             </div>

//                             {/* Google Login */}
//                             <button
//                                 type="button"
//                                 className="w-full flex items-center justify-center gap-3 border border-[#eaded9] hover:bg-[#fdf8f5] text-[#3d222c] font-medium py-3 rounded-xl transition"
//                             >

//                                 <svg viewBox="0 0 48 48" className="w-5 h-5">
//                                     <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
//                                     <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.2 5.59c4.21-3.88 6.56-9.59 6.56-17.24z" />
//                                     <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
//                                     <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.2-5.59c-2 1.35-4.54 2.15-8.71 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
//                                 </svg>

//                                 Sign In with Google

//                             </button>

//                             {/* Sign Up Link */}
//                             <p className="text-center text-sm text-gray-500 pt-2">

//                                 Dont have an account?{" "}

//                                 <Link
//                                     href="/sign-up"
//                                     className="font-bold text-[#8c5968] hover:text-[#3d222c] transition"
//                                 >
//                                     Sign Up
//                                 </Link>

//                             </p>

//                         </form>

//                     </div>

//                 </div>

//             </div>
//         </main>
//     );
// };

// export default SignInPage;
























"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    Scissors,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Sign In Function
    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            // Form থেকে Email এবং Password নেওয়া
            const formData = new FormData(e.currentTarget);

            // FormData কে সাধারণ Object-এ রূপান্তর
            const user = Object.fromEntries(formData.entries());

            // Better Auth দিয়ে Sign In
            const { error } = await authClient.signIn.email({
                email: user.email as string,
                password: user.password as string,
            });

            if (error) {
                setError(error.message || "Invalid email or password.");
                return;
            }

            // Login successful
            router.push("/");
            router.refresh();

        } catch (err) {
            console.error("Sign In Error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlegoogleSignIn = async () => {
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

                    {/* Logo */}
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

                    {/* Welcome Content */}
                    <div className="relative z-10 space-y-6">

                        <div className="flex items-center gap-2 text-[#e7b9a9]">
                            <Sparkles size={20} />

                            <span className="text-sm font-medium tracking-widest uppercase">
                                Welcome Back
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-serif leading-tight">
                            Your beauty
                            <span className="block italic text-[#e7b9a9]">
                                journey continues.
                            </span>
                        </h1>

                        <p className="text-[#e6d6d1] leading-7 max-w-md">
                            Sign in to your SalonBook account and manage your
                            appointments, explore salon services, and enjoy
                            a more personalized beauty experience.
                        </p>

                        <div className="pt-4 border-t border-white/20">
                            <p className="text-sm text-[#d8c2bd]">
                                Discover. Book. Relax. Repeat.
                            </p>
                        </div>

                    </div>

                    {/* Copyright */}
                    <div className="relative z-10 text-xs text-[#cbb5b0]">
                        © 2026 SalonBook. All rights reserved.
                    </div>

                </div>

                {/* Right Side - Sign In Form */}
                <div className="px-6 py-12 sm:px-12 lg:px-16 flex items-center">

                    <div className="max-w-md mx-auto w-full">

                        {/* Mobile Logo */}
                        <Link
                            href="/"
                            className="md:hidden flex items-center gap-2 mb-10 text-[#3d222c]"
                        >
                            <Scissors size={24} />
                            <span className="text-xl font-bold">SalonBook</span>
                        </Link>

                        {/* Heading */}
                        <div className="mb-9">

                            <p className="text-sm text-[#a4777d] font-semibold tracking-widest uppercase mb-3">
                                Welcome Back
                            </p>

                            <h2 className="text-3xl font-bold text-[#3d222c]">
                                Sign In
                            </h2>

                            <p className="text-gray-500 mt-2 text-sm">
                                Enter your details to access your SalonBook account.
                            </p>

                        </div>

                        {/* Sign In Form */}
                        <form onSubmit={handleSignin} className="space-y-6">

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
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#eaded9] bg-[#fdfaf8] text-gray-800 outline-none focus:border-[#8c5968] focus:ring-2 focus:ring-[#8c5968]/10 transition"
                                    />

                                </div>

                            </div>

                            {/* Password */}
                            <div>

                                <div className="flex justify-between items-center mb-2">

                                    <label className="block text-sm font-semibold text-[#3d222c]">
                                        Password
                                    </label>

                                </div>

                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                                    />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        required
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

                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                    {error}
                                </p>
                            )}

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-[#3d222c] hover:bg-[#593442] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition duration-300 shadow-md shadow-[#3d222c]/10"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">

                                <div className="h-px bg-[#eaded9] flex-1" />

                                <span className="text-xs text-gray-400">
                                    OR CONTINUE WITH
                                </span>

                                <div className="h-px bg-[#eaded9] flex-1" />

                            </div>

                            {/* Google Login */}
                            <button
                            onClick={handlegoogleSignIn}
                                type="button"
                                className="w-full flex items-center justify-center gap-3 border border-[#eaded9] hover:bg-[#fdf8f5] text-[#3d222c] font-medium py-3 rounded-xl transition"
                            >

                                <svg viewBox="0 0 48 48" className="w-5 h-5">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.2 5.59c4.21-3.88 6.56-9.59 6.56-17.24z" />
                                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.2-5.59c-2 1.35-4.54 2.15-8.71 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>

                                Sign In with Google

                            </button>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-gray-500 pt-2">

                                Dont have an account?{" "}

                                <Link
                                    href="/sign-up"
                                    className="font-bold text-[#8c5968] hover:text-[#3d222c] transition"
                                >
                                    Sign Up
                                </Link>

                            </p>

                        </form>

                    </div>

                </div>

            </div>
        </main>
    );
};

export default SignInPage;
