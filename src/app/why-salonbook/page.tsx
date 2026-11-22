
import Link from "next/link";
import {
    CalendarCheck,
    ShieldCheck,
    Clock,
    Sparkles,
    HeartHandshake,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const features = [
    {
        icon: CalendarCheck,
        title: "Easy Online Booking",
        description:
            "Book your preferred salon services anytime with a simple and convenient online booking experience.",
    },
    {
        icon: Clock,
        title: "Flexible Scheduling",
        description:
            "Choose a date and time that fits your routine and manage your appointments with ease.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        description:
            "Enjoy a reliable payment experience with secure online payment processing.",
    },
    {
        icon: Sparkles,
        title: "Quality Salon Services",
        description:
            "Explore a variety of salon services and find the right treatment for your personal care needs.",
    },
    {
        icon: HeartHandshake,
        title: "Customer Focused",
        description:
            "We aim to make your salon booking journey simple, comfortable, and convenient.",
    },
    {
        icon: CheckCircle2,
        title: "Easy Appointment Management",
        description:
            "View your bookings, keep track of appointment updates, and manage your appointments from one place.",
    },
];

export default function WhySalonBookPage() {
    return (
        <main className="min-h-screen bg-[#fffaf7] text-[#542d38]">

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#eee7e3]">
                <div className="mx-auto max-w-[1440px] px-5 py-20 text-center md:px-10 md:py-28 lg:px-16">

                    <span className="inline-flex items-center gap-2 rounded-full border border-[#eaded9] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[2px] text-[#8b4b5c]">
                        <Sparkles size={14} />
                        The SalonBook Experience
                    </span>

                    <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#542d38] md:text-6xl">
                        Beauty Meets
                        <span className="text-[#a16b78]"> Convenience.</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#806f72] md:text-base md:leading-8">
                        Your time matters. SalonBook makes discovering salon
                        services and managing appointments easier, smoother,
                        and more convenient.
                    </p>

                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-full bg-[#542d38] px-8 py-4 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-[#754553] hover:shadow-lg"
                        >
                            Explore Services
                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            href="/"
                            className="rounded-full border border-[#d9c5c1] bg-white px-8 py-4 text-sm font-semibold text-[#542d38] transition hover:bg-[#f5eeea]"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#eaded9]/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#e7d3d0]/40 blur-3xl" />
            </section>

            {/* Introduction */}
            <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-3xl text-center">

                    <p className="text-xs font-bold uppercase tracking-[3px] text-[#a16b78]">
                        Why SalonBook
                    </p>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#542d38] md:text-4xl">
                        A Better Way to Book Your Salon Experience
                    </h2>

                    <p className="mt-6 text-sm leading-8 text-[#806f72] md:text-base">
                        We believe booking a salon appointment should be as
                        enjoyable as the experience itself. SalonBook brings
                        essential booking and appointment management features
                        together in one convenient platform.
                    </p>
                </div>

                {/* Features */}
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-[#eee7e3] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d9c5c1] hover:shadow-lg"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eeea] text-[#8b4b5c] transition duration-300 group-hover:bg-[#542d38] group-hover:text-white">
                                    <Icon size={25} strokeWidth={1.7} />
                                </div>

                                <span className="mt-7 block text-xs font-semibold tracking-widest text-[#b99ba1]">
                                    0{index + 1}
                                </span>

                                <h3 className="mt-2 text-lg font-bold text-[#542d38]">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#806f72]">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Closing CTA */}
            <section className="mx-5 mb-20 overflow-hidden rounded-[28px] bg-[#542d38] px-6 py-16 text-center md:mx-10 md:px-12 md:py-20 lg:mx-16">
                <div className="mx-auto max-w-2xl">

                    <Sparkles
                        size={30}
                        className="mx-auto text-[#e8c8cb]"
                    />

                    <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
                        Your Next Salon Experience Starts Here.
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-[#eaded9] md:text-base">
                        Discover our services and make your next appointment
                        with just a few simple steps.
                    </p>

                    <Link
                        href="/services"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fffaf7] px-8 py-4 text-sm font-bold text-[#542d38] transition hover:bg-[#eaded9]"
                    >
                        Book Your Appointment
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

        </main>
    );
}
