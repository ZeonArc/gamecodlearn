"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Dev at Vercel",
    content: "GameCodLearn completely changed how I approach DSA. The gamification makes it actually fun to grind LeetCode style problems.",
    avatar: "SC"
  },
  {
    name: "Alex Rivera",
    role: "Student at MIT",
    content: "The AI mentor is a game changer. It's like having a senior engineer pair program with you 24/7.",
    avatar: "AR"
  },
  {
    name: "Jordan Lee",
    role: "Backend Lead",
    content: "I use this to keep my skills sharp. The daily streaks keep me coming back every single morning.",
    avatar: "JL"
  },
   {
    name: "Emily Zhang",
    role: "Full Stack Developer",
    content: "The best platform for learning system design. The visual aids are top notch.",
    avatar: "EZ"
  },
  {
    name: "David Kim",
    role: "Software Engineer at Google",
    content: "I secured my dream job thanks to the mock interview simulations. Highly recommended!",
    avatar: "DK"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mb-16 text-center">
         <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Trusted by <span className="text-primary">Developers</span></h2>
      </div>
      
      {/* Infinite Marquee */}
      <div className="relative flex overflow-x-hidden group">
         {/* Gradient Masks */}
         <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
         <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

         <motion.div 
            className="flex gap-8 py-4 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
         >
            {[...testimonials, ...testimonials].map((t, i) => (
                <Card key={i} className="min-w-[350px] rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <CardContent className="p-8 flex flex-col gap-6">
                    <p className="text-lg text-foreground/80 leading-relaxed">"{t.content}"</p>
                    <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback>{t.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
         </motion.div>
      </div>
    </section>
  )
}
