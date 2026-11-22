"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import {
  Menu,
  X,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";

// User Avatar Props
type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
};

// User Avatar Component
const UserAvatar = ({ image, name }: UserAvatarProps) => {
  return (
    <Avatar className="h-10 w-10 border-2 border-[#eaded9]">
      <AvatarImage
        src={image || ""}
        alt={name || "User"}
      />

      <AvatarFallback className="bg-[#542d38] text-sm font-bold text-white">
        {name?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Logged-in user information
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Logged-in user role
  const userRole = user?.role;

  // Check User Role in Browser Console
  // console.log("Logged In User Role:", userRole);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Why Choose Us", href: "/why-salonbook" },
    { name: "Visit Us", href: "/visit-us" },
  ];

  // Sign Out
  const handleSignOut = async () => {
    await authClient.signOut();

    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eee7e3] bg-[#fffaf7]">

      <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/saloonlogo.webp"
            alt="SalonBook Logo"
            width={42}
            height={42}
            priority
            className="h-[42px] w-[42px] object-contain"
          />

          <span className="text-[21px] font-bold tracking-tight text-[#542d38]">
            SalonBook
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-medium text-[#484044] transition-colors duration-200 hover:text-[#8b4b5c]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-7 lg:flex">

          {!isPending && user ? (

            /* Logged In User Dropdown */
            <div className="relative">

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[#f5eeea]"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                <UserAvatar
                  image={user.image}
                  name={user.name}
                />

                <span className="max-w-[110px] truncate text-[13px] font-semibold text-[#542d38]">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#542d38] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-14 w-64 rounded-xl border border-[#eee7e3] bg-white p-2 shadow-xl">

                  {/* User Information */}
                  <div className="border-b border-[#eee7e3] px-3 py-3">

                    <p className="truncate text-sm font-bold text-[#542d38]">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#8b7b7f]">
                      {user.email}
                    </p>

                    {/* User Role */}
                    <p className="mt-1 text-xs font-semibold text-[#8c5968]">
                      Role: {userRole || "Loading..."}
                    </p>

                  </div>

                  {/* Dropdown Links */}
                  <div className="py-2">

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#484044] transition hover:bg-[#f8f1ed] hover:text-[#542d38]"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#484044] transition hover:bg-[#f8f1ed] hover:text-[#542d38]"
                    >
                      <UserCircle size={17} />
                      My Profile
                    </Link>

                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-[#eee7e3] pt-2">

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>

                  </div>

                </div>
              )}

            </div>

          ) : !isPending ? (

            <>
              <Link
                href="/sign-in"
                className="text-[13px] font-semibold text-[#484044] transition hover:text-[#8b4b5c]"
              >
                Sign In
              </Link>

              <Link
                href="/services"
                className="flex items-center gap-2 rounded-full bg-[#542d38] px-6 py-3 text-[12px] font-semibold text-white shadow-sm transition duration-300 hover:bg-[#754553] hover:shadow-md"
              >
                <CalendarDays size={14} />
                Book Now
              </Link>
            </>

          ) : null}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-[#542d38] hover:bg-[#f5eeea] lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (

        <div className="border-t border-[#eee7e3] bg-[#fffaf7] px-6 py-5 lg:hidden">

          <div className="flex flex-col gap-5">

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-[#484044] hover:text-[#8b4b5c]"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-[#eee7e3] pt-4">

              {!isPending && user ? (

                /* Mobile Logged In User */
                <div className="flex flex-col gap-4">

                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3">

                    <UserAvatar
                      image={user.image}
                      name={user.name}
                    />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-[#542d38]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[#8b7b7f]">
                        {user.email}
                      </p>

                      {/* Mobile User Role */}
                      <p className="mt-1 text-xs font-semibold text-[#8c5968]">
                        Role: {userRole || "Loading..."}
                      </p>

                    </div>

                  </div>

                  {/* Dashboard */}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-[#484044]"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  {/* My Profile */}
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-[#484044]"
                  >
                    <UserCircle size={17} />
                    My Profile
                  </Link>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-left text-sm font-semibold text-red-600"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>

                </div>

              ) : !isPending ? (

                <div className="flex items-center gap-4">

                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-semibold text-[#542d38]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-full bg-[#542d38] px-5 py-3 text-sm font-semibold text-white"
                  >
                    <CalendarDays size={15} />
                    Book Now
                  </Link>

                </div>

              ) : null}

            </div>

          </div>

        </div>

      )}

    </header>
  );
};

export default Navbar;
