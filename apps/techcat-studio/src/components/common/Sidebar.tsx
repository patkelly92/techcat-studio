"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  FolderGit2,
  PlaySquare,
  FileText,
  MessageCircle,
  Settings as SettingsIcon,
  Home,
  User,
} from "lucide-react"
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, navGroup: "Main" },
  { title: "Projects", url: "/projects", icon: FolderGit2, navGroup: "Main" },
  { title: "Kickoff", url: "/kickoff", icon: PlaySquare, navGroup: "Main" },
  { title: "Documents", url: "/documents", icon: FileText, navGroup: "Main" },
  { title: "Feedback", url: "/feedback", icon: MessageCircle, navGroup: "Main" },
  { title: "Settings", url: "/settings", icon: SettingsIcon, navGroup: "Main" },
]

export default function Sidebar() {
  const groups = navItems.reduce<Record<string, typeof navItems>>( (acc, item) => {
    ;(acc[item.navGroup] ??= []).push(item)
    return acc
  }, {})

  return (
    <SidebarUI variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home />
                <span>TechCat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groups).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User /> account@example.com
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  )
}
