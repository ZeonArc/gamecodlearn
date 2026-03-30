"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Flame, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function StreakPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate valid streak check
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
            <div className="relative bg-[#1a1a1a] border border-orange-500/50 rounded-xl p-4 shadow-2xl shadow-orange-500/20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                
                <div className="relative z-10 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/30">
                        <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold text-lg text-white">Daily Streak!</h3>
                             <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-white transition-colors">
                                 <X className="h-4 w-4" />
                             </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">You're on fire! Keep it up for 7 days to earn the <span className="text-orange-400 font-bold">Inferno Amulet</span>.</p>
                        <div className="mt-3 flex gap-2">
                             <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-orange-500 w-[70%]" />
                             </div>
                             <span className="text-xs font-bold text-orange-500">5/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  )
}
