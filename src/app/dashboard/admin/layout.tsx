
// import type { ReactNode } from "react";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { auth } from "@/lib/auth";
// import AdminSidebar from "./AdminSidebar";
// import Image from "next/image";

// type AdminLayoutProps = {
//     children: ReactNode;
// };

// const AdminLayout = async ({ children }: AdminLayoutProps) => {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     if (!session) {
//         redirect("/sign-in");
//     }

//     if (session.user.role !== "admin") {
//         redirect("/dashboard/customer");
//     }

//     return (
//         <div className="flex min-h-screen bg-[#fbf7f3]">
//             <AdminSidebar />

//             <div className="min-w-0 flex-1">
//                 {/* Dashboard Header */}
//                 <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eee7e3] bg-white/95 px-6 pl-20 backdrop-blur-md sm:px-8 sm:pl-20 lg:px-10">
//                     <div>
//                         <p className="text-xs font-medium text-[#a4777d]">
//                             SalonBook / Admin
//                         </p>

//                         <h2 className="mt-1 text-lg font-bold text-[#3d222c]">
//                             Admin Dashboard
//                         </h2>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="hidden text-right sm:block">
//                             <p className="text-sm font-bold text-[#542d38]">
//                                 {session.user.name}
//                             </p>

//                             <p className="text-xs capitalize text-[#9b858a]">
//                                 {session.user.role}
//                             </p>
//                         </div>

//                         <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#eaded9] bg-[#542d38] text-sm font-bold text-white">
//                             {session.user.image ? (
//                                 <Image
//                                     src={session.user.image}
//                                     alt={session.user.name}
//                                     className="h-full w-full object-cover"
//                                     width={200}
//                                     height={200}
//                                 />
//                             ) : (
//                                 session.user.name?.charAt(0).toUpperCase() || "A"
//                             )}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Page Content */}
//                 <div className="p-5 sm:p-8 lg:p-10">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLayout;

















import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import Image from "next/image";

type AdminLayoutProps = {
    children: ReactNode;
};

async function AdminLayoutContent({ children }: AdminLayoutProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "admin") {
        redirect("/dashboard/customer");
    }

    return (
        <div className="flex min-h-screen bg-[#fbf7f3]">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eee7e3] bg-white/95 px-6 pl-20 backdrop-blur-md sm:px-8 sm:pl-20 lg:px-10">
                    <div>
                        <p className="text-xs font-medium text-[#a4777d]">
                            SalonBook / Admin
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#3d222c]">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold text-[#542d38]">
                                {session.user.name}
                            </p>

                            <p className="text-xs capitalize text-[#9b858a]">
                                {session.user.role}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#eaded9] bg-[#542d38] text-sm font-bold text-white">
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                />
                            ) : (
                                session.user.name?.charAt(0).toUpperCase() || "A"
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-5 sm:p-8 lg:p-10">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#fbf7f3]">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eaded9] border-t-[#542d38]" />
                </div>
            }
        >
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    );
}
