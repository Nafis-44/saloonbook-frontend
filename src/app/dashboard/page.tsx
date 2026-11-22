
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardPage = async () => {
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
};

export default DashboardPage;
