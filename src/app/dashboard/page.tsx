import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

async function DashboardContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // User login না করলে Sign In Page
    if (!session) {
        redirect("/sign-in");
    }

    // User Role Check
    const role = session.user.role;

    if (role === "admin") {
        redirect("/dashboard/admin");
    }

    if (role === "customer") {
        redirect("/dashboard/customer");
    }

    redirect("/");
    return null;
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}
