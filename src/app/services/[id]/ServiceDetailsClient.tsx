
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    ArrowLeft,
    Clock,
    Scissors,
    ImageIcon,
    AlertCircle,
    RefreshCw,
    CalendarDays,
    CheckCircle2,
} from "lucide-react";

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

type ServiceDetailsClientProps = {
    serviceId: string;
    token: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ServiceDetailsClient = ({
    serviceId,
    token,
}: ServiceDetailsClientProps) => {
    console.log("Frontend JWT Token:", token);

    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchService = async () => {
        try {
            setIsLoading(true);
            setError("");

            


            const response = await fetch(
                `${API_URL}/services/${serviceId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error("Unauthorized! Please sign in again.");
            }

            if (response.status === 404) {
                throw new Error("Service not found.");
            }

            if (!response.ok) {
                throw new Error("Failed to load service details.");
            }

            const data: Service = await response.json();

            if (data.status && data.status !== "active") {
                throw new Error("This service is currently unavailable.");
            }

            setService(data);

        } catch (error) {
            console.error("Fetch Service Details Error:", error);

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
        if (serviceId && token) {
            fetchService();
        }
    }, [serviceId, token]);

    return (
        <main className="min-h-screen bg-[#fffaf7]">

            {isLoading && (
                <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />
                    <p className="text-sm text-[#907d81]">
                        Loading service details...
                    </p>
                </div>
            )}

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

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={fetchService}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#542d38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>

                        <Link
                            href="/services"
                            className="rounded-xl border border-[#eaded9] bg-white px-5 py-3 text-sm font-semibold text-[#542d38] transition hover:bg-[#f8f1ed]"
                        >
                            Browse Services
                        </Link>
                    </div>
                </div>
            )}

            {!isLoading && !error && service && (
                <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">

                    <Link
                        href="/services"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#754653] transition hover:text-[#542d38]"
                    >
                        <ArrowLeft size={18} />
                        Back to Services
                    </Link>

                    <div className="grid overflow-hidden rounded-3xl border border-[#eee5e0] bg-white shadow-sm lg:grid-cols-2">

                        <div className="relative min-h-[300px] bg-[#f7eeea] sm:min-h-[450px]">
                            {service.image ? (
                                <Image
                                    src={service.image}
                                    alt={service.name}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[300px] items-center justify-center text-[#b38d95]">
                                    <ImageIcon size={70} />
                                </div>
                            )}

                            <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#754653] shadow-sm">
                                {service.category}
                            </span>
                        </div>

                        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a4777d]">
                                SalonBook Exclusive Service
                            </p>

                            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#542d38] sm:text-4xl">
                                {service.name}
                            </h1>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 rounded-xl bg-[#f8f1ed] px-4 py-3 text-sm font-semibold text-[#754653]">
                                    <Clock size={18} />
                                    {service.duration} Minutes
                                </div>

                                <div className="flex items-center gap-2 rounded-xl bg-[#f8f1ed] px-4 py-3 text-sm font-semibold text-[#754653]">
                                    <Scissors size={18} />
                                    Professional Care
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-bold text-[#542d38]">
                                    About This Service
                                </h2>

                                <p className="mt-3 text-sm leading-8 text-[#907d81]">
                                    {service.description}
                                </p>
                            </div>

                            <div className="mt-8 rounded-2xl border border-[#eee5e0] bg-[#fffaf7] p-5">
                                <p className="text-xs font-medium text-[#9b898d]">
                                    Service Price
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#542d38]">
                                    ৳{service.price.toLocaleString("en-BD")}
                                </p>

                                <p className="mt-2 text-xs text-[#907d81]">
                                    Final price for this service
                                </p>
                            </div>

                            <Link
                                href={`/services/${service._id}/book`}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#542d38] py-4 text-sm font-bold text-white transition hover:bg-[#754653]"
                            >
                                <CalendarDays size={18} />
                                Book This Service
                            </Link>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#907d81]">
                                <CheckCircle2 size={15} className="text-[#8b9a72]" />
                                Professional Salon Services
                            </div>

                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default ServiceDetailsClient;
