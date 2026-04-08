"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Bed, 
  CalendarCheck, 
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  Quote
} from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

const DIRECTIVES = [
  "Efficiency is the silent language of excellence.",
  "The future is built by those who dare to define it.",
  "Precision is the difference between a stay and an experience.",
  "In the heart of industry, hospitality is our greatest asset.",
  "Building the future, one reservation at a time.",
  "Excellence is not a skill, it is a persistent attitude."
];

export default function DashboardPage() {
  const db = useFirestore();
  const [activeDirective, setActiveDirective] = useState("");
  
  const roomsQuery = useMemoFirebase(() => collection(db, 'rooms'), [db]);
  const reservationsQuery = useMemoFirebase(() => collection(db, 'reservations'), [db]);
  const customersQuery = useMemoFirebase(() => collection(db, 'customers'), [db]);

  const { data: rooms, isLoading: loadingRooms } = useCollection(roomsQuery);
  const { data: reservations, isLoading: loadingRes } = useCollection(reservationsQuery);
  const { data: customers, isLoading: loadingCust } = useCollection(customersQuery);

  useEffect(() => {
    setActiveDirective(DIRECTIVES[Math.floor(Math.random() * DIRECTIVES.length)]);
    const interval = setInterval(() => {
      setActiveDirective(DIRECTIVES[Math.floor(Math.random() * DIRECTIVES.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const availableCount = rooms?.filter(r => r.status === 'Available').length || 0;
  const totalRevenue = reservations?.reduce((acc, res) => acc + (res.totalPrice || 0), 0) || 0;
  const isLoading = loadingRooms || loadingRes || loadingCust;

  return (
    <div className="flex h-screen bg-black overflow-hidden font-mono">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-y-auto">
        <header className="flex h-16 md:h-20 items-center px-4 md:px-8 sticky top-0 glass-nav z-10 justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <SidebarTrigger className="text-white hover:text-primary transition-colors shrink-0" />
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg md:text-xl font-black tracking-widest text-white uppercase flex items-center gap-2 md:gap-3 truncate">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" /> BuildoHolics
              </h1>
              <span className="text-[8px] md:text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold truncate">Status: Active // Node: Alpha-7</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded border border-white/10 bg-white/5 shrink-0">
            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]">Real-time Sync</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10">
          <Card className="cyber-card border-primary/20 bg-primary/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block">
              <Quote className="h-16 w-16 md:h-24 md:w-24 text-primary" />
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center relative z-10">
              <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4">Neural Directive // Transmission Active</span>
              <p className="text-lg md:text-2xl font-black italic text-white uppercase tracking-tight leading-tight max-w-3xl">
                "{activeDirective || "Loading Directive..."}"
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-6 md:w-8 bg-primary/30" />
                <span className="text-[7px] md:text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Buildoholics Protocol 01</span>
                <div className="h-1 w-6 md:w-8 bg-primary/30" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Bookings", val: reservations?.length || 0, icon: CalendarCheck, color: "text-primary" },
              { label: "Total Guests", val: customers?.length || 0, icon: Users, color: "text-white" },
              { label: "Rooms Available", val: availableCount, icon: Bed, color: "text-primary" },
              { label: "Total Revenue", val: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: Zap, color: "text-white" }
            ].map((stat, i) => (
              <Card key={i} className="cyber-card group overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</span>
                  <stat.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${stat.color} group-hover:scale-125 transition-transform duration-500`} />
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-8 md:h-10 w-20 md:w-24 bg-white/5" /> : (
                    <div className="text-2xl md:text-4xl font-black tracking-tighter">{stat.val}</div>
                  )}
                  <div className="flex items-center gap-2 mt-3 md:mt-4 text-[8px] md:text-[9px] font-bold text-primary/70">
                    <ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    <span>Updated Live</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-12">
            <Card className="lg:col-span-8 cyber-card">
              <CardHeader className="border-b border-white/5 pb-4 md:pb-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <CardTitle className="text-base md:text-lg tracking-widest uppercase">System Operations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest leading-loose">
                  Sector Alpha-7 is operating within normal parameters. Real-time data synchronization with Firestore is currently active. 
                  All guest interactions and room assignments are being logged via the neural network.
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 cyber-card">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-base md:text-lg tracking-widest uppercase">Status Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Database Linked</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Neural Link: Stable</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}