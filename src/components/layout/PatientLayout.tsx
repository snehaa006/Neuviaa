import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "./PatientSidebar";
import { Outlet, useLocation } from "react-router-dom";

const PatientLayout = () => {
  const location = useLocation();

  // Remove header only on the dashboard route (e.g., "/patient/dashboard")
  const hideHeader = ["/patient/dashboard", "/patient/consult-doctor"].includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <PatientSidebar />
        <div className="flex-1 flex flex-col">
          {!hideHeader && (
            <header className="h-14 flex items-center border-b bg-background px-4 lg:px-6">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1" />
            </header>
          )}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientLayout;
