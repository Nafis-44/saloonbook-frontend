
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";

const Banner = () => {
  return (
    <section className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-16 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-20">

      {/* Left Content */}
      <div className="relative z-10">

        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#e9ded7] bg-white px-4 py-2 text-xs text-[#66575a]">
            <span className="mr-2 text-green-600">●</span>
            Open Today · 9:00 AM – 8:00 PM
          </span>

          <span className="rounded-full border border-[#e9ded7] bg-white px-4 py-2 text-xs text-[#66575a]">
            <MapPin size={13} className="mr-1 inline" />
            Your Neighborhood
          </span>
        </div>

        <h1 className="max-w-xl font-serif text-5xl leading-[1.12] tracking-tight text-[#35242a] md:text-6xl lg:text-[68px]">
          Grooming,
          <br />
          <span className="italic text-[#754252]">
            done properly.
          </span>
        </h1>

        <p className="mt-7 max-w-lg text-sm leading-7 text-[#766b6b] md:text-base">
          A better salon experience for hair, skin, nails and spa rituals.
          Browse our services, request a time that suits you, and let our
          professionals take care of the rest.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 rounded-full bg-[#754252] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#59313e]"
          >
            Explore Services
            <ArrowRight size={17} />
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-[#d9cbc4] bg-white px-7 py-4 text-sm font-semibold text-[#493940] transition hover:border-[#754252]"
          >
            <CalendarDays size={16} />
            Create an Account
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-[#e8ddd7] pt-7">
          <div>
            <h3 className="font-serif text-2xl">4.9/5</h3>
            <p className="mt-1 text-xs text-[#8b7d7b]">Client Rating</p>
          </div>

          <div>
            <h3 className="font-serif text-2xl">8k+</h3>
            <p className="mt-1 text-xs text-[#8b7d7b]">Appointments</p>
          </div>

          <div>
            <h3 className="font-serif text-2xl">12</h3>
            <p className="mt-1 text-xs text-[#8b7d7b]">Salon Experts</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="relative mx-auto w-full max-w-[540px]">

        <div className="relative h-[420px] overflow-hidden rounded-[100px] rounded-bl-[28px] md:h-[520px]">
          <Image
            src="/saloonbanner.webp"
            alt="SalonBook salon interior"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Small Image Preview */}
        <div className="absolute -bottom-5 -left-7 hidden h-32 w-36 overflow-hidden rounded-2xl border-4 border-white shadow-xl md:block">
          <Image
            src="/saloonbanner.webp"
            alt="Salon interior preview"
            fill
            className="object-cover"
          />
        </div>

        {/* Opening Time Card */}
        <div className="absolute -bottom-5 right-0 flex items-center gap-3 rounded-2xl border border-[#eee4dd] bg-white px-5 py-4 shadow-lg md:-right-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ec] text-green-700">
            <Clock size={20} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#948681]">
              Next Opening
            </p>
            <p className="mt-1 text-sm font-semibold text-[#493940]">
              Today · 2:30 PM
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Banner;
