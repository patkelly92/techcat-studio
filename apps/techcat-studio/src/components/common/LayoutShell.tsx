"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"
import { SidebarProvider } from "@/components/ui/sidebar"

interface LayoutShellProps {
  children: React.ReactNode
}

const LayoutShell = ({ children }: LayoutShellProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default LayoutShell
