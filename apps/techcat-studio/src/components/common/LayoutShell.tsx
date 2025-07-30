"use client";

import Header from "./Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutShellProps {
  children: React.ReactNode;
}

const LayoutShell = ({ children }: LayoutShellProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LayoutShell;
