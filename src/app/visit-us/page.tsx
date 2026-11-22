
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    ArrowRight,
    Sparkles,
    CalendarDays,
} from "lucide-react";

const contactItems = [
    {
        icon: Mail,
        title: "Email Us",
        description: "Have a question? Send us an email.",
        value: "Contact us through our platform",
    },
    {
        icon: Phone,
        title: "Get in Touch",
        description: "We are here to help with your booking.",
        value: "Customer Support",
    },
    {
        icon: MapPin,
        title: "Visit SalonBook",
        description: "Explore salon services from wherever you are.",
        value: "Online Booking Platform",
    },
];

const supportTopics = [
    "Booking a salon appointment",
    "Exploring available services",
    "Managing your appointments",
    "Payment and booking assistance",
];

export default function VisitUsPage() {
    return (
        <main className="min-h-screen bg-[#fffaf7] text-[#542d38]">

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#eee7e3]">
                <div className="mx-auto max-w-[1440px] px-5 py-20 text-center md:px-10 md:py-28 lg:px-16">

                    <span className="inline-flex items-center gap-2 rounded-full border border-[#eaded9] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[2px] text-[#8b4b5c]">
                        <MessageCircle size={14} />
                        We Are Here For You
                    </span>

                    <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#542d38] md:text-6xl">
                        Let's Stay
                        <span className="text-[#a16b78]"> Connected.</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#806f72] md:text-base md:leading-8">
                        Have questions about SalonBook? Need help with an
                        appointment? We are always happy to help make your
                        booking experience easier.
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

            {/* Contact Information */}
            <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-16 lg:py-24">

                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[3px] text-[#a16b78]">
                        Contact & Support
                    </p>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#542d38] md:text-4xl">
                        How Can We Help You?
                    </h2>

                    <p className="mt-6 text-sm leading-8 text-[#806f72] md:text-base">
                        Whether you need help booking an appointment or have
                        questions about our platform, find the information
                        you need below.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {contactItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-[#eee7e3] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d9c5c1] hover:shadow-lg"
                            >
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5eeea] text-[#8b4b5c] transition duration-300 group-hover:bg-[#542d38] group-hover:text-white">
                                    <Icon size={27} strokeWidth={1.7} />
                                </div>

                                <h3 className="mt-6 text-lg font-bold text-[#542d38]">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#806f72]">
                                    {item.description}
                                </p>

                                <p className="mt-4 text-sm font-semibold text-[#8b4b5c]">
                                    {item.value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Support Section */}
            <section className="border-y border-[#eee7e3] bg-white">
                <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-24">

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[3px] text-[#a16b78]">
                            Customer Assistance
                        </p>

                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#542d38] md:text-4xl">
                            Need a Little Help?
                        </h2>

                        <p className="mt-5 text-sm leading-8 text-[#806f72] md:text-base">
                            SalonBook is designed to make your salon booking
                            journey simple. Explore the services and manage
                            your appointments from one convenient place.
                        </p>

                        <Link
                            href="/services"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#542d38] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#754553]"
                        >
                            Browse Services
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-[#eee7e3] bg-[#fffaf7] p-7 md:p-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#542d38] text-white">
                                <MessageCircle size={22} />
                            </div>

                            <div>
                                <h3 className="font-bold text-[#542d38]">
                                    How We Can Help
                                </h3>
                                <p className="text-xs text-[#8b7b7f]">
                                    Your booking journey matters to us.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-5">
                            {supportTopics.map((topic) => (
                                <div
                                    key={topic}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eaded9] text-[#542d38]">
                                        <ArrowRight size={13} />
                                    </span>

                                    <p className="text-sm leading-6 text-[#6f5c61]">
                                        {topic}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="mx-5 my-20 overflow-hidden rounded-[28px] bg-[#542d38] px-6 py-16 text-center md:mx-10 md:px-12 md:py-20 lg:mx-16">
                <Sparkles
                    size={30}
                    className="mx-auto text-[#e8c8cb]"
                />

                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold text-white md:text-4xl">
                    Ready to Book Your Next Appointment?
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#eaded9] md:text-base">
                    Discover our services and find the perfect time for
                    your next salon experience.
                </p>

                <Link
                    href="/services"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fffaf7] px-8 py-4 text-sm font-bold text-[#542d38] transition hover:bg-[#eaded9]"
                >
                    <CalendarDays size={17} />
                    Book Your Appointment
                    <ArrowRight size={17} />
                </Link>
            </section>

        </main>
    );
}
