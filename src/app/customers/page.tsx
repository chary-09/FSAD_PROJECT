
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, History, MoreVertical, Search, Plus, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersPage() {
  const db = useFirestore();
  const customersQuery = useMemoFirebase(() => collection(db, 'customers'), [db]);
  const { data: customers, isLoading } = useCollection(customersQuery);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers?.filter(c => 
    c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (member: boolean) => {
    return member ? 'bg-primary text-black cyber-glow border-none' : 'bg-muted text-muted-foreground border-border'
  }

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    addDocumentNonBlocking(collection(db, 'customers'), {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      loyaltyProgramMember: true,
      previousStays: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsAddOpen(false);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-mono selection:bg-primary selection:text-black">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-y-auto">
        <header className="flex h-16 md:h-20 items-center px-4 md:px-8 sticky top-0 glass-nav z-10 justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <SidebarTrigger className="text-white hover:text-primary transition-colors shrink-0" />
            <h1 className="text-lg md:text-xl font-black tracking-widest text-white uppercase flex items-center gap-2 md:gap-3 truncate">
              <UserPlus className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" /> Guest <span className="hidden sm:inline">Directory</span>
            </h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black font-black px-4 md:px-6 gap-2 cyber-glow text-xs h-9 md:h-10">
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 stroke-[3]" />
                <span className="hidden sm:inline">Add New Guest</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-white/10 font-mono text-white max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary font-black uppercase tracking-widest text-sm md:text-base">New Guest Profile</DialogTitle>
                <DialogDescription className="sr-only">Enter the details of the new guest to add to the registry.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4 md:space-y-6 py-2 md:py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">First Name</Label>
                    <Input name="firstName" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Last Name</Label>
                    <Input name="lastName" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input name="email" type="email" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                  <Input name="phone" className="bg-white/5 border-white/10 text-xs h-9 md:h-10" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-primary text-black font-black uppercase tracking-widest cyber-glow h-12">Save Guest</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 md:mb-10 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input 
                placeholder="Search guest names..." 
                className="pl-12 h-12 md:h-14 bg-white/[0.03] border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:border-primary/50" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[200px] w-full bg-white/5 rounded" />)
            ) : filteredCustomers?.map((customer) => (
              <Card key={customer.id} className="cyber-card overflow-hidden border border-white/10 group">
                <CardContent className="p-0">
                   <div className="flex flex-col sm:flex-row items-stretch min-h-[160px]">
                      <div className="w-full sm:w-1/3 bg-white/5 flex sm:flex-col items-center justify-between sm:justify-center p-4 md:p-6 border-b sm:border-b-0 sm:border-r border-white/5">
                         <Avatar className="h-12 w-12 md:h-20 md:w-20 border-2 border-primary/20 shadow-lg group-hover:border-primary transition-colors duration-500">
                           <AvatarImage src={`https://picsum.photos/seed/${customer.id}/200/200`} />
                           <AvatarFallback className="text-sm md:text-xl font-black bg-primary text-black">
                             {customer.firstName?.[0]}{customer.lastName?.[0]}
                           </AvatarFallback>
                         </Avatar>
                         <Badge className={`mt-0 sm:mt-4 font-black text-[7px] md:text-[8px] uppercase tracking-widest px-2 md:px-3 py-1 ${getTierColor(customer.loyaltyProgramMember)}`}>
                            {customer.loyaltyProgramMember ? 'ELITE MEMBER' : 'GUEST'}
                         </Badge>
                      </div>
                      <div className="flex-1 p-5 md:p-8 relative">
                         <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 rounded-full text-white/30 hover:text-primary">
                               <MoreVertical className="h-4 w-4" />
                            </Button>
                         </div>
                         <h3 className="text-base md:text-xl font-black tracking-tight mb-1 uppercase group-hover:text-primary transition-colors truncate pr-8">{customer.firstName} {customer.lastName}</h3>
                         <div className="space-y-2 md:space-y-3 mt-4 md:mt-6">
                            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                               <Mail className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
                               {customer.email}
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                               <Phone className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
                               {customer.phoneNumber}
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-1 md:pt-2">
                               <History className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
                               <span className="font-black text-white">{customer.previousStays || 0}</span> Previous Stays
                            </div>
                         </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
