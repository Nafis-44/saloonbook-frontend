
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
    ArrowLeft,
    CreditCard,
    CalendarDays,
    RefreshCw,
    ReceiptText,
    CheckCircle2,
    Wallet,
    Scissors,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Transaction = {
    _id?: string;
    appointmentId: string;
    customerId: string;
    stripeSessionId: string;
    stripePaymentIntentId?: string;
    amountTotal: number;
    currency: string;
    paymentStatus: string;
    createdAt: string;
};

type TransactionResponse = {
    success: boolean;
    totalTransactions: number;
    transactions: Transaction[];
};

const formatDate = (date: string) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100;

    if (currency?.toLowerCase() === "bdt") {
        return `৳${value.toLocaleString("en-BD", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency?.toUpperCase() || "USD",
    }).format(value);
};

export default function PaymentHistoryPage() {
    const { data: session, isPending: isSessionPending } =
        authClient.useSession();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(
                `${API_URL}/customer/transactions/${session.user.id}`,
                {
                    cache: "no-store",
                    headers: {
                        authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const data: TransactionResponse = await response.json();

            if (!response.ok) {
                throw new Error("Failed to fetch payment history.");
            }

            setTransactions(data.transactions || []);
        } catch (error) {
            console.error("Payment History Error:", error);
            toast.error("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSessionPending) return;

        fetchTransactions();

    }, [session?.user?.id, isSessionPending]);

    return (
        <main className="min-h-screen bg-[#fbf7f3] px-4 py-10 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/customer"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8c5968] transition hover:text-[#542d38]"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-[#542d38]">
                                Payment History
                            </h1>

                            <p className="mt-2 text-gray-500">
                                View all your completed salon payments.
                            </p>
                        </div>

                        <button
                            onClick={fetchTransactions}
                            disabled={loading || !session?.user?.id}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e8d5d9] bg-white px-4 py-2.5 text-sm font-semibold text-[#542d38] transition hover:bg-[#f8edf0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Transactions
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-[#542d38]">
                                    {loading ? "..." : transactions.length}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-[#f8edf0] p-3">
                                <ReceiptText
                                    size={25}
                                    className="text-[#8c5968]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Payment Status
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-green-600">
                                    Completed
                                </h2>
                            </div>

                            <div className="rounded-xl bg-green-50 p-3">
                                <CheckCircle2
                                    size={25}
                                    className="text-green-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <section className="rounded-2xl border border-[#f0e5e1] bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#542d38]">
                                Transaction History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your successful payment records.
                            </p>
                        </div>

                        <Wallet
                            size={25}
                            className="text-[#8c5968]"
                        />
                    </div>

                    {loading || isSessionPending ? (
                        <div className="flex items-center justify-center gap-3 py-16 text-[#8c5968]">
                            <RefreshCw
                                size={20}
                                className="animate-spin"
                            />
                            Loading payment history...
                        </div>
                    ) : !session?.user?.id ? (
                        <div className="py-16 text-center">
                            <CreditCard
                                size={45}
                                className="mx-auto text-[#c7a5ae]"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-[#542d38]">
                                Sign In Required
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Please sign in to view your payment history.
                            </p>

                            <Link
                                href="/sign-in"
                                className="mt-6 inline-block rounded-lg bg-[#542d38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8c5968]"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-16 text-center">
                            <Scissors
                                size={45}
                                className="mx-auto text-[#c7a5ae]"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-[#542d38]">
                                No Payment History
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                You have not completed any payments yet.
                            </p>

                            <Link
                                href="/services"
                                className="mt-6 inline-block rounded-lg bg-[#542d38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8c5968]"
                            >
                                Explore Services
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction, index) => (
                                <div
                                    key={
                                        transaction._id ||
                                        transaction.stripeSessionId ||
                                        index
                                    }
                                    className="rounded-xl border border-[#f0e5e1] p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                                        {/* Transaction Information */}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-[#f8edf0] p-3">
                                                    <CreditCard
                                                        size={22}
                                                        className="text-[#8c5968]"
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-[#542d38]">
                                                        Salon Appointment Payment
                                                    </h3>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Transaction #{index + 1}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-6">
                                                <span className="flex items-center gap-2">
                                                    <CalendarDays size={16} />
                                                    {formatDate(transaction.createdAt)}
                                                </span>

                                                <span className="flex items-center gap-2">
                                                    <ReceiptText size={16} />
                                                    Appointment:{" "}
                                                    {String(transaction.appointmentId).slice(-8)}
                                                </span>
                                            </div>

                                            <p className="mt-3 break-all text-xs text-gray-400">
                                                Payment ID:{" "}
                                                {transaction.stripePaymentIntentId ||
                                                    transaction.stripeSessionId}
                                            </p>
                                        </div>

                                        {/* Amount and Payment Status */}
                                        <div className="flex flex-row items-center justify-between gap-5 border-t border-[#f0e5e1] pt-4 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Amount Paid
                                                </p>

                                                <p className="mt-1 text-2xl font-bold text-[#542d38]">
                                                    {formatAmount(
                                                        transaction.amountTotal,
                                                        transaction.currency
                                                    )}
                                                </p>
                                            </div>

                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold capitalize text-green-700">
                                                <CheckCircle2 size={14} />
                                                {transaction.paymentStatus}
                                            </span>
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
