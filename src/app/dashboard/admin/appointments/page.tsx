
"use client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    Scissors,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare,
    CreditCard,
    UserRound,
    Mail,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
    _id: string;
    name: string;
    category?: string;
    price: number;
    duration: number;
};

type Customer = {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
};

type Appointment = {
    _id: string;
    serviceId: string;
    customerId: string | null;
    appointmentDate: string;
    timeSlot: string;
    message: string;
    servicePrice: number;
    paymentStatus: "unpaid" | "paid";
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
    service?: Service;
    customer?: Customer;
};

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Fetch Appointments
    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            setError("");

            // Get Authentication Token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            // Fetch Appointments
            const response = await fetch(`${API_URL}/appointments`, {
                headers: {
                    authorization: `Bearer ${tokenData.token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load appointments."
                );
            }

            setAppointments(data);
        } catch (error) {
            console.error("Fetch Appointments Error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Update Appointment Status
    const handleStatusUpdate = async (
        appointmentId: string,
        status: "confirmed" | "cancelled"
    ) => {
        const action = status === "confirmed" ? "confirm" : "cancel";

        if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) {
            return;
        }

        try {
            setIsUpdating(appointmentId);

            // Get Authentication Token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            // Send Status Update Request
            const response = await fetch(
                `${API_URL}/appointments/${appointmentId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update appointment."
                );
            }

            setAppointments((previousAppointments) =>
                previousAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status }
                        : appointment
                )
            );

            toast.success(data.message || "Appointment updated successfully!");

        } catch (error) {
            console.error("Update Appointment Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsUpdating(null);
        }
    };

    // Format Appointment Date
    const formatDate = (date: string) => {
        if (!date) return "N/A";

        const [year, month, day] = date.split("-");

        return `${day}/${month}/${year}`;
    };

    // Format Request Date
    const formatCreatedAt = (date: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-BD", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#b78b50]">
                            Admin Dashboard
                        </p>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Manage Appointments
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            View and manage all customer appointment requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchAppointments}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={isLoading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Total Appointments
                            </p>
                            <CalendarDays className="text-blue-600" size={22} />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {appointments.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Pending</p>
                            <AlertCircle className="text-yellow-600" size={22} />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {appointments.filter((item) => item.status === "pending").length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Confirmed</p>
                            <CheckCircle2 className="text-green-600" size={22} />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {appointments.filter((item) => item.status === "confirmed").length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Cancelled</p>
                            <XCircle className="text-red-600" size={22} />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {appointments.filter((item) => item.status === "cancelled").length}
                        </h2>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Appointment List */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-5 py-5 md:px-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            All Appointment Requests
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Review customer bookings and update their status.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <RefreshCw
                                size={30}
                                className="animate-spin text-[#b78b50]"
                            />
                            <p className="mt-4 text-sm text-gray-500">
                                Loading appointments...
                            </p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="px-5 py-20 text-center">
                            <CalendarDays
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-gray-800">
                                No Appointments Found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Customer appointment requests will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="p-5 transition hover:bg-gray-50/70 md:p-6"
                                >
                                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

                                        {/* Appointment Information */}
                                        <div className="min-w-0 flex-1">

                                            <div className="mb-4 flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {appointment.service?.name || "Service Information Unavailable"}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                                {/* Service Category */}
                                                <div className="flex items-start gap-3">
                                                    <Scissors
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Service Category
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {appointment.service?.category || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Appointment Date */}
                                                <div className="flex items-start gap-3">
                                                    <CalendarDays
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Appointment Date
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {formatDate(appointment.appointmentDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Time Slot */}
                                                <div className="flex items-start gap-3">
                                                    <Clock
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Time Slot
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {appointment.timeSlot}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Customer Name */}
                                                <div className="flex items-start gap-3">
                                                    <UserRound
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Customer Name
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {appointment.customer?.name || "Customer information unavailable"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Customer Email */}
                                                <div className="flex items-start gap-3">
                                                    <Mail
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Customer Email
                                                        </p>
                                                        <p className="break-all text-sm font-medium text-gray-700">
                                                            {appointment.customer?.email || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Service Price */}
                                                <div className="flex items-start gap-3">
                                                    <CreditCard
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Service Price
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {appointment.servicePrice} BDT
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Payment Status */}
                                                <div className="flex items-start gap-3">
                                                    <CreditCard
                                                        size={18}
                                                        className="mt-0.5 text-[#b78b50]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Payment Status
                                                        </p>
                                                        <p className={`text-sm font-semibold capitalize ${appointment.paymentStatus === "paid"
                                                                ? "text-green-600"
                                                                : "text-orange-600"
                                                            }`}>
                                                            {appointment.paymentStatus}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Message */}
                                            {appointment.message && (
                                                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        <MessageSquare size={16} />
                                                        Customer Message
                                                    </div>

                                                    <p className="text-sm leading-6 text-gray-600">
                                                        {appointment.message}
                                                    </p>
                                                </div>
                                            )}

                                            <p className="mt-4 text-xs text-gray-400">
                                                Request Date: {formatCreatedAt(appointment.createdAt)}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex shrink-0 flex-wrap gap-2 lg:w-44 lg:flex-col">

                                            {appointment.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment._id,
                                                                "confirmed"
                                                            )
                                                        }
                                                        disabled={isUpdating === appointment._id}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
                                                    >
                                                        <CheckCircle2 size={17} />
                                                        Confirm
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment._id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        disabled={isUpdating === appointment._id}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
                                                    >
                                                        <XCircle size={17} />
                                                        Cancel
                                                    </button>
                                                </>
                                            )}

                                            {appointment.status === "confirmed" && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            appointment._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    disabled={isUpdating === appointment._id}
                                                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <XCircle size={17} />
                                                    Cancel Appointment
                                                </button>
                                            )}

                                            {appointment.status === "cancelled" && (
                                                <p className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-medium text-gray-500">
                                                    No Actions Available
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isUpdating === appointment._id && (
                                        <p className="mt-3 text-right text-xs text-gray-500">
                                            Updating appointment...
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
