"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

const Header = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white/80 px-4 dark:bg-zinc-900/80 backdrop-blur">
      <div className="sm:hidden">
        <SidebarTrigger className="size-6" />
      </div>
      <h1 className="text-lg font-semibold">TechCat Studio</h1>
    </header>
  )
}

export default Header
