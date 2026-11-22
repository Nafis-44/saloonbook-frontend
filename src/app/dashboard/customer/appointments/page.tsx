
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
    CalendarDays,
    Clock,
    Wallet,
    Scissors,
    XCircle,
    RefreshCw,
    ArrowLeft,
    CreditCard,
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

type AppointmentResponse = {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    cancelledAppointments: number;
    appointments: Appointment[];
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

const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

export default function MyAppointmentsPage() {
    const { data: session, isPending: isSessionPending } =
        authClient.useSession();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [payingId, setPayingId] = useState<string | null>(null);

    // Fetch Customer Appointments
    useEffect(() => {
        if (isSessionPending) return;

        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        const fetchAppointments = async () => {
            try {
                setLoading(true);

                const { data } = await authClient.token();

                const token = data?.token;

                const response = await fetch(
                    `${API_URL}/customer/appointments/${session.user.id}`,
                    {
                        cache: "no-store",
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result: AppointmentResponse = await response.json();

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments.");
                }

                setAppointments(result.appointments || []);
            } catch (error) {
                console.error("Fetch Appointments Error:", error);
                toast.error("Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [session?.user?.id, isSessionPending]);

    // Cancel Pending Appointment
    const handleCancel = async (appointmentId: string) => {
        if (!session?.user?.id) {
            toast.error("Please sign in first.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(appointmentId);

            const { data } = await authClient.token();

            const token = data?.token;

            const response = await fetch(
                `${API_URL}/customer/appointments/${appointmentId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        customerId: session.user.id,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to cancel appointment."
                );
            }

            setAppointments((previousAppointments) =>
                previousAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status: "cancelled" }
                        : appointment
                )
            );

            toast.success("Appointment cancelled successfully!");
        } catch (error) {
            console.error("Cancel Appointment Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Stripe Payment
    const handlePayment = async (appointmentId: string) => {
        if (!session?.user?.id) {
            toast.error("Please sign in first.");
            return;
        }

        try {
            setPayingId(appointmentId);
            const { data } = await authClient.token();

            const token = data?.token;

            const response = await fetch(
                `${API_URL}/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        appointmentId,
                        customerId: session.user.id,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to create payment session."
                );
            }

            if (!result.url) {
                throw new Error("Stripe Checkout URL not found.");
            }

            // Redirect Customer to Stripe Checkout
            window.location.href = result.url;

        } catch (error) {
            console.error("Stripe Payment Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Payment failed. Please try again."
            );

            setPayingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#fbf7f3] px-4 py-10 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/customer"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8c5968] hover:text-[#542d38]"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <h1 className="text-3xl font-bold text-[#542d38]">
                        My Appointments
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View and manage all your salon appointments.
                    </p>
                </div>

                {/* Appointments List */}
                <section className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#542d38]">
                                Appointment History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Total: {appointments.length} appointments
                            </p>
                        </div>

                        <CalendarDays
                            size={25}
                            className="text-[#8c5968]"
                        />
                    </div>

                    {loading || isSessionPending ? (
                        <div className="flex items-center justify-center gap-3 py-16 text-[#8c5968]">
                            <RefreshCw size={20} className="animate-spin" />
                            Loading appointments...
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="py-16 text-center">
                            <Scissors
                                size={45}
                                className="mx-auto text-[#c7a5ae]"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-[#542d38]">
                                No Appointments Found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                You have not booked any appointments yet.
                            </p>

                            <Link
                                href="/services"
                                className="mt-6 inline-block rounded-lg bg-[#542d38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8c5968]"
                            >
                                Explore Services
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="rounded-xl border border-[#f0e5e1] p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                                        {/* Service Information */}
                                        <div>
                                            <h3 className="text-lg font-bold text-[#542d38]">
                                                {appointment.service?.name || "Service Unavailable"}
                                            </h3>

                                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
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

                                            {appointment.service?.duration && (
                                                <p className="mt-3 text-xs text-gray-400">
                                                    Duration: {appointment.service.duration} minutes
                                                </p>
                                            )}
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col items-start gap-3 lg:items-end">

                                            {/* Appointment and Payment Status */}
                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                                                >
                                                    {appointment.status}
                                                </span>

                                                <span className="rounded-full bg-[#f3e5e9] px-3 py-1 text-xs font-semibold capitalize text-[#8c5968]">
                                                    {appointment.paymentStatus}
                                                </span>
                                            </div>

                                            {/* Cancel Button */}
                                            {appointment.status === "pending" && (
                                                <button
                                                    onClick={() =>
                                                        handleCancel(appointment._id)
                                                    }
                                                    disabled={
                                                        cancellingId === appointment._id
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <XCircle size={16} />

                                                    {cancellingId === appointment._id
                                                        ? "Cancelling..."
                                                        : "Cancel Appointment"}
                                                </button>
                                            )}

                                            {/* Stripe Pay Now Button */}
                                            {appointment.status === "confirmed" &&
                                                appointment.paymentStatus === "unpaid" && (
                                                    <button
                                                        onClick={() =>
                                                            handlePayment(appointment._id)
                                                        }
                                                        disabled={
                                                            payingId !== null
                                                        }
                                                        className="flex items-center gap-2 rounded-lg bg-[#542d38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8c5968] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CreditCard size={17} />

                                                        {payingId === appointment._id
                                                            ? "Redirecting..."
                                                            : "Pay Now"}
                                                    </button>
                                                )}

                                            {/* Payment Completed */}
                                            {appointment.paymentStatus === "paid" && (
                                                <span className="text-sm font-semibold text-green-600">
                                                    Payment Completed
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
