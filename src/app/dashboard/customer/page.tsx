
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";

import {
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    Wallet,
    Scissors,
    UserRound,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Service = {
    name?: string;
    price?: number;
    duration?: number;
    image?: string;
};

type Appointment = {
    _id: string;
    appointmentDate: string;
    timeSlot: string;
    status: string;
    paymentStatus: string;
    servicePrice: number;
    service?: Service;
};

type CustomerDashboardData = {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    cancelledAppointments: number;
    appointments: Appointment[];
};

const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        case "pending":
            return "bg-yellow-100 text-yellow-700";

        default:
            return "bg-gray-100 text-gray-600";
    }
};

const CustomerDashboard = async () => {
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

    let dashboardData: CustomerDashboardData = {
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
        appointments: [],
    };


    try {
        const tokenData = await auth.api.getToken({
            headers: await headers(),
        });

        const response = await fetch(
            `${API_URL}/customer/appointments/${session.user.id}`,
            {
                cache: "no-store",
                headers: {
                    authorization: `Bearer ${tokenData.token}`,
                },
            }
        );

        if (response.ok) {
            dashboardData = await response.json();
        } else {
            console.error(
                "Customer Dashboard API Error:",
                response.status,
                await response.text()
            );
        }
    } catch (error) {
        console.error("Customer Dashboard Error:", error);
    }


    const stats = [
        {
            title: "Total Appointments",
            value: dashboardData.totalAppointments,
            icon: CalendarDays,
            color: "bg-[#f3e5e9] text-[#8c5968]",
        },
        {
            title: "Pending",
            value: dashboardData.pendingAppointments,
            icon: Clock,
            color: "bg-yellow-100 text-yellow-700",
        },
        {
            title: "Confirmed",
            value: dashboardData.confirmedAppointments,
            icon: CheckCircle,
            color: "bg-green-100 text-green-700",
        },
        {
            title: "Cancelled",
            value: dashboardData.cancelledAppointments,
            icon: XCircle,
            color: "bg-red-100 text-red-700",
        },
    ];

    return (
        <main className="min-h-screen bg-[#fbf7f3] px-4 py-10 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Welcome Section */}
                <section className="mb-8 rounded-2xl bg-gradient-to-r from-[#542d38] to-[#8c5968] p-8 text-white shadow-md">
                    <p className="text-sm text-[#f3dce2]">
                        Welcome Back!
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Hello, {session.user.name}!
                    </h1>

                    <p className="mt-3 text-sm text-[#f3dce2]">
                        Manage your appointments and enjoy your salon experience.
                    </p>
                </section>

                {/* Customer Dashboard Navigation */}
                <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <Link
                        href="/dashboard/customer/appointments"
                        className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-[#f3e5e9] p-3 text-[#8c5968]">
                                <CalendarDays size={25} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-[#542d38]">
                                    My Appointments
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage your appointments.
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/customer/profile"
                        className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-[#f3e5e9] p-3 text-[#8c5968]">
                                <UserRound size={25} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-[#542d38]">
                                    My Profile
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage your profile.
                                </p>
                            </div>
                        </div>
                    </Link>

                </section>

                {/* Dashboard Heading */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#542d38]">
                        Dashboard Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Here is a summary of your appointments.
                    </p>
                </div>

                {/* Statistics Cards */}
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {item.title}
                                        </p>

                                        <h3 className="mt-3 text-3xl font-bold text-[#542d38]">
                                            {item.value}
                                        </h3>
                                    </div>

                                    <div className={`rounded-xl p-3 ${item.color}`}>
                                        <Icon size={25} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Recent Appointments */}
                <section className="mt-10 rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#542d38]">
                            Recent Appointments
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your latest appointment activities.
                        </p>
                    </div>

                    {dashboardData.appointments.length === 0 ? (
                        <div className="py-12 text-center">
                            <Scissors
                                size={40}
                                className="mx-auto text-[#c7a5ae]"
                            />

                            <h3 className="mt-4 font-semibold text-[#542d38]">
                                No Appointments Yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                You have not booked any appointments yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dashboardData.appointments.slice(0, 5).map(
                                (appointment) => (
                                    <div
                                        key={appointment._id}
                                        className="rounded-xl border border-[#f0e5e1] p-5"
                                    >
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                            {/* Service Information */}
                                            <div>
                                                <h3 className="font-semibold text-[#542d38]">
                                                    {appointment.service?.name || "Service Unavailable"}
                                                </h3>

                                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-2">
                                                        <CalendarDays size={16} />
                                                        {formatDate(appointment.appointmentDate)}
                                                    </span>

                                                    <span className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        {appointment.timeSlot}
                                                    </span>

                                                    <span className="flex items-center gap-2">
                                                        <Wallet size={16} />
                                                        ৳{appointment.servicePrice}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Information */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                                                >
                                                    {appointment.status}
                                                </span>

                                                <span className="rounded-full bg-[#f3e5e9] px-3 py-1 text-xs font-semibold capitalize text-[#8c5968]">
                                                    Payment: {appointment.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
};

export default CustomerDashboard;
