
"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Search,
    RefreshCw,
    UserRound,
    Mail,
    CalendarDays,
    ShieldCheck,
    ShieldBan,
    AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Customer = {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    isBlocked?: boolean;
    createdAt?: string;
};

export default function AdminUsersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Fetch Customers
    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            setError("");

            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    authorization: `Bearer ${tokenData.token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load customers."
                );
            }

            setCustomers(data);
        } catch (error) {
            console.error("Fetch Customers Error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong.";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Block / Unblock Customer
    const handleBlockStatus = async (customer: Customer) => {
        const newStatus = !customer.isBlocked;

        const action = newStatus ? "block" : "unblock";

        if (
            !window.confirm(
                `Are you sure you want to ${action} ${customer.name || "this customer"
                }?`
            )
        ) {
            return;
        }

        try {
            setUpdatingId(customer._id);
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(
                `${API_URL}/admin/users/${customer._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({
                        isBlocked: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update customer."
                );
            }

            // Update Customer Status
            setCustomers((previousCustomers) =>
                previousCustomers.map((item) =>
                    item._id === customer._id
                        ? { ...item, isBlocked: data.isBlocked }
                        : item
                )
            );

            // Success Toast
            if (data.isBlocked === true) {
                toast.success(
                    data.message || "Customer blocked successfully!"
                );
            } else {
                toast.success(
                    data.message || "Customer unblocked successfully!"
                );
            }

        } catch (error) {
            console.error("Customer Status Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Format Registration Date
    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Search Customers
    const filteredCustomers = customers.filter((customer) => {
        const search = searchTerm.toLowerCase();

        return (
            (customer.name || "").toLowerCase().includes(search) ||
            (customer.email || "").toLowerCase().includes(search)
        );
    });

    const blockedCount = customers.filter(
        (customer) => customer.isBlocked === true
    ).length;

    const activeCount = customers.length - blockedCount;

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
                            User Management
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            View and manage all registered customers.
                        </p>
                    </div>

                    <button
                        onClick={fetchCustomers}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={isLoading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Total Customers
                            </p>
                            <Users size={22} className="text-blue-600" />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {customers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Active Customers
                            </p>
                            <ShieldCheck size={22} className="text-green-600" />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {activeCount}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Blocked Customers
                            </p>
                            <ShieldBan size={22} className="text-red-600" />
                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {blockedCount}
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

                {/* Search */}
                <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by customer name or email..."
                            className="w-full rounded-lg border border-gray-200 py-3 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#b78b50] focus:ring-2 focus:ring-[#b78b50]/10"
                        />
                    </div>
                </div>

                {/* Customer List */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-5 py-5 md:px-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            All Customers
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {filteredCustomers.length} customer(s) found
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <RefreshCw
                                size={30}
                                className="animate-spin text-[#b78b50]"
                            />

                            <p className="mt-4 text-sm text-gray-500">
                                Loading customers...
                            </p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="px-5 py-20 text-center">
                            <Users
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-gray-800">
                                No Customers Found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                No registered customers match your search.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="flex flex-col justify-between gap-5 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center md:px-6"
                                >
                                    {/* Customer Information */}
                                    <div className="flex min-w-0 items-center gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                                            {customer.image ? (
                                                <Image
                                                    src={customer.image}
                                                    alt={customer.name || "Customer"}
                                                    className="h-full w-full object-cover"
                                                    width={200}
                                                    height={200}
                                                />
                                            ) : (
                                                <UserRound
                                                    size={23}
                                                    className="text-gray-500"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate text-base font-bold text-gray-900">
                                                    {customer.name || "Unnamed Customer"}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${customer.isBlocked
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {customer.isBlocked
                                                        ? "Blocked"
                                                        : "Active"}
                                                </span>
                                            </div>

                                            <p className="mt-1 flex items-center gap-2 truncate text-sm text-gray-500">
                                                <Mail size={14} />
                                                {customer.email || "No email"}
                                            </p>

                                            <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                                <CalendarDays size={13} />
                                                Joined: {formatDate(customer.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Block / Unblock Button */}
                                    <button
                                        onClick={() =>
                                            handleBlockStatus(customer)
                                        }
                                        disabled={updatingId === customer._id}
                                        className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${customer.isBlocked
                                            ? "border border-green-200 bg-white text-green-700 hover:bg-green-50"
                                            : "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                            }`}
                                    >
                                        {updatingId === customer._id ? (
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                        ) : customer.isBlocked ? (
                                            <ShieldCheck size={17} />
                                        ) : (
                                            <ShieldBan size={17} />
                                        )}

                                        {updatingId === customer._id
                                            ? "Updating..."
                                            : customer.isBlocked
                                                ? "Unblock Customer"
                                                : "Block Customer"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
