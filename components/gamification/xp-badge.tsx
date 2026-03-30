"use client"

import { Zap } from "lucide-react"
import { motion } from "framer-motion"

export function XPBadge({ xp = 1250 }: { xp?: number }) {
  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-500">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Zap className="h-3 w-3 fill-yellow-500" />
      </motion.div>
      <span>{xp.toLocaleString()} XP</span>
    </div>
  )
}
