"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Sparkles, Layers } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  const [codeText, setCodeText] = useState("")
  const FullCode = `export default function Future() {
  return (
    <Platform
      tech={['Next.js', 'AI', 'Algorithms']}
      state="Optimized"
    />
  );
}`

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setCodeText(FullCode.slice(0, i))
      i++
      if (i > FullCode.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
      
      {/* Soft Animated Background Mesh (Handled by global CSS gradient theme ideally, but we put a subtle radial here for structure) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-[-1]" />
      
      <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Refined Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground w-fit shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Next-Gen Learning Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Engineering
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-[500px]">
            Master algorithms, data structures, and system design through fluid, AI-driven interactive experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/problems">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-medium bg-background/50 backdrop-blur-sm hover:bg-accent/10">
                    Explore Problems
                </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-8 mt-8 text-sm font-medium text-muted-foreground">
             <div className="flex items-center gap-2">
                 <Code2 className="h-4 w-4 text-primary" />
                 <span>Native AI Integration</span>
             </div>
             <div className="flex items-center gap-2">
                 <Layers className="h-4 w-4 text-accent" />
                 <span>Interactive IDE</span>
             </div>
          </div>
        </motion.div>

        {/* Right: Sleek Mac-like IDE Window */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
           className="relative w-full max-w-lg mx-auto lg:mx-0"
        >
            <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl">
                {/* Windows/Mac like Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border/40">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="mx-auto text-xs font-medium text-muted-foreground flex items-center gap-2">
                       <Code2 className="w-3 h-3" /> main.tsx
                    </div>
                </div>
                
                {/* Code Body */}
                <div className="p-6 font-mono text-sm leading-relaxed h-[320px] text-foreground/80 overflow-hidden">
                    <pre className="whitespace-pre-wrap">
                        <code>
                            {codeText}
                            <span className="inline-block w-2.5 h-4 bg-primary ml-1 animate-pulse align-middle opacity-70" />
                        </code>
                    </pre>
                </div>
            </div>
            
            {/* Minimal Background Glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-[100px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
