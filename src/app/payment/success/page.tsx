
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type PaymentVerificationResponse = {
    success: boolean;
    pending?: boolean;
    message?: string;
    paymentStatus?: string;
    transaction?: {
        amountTotal: number;
        currency: string;
        stripeSessionId: string;
        appointmentId: string;
        serviceName: string;
        appointmentDate: string;
        timeSlot: string;
        paidAt: string;
    };
};

async function PaymentSuccessContent({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const { session_id } = await searchParams;

    let paymentData: PaymentVerificationResponse["transaction"] = undefined;
    let errorMessage = "";

    if (!session_id) {
        errorMessage = "Payment Session ID is missing.";
    } else {
        try {
            const backendUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            const tokenData = await auth.api.getToken({
                headers: await headers(),
            });

            const response = await fetch(
                `${backendUrl}/payment/verify/${encodeURIComponent(session_id)}`,
                {
                    cache: "no-store",
                    headers: {
                        authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const data: PaymentVerificationResponse =
                await response.json();

            if (
                response.ok &&
                data.success &&
                data.paymentStatus === "paid" &&
                data.transaction
            ) {
                paymentData = data.transaction;
            } else {
                errorMessage =
                    data.message ||
                    "Payment verification is still processing.";
            }
        } catch (error) {
            console.error("Payment Verification Error:", error);
            errorMessage =
                "Unable to verify your payment right now. Please check My Appointments.";
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

                {paymentData ? (
                    <>
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <span className="text-4xl text-green-600">
                                ✓
                            </span>
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-gray-900">
                            Payment Successful!
                        </h1>

                        <p className="mb-6 text-gray-600">
                            Thank you! Your payment has been verified successfully.
                        </p>

                        <div className="mb-6 rounded-xl bg-gray-50 p-5 text-left">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Payment Details
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Service
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {paymentData.serviceName}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Amount Paid
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        {paymentData.currency.toUpperCase()}{" "}
                                        {(paymentData.amountTotal / 100).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Appointment Date
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {paymentData.appointmentDate}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Time Slot
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {paymentData.timeSlot}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Payment Status
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        Paid
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="mb-6 break-all text-xs text-gray-400">
                            Transaction ID: {paymentData.stripeSessionId}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                            <span className="text-4xl text-yellow-600">
                                !
                            </span>
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-gray-900">
                            Payment Verification Pending
                        </h1>

                        <p className="mb-6 text-gray-600">
                            {errorMessage}
                        </p>

                        <p className="mb-6 text-sm text-gray-500">
                            Please check your appointment dashboard for the latest payment status.
                        </p>
                    </>
                )}

                <a
                    href="/dashboard/customer/appointments"
                    className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    My Appointments
                </a>
            </div>
        </main>
    );
}

export default function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
                </div>
            }
        >
            <PaymentSuccessContent searchParams={searchParams} />
        </Suspense>
    );
}
