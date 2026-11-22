
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    Scissors,
    Clock,
    ImageIcon,
    ArrowRight,
    RefreshCw,
    AlertCircle,
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

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomeSections() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Active Services
    const fetchServices = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/public/services`);

            if (!response.ok) {
                throw new Error("Failed to load services.");
            }

            const data: Service[] = await response.json();

            const activeServices = data.filter(
                (service) =>
                    !service.status || service.status === "active"
            );

            setServices(activeServices);

        } catch (error) {
            console.error("Fetch Home Services Error:", error);

            setError(
                "Services load করা যায়নি। Backend Server চালু আছে কি না পরীক্ষা করুন।"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Featured Services - Maximum 6
    const featuredServices = services.slice(0, 6);

    // Dynamic Categories
    const categories = Array.from(
        new Set(
            services
                .map((service) => service.category)
                .filter((category) => category)
        )
    );

    return (
        <>
            {/* Featured Salon Services */}
            <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16">

                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a4777d]">
                            Our Professional Services
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-[#3d222c] sm:text-3xl">
                            Featured Salon Services
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#907d81]">
                            Discover our popular salon treatments and
                            professional beauty services, designed to help
                            you look and feel your best.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#754653] transition hover:text-[#a4777d]"
                    >
                        Explore All Services
                        <ArrowRight size={17} />
                    </Link>

                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />

                        <p className="text-sm text-[#907d81]">
                            Loading featured services...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 text-center">
                        <AlertCircle size={38} className="text-red-500" />

                        <h3 className="mt-4 text-lg font-bold text-[#542d38]">
                            Unable to Load Services
                        </h3>

                        <p className="mt-2 text-sm text-[#907d81]">
                            {error}
                        </p>

                        <button
                            onClick={fetchServices}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#542d38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty Services */}
                {!isLoading && !error && services.length === 0 && (
                    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-[#eee5e0] bg-white px-5 text-center">
                        <Scissors size={38} className="text-[#a4777d]" />

                        <h3 className="mt-4 text-lg font-bold text-[#542d38]">
                            No Services Available
                        </h3>

                        <p className="mt-2 text-sm text-[#907d81]">
                            Our salon services will appear here soon.
                        </p>
                    </div>
                )}

                {/* Featured Cards */}
                {!isLoading && !error && featuredServices.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {featuredServices.map((service) => (
                            <article
                                key={service._id}
                                className="group overflow-hidden rounded-2xl border border-[#eee5e0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-[#f7eeea]">

                                    {service.image ? (
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            width={600}
                                            height={500}
                                            unoptimized
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#b38d95]">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-[#754653] shadow-sm">
                                        {service.category}
                                    </span>
                                </div>

                                {/* Information */}
                                <div className="p-5">

                                    <h3 className="text-xl font-bold text-[#542d38] transition group-hover:text-[#8c5968]">
                                        {service.name}
                                    </h3>

                                    <p className="mt-3 min-h-[48px] line-clamp-2 text-sm leading-6 text-[#907d81]">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-[#f0e8e4] pt-4">

                                        <div>
                                            <p className="text-xs text-[#9b898d]">
                                                Service Price
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-[#542d38]">
                                                ৳{service.price.toLocaleString("en-BD")}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-lg bg-[#f8f1ed] px-3 py-2 text-xs font-semibold text-[#754653]">
                                            <Clock size={15} />
                                            {service.duration} min
                                        </div>

                                    </div>

                                    <Link
                                        href={`/services/${service._id}`}
                                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#542d38] py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                                    >
                                        View Details
                                    </Link>

                                </div>
                            </article>
                        ))}

                    </div>
                )}

                {!isLoading && !error && services.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#542d38] px-7 py-3 text-sm font-semibold text-[#542d38] transition hover:bg-[#542d38] hover:text-white"
                        >
                            Explore All Services
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}

            </section>

            {/* Salon Service Categories */}
            {!isLoading && !error && categories.length > 0 && (
                <section className="border-y border-[#eee5e0] bg-white">

                    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16">

                        <div className="mx-auto mb-10 max-w-2xl text-center">

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a4777d]">
                                Explore By Category
                            </p>

                            <h2 className="mt-3 text-2xl font-bold text-[#3d222c] sm:text-3xl">
                                Salon Service Categories
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#907d81]">
                                Explore our range of beauty and wellness
                                services and discover the right treatment
                                for your needs.
                            </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/services?category=${encodeURIComponent(category)}`}
                                    className="group flex items-center justify-between rounded-2xl border border-[#eee5e0] bg-[#fffaf7] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d9b9b6] hover:shadow-md"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3e8e5] text-[#754653] transition group-hover:bg-[#542d38] group-hover:text-white">
                                            <Scissors size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#542d38] transition group-hover:text-[#8c5968]">
                                                {category}
                                            </h3>

                                            <p className="mt-1 text-xs text-[#9b898d]">
                                                Explore Services
                                            </p>
                                        </div>

                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="shrink-0 text-[#a4777d] transition group-hover:translate-x-1 group-hover:text-[#542d38]"
                                    />

                                </Link>
                            ))}

                        </div>

                    </div>

                </section>
            )}
        </>
    );
}
