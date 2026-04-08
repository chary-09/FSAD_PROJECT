"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/firebase"
import { signInAnonymously } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, Shield, Target, Terminal } from "lucide-react"

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isSequencing, setIsSequencing] = useState(false)
  const [sequenceText, setSequenceText] = useState("")

  const sequences = [
    "INITIALIZING NEURAL UPLINK...",
    "HANDSHAKE PROTOCOL: ALPHA-7",
    "ENCRYPTING SIGNAL STREAM...",
    "VERIFYING NODE INTEGRITY...",
    "BUILDOHOLICS CORE DETECTED",
    "ESTABLISHING SECURE TUNNEL...",
    "SYNC SUCCESSFUL. REDIRECTING."
  ]

  useEffect(() => {
    if (isSequencing) {
      let current = 0
      const interval = setInterval(() => {
        if (current < sequences.length) {
          setSequenceText(sequences[current])
          current++
        } else {
          clearInterval(interval)
          completeLogin()
        }
      }, 600)
      return () => clearInterval(interval)
    }
  }, [isSequencing])

  const completeLogin = async () => {
    try {
      await signInAnonymously(auth)
      router.push("/dashboard")
    } catch (error) {
      setIsSequencing(false)
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setIsSequencing(true)
  }

  if (isSequencing) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono overflow-hidden">
        <div className="scanline-effect" />
        <div className="relative z-10 space-y-12 flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded bg-primary flex items-center justify-center cyber-glow">
            <Zap className="h-12 w-12 text-black fill-black" />
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.5em]">BuildoHolics</h2>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Hotel Management System</span>
            <div className="h-1 w-64 bg-white/5 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-primary animate-progress-flow" style={{ width: '40%' }} />
            </div>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{sequenceText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
      <Card className="w-full max-w-md bg-black border border-white/10 cyber-glow-sm relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <CardHeader className="space-y-6 pt-12 text-center">
          <div className="mx-auto h-20 w-20 rounded bg-primary flex items-center justify-center cyber-glow">
            <Zap className="h-10 w-10 text-black fill-black" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black uppercase tracking-[0.2em] text-white">BuildoHolics</CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Hotel Management System // Node: Alpha-7
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-12">
          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.3em] cyber-glow transition-all active:scale-[0.98]"
            >
              {loading ? "INITIALIZING LINK..." : "ESTABLISH LINK"}
            </Button>
            <div className="flex items-center justify-center gap-6 pt-6">
              {[Shield, Target, Terminal].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className="p-3 rounded border border-white/5 bg-white/[0.02]">
                     <Icon className="h-4 w-4 text-white/20" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}