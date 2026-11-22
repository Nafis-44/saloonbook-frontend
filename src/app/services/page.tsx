
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    Search,
    Scissors,
    Clock,
    ArrowUpDown,
    RefreshCw,
    AlertCircle,
    ImageIcon,
    SlidersHorizontal,
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

const ServicesPage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");

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

            // Only Active Services
            // Old services without status are treated as Active
            const activeServices = data.filter(
                (service) =>
                    !service.status || service.status === "active"
            );

            setServices(activeServices);

        } catch (error) {
            console.error("Fetch Services Error:", error);

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

    // Read Category from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");

        if (category) {
            setSelectedCategory(category);
        }
    }, []);

    // Get Unique Categories
    const categories = useMemo(() => {
        return [
            "All",
            ...Array.from(
                new Set(services.map((service) => service.category))
            ),
        ];
    }, [services]);

    // Search, Filter and Sort
    const filteredServices = useMemo(() => {
        let result = [...services];

        // Search by Name or Category
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();

            result = result.filter(
                (service) =>
                    service.name.toLowerCase().includes(search) ||
                    service.category.toLowerCase().includes(search)
            );
        }

        // Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(
                (service) => service.category === selectedCategory
            );
        }

        // Price Sorting
        if (sortOrder === "low-to-high") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "high-to-low") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [services, searchTerm, selectedCategory, sortOrder]);

    return (
        <main className="min-h-screen bg-[#fffaf7]">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#542d38] px-5 py-20 text-center sm:py-24">

                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/5" />

                <div className="relative mx-auto max-w-3xl">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#f5d9d4]">
                        <Scissors size={27} />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#e7c3bd]">
                        Discover Your Perfect Look
                    </p>

                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
                        Our Salon Services
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#ead9d8] sm:text-base">
                        Explore our professional salon services and find
                        the perfect treatment for your beauty and care.
                    </p>

                </div>

            </section>

            {/* Services Content */}
            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-16">

                {/* Section Heading */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a4777d]">
                            What We Offer
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[#3d222c] sm:text-3xl">
                            Explore Our Services
                        </h2>

                        <p className="mt-2 text-sm text-[#907d81]">
                            Find the right service for your needs.
                        </p>
                    </div>

                    {!isLoading && !error && (
                        <div className="rounded-xl bg-[#f5ece8] px-4 py-3 text-sm font-semibold text-[#754653]">
                            {filteredServices.length} Services Available
                        </div>
                    )}

                </div>

                {/* Search and Filters */}
                <div className="mb-9 rounded-2xl border border-[#eee5e0] bg-white p-4 shadow-sm sm:p-5">

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_220px_220px]">

                        {/* Search */}
                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search services..."
                                className="w-full rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none transition focus:border-[#8c5968]"
                            />

                        </div>

                        {/* Category Filter */}
                        <div className="relative">

                            <SlidersHorizontal
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none focus:border-[#8c5968]"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === "All"
                                            ? "All Categories"
                                            : category}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Price Sorting */}
                        <div className="relative">

                            <ArrowUpDown
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4777d]"
                            />

                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-[#eaded9] bg-[#fdfaf8] py-3.5 pl-11 pr-4 text-sm text-[#542d38] outline-none focus:border-[#8c5968]"
                            >
                                <option value="default">Default Sorting</option>
                                <option value="low-to-high">
                                    Price: Low to High
                                </option>
                                <option value="high-to-low">
                                    Price: High to Low
                                </option>
                            </select>

                        </div>

                    </div>

                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">

                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />

                        <p className="text-sm text-[#907d81]">
                            Loading our services...
                        </p>

                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 text-center">

                        <AlertCircle size={40} className="text-red-500" />

                        <h3 className="mt-4 text-lg font-bold text-[#542d38]">
                            Unable to Load Services
                        </h3>

                        <p className="mt-2 text-sm text-[#907d81]">
                            {error}
                        </p>

                        <button
                            onClick={fetchServices}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#542d38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#754653]"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>

                    </div>
                )}

                {/* No Services */}
                {!isLoading && !error && services.length === 0 && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#eee5e0] bg-white px-5 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7eeea] text-[#754653]">
                            <Scissors size={30} />
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-[#542d38]">
                            No Services Available
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#907d81]">
                            We currently have no active services.
                            Please check back later.
                        </p>

                    </div>
                )}

                {/* No Search Results */}
                {!isLoading &&
                    !error &&
                    services.length > 0 &&
                    filteredServices.length === 0 && (
                        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-[#eee5e0] bg-white px-5 text-center">

                            <Search size={35} className="text-[#a4777d]" />

                            <h3 className="mt-4 text-lg font-bold text-[#542d38]">
                                No Matching Services
                            </h3>

                            <p className="mt-2 text-sm text-[#907d81]">
                                Try another search term or category.
                            </p>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All");
                                    setSortOrder("default");
                                }}
                                className="mt-4 text-sm font-semibold text-[#8c5968] underline"
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                {/* Service Cards */}
                {!isLoading && !error && filteredServices.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredServices.map((service) => (
                            <article
                                key={service._id}
                                className="group overflow-hidden rounded-2xl border border-[#eee5e0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >

                                {/* Service Image */}
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
                                            <ImageIcon size={50} />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-[#754653] shadow-sm">
                                        {service.category}
                                    </span>

                                </div>

                                {/* Service Information */}
                                <div className="p-5">

                                    <h3 className="text-xl font-bold text-[#542d38] transition group-hover:text-[#8c5968]">
                                        {service.name}
                                    </h3>

                                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#907d81] line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Price and Duration */}
                                    <div className="mt-5 flex items-center justify-between border-t border-[#f0e8e4] pt-4">

                                        <div>
                                            <p className="text-xs text-[#9b898d]">
                                                Starting Price
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

                                    {/* Details Button */}
                                    <Link
                                        href={`/services/${service._id}`}
                                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#542d38] py-3 text-sm font-semibold text-white transition hover:bg-[#754653]"
                                    >
                                        View Service Details
                                    </Link>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
};

export default ServicesPage;
