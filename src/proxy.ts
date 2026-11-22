
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const user = session?.user;
    console.log("Session User:", user);
    console.log("Logged In User Role:", user?.role);

    // User is not logged in
    if (!user) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);

        return NextResponse.redirect(signInUrl);
    }

    const role = user.role;

    // Admin-only routes
    if (pathname.startsWith("/dashboard/admin")) {
        if (role !== "admin") {
            return NextResponse.redirect(
                new URL("/dashboard/customer", request.url)
            );
        }
    }

    // Customer-only routes
    if (pathname.startsWith("/dashboard/customer")) {
        if (role !== "customer") {
            return NextResponse.redirect(
                new URL("/dashboard/admin", request.url)
            );
        }
    }

    // Dashboard redirect based on role
    if (pathname === "/dashboard") {
        if (role === "admin") {
            return NextResponse.redirect(
                new URL("/dashboard/admin", request.url)
            );
        }

        if (role === "customer") {
            return NextResponse.redirect(
                new URL("/dashboard/customer", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/services/:id",
        "/services/:id/book",
        "/dashboard/:path*",
    ],
};
