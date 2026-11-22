
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Scissors,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";

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
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
];

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const BookingPage = () => {
    const params = useParams();

    const serviceId = params.id as string;

    // Get Logged-in User Session
    const { data: session, isPending: isSessionPending } =
        authClient.useSession();

    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [message, setMessage] = useState("");

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Service Details
    useEffect(() => {
        const fetchService = async () => {
            try {
                setIsLoading(true);
                setError("");

                const { data, error } = await authClient.token();

                const token = data?.token;

                const response = await fetch(
                    `${API_URL}/services/${serviceId}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 404) {
                    throw new Error("Service not found.");
                }

                if (!response.ok) {
                    throw new Error("Failed to load service details.");
                }

                const result: Service = await response.json();

                if (result.status && result.status !== "active") {
                    throw new Error(
                        "This service is currently unavailable."
                    );
                }

                setService(result);

            } catch (error) {
                console.error("Fetch Booking Service Error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );

            } finally {
                setIsLoading(false);
            }
        };

        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    // Submit Booking Request
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setFormError("");
        setSuccessMessage("");

        // Check Session Loading
        if (isSessionPending) {
            setFormError("Please wait while we verify your account.");
            return;
        }

        // Check Logged-in User
        if (!session?.user?.id) {
            setFormError("Please sign in before booking an appointment.");
            return;
        }

        // Prevent Admin Booking
        if (session.user.role === "admin") {
            setFormError("Admin accounts cannot book customer appointments.");
            return;
        }

        if (!appointmentDate) {
            setFormError("Please select an appointment date.");
            return;
        }

        if (appointmentDate < getTodayDate()) {
            setFormError("Please select today or a future date.");
            return;
        }

        if (!timeSlot) {
            setFormError("Please select an appointment time.");
            return;
        }

        try {
            setIsSubmitting(true);
            const { data, error } = await authClient.token();

            const token = data?.token;

            // Get Customer ID from Better Auth Session
            const customerId = session.user.id;

            const response = await fetch(`${API_URL}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId,
                    customerId,
                    appointmentDate,
                    timeSlot,
                    message,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit appointment."
                );
            }

            setSuccessMessage(
                result.message ||
                "Appointment request submitted successfully!"
            );

            setAppointmentDate("");
            setTimeSlot("");
            setMessage("");

        } catch (error) {
            console.error("Submit Appointment Error:", error);

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fffaf7]">

            {/* Loading */}
            {isLoading && (
                <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />

                    <p className="text-sm text-[#907d81]">
                        Loading booking page...
                    </p>
                </div>
            )}

            {/* Error */}
            {!isLoading && error && (
                <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertCircle size={35} />
                    </div>

                    <h2 className="mt-5 text-2xl font-bold text-[#542d38]">
                        Service Unavailable
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-7 text-[#907d81]">
                        {error}
                    </p>

                    <Link
                        href="/services"
                        className="mt-6 rounded-xl bg-[#542d38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                    >
                        Browse Services
                    </Link>
                </div>
            )}

            {/* Booking Form */}
            {!isLoading && !error && service && (
                <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">

                    <Link
                        href={`/services/${service._id}`}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#754653] transition hover:text-[#542d38]"
                    >
                        <ArrowLeft size={18} />
                        Back to Service
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

                        {/* Form */}
                        <div className="rounded-3xl border border-[#eee5e0] bg-white p-6 shadow-sm sm:p-9">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a4777d]">
                                    SalonBook Appointment
                                </p>

                                <h1 className="mt-3 text-3xl font-bold text-[#542d38]">
                                    Book Your Appointment
                                </h1>

                                <p className="mt-3 text-sm leading-7 text-[#907d81]">
                                    Choose your preferred date and time to request an appointment.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-9 space-y-7"
                            >

                                {/* Appointment Date */}
                                <div>
                                    <label
                                        htmlFor="appointmentDate"
                                        className="mb-3 flex items-center gap-2 text-sm font-bold text-[#542d38]"
                                    >
                                        <CalendarDays size={18} />
                                        Appointment Date
                                    </label>

                                    <input
                                        id="appointmentDate"
                                        type="date"
                                        min={getTodayDate()}
                                        required
                                        value={appointmentDate}
                                        onChange={(e) => {
                                            setAppointmentDate(e.target.value);
                                            setFormError("");
                                            setSuccessMessage("");
                                        }}
                                        className="w-full rounded-xl border border-[#eaded9] bg-[#fffaf7] px-4 py-4 text-sm text-[#542d38] outline-none transition focus:border-[#754653] focus:ring-2 focus:ring-[#754653]/10"
                                    />

                                    <p className="mt-2 text-xs text-[#a18e92]">
                                        Select today or any future date.
                                    </p>
                                </div>

                                {/* Time Slot */}
                                <div>
                                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#542d38]">
                                        <Clock size={18} />
                                        Available Time Slots
                                    </label>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => {
                                                    setTimeSlot(slot);
                                                    setFormError("");
                                                    setSuccessMessage("");
                                                }}
                                                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${timeSlot === slot
                                                    ? "border-[#542d38] bg-[#542d38] text-white"
                                                    : "border-[#eaded9] bg-[#fffaf7] text-[#754653] hover:border-[#754653]"
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Optional Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-3 flex items-center gap-2 text-sm font-bold text-[#542d38]"
                                    >
                                        <MessageSquare size={18} />
                                        Additional Message
                                        <span className="font-normal text-[#a18e92]">
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="message"
                                        rows={4}
                                        maxLength={500}
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                            setSuccessMessage("");
                                        }}
                                        placeholder="Write any special request or message..."
                                        className="w-full resize-none rounded-xl border border-[#eaded9] bg-[#fffaf7] px-4 py-4 text-sm text-[#542d38] outline-none transition placeholder:text-[#b7a6a9] focus:border-[#754653] focus:ring-2 focus:ring-[#754653]/10"
                                    />

                                    <p className="mt-2 text-right text-xs text-[#a18e92]">
                                        {message.length}/500 characters
                                    </p>
                                </div>

                                {/* Form Error */}
                                {formError && (
                                    <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        <AlertCircle size={17} />
                                        {formError}
                                    </div>
                                )}

                                {/* Success Message */}
                                {successMessage && (
                                    <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                                        <div className="flex items-center gap-2 font-bold">
                                            <CheckCircle2 size={18} />
                                            Booking Successful!
                                        </div>

                                        <p className="mt-2 leading-6">
                                            {successMessage}
                                        </p>

                                        <p className="mt-1 text-xs">
                                            Your appointment is currently pending confirmation.
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSessionPending}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#542d38] py-4 text-sm font-bold text-white transition hover:bg-[#754653] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <CalendarDays size={18} />

                                    {isSessionPending
                                        ? "Checking Account..."
                                        : isSubmitting
                                            ? "Submitting..."
                                            : "Submit Booking Request"}
                                </button>

                            </form>
                        </div>

                        {/* Service Summary */}
                        <aside className="h-fit rounded-3xl border border-[#eee5e0] bg-white p-6 shadow-sm sm:p-7">

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a4777d]">
                                Your Selected Service
                            </p>

                            <div className="mt-5 flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f8f1ed] text-[#754653]">
                                    <Scissors size={23} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#542d38]">
                                        {service.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-[#907d81]">
                                        {service.category}
                                    </p>
                                </div>
                            </div>

                            <div className="my-6 border-t border-[#eee5e0]" />

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#907d81]">
                                    Duration
                                </span>

                                <span className="font-semibold text-[#542d38]">
                                    {service.duration} Minutes
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-[#907d81]">
                                    Service Price
                                </span>

                                <span className="text-xl font-bold text-[#542d38]">
                                    ৳{service.price.toLocaleString("en-BD")}
                                </span>
                            </div>

                            <div className="mt-6 rounded-xl bg-[#fffaf7] p-4">
                                <p className="text-xs leading-6 text-[#907d81]">
                                    Your appointment will be requested for the selected date and time. Confirmation will depend on appointment availability.
                                </p>
                            </div>

                        </aside>

                    </div>
                </section>
            )}
        </main>
    );
};

export default BookingPage;
