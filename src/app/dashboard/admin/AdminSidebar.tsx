
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
    LayoutDashboard,
    Scissors,
    CalendarDays,
    Users,
    CreditCard,
    UserCircle,
    LogOut,
    Menu,
    X,
    Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const menuItems = [
    {
        name: "Overview",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Manage Services",
        href: "/dashboard/admin/services",
        icon: Scissors,
    },
    {
        name: "Appointments",
        href: "/dashboard/admin/appointments",
        icon: CalendarDays,
    },
    {
        name: "Users",
        href: "/dashboard/admin/users",
        icon: Users,
    },
    {
        name: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: CreditCard,
    },
    {
        name: "My Profile",
        href: "/dashboard/admin/profile",
        icon: UserCircle,
    },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);

            await authClient.signOut();

            router.replace("/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
            setIsLoggingOut(false);
        }
    };

    const sidebarContent = (
        <>
            {/* Logo */}
            <Link
                href="/"
                className="flex items-center gap-3 border-b border-white/10 px-6 py-6"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e7df] text-[#542d38]">
                    <Scissors size={22} />
                </div>

                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        SalonBook
                    </h2>
                    <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#d8b9bd]">
                        Admin Panel
                    </p>
                </div>
            </Link>

            {/* Navigation */}
            <div className="flex-1 px-4 py-7">
                <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-[#bda4aa]">
                    Main Menu
                </p>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            item.href === "/dashboard/admin"
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-[#f5e7df] text-[#542d38] shadow-sm"
                                        : "text-[#e5d6d8] hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon size={19} strokeWidth={1.8} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Card */}
            <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[#e8c6b9]">
                    <Sparkles size={16} />
                    <span className="text-xs font-semibold">
                        SalonBook Admin
                    </span>
                </div>

                <p className="text-xs leading-5 text-[#d3c0c3]">
                    Manage your salon, services and appointments from one place.
                </p>
            </div>

            {/* Sign Out */}
            <div className="border-t border-white/10 p-4">
                <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#f0c5c5] transition hover:bg-red-500/10 hover:text-white disabled:opacity-50"
                >
                    <LogOut size={19} />
                    {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="fixed left-4 top-4 z-[60] lg:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rounded-xl bg-[#542d38] p-3 text-white shadow-lg"
                    aria-label="Toggle admin menu"
                >
                    {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden min-h-screen w-[270px] shrink-0 flex-col bg-[#3d222c] lg:flex">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    />

                    <aside className="relative flex h-full w-[280px] flex-col bg-[#3d222c] shadow-2xl">
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
};

export default AdminSidebar;
