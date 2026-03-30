"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const steps = [
    { title: "Pick a Track", desc: "Choose from Web Dev, DSA, or System Design.", step: "01", color: "bg-blue-500" },
    { title: "Learn & Practice", desc: "Watch bite-sized lessons and solve interactive coding challenges.", step: "02", color: "bg-purple-500" },
    { title: "Get Certified", desc: "Complete capstone projects and earn industry-recognized badges.", step: "03", color: "bg-green-500" }
  ]

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How it Works</h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
                    Your journey from beginner to expert in 3 simple steps.
                </p>
            </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-0 bottom-0 left-[2rem] md:left-1/2 md:-translate-x-1/2 w-1 bg-border/30 h-full hidden md:block" />
            
            {/* Steps */}
            <div className="space-y-12 md:space-y-24">
                {steps.map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Text Content Side */}
                        <div className={`flex-1 text-center md:text-left ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                             <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                             <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                        
                        {/* Center Circle */}
                        <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/80 backdrop-blur-md shadow-lg">
                            <span className={`text-xl font-bold ${item.color.replace("bg-", "text-")}`}>{item.step}</span>
                            {/* Pulse Effect */}
                            <div className={`absolute inset-0 rounded-full ${item.color} opacity-10 blur-md`} />
                        </div>

                        {/* Empty Side for balance on Desktop */}
                        <div className="flex-1 hidden md:block"></div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  )
}
