
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#3d222c] text-[#f8eee9]">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:px-16 lg:py-20">

        {/* Brand */}
        <div>
          <Link href="/" className="mb-5 flex items-center gap-2">
            <Image
              src="/saloonlogo.webp"
              alt="SalonBook Logo"
              width={42}
              height={42}
              priority
              className="h-[42px] w-[42px] object-contain"
            />

            <span className="text-[21px] font-bold tracking-tight text-white">
              SalonBook
            </span>
          </Link>

          <p className="max-w-[280px] text-sm leading-7 text-[#d5c3c5]">
            Discover your beauty, embrace your confidence.
            Experience exceptional salon services and book
            your perfect appointment with ease.
          </p>

          {/* Social Links */}
          <div className="mt-7 flex items-center gap-3">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#765663] transition hover:bg-[#fffaf7] hover:text-[#542d38]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#765663] transition hover:bg-[#fffaf7] hover:text-[#542d38]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
              </svg>
            </a>

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-4 text-sm text-[#d5c3c5]">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/services" className="transition hover:text-white">
                Browse Services
              </Link>
            </li>

            <li>
              <Link href="/signin" className="transition hover:text-white">
                Sign In
              </Link>
            </li>

            <li>
              <Link href="/signup" className="transition hover:text-white">
                Create Account
              </Link>
            </li>

            <li>
              <Link href="/visit-us" className="transition hover:text-white">
                Visit Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Get In Touch
          </h3>

          <ul className="space-y-5 text-sm text-[#d5c3c5]">
            <li className="flex items-start gap-3">
              <MapPin
                size={19}
                className="mt-1 shrink-0 text-[#d9a7a9]"
              />
              <span>
                Your Salon Address,
                <br />
                City, Bangladesh
              </span>
            </li>

            <li className="flex items-center gap-3">
              <Phone
                size={18}
                className="shrink-0 text-[#d9a7a9]"
              />
              <span>Your Contact Number</span>
            </li>

            <li className="flex items-center gap-3">
              <Mail
                size={18}
                className="shrink-0 text-[#d9a7a9]"
              />
              <span>hello@salonbook.com</span>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Opening Hours
          </h3>

          <div className="mb-5 flex items-start gap-3">
            <Clock
              size={19}
              className="mt-1 shrink-0 text-[#d9a7a9]"
            />

            <div className="space-y-4 text-sm text-[#d5c3c5]">
              <div>
                <p className="font-medium text-white">
                  Monday - Saturday
                </p>
                <p className="mt-1">10:00 AM - 09:00 PM</p>
              </div>

              <div>
                <p className="font-medium text-white">Sunday</p>
                <p className="mt-1">11:00 AM - 07:00 PM</p>
              </div>
            </div>
          </div>

          <Link
            href="/services"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#e8b9b9] transition hover:text-white"
          >
            Explore Services
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#684653]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-6 py-6 text-center text-xs text-[#c9b5ba] md:flex-row md:px-10 lg:px-16">

          <p>
           © 2026 SalonBook. All rights reserved.
          </p>

          <p>
            Designed with care for your beauty.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
