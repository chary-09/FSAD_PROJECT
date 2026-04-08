"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/firebase"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, isUserLoading, router, pathname])

  if (isUserLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-6 font-mono">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Syncing Uplink</p>
      </div>
    )
  }

  if (!user && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}
