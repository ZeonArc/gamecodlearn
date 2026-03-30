"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, TestTube, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Nucleotide = "A" | "T" | "C" | "G"

const PAIR_MAP: Record<Nucleotide, Nucleotide> = {
  A: "T",
  T: "A",
  C: "G",
  G: "C",
}

export function BioLab() {
  // Target sequence
  const targetStrand: Nucleotide[] = ["A", "T", "G", "C", "A"]
  const [playerStrand, setPlayerStrand] = useState<Nucleotide[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [shakeIndex, setShakeIndex] = useState<number | null>(null)

  useEffect(() => {
    if (playerStrand.length === targetStrand.length) {
      // Check if perfectly matched
      const isPerfect = playerStrand.every((nuc, i) => nuc === PAIR_MAP[targetStrand[i]])
      if (isPerfect) setIsSuccess(true)
    }
  }, [playerStrand])

  const handleSelect = (nuc: Nucleotide) => {
    if (playerStrand.length >= targetStrand.length) return
    
    const currentIndex = playerStrand.length
    const expected = PAIR_MAP[targetStrand[currentIndex]]
    
    if (nuc !== expected) {
      setShakeIndex(currentIndex)
      setTimeout(() => setShakeIndex(null), 500)
    } else {
      setPlayerStrand(prev => [...prev, nuc])
    }
  }

  const reset = () => {
    setPlayerStrand([])
    setIsSuccess(false)
    setShakeIndex(null)
  }

  const getNucColor = (nuc: Nucleotide, isTarget = false) => {
    const baseColors = {
      A: "bg-red-500/80 border-red-400 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
      T: "bg-blue-500/80 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      C: "bg-yellow-500/80 border-yellow-400 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
      G: "bg-emerald-500/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
    }
    const targetColors = {
      A: "border-red-400/50 text-red-400",
      T: "border-blue-400/50 text-blue-400",
      C: "border-yellow-400/50 text-yellow-400",
      G: "border-emerald-400/50 text-emerald-400"
    }
    return isTarget ? targetColors[nuc] : baseColors[nuc]
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <TestTube className="text-pink-400 w-5 h-5" /> 
               Genetics Lab (BioTech)
             </h3>
             <p className="text-sm text-slate-400">Synthesize the complimentary DNA strand. (A pairs with T, C pairs with G)</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={reset}
            className="border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Restart
          </Button>
        </div>

        {/* DNA Helix Visualization */}
        <div className="w-full max-w-3xl bg-black/60 rounded-xl border border-white/10 p-12 flex justify-center items-center relative overflow-hidden h-64">
           {/* Ambient floating particles */}
           {[...Array(10)].map((_, i) => (
             <motion.div 
               key={i}
               className="absolute w-1 h-1 bg-white/20 rounded-full"
               initial={{ x: Math.random() * 800, y: Math.random() * 300, opacity: 0 }}
               animate={{ x: Math.random() * 800, y: Math.random() * 300, opacity: [0, 1, 0] }}
               transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
             />
           ))}

           <div className="flex gap-4">
              {targetStrand.map((nuc, idx) => {
                 const isPaired = playerStrand.length > idx
                 const playerNuc = playerStrand[idx]
                 
                 return (
                   <div key={idx} className="flex items-center gap-1 w-24">
                     {/* Target Nucleotide */}
                     <div className={cn("w-10 h-10 rounded-r-full border-2 border-l-0 flex items-center justify-center font-bold text-lg", getNucColor(nuc, true))}>
                       {nuc}
                     </div>
                     
                     {/* Hydrogen Bond (Line) */}
                     <div className={cn("flex-1 h-0.5 border-t-2 border-dashed transition-all duration-300", isPaired ? "border-white/50" : "border-white/10")} />
                     
                     {/* Player Nucleotide Slot */}
                     <motion.div 
                        initial={false}
                        animate={shakeIndex === idx ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "w-10 h-10 rounded-l-full border-2 border-r-0 flex items-center justify-center font-bold text-lg transition-all duration-300",
                          isPaired ? getNucColor(playerNuc, false) : "border-white/10 text-transparent"
                        )}
                     >
                       {isPaired ? playerNuc : "?"}
                     </motion.div>
                   </div>
                 )
              })}
           </div>
        </div>

        {/* Controls */}
        <div className="mt-8">
           <p className="text-center text-sm font-mono text-slate-400 mb-4 uppercase tracking-widest">Select Nucleotide Base</p>
           <div className="flex gap-4 justify-center">
             {(["A", "T", "G", "C"] as Nucleotide[]).map(base => (
                <motion.button
                  key={base}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(base)}
                  disabled={isSuccess || playerStrand.length >= targetStrand.length}
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transition-all",
                    base === "A" ? "bg-red-500/20 border border-red-400/50 text-red-100 hover:bg-red-500/40" :
                    base === "T" ? "bg-blue-500/20 border border-blue-400/50 text-blue-100 hover:bg-blue-500/40" :
                    base === "G" ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/40" :
                    "bg-yellow-500/20 border border-yellow-400/50 text-yellow-100 hover:bg-yellow-500/40",
                    (isSuccess || playerStrand.length >= targetStrand.length) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {base}
                </motion.button>
             ))}
           </div>
        </div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-8 flex items-center gap-3 bg-fuchsia-500/10 border border-fuchsia-500/20 px-6 py-3 rounded-full"
            >
              <CheckCircle className="text-fuchsia-400 w-5 h-5" />
              <span className="text-fuchsia-400 font-medium font-mono text-sm">PROTEIN SYNTHESIZED! +100 XP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
