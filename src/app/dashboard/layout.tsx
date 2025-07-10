
import NavBarDashboard from "@/components/dashboard/NavBarDashboard";
import SideBar from "@/components/dashboard/SideBar";
import { ReactNode } from "react";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
   <div className='flex flex-row  min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='md:sticky md:top-0 md:h-screen'>
        <SideBar />
        </div>
        <div className="flex-1">
            <NavBarDashboard />
            {children}
        </div>
    </div>
  );
}