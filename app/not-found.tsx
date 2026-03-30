/import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center relative overflow-hidden">
        {/* Cyber Background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/10 rounded-full blur-[120px] -z-10 animate-pulse" />
       
      <div className="p-6 rounded-full bg-destructive/10 text-destructive mb-2 animate-bounce">
        <AlertTriangle className="h-16 w-16" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-6xl font-extrabold tracking-tighter text-destructive drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">404</h2>
        <p className="text-2xl font-bold">System Error: Page Not Found</p>
        <p className="text-muted-foreground max-w-[500px]">The requested protocol does not exist in this sector. Return to base immediatley.</p>
      </div>
      
      <Link href="/">
        <Button size="lg" className="bg-destructive hover:bg-destructive/80 text-destructive-foreground shadow-[0_0_20px_rgba(255,0,0,0.4)]">
            Reboot System (Home)
        </Button>
      </Link>
    </div>
  )
}
