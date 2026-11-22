
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ServiceDetailsClient from "./ServiceDetailsClient";
export const instant = false;


type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const ServiceDetailsPage = async ({ params }: PageProps) => {
    const { id } = await params;

    let token: string;

    try {
        const tokenData = await auth.api.getToken({
            headers: await headers(),
        });

        token = tokenData.token;
        console.log("JWT Token:", token);
    } catch (error) {
        console.error("JWT Token Error:", error);
        redirect("/sign-in");
    }

    return (
        <ServiceDetailsClient
            serviceId={id}
            token={token}
        />
    );
};

export default ServiceDetailsPage;
