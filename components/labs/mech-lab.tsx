"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function MechLab() {
  const [teethA, setTeethA] = useState(12)
  const [teethB, setTeethB] = useState(24)
  const [rpmA, setRpmA] = useState(60) // Base RPM
  const [isSuccess, setIsSuccess] = useState(false)

  // Gear B RPM = (Teeth A / Teeth B) * RPM A
  const gearRatio = teethA / teethB
  const rpmB = Math.round(gearRatio * rpmA)
  
  const targetRpm = 30 
  
  useEffect(() => {
    if (rpmB === targetRpm) setIsSuccess(true)
  }, [rpmB])

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Settings className="text-amber-400 w-5 h-5 bg-amber-500/10 p-1 rounded" /> 
               Kinematics Lab (Mech)
             </h3>
             <p className="text-sm text-slate-400">Target: Reach exactly <span className="font-bold text-amber-500">{targetRpm} RPM</span> on Output Gear B.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { setTeethA(12); setTeethB(24); setIsSuccess(false); }}
            className="border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Visualizer Area */}
        <div className="w-full max-w-2xl bg-black/60 rounded-xl border border-white/10 p-12 flex justify-center items-center gap-4 relative">
          
          {/* Gear A (Input) */}
          <div className="flex flex-col items-center gap-6">
            <h4 className="font-bold text-blue-400 font-mono tracking-widest text-sm">INPUT (A)</h4>
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 60 / rpmA // Duration for 1 full rotation
                }}
                className={cn(
                  "border-8 border-dashed border-blue-500/80 rounded-full flex items-center justify-center bg-blue-500/10",
                  teethA === 12 ? "w-32 h-32" : teethA === 24 ? "w-48 h-48" : "w-64 h-64"
                )}
              >
                  <div className="w-6 h-6 rounded-full bg-blue-500/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                  </div>
              </motion.div>
            </div>
            <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-lg text-center font-mono">
               <span className="block text-slate-500 text-xs">RPM</span>
               <span className="text-blue-400 text-xl font-bold">{rpmA}</span>
            </div>
          </div>

          {/* Connectors / Visual separator */}
          <div className="text-slate-600 font-black text-4xl leading-none px-4">↔</div>

          {/* Gear B (Output) */}
          <div className="flex flex-col items-center gap-6">
             <h4 className={cn("font-bold font-mono tracking-widest text-sm", isSuccess ? "text-emerald-400" : "text-amber-400")}>OUTPUT (B)</h4>
             <div className="relative">
              <motion.div 
                animate={{ rotate: -360 }} // Spins opposite direction
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 60 / Math.max(rpmB, 1) // Prevent / 0
                }}
                className={cn(
                  "border-8 border-dashed rounded-full flex items-center justify-center",
                  isSuccess ? "border-emerald-500/80 bg-emerald-500/10" : "border-amber-500/80 bg-amber-500/10",
                  teethB === 12 ? "w-32 h-32" : teethB === 24 ? "w-48 h-48" : "w-64 h-64"
                )}
              >
                 <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", isSuccess ? "bg-emerald-500/50" : "bg-amber-500/50")}>
                    <div className="w-2 h-2 rounded-full bg-black" />
                 </div>
              </motion.div>
             </div>
             <div className={cn("bg-slate-900 border border-white/10 px-4 py-2 rounded-lg text-center font-mono", isSuccess && "border-emerald-500/50")}>
               <span className="block text-slate-500 text-xs">RPM</span>
               <span className={cn("text-xl font-bold", isSuccess ? "text-emerald-400" : "text-amber-400")}>{rpmB}</span>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-8">
           <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300">Gear A Teeth</label>
              <div className="flex gap-2">
                 {[12, 24, 36].map(t => (
                    <Button 
                      key={t}
                      variant={teethA === t ? "default" : "outline"}
                      onClick={() => setTeethA(t)}
                      className={cn("flex-1", teethA === t && "bg-blue-600 hover:bg-blue-700")}
                    >
                      {t}t
                    </Button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300">Gear B Teeth</label>
              <div className="flex gap-2">
                 {[12, 24, 36].map(t => (
                    <Button 
                      key={t}
                      variant={teethB === t ? "default" : "outline"}
                      onClick={() => setTeethB(t)}
                      className={cn("flex-1", teethB === t && "bg-amber-600 hover:bg-amber-700")}
                    >
                      {t}t
                    </Button>
                 ))}
              </div>
           </div>
        </div>

        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full"
          >
            <CheckCircle className="text-emerald-400 w-5 h-5" />
            <span className="text-emerald-400 font-medium font-mono text-sm">RATIO OPTIMIZED! +50 XP</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
