"use client"

import { Code2, Target, Users, Zap, Brain, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Code2,
    title: "Interactive Coding",
    description: "Real-time execution environment with IntelliSense-like autocomplete.",
    className: "lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-primary/10 to-transparent",
    color: "text-blue-400",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Detailed complexity analysis for Big O optimization.",
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-purple-400",
  },
  {
    icon: Target,
    title: "Structured Paths",
    description: "Curated roadmaps from Novice to Architect.",
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-green-400",
  },
  {
    icon: Zap,
    title: "Daily Streaks",
    description: "Gamified progression system to keep you consistent.",
    className: "lg:col-span-1 lg:row-span-2",
    color: "text-yellow-400",
  },
  {
    icon: Users,
    title: "Community",
    description: "Compare solutions with global peers.",
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-pink-400",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Mock interviews with real company questions.",
    className: "lg:col-span-1 lg:row-span-1 bg-gradient-to-tl from-accent/10 to-transparent",
    color: "text-cyan-400",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 container px-4 md:px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to <span className="text-primary">excel</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
            A comprehensive suite of tools designed to accelerate your mastery.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.05)" }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-1",
                feature.className
            )}
          >
            <div className="flex h-full flex-col justify-between relative z-10">
                <div className={cn("mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 border border-border/40 shadow-sm", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
