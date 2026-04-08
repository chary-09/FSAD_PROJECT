"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Sparkles, Loader2, ArrowUpCircle, PlusCircle, Target } from "lucide-react"
import { automatedUpsellSuggestions, type AutomatedUpsellSuggestionsOutput } from "@/ai/flows/automated-upsell-suggestions"
import { Customer, Reservation } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface UpsellDialogProps {
  customer: Customer;
  reservation: Reservation;
}

export function UpsellDialog({ customer, reservation }: UpsellDialogProps) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AutomatedUpsellSuggestionsOutput | null>(null)

  const getRecommendations = async () => {
    setLoading(true)
    try {
      const result = await automatedUpsellSuggestions({
        customerProfile: {
          id: customer.id,
          loyaltyTier: customer.loyaltyTier || "None",
          previousStays: customer.previousStays,
          preferences: customer.preferences
        },
        bookingDetails: {
          bookingId: reservation.id,
          roomTypeBooked: "Standard Unit",
          numberOfNights: 3,
          numberOfGuests: reservation.numberOfGuests,
          checkInDate: reservation.checkInDate,
          totalPrice: reservation.totalPrice
        },
        availableUpgrades: ["High-Security Suite", "Penthouse Command", "Deluxe Void View"],
        availableServices: ["Encrypted Shuttle", "Nutrient Buffet", "Neural Spa", "Extended Cycle"]
      })
      setSuggestions(result)
    } catch (error) {
      console.error("AI flow error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 border-white/10 hover:border-primary/50 hover:bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          AI Optimize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-black border border-white/10 shadow-[0_0_100px_rgba(255,69,0,0.1)] font-mono">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded bg-primary flex items-center justify-center cyber-glow">
              <Target className="h-6 w-6 text-black" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-widest text-white">Neural Optimizer</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Synthesizing offers for <span className="text-primary">{customer.firstName} {customer.lastName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {!suggestions && !loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-white/10 rounded">
               <div className="h-20 w-20 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="h-10 w-10 text-primary" />
               </div>
               <div className="space-y-2 px-12">
                 <p className="text-sm font-black uppercase tracking-[0.2em]">Ready for Analysis?</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">System will process guest behavioral data to extract maximum credit yield.</p>
               </div>
               <Button onClick={getRecommendations} className="bg-primary hover:bg-primary/90 text-black font-black px-8 h-12 cyber-glow">
                 EXECUTE ANALYSIS
               </Button>
            </div>
          )}

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Synthesizing Data</p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress-flow" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          )}

          {suggestions && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] p-6 rounded border border-white/10 hover:border-primary/30 transition-all">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-5 flex items-center gap-3">
                    <ArrowUpCircle className="h-4 w-4 text-primary" />
                    Unit Upgrades
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.suggestedUpgrades.map((upgrade, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1.5 bg-primary text-black font-black text-[9px] uppercase tracking-widest border-none cyber-glow">
                        {upgrade}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] p-6 rounded border border-white/10 hover:border-primary/30 transition-all">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-5 flex items-center gap-3">
                    <PlusCircle className="h-4 w-4 text-primary" />
                    Neural Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.suggestedServices.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1.5 border-white/10 text-white font-black text-[9px] uppercase tracking-widest hover:border-primary/50 transition-colors">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Target className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary" /> AI Strategy Reasoning
                </h4>
                <p className="text-[11px] font-bold leading-relaxed text-white/80 uppercase tracking-widest italic">
                  "{suggestions.reasoning}"
                </p>
              </div>
            </div>
          )}
        </div>

        {suggestions && (
          <DialogFooter className="flex-col sm:flex-row gap-4 mt-6 border-t border-white/10 pt-8">
            <Button variant="ghost" onClick={() => setSuggestions(null)} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Abort</Button>
            <Button className="bg-primary hover:bg-primary/90 text-black font-black px-10 h-14 cyber-glow">COMMIT OFFERS</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}