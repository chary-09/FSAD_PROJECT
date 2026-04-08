"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", total: 4500 },
  { month: "Feb", total: 5200 },
  { month: "Mar", total: 4800 },
  { month: "Apr", total: 6100 },
  { month: "May", total: 5900 },
  { month: "Jun", total: 7200 },
]

const occupancyData = [
  { day: "Mon", rate: 65 },
  { day: "Tue", rate: 58 },
  { day: "Wed", rate: 72 },
  { day: "Thu", rate: 85 },
  { day: "Fri", rate: 94 },
  { day: "Sat", rate: 98 },
  { day: "Sun", rate: 80 },
]

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-y-auto">
        <header className="flex h-16 items-center border-b px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="text-xl font-headline font-bold ml-4">Analytical Reports</h1>
        </header>

        <main className="flex-1 p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
                <CardDescription>Total earnings generated across all services</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pl-2">
                <ChartContainer config={{ 
                  total: { label: "Revenue ($)", color: "hsl(var(--primary))" } 
                }}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Occupancy Rate (%)</CardTitle>
                <CardDescription>Percentage of rooms filled per day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pl-2">
                <ChartContainer config={{ 
                  rate: { label: "Occupancy %", color: "black" } 
                }}>
                  <BarChart data={occupancyData}>
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.rate > 90 ? "hsl(var(--primary))" : "black"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
              <CardDescription>Quick snapshot of hotel performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Avg Daily Rate</span>
                     <span className="text-3xl font-bold text-primary">$184.20</span>
                     <span className="text-xs text-green-500 font-semibold">+4.5% vs Last Month</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">RevPAR</span>
                     <span className="text-3xl font-bold">$142.10</span>
                     <span className="text-xs text-green-500 font-semibold">+2.1% vs Last Month</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Cancellations</span>
                     <span className="text-3xl font-bold">12</span>
                     <span className="text-xs text-red-500 font-semibold">-5.0% Improvement</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Net NPS</span>
                     <span className="text-3xl font-bold">78</span>
                     <span className="text-xs text-primary font-semibold">Excellent</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  )
}