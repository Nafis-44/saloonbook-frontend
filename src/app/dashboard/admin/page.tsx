import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />
                </div>
            }
        >
            <AdminDashboard />
        </Suspense>
    );
}