"use client"

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Bed,
  BarChart3,
  Zap,
  Shield,
  CircleDot,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

const items = [
  {
    title: "BuildoHolics",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: CalendarDays,
  },
  {
    title: "Manage Rooms",
    url: "/rooms",
    icon: Bed,
  },
  {
    title: "Guest Directory",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/reports",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <Sidebar className="border-r border-white/10 bg-black font-mono">
      <SidebarHeader className="p-4 md:p-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded bg-primary text-black cyber-glow shrink-0">
            <Zap className="h-4 w-4 md:h-6 md:w-6 fill-black" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base md:text-lg font-black tracking-tighter text-white leading-none truncate">
              BuildoHolics
            </span>
            <span className="text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-[0.3em] mt-1 truncate">
              HMS v4.0.2
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="bg-white/5 mx-4 md:mx-6" />
      <SidebarContent className="px-2 md:px-4 py-4 md:py-8">
        <SidebarMenu className="gap-1 md:gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link 
                  href={item.url} 
                  className={`flex items-center gap-3 md:gap-4 px-3 md:px-5 py-5 md:py-7 rounded transition-all duration-300 ${
                    pathname === item.url 
                      ? 'bg-primary text-black cyber-glow' 
                      : 'hover:bg-white/5 text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  <span className="font-bold text-[9px] md:text-[11px] uppercase tracking-widest truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 md:p-6 space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-white/30 hover:text-red-500 group"
        >
          <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate">Logout</span>
        </button>

        <div className="p-3 md:p-5 rounded border border-white/10 bg-white/5 flex items-center gap-3 md:gap-4 group hover:border-primary/50 transition-colors">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-primary flex items-center justify-center animate-pulse-glow shrink-0">
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] md:text-[10px] font-black uppercase text-white truncate">Admin</p>
            <div className="flex items-center gap-1.5">
              <CircleDot className="h-1.5 w-1.5 md:h-2 md:w-2 text-primary animate-pulse shrink-0" />
              <p className="text-[7px] md:text-[8px] text-primary uppercase font-bold tracking-widest truncate">Online</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}