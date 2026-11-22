
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import {
    Scissors,
    CalendarDays,
    Users,
    Wallet,
    ArrowUpRight,
    Clock3,
    Sparkles,
    Hourglass,
    CheckCircle2,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Appointment = {
    _id: string;
    appointmentDate?: string;
    timeSlot?: string;
    status?: string;
    paymentStatus?: string;
    servicePrice?: number;
    createdAt?: string;
    serviceName?: string;
    customerName?: string;
    customerEmail?: string;
};

type DashboardStats = {
    totalServices: number;
    activeServices: number;
    totalCustomers: number;
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    totalRevenue: number;
    recentAppointments: Appointment[];
};

const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(amount || 0);
};

const getStatusStyle = (status?: string) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-yellow-100 text-yellow-700";
    }
};

const AdminDashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const firstName = session?.user.name?.split(" ")[0] || "Admin";

    let dashboardData: DashboardStats | null = null;
    let dashboardError = false;

    try {
        const tokenData = await auth.api.getToken({
            headers: await headers(),
        });

        if (!tokenData?.token) {
            throw new Error("Failed to get authentication token.");
        }

        const response = await fetch(
            `${API_URL}/admin/dashboard/stats`,
            {
                cache: "no-store",
                headers: {
                    authorization: `Bearer ${tokenData.token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard statistics.");
        }

        dashboardData = await response.json();

    } catch (error) {
        console.error("Dashboard Statistics Error:", error);
        dashboardError = true;
    }

    const stats = [
        {
            title: "Total Services",
            value: dashboardData?.totalServices ?? 0,
            description: `${dashboardData?.activeServices ?? 0} active services`,
            icon: Scissors,
        },
        {
            title: "Total Appointments",
            value: dashboardData?.totalAppointments ?? 0,
            description: "All booking requests",
            icon: CalendarDays,
        },
        {
            title: "Total Customers",
            value: dashboardData?.totalCustomers ?? 0,
            description: "Registered customers",
            icon: Users,
        },
        {
            title: "Total Revenue",
            value: formatCurrency(dashboardData?.totalRevenue ?? 0),
            description: "Total completed payments",
            icon: Wallet,
        },
    ];

    // Appointment Status Statistics
    const appointmentStats = [
        {
            title: "Pending Appointments",
            value: dashboardData?.pendingAppointments ?? 0,
            description: "Waiting for admin confirmation",
            icon: Hourglass,
            iconStyle: "bg-yellow-100 text-yellow-700",
            numberStyle: "text-yellow-700",
        },
        {
            title: "Confirmed Appointments",
            value: dashboardData?.confirmedAppointments ?? 0,
            description: "Successfully confirmed bookings",
            icon: CheckCircle2,
            iconStyle: "bg-green-100 text-green-700",
            numberStyle: "text-green-700",
        },
    ];

    const recentAppointments =
        dashboardData?.recentAppointments || [];

    return (
        <main className="space-y-8">

            {/* Welcome Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#542d38] to-[#754653] p-7 text-white shadow-lg sm:p-9">

                <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-28 right-36 h-64 w-64 rounded-full bg-white/5" />

                <div className="relative z-10 max-w-2xl">
                    <div className="mb-4 flex items-center gap-2 text-[#f0c8b9]">
                        <Sparkles size={18} />
                        <span className="text-xs font-semibold uppercase tracking-[2px]">
                            Admin Control Center
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Welcome back, {firstName}!
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#f0dfe0] sm:text-base">
                        Here is your salon management overview. Keep track of
                        your services, appointments and customers from one place.
                    </p>

                    <p className="mt-5 text-xs font-medium text-[#e8c6b9]">
                        Your Role: Admin
                    </p>
                </div>
            </section>

            {/* Page Heading */}
            <section>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-xl font-bold text-[#3d222c]">
                            Dashboard Overview
                        </h2>

                        <p className="mt-1 text-sm text-[#907d81]">
                            A quick overview of your salon business.
                        </p>
                    </div>

                    <p className="text-xs text-[#a4777d]">
                        Live database statistics
                    </p>
                </div>
            </section>

            {/* Dashboard Error */}
            {dashboardError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Unable to load dashboard statistics. Please check your
                    backend server.
                </div>
            )}

            {/* Main Statistics Cards */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-[#eee5e0] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                    <Icon size={22} />
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="text-[#c0a6a9]"
                                />
                            </div>

                            <p className="mt-5 text-sm font-medium text-[#8d7a7e]">
                                {stat.title}
                            </p>

                            <h3 className="mt-1 text-3xl font-bold text-[#3d222c]">
                                {stat.value}
                            </h3>

                            <p className="mt-2 text-xs text-[#a99a9d]">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Appointment Status Overview */}
            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#3d222c]">
                        Appointment Status Overview
                    </h3>

                    <p className="mt-1 text-sm text-[#9b898d]">
                        Monitor your appointment requests and confirmations.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {appointmentStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-[#eee5e0] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}>
                                        <Icon size={23} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-[#8d7a7e]">
                                            {stat.title}
                                        </p>

                                        <h3 className={`mt-1 text-3xl font-bold ${stat.numberStyle}`}>
                                            {stat.value}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-[#a99a9d]">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Lower Dashboard Sections */}
            <section className="grid gap-6 xl:grid-cols-3">

                {/* Recent Appointments */}
                <div className="rounded-2xl border border-[#eee5e0] bg-white p-6 shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-[#3d222c]">
                                Recent Appointments
                            </h3>

                            <p className="mt-1 text-xs text-[#9b898d]">
                                Latest customer booking activity
                            </p>
                        </div>

                        <CalendarDays
                            size={22}
                            className="text-[#8c5968]"
                        />
                    </div>

                    {recentAppointments.length === 0 ? (
                        <div className="mt-7 flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-[#eaded9] bg-[#fdfaf8] px-5 text-center">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e7e3] text-[#8c5968]">
                                <CalendarDays size={22} />
                            </div>

                            <h4 className="mt-4 text-sm font-semibold text-[#542d38]">
                                No appointment data yet
                            </h4>

                            <p className="mt-2 max-w-sm text-xs leading-5 text-[#9b898d]">
                                Customer appointments will appear here when
                                booking requests are available.
                            </p>

                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {recentAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#eee5e0] p-4 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0">
                                        <h4 className="truncate text-sm font-bold text-[#542d38]">
                                            {appointment.serviceName || "Service unavailable"}
                                        </h4>

                                        <p className="mt-1 text-xs text-[#8d7a7e]">
                                            {appointment.customerName ||
                                                "Customer details not linked yet"}
                                        </p>

                                        {appointment.customerEmail && (
                                            <p className="mt-1 truncate text-xs text-[#a99a9d]">
                                                {appointment.customerEmail}
                                            </p>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#9b898d]">
                                            <span>
                                                {formatDate(appointment.appointmentDate)}
                                            </span>

                                            <span>
                                                {appointment.timeSlot || "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status || "Pending"}
                                        </span>

                                        <span className="text-sm font-bold text-[#542d38]">
                                            {formatCurrency(
                                                appointment.servicePrice || 0
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Quick Information */}
                <div className="rounded-2xl border border-[#eee5e0] bg-white p-6 shadow-sm">

                    <h3 className="text-lg font-bold text-[#3d222c]">
                        Quick Information
                    </h3>

                    <p className="mt-1 text-xs text-[#9b898d]">
                        Your admin account details
                    </p>

                    <div className="mt-6 space-y-5">

                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                <Users size={19} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[#9b898d]">
                                    Admin Name
                                </p>

                                <p className="mt-1 truncate text-sm font-semibold text-[#542d38]">
                                    {session?.user.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                <Wallet size={19} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[#9b898d]">
                                    Account Email
                                </p>

                                <p className="mt-1 break-all text-sm font-semibold text-[#542d38]">
                                    {session?.user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#754653]">
                                <Clock3 size={19} />
                            </div>

                            <div>
                                <p className="text-xs text-[#9b898d]">
                                    Account Role
                                </p>

                                <p className="mt-1 text-sm font-semibold capitalize text-[#542d38]">
                                    {session?.user.role}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </section>

        </main>
    );
};

export default AdminDashboard;









