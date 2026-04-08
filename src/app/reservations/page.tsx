"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { UpsellDialog } from "@/components/upsell-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReservationsPage() {
  const db = useFirestore();
  const resQuery = useMemoFirebase(() => collection(db, 'reservations'), [db]);
  const custQuery = useMemoFirebase(() => collection(db, 'customers'), [db]);
  const roomsQuery = useMemoFirebase(() => collection(db, 'rooms'), [db]);

  const { data: reservations, isLoading: loadingRes } = useCollection(resQuery);
  const { data: customers } = useCollection(custQuery);
  const { data: rooms } = useCollection(roomsQuery);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const handleAddReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const checkInDate = formData.get('checkIn') as string;
    const checkOutDate = formData.get('checkOut') as string;

    if (!selectedCustomerId || !selectedRoomId) return;

    const selectedRoom = rooms?.find(r => r.id === selectedRoomId);
    const pricePerNight = selectedRoom?.pricePerNight || 100;

    addDocumentNonBlocking(collection(db, 'reservations'), {
      customerId: selectedCustomerId,
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      status: 'Confirmed',
      numberOfGuests: 1,
      totalPrice: pricePerNight * 3,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsAddOpen(false);
    setSelectedCustomerId("");
    setSelectedRoomId("");
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-mono selection:bg-primary selection:text-black">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-y-auto">
        <header className="flex h-16 md:h-20 items-center px-4 md:px-8 sticky top-0 glass-nav z-10 justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <SidebarTrigger className="text-white hover:text-primary transition-colors shrink-0" />
            <h1 className="text-lg md:text-2xl font-black tracking-widest text-white uppercase flex items-center gap-2 md:gap-3 truncate">
              <Database className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" /> <span className="hidden sm:inline">Reservations Registry</span><span className="sm:hidden">Bookings</span>
            </h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black font-black px-4 md:px-6 gap-2 cyber-glow transition-all text-xs md:text-sm h-9 md:h-10">
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 stroke-[3]" />
                <span className="hidden sm:inline">New Reservation</span>
                <span className="sm:hidden">New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-white/10 font-mono text-white max-w-[95vw] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-primary font-black uppercase tracking-widest text-sm md:text-base">Add New Booking</DialogTitle>
                <DialogDescription className="sr-only">Assign a guest to an available room and set their stay dates.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddReservation} className="space-y-4 md:space-y-6 py-2 md:py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Select Guest</Label>
                  <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs text-white">
                      <SelectValue placeholder="Search Guest Name" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      {customers?.map(c => (
                        <SelectItem key={c.id} value={c.id} className="focus:bg-primary focus:text-black">
                          {c.firstName} {c.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Select Room</Label>
                  <Select onValueChange={setSelectedRoomId} value={selectedRoomId} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs text-white">
                      <SelectValue placeholder="Select Available Room" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      {rooms?.filter(r => r.status === 'Available').map(r => (
                        <SelectItem key={r.id} value={r.id} className="focus:bg-primary focus:text-black">
                          Room {r.roomNumber} ({r.roomType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-in Date</Label>
                    <Input name="checkIn" type="date" className="bg-white/5 border-white/10 text-xs text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Check-out Date</Label>
                    <Input name="checkOut" type="date" className="bg-white/5 border-white/10 text-xs text-white" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-primary text-black font-black uppercase tracking-widest cyber-glow h-12">Confirm Booking</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 md:mb-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input 
                placeholder="Search by Guest Name / ID..." 
                className="pl-12 h-12 md:h-14 bg-white/[0.03] border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:border-primary/50" 
              />
            </div>
          </div>

          <div className="rounded border border-white/10 bg-white/[0.02] overflow-hidden">
            {loadingRes ? (
              <div className="p-4 md:p-8 space-y-4">
                <Skeleton className="h-10 w-full bg-white/5" />
                <Skeleton className="h-10 w-full bg-white/5" />
                <Skeleton className="h-10 w-full bg-white/5" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[800px] lg:min-w-full">
                  <TableHeader className="bg-white/5 border-b border-white/10">
                    <TableRow className="hover:bg-transparent border-none h-14 md:h-16">
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary pl-4 md:pl-8">ID</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary">Guest Name</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary">Check-in</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary">Check-out</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary">Status</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary text-right">Price</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-primary text-center">AI Optimization</TableHead>
                      <TableHead className="w-[60px] md:w-[80px] pr-4 md:pr-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations?.map((res) => {
                      const customer = customers?.find(c => c.id === res.customerId);
                      return (
                        <TableRow key={res.id} className="group border-white/5 hover:bg-white/[0.03] transition-colors h-16 md:h-20">
                          <TableCell className="font-mono text-[9px] md:text-[10px] font-black text-white/30 pl-4 md:pl-8">{res.id.substring(0, 6).toUpperCase()}</TableCell>
                          <TableCell>
                            <div className="flex flex-col min-w-[120px]">
                              <span className="font-black text-xs md:text-sm text-white group-hover:text-primary transition-colors tracking-tight truncate">
                                {customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Guest"}
                              </span>
                              <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{customer?.email || "No Email"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[9px] md:text-[10px] font-bold text-white/80 whitespace-nowrap">{res.checkInDate}</TableCell>
                          <TableCell className="text-[9px] md:text-[10px] font-bold text-white/80 whitespace-nowrap">{res.checkOutDate}</TableCell>
                          <TableCell>
                            <Badge className={`${res.status === 'Checked-In' ? 'bg-primary text-black cyber-glow' : 'bg-white/10 text-white/60'} font-black text-[8px] md:text-[9px] tracking-[0.2em] uppercase border-none px-2 md:px-3 py-0.5 md:py-1 whitespace-nowrap`}>
                              {res.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-black text-primary text-sm md:text-base italic tracking-tighter">${res.totalPrice}</TableCell>
                          <TableCell className="text-center">
                            {customer && <UpsellDialog customer={{ 
                              id: customer.id, 
                              firstName: customer.firstName,
                              lastName: customer.lastName,
                              email: customer.email, 
                              phoneNumber: customer.phoneNumber, 
                              loyaltyTier: customer.loyaltyProgramMember ? 'Gold' : 'None',
                              previousStays: customer.previousStays || 0,
                              loyaltyProgramMember: customer.loyaltyProgramMember
                            }} reservation={{ 
                              id: res.id, 
                              customerId: res.customerId, 
                              roomId: res.roomId, 
                              checkInDate: res.checkInDate, 
                              checkOutDate: res.checkOutDate, 
                              numberOfGuests: res.numberOfGuests, 
                              status: res.status, 
                              totalPrice: res.totalPrice 
                            }} />}
                          </TableCell>
                          <TableCell className="pr-4 md:pr-8 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/5 hover:text-primary">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}