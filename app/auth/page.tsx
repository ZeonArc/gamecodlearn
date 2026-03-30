"use client"

import { useState, Suspense } from "react"
export const dynamic = "force-dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, ArrowRight, CheckCircle2, Terminal } from "lucide-react"
import { motion } from "framer-motion"

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) setError(error.message)
      else {
          alert("Check your email for confirmation link!")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else {
        router.push("/dashboard")
        router.refresh()
      }
    }
    setLoading(false)
  }

  const handleOAuth = async (provider: 'github') => {
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
          provider,
          options: {
              redirectTo: `${location.origin}/auth/callback`
          }
      })
  }

  return (
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center md:text-left">
           <h1 className="text-3xl font-bold tracking-tighter">
             {mode === "login" ? "Welcome Back" : "Join the Elite"}
           </h1>
           <p className="text-muted-foreground">
             {mode === "login" ? "Enter your credentials to access the mainframe." : "Create your identity to start the simulation."}
           </p>
        </div>

        <div className="grid gap-4">
           {/* OAuth Buttons */}
            <Button variant="outline" onClick={() => handleOAuth('github')} className="w-full py-6 relative overflow-hidden group">
               <Github className="mr-2 h-5 w-5" />
               <span className="relative z-10">Continue with Github</span>
               <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
            
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or via secure protocol
                </span>
                </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                 <div className="space-y-2">
                     <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/50 border-input/50 focus:border-primary/50 transition-colors h-12"
                      />
                 </div>
                 <div className="space-y-2">
                    <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-muted/50 border-input/50 focus:border-primary/50 transition-colors h-12"
                    />
                 </div>
                  
                  {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          {error}
                      </div>
                  )}

                  <Button disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all hover:scale-[1.02]">
                    {loading && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {mode === "login" ? "Access System" : "Initialize Identity"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
            </form>
            
            <div className="text-center text-sm">
                {mode === "login" ? "Don't have an ID? " : "Already have an ID? "}
                 <Link href={mode === "login" ? "/auth?mode=signup" : "/auth"} className="underline underline-offset-4 hover:text-primary transition-colors font-medium">
                    {mode === "login" ? "Sign Up" : "Login"}
                </Link>
            </div>
             
             {/* Demo Button */}
             <div className="pt-4 border-t border-border/50 text-center">
                 <button 
                  onClick={() => {
                        setEmail("demo@gamecodlearn.com");
                        setPassword("demo1234");
                    }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                 >
                     Use Demo Credentials
                 </button>
             </div>
        </div>
      </div>
  )
}

export default function AuthPage() {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
       {/* Left Side: Graphic */}
       <div className="hidden lg:flex flex-col justify-between p-10 bg-[#0d1117] relative overflow-hidden border-r border-border/30">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          
           <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
              <Terminal className="h-6 w-6 text-primary" />
              GameCodLearn
           </div>

           <div className="relative z-10 max-w-md space-y-8">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
               >
                   <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Build your legacy in code.
                   </h2>
                   <ul className="space-y-4">
                       {[
                           "Interactive LeetCode-style environment",
                           "Real-time complexity analysis",
                           "Global leaderboards and crypto-badges",
                           "Mock interviews with AI feedback"
                       ].map((item, i) => (
                           <motion.li 
                             key={i}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.4 + (i * 0.1) }}
                             className="flex items-center gap-3 text-lg text-muted-foreground"
                            >
                               <CheckCircle2 className="h-5 w-5 text-primary" />
                               {item}
                           </motion.li>
                       ))}
                   </ul>
               </motion.div>
           </div>
           
           <div className="relative z-10 text-sm text-muted-foreground/60">
              © 2024 GameCodLearn Inc. System v2.0
           </div>
       </div>

       {/* Right Side: Form */}
       <div className="flex items-center justify-center p-6 lg:p-10 relative">
          {/* Mobile Background Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-[80px] -z-10 lg:hidden" />
          
          <Suspense fallback={<div>Loading Interface...</div>}>
             <AuthForm />
          </Suspense>
       </div>
    </div>
  )
}
