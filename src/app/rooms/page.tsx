
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Wifi, Tv, Zap, ShieldCheck, Target } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function RoomsPage() {
  const db = useFirestore();
  const roomsQuery = useMemoFirebase(() => collection(db, 'rooms'), [db]);
  const { data: rooms, isLoading } = useCollection(roomsQuery);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'border-primary text-primary bg-primary/5 cyber-glow'
      case 'Occupied': return 'border-white/20 text-white/50 bg-white/5'
      case 'Cleaning': return 'border-orange-500/50 text-orange-400 bg-orange-500/10'
      case 'Maintenance': return 'border-red-500/50 text-red-500 bg-red-500/10'
      default: return 'border-white/10 text-white'
    }
  }

  const handleAddRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomNumber = formData.get('roomNumber') as string;
    const roomType = formData.get('roomType') as string;
    const price = Number(formData.get('price'));
    const status = formData.get('status') as string;

    addDocumentNonBlocking(collection(db, 'rooms'), {
      roomNumber,
      roomType,
      pricePerNight: price,
      status,
      capacity: 2,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsAddOpen(false);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-mono selection:bg-primary selection:text-black">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-y-auto">
        <header className="flex h-20 items-center px-4 md:px-8 sticky top-0 glass-nav z-10 justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <SidebarTrigger className="text-white hover:text-primary transition-colors" />
            <h1 className="text-lg md:text-2xl font-black tracking-widest text-white uppercase flex items-center gap-2 md:gap-3 italic truncate">
              Room Management <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black font-black px-4 md:px-6 gap-2 cyber-glow transition-all text-xs md:text-sm h-9 md:h-10">
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 stroke-[3]" />
                <span className="hidden sm:inline">Add New Room</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-white/10 font-mono text-white max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary font-black uppercase tracking-widest text-sm md:text-base">Register New Room</DialogTitle>
                <DialogDescription className="sr-only">Provide the room number, type, price, and initial status to add it to the inventory.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRoom} className="space-y-4 md:space-y-6 py-2 md:py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Room Number</Label>
                    <Input name="roomNumber" placeholder="e.g. 101" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Room Type</Label>
                    <Select name="roomType" defaultValue="Standard">
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-9 md:h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 text-white">
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Price per Night</Label>
                    <Input name="price" type="number" placeholder="100" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Current Status</Label>
                    <Select name="status" defaultValue="Available">
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-9 md:h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 text-white">
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-primary text-black font-black uppercase tracking-widest cyber-glow h-12">Add Room</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-[300px] md:h-[350px] w-full bg-white/5 rounded" />)
            ) : rooms?.map((room) => (
              <Card key={room.id} className="cyber-card group relative overflow-hidden flex flex-col">
                <div className="absolute top-4 right-4 z-10">
                   <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 text-white/30 hover:text-primary hover:bg-white/5 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                   </Button>
                </div>
                
                <CardHeader className="pb-6 md:pb-8">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <Badge variant="outline" className={`font-black uppercase tracking-[0.25em] text-[7px] md:text-[8px] px-2 md:px-3 py-1 border-2 transition-all duration-500 ${getStatusColor(room.status)}`}>
                      {room.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl md:text-5xl font-black flex items-baseline gap-2 md:gap-3">
                    <span className="text-white/10 text-[8px] md:text-xs font-bold uppercase tracking-[0.4em]">ROOM</span>
                    {room.roomNumber}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 md:space-y-8 flex-1">
                   <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                         <ShieldCheck className="h-3 w-3 text-primary" /> Type: {room.roomType}
                      </div>
                      <div className="text-2xl md:text-4xl font-black text-white group-hover:text-primary transition-colors duration-500">
                        ${room.pricePerNight}<span className="text-[8px] md:text-[10px] font-bold text-white/20 ml-2 uppercase tracking-widest">/ night</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-2 md:gap-4 border-t border-white/5 pt-4 md:pt-6">
                      {[Wifi, Tv, Zap].map((Icon, i) => (
                        <div key={i} className="p-2 md:p-3 rounded bg-white/5 text-white/20 group-hover:text-primary group-hover:border-primary/30 border border-transparent transition-all">
                          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </div>
                      ))}
                   </div>
                </CardContent>

                <CardFooter className="p-0 border-t border-white/5 overflow-hidden">
                  <Button variant="ghost" className="w-full h-12 md:h-14 rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-black hover:bg-primary transition-all">
                    Room Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
