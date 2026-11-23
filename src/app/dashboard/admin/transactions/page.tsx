
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import {
    CreditCard,
    CalendarDays,
    UserRound,
    Scissors,
    AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Transaction = {
    _id: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    appointmentId?: string;
    customerId?: string;
    amountTotal: number;
    currency: string;
    paymentStatus: string;
    createdAt: string;
    customerName?: string;
    customerEmail?: string;
    serviceName?: string;
    appointmentDate?: string;
    timeSlot?: string;
};

type TransactionResponse = {
    success: boolean;
    totalTransactions: number;
    transactions: Transaction[];
};

const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency?.toUpperCase() || "BDT",
    }).format(amount / 100);
};

const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatStatus = (status: string) => {
    if (status === "paid") {
        return "bg-green-100 text-green-700";
    }

    if (status === "pending") {
        return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
};

export default async function AdminTransactionsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const jwtToken = await auth.api.getToken({
    headers: await headers(),
});

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    let transactions: Transaction[] = [];
    let errorMessage = "";

    try {
        const response = await fetch(
            `${API_URL}/admin/transactions`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken.token}`,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch transactions (${response.status})`
            );
        }

        const data: TransactionResponse = await response.json();

        transactions = data.transactions || [];

    } catch (error) {
        console.error("Admin Transactions Error:", error);

        errorMessage =
            "Unable to load transactions. Please try again later.";
    }

    const totalRevenue = transactions.reduce(
        (total, item) =>
            item.paymentStatus === "paid"
                ? total + item.amountTotal
                : total,
        0
    );

    return (
        <main className="min-h-screen bg-[#fffaf7] p-4 md:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#f3e5e9] p-3">
                        <CreditCard className="h-6 w-6 text-[#8c5968]" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#542d38] md:text-3xl">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            View all customer payment transactions
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl border border-[#eee2dc] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Transactions
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-[#542d38]">
                                {transactions.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-[#f3e5e9] p-3">
                            <CreditCard className="h-6 w-6 text-[#8c5968]" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#eee2dc] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Paid Revenue
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-[#542d38]">
                                {formatAmount(
                                    totalRevenue,
                                    transactions[0]?.currency || "bdt"
                                )}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-green-100 p-3">
                            <CreditCard className="h-6 w-6 text-green-700" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-2xl border border-[#eee2dc] bg-white shadow-sm">

                <div className="border-b border-[#eee2dc] px-6 py-5">
                    <h2 className="text-lg font-bold text-[#542d38]">
                        All Transactions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Complete payment history
                    </p>
                </div>

                {errorMessage ? (

                    <div className="flex items-center gap-3 p-8 text-red-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>

                ) : transactions.length === 0 ? (

                    <div className="px-6 py-16 text-center">
                        <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300" />

                        <h3 className="text-lg font-semibold text-gray-700">
                            No Transactions Found
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Customer payment transactions will appear here.
                        </p>
                    </div>

                ) : (

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left">

                            <thead className="bg-[#faf5f2]">
                                <tr className="text-sm text-[#542d38]">
                                    <th className="px-6 py-4 font-semibold">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Service
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Appointment
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Payment Date
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#f1e9e4]">

                                {transactions.map((transaction) => (

                                    <tr
                                        key={transaction._id}
                                        className="transition hover:bg-[#fffaf7]"
                                    >

                                        {/* Customer */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-[#f3e5e9] p-2">
                                                    <UserRound className="h-4 w-4 text-[#8c5968]" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {transaction.customerName || "Unknown Customer"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {transaction.customerEmail || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Service */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Scissors className="h-4 w-4 text-[#8c5968]" />

                                                {transaction.serviceName || "Unknown Service"}
                                            </div>
                                        </td>

                                        {/* Appointment */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <CalendarDays className="h-4 w-4 text-[#8c5968]" />

                                                <div>
                                                    <p>
                                                        {formatDate(transaction.appointmentDate)}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {transaction.timeSlot || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-gray-800">
                                                {formatAmount(
                                                    transaction.amountTotal,
                                                    transaction.currency
                                                )}
                                            </p>
                                        </td>

                                        {/* Payment Date */}
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            {formatDate(transaction.createdAt)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${formatStatus(transaction.paymentStatus)}`}
                                            >
                                                {transaction.paymentStatus}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>

                )}

            </div>

        </main>
    );
}
