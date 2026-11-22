
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";

import {
    UserRound,
    Mail,
    ShieldCheck,
    ArrowLeft,
    Fingerprint,
    Sparkles,
} from "lucide-react";
import Image from "next/image";

const AdminProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "admin") {
        if (session.user.role === "customer") {
            redirect("/dashboard/customer");
        }

        redirect("/");
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-[#fbf7f3] px-4 py-10 md:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <Link
                    href="/dashboard/admin"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#8c5968] transition hover:text-[#542d38]"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#3d222c]">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-[#907d81]">
                        View your administrator account information.
                    </p>
                </div>

                {/* Profile Card */}
                <section className="overflow-hidden rounded-2xl border border-[#eee5e0] bg-white shadow-sm">

                    {/* Profile Header */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#542d38] to-[#754653] px-6 py-12 text-center text-white">

                        <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/5" />

                        <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative z-10">

                            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/40 bg-white text-[#754653]">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "Admin"}
                                        className="h-full w-full object-cover"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <UserRound size={48} />
                                )}
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 text-[#f0c8b9]">
                                <Sparkles size={17} />

                                <span className="text-xs font-semibold uppercase tracking-[2px]">
                                    Administrator Account
                                </span>
                            </div>

                            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                                {user.name || "Admin"}
                            </h2>

                            <p className="mt-2 text-sm text-[#f0dfe0]">
                                {user.email}
                            </p>

                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-6 md:p-8">

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#3d222c]">
                                Account Information
                            </h3>

                            <p className="mt-1 text-sm text-[#907d81]">
                                Your personal administrator details.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Full Name */}
                            <div className="rounded-xl border border-[#eee5e0] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                        <UserRound size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-[#9b898d]">
                                            Full Name
                                        </p>

                                        <p className="mt-1 truncate font-semibold text-[#542d38]">
                                            {user.name || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="rounded-xl border border-[#eee5e0] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                        <Mail size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-[#9b898d]">
                                            Email Address
                                        </p>

                                        <p className="mt-1 break-all font-semibold text-[#542d38]">
                                            {user.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="rounded-xl border border-[#eee5e0] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                        <ShieldCheck size={22} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#9b898d]">
                                            Account Role
                                        </p>

                                        <p className="mt-1 font-semibold capitalize text-[#542d38]">
                                            {user.role || "Admin"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account ID */}
                            <div className="rounded-xl border border-[#eee5e0] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                        <Fingerprint size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-[#9b898d]">
                                            Account ID
                                        </p>

                                        <p className="mt-1 break-all font-semibold text-[#542d38]">
                                            {user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Account Notice */}
                        <div className="mt-6 rounded-xl border border-[#eee5e0] bg-[#fdfaf8] p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={23}
                                    className="mt-0.5 shrink-0 text-[#754653]"
                                />

                                <div>
                                    <h4 className="font-semibold text-[#542d38]">
                                        Administrator Account
                                    </h4>

                                    <p className="mt-1 text-sm leading-6 text-[#907d81]">
                                        You are viewing the profile information
                                        associated with your SalonBook
                                        administrator account.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
};

export default AdminProfilePage;
