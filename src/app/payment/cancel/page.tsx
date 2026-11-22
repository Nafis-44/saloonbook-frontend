
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <span className="text-4xl text-red-600">✕</span>
                </div>

                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                    Payment Cancelled!
                </h1>

                <p className="mb-6 text-gray-600">
                    Your payment was cancelled. No amount has been charged.
                    You can try again whenever you are ready.
                </p>

                {appointmentId && (
                    <p className="mb-6 break-all text-xs text-gray-400">
                        Appointment ID: {appointmentId}
                    </p>
                )}

                <Link
                    href="/dashboard/customer/appointments"
                    className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    Back to My Appointments
                </Link>
            </div>
        </main>
    );
}
