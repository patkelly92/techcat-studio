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
      <div className="flex min-h-screen w-full flex-1 min-w-0">
        <Sidebar />

        {/* ← main column: grows, never shrinks, always 100 % width */}
        <div className="flex flex-col grow shrink-0 basis-0 w-full min-w-0">
          <Header />

          <main className="flex-1 overflow-auto w-full p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default LayoutShell