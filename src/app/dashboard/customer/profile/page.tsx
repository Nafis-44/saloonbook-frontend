
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";

import {
    UserRound,
    Mail,
    ShieldCheck,
    ArrowLeft,
    CalendarDays,
} from "lucide-react";
import Image from "next/image";

async function CustomerProfileContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "customer") {
        if (session.user.role === "admin") {
            redirect("/dashboard/admin");
        }

        redirect("/");
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-[#fbf7f3] px-4 py-10 md:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <Link
                    href="/dashboard/customer"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#8c5968] transition hover:text-[#542d38]"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#542d38]">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View your personal account information.
                    </p>
                </div>

                {/* Profile Card */}
                <section className="overflow-hidden rounded-2xl border border-[#f0e5e1] bg-white shadow-sm">

                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-[#542d38] to-[#8c5968] px-6 py-10 text-center text-white">

                        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/40 bg-white text-[#8c5968]">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "Customer"}
                                    className="h-full w-full object-cover"
                                    width={300}
                                    height={300}
                                />
                            ) : (
                                <UserRound size={45} />
                            )}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold">
                            {user.name || "Customer"}
                        </h2>

                        <p className="mt-1 text-sm text-[#f3dce2]">
                            SalonBook Customer
                        </p>
                    </div>

                    {/* Profile Information */}
                    <div className="p-6 md:p-8">

                        <h3 className="mb-6 text-xl font-bold text-[#542d38]">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Name */}
                            <div className="rounded-xl border border-[#f0e5e1] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#f3e5e9] p-3 text-[#8c5968]">
                                        <UserRound size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-semibold text-[#542d38]">
                                            {user.name || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="rounded-xl border border-[#f0e5e1] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#f3e5e9] p-3 text-[#8c5968]">
                                        <Mail size={21} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500">
                                            Email Address
                                        </p>

                                        <p className="mt-1 break-all font-semibold text-[#542d38]">
                                            {user.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Role */}
                            <div className="rounded-xl border border-[#f0e5e1] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#f3e5e9] p-3 text-[#8c5968]">
                                        <ShieldCheck size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Account Role
                                        </p>

                                        <p className="mt-1 font-semibold capitalize text-[#542d38]">
                                            {user.role || "Customer"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account ID */}
                            <div className="rounded-xl border border-[#f0e5e1] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#f3e5e9] p-3 text-[#8c5968]">
                                        <CalendarDays size={21} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500">
                                            Account ID
                                        </p>

                                        <p className="mt-1 break-all font-semibold text-[#542d38]">
                                            {user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Account Status */}
                        <div className="mt-6 rounded-xl bg-[#f8f1f2] p-5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck
                                    className="text-[#8c5968]"
                                    size={22}
                                />

                                <div>
                                    <p className="font-semibold text-[#542d38]">
                                        Account Information
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Your account is connected with SalonBook.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}

export default function CustomerProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />
                </div>
            }
        >
            <CustomerProfileContent />
        </Suspense>
    );
}
