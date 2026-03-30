"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShieldAlert, RefreshCw, Layers, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeaSimulator() {
  const [loadForce, setLoadForce] = useState<number>(0) // 0 to 100 kN
  const [material, setMaterial] = useState<"Alloy Steel" | "Aluminum" | "Titanium">("Alloy Steel")
  const [isBroken, setIsBroken] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Material properties
  const materialProps = {
    "Alloy Steel": { yieldStrength: 65, color: "text-slate-400" },
    "Aluminum": { yieldStrength: 40, color: "text-blue-300" },
    "Titanium": { yieldStrength: 85, color: "text-yellow-200" }
  }

  const yieldLimit = materialProps[material].yieldStrength

  useEffect(() => {
    if (loadForce > yieldLimit) {
      setIsBroken(true)
      setIsSuccess(false)
    } else if (loadForce >= yieldLimit - 10 && loadForce <= yieldLimit) {
      setIsSuccess(true) // Optimized design (close to limit but safe)
    } else {
      setIsSuccess(false)
      setIsBroken(false)
    }
  }, [loadForce, material, yieldLimit])

  // Generate stress heatmap colors based on load
  const getStressColor = (segmentPosition: number) => {
    // Basic approximation: high stress in center, low at ends
    const distanceToCenter = Math.abs(segmentPosition - 0.5) * 2
    const stressFactor = (loadForce / yieldLimit) * (1 - distanceToCenter * 0.5)
    
    if (isBroken) return "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
    if (stressFactor < 0.3) return "bg-blue-500/80"
    if (stressFactor < 0.7) return "bg-emerald-500/80"
    if (stressFactor < 1.0) return "bg-yellow-500/90 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
    return "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
  }

  // Calculate beam deflection (bending) visually
  const maxDeflection = isBroken ? 60 : (loadForce / yieldLimit) * 20

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Layers className="text-rose-400 w-5 h-5 bg-rose-500/10 p-1 rounded" /> 
               FEA Stress Simulator (MechE)
             </h3>
             <p className="text-sm text-slate-400">Apply a structural load to the beam. Optimize the design to be as close to the yield point as possible without breaking.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { setLoadForce(0); setIsBroken(false); setIsSuccess(false); }}
            className="border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* FEA Visualizer */}
        <div className="w-full max-w-4xl bg-black/80 rounded-xl border border-white/5 p-12 relative flex justify-center items-center h-[300px] shadow-inner mb-8">
          
          {/* Support Columns (Pillars) */}
          <div className="absolute bottom-12 left-20 w-8 h-24 bg-slate-800 border-x border-t border-slate-600" />
          <div className="absolute bottom-12 right-20 w-8 h-24 bg-slate-800 border-x border-t border-slate-600" />

          {/* Applied Load Arrow */}
          <motion.div 
             animate={{ y: Math.min(loadForce, yieldLimit) * 0.2 }}
             className="absolute top-8 flex flex-col items-center z-20"
          >
             <span className="font-mono font-bold text-red-500 mb-1">{loadForce} kN</span>
             <div className="w-1 h-16 bg-red-500" />
             <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
          </motion.div>

          {/* Finite Element Beam */}
          <div className="flex w-full max-w-2xl mt-4 relative z-10">
             {/* Render 20 segments for FEA representation */}
             {[...Array(20)].map((_, i) => {
                const normPos = i / 19
                // Parabolic deflection curve
                const deflection = maxDeflection * (1 - Math.pow((normPos * 2 - 1), 2))
                
                return (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: isBroken && (i === 9 || i === 10) ? (i === 9 ? -15 : 15) : 0, 
                      y: isBroken && (i === 9 || i === 10) ? deflection + 40 : deflection 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "flex-1 h-8 transition-colors duration-500 border-x border-white/5",
                      getStressColor(normPos)
                    )}
                  />
                )
             })}
          </div>

          {isBroken && (
            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-30 pointer-events-none">
              <div className="bg-red-900/80 border border-red-500 text-red-100 font-bold px-6 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                <ShieldAlert className="w-5 h-5" /> MATERIAL FRACTURE
              </div>
            </div>
          )}
        </div>

        {/* Editor sidebar/controls */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
           <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">Select Material</label>
              <div className="flex gap-2">
                 {(["Alloy Steel", "Aluminum", "Titanium"] as const).map(m => (
                    <Button 
                      key={m}
                      variant={material === m ? "default" : "outline"}
                      onClick={() => setMaterial(m)}
                      className={cn("flex-1", material === m && "bg-rose-600 hover:bg-rose-700")}
                    >
                      {m}
                    </Button>
                 ))}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-2 flex justify-between">
                <span>Yield Strength Max:</span> 
                <span className={cn("font-bold", materialProps[material].color)}>{yieldLimit} kN</span>
              </p>
           </div>

           <div className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    Applied Central Load (kN)
                    <span className={cn("font-bold", loadForce > yieldLimit ? "text-red-500" : "text-blue-400")}>
                        {loadForce} / 100
                    </span>
                </label>
                <input 
                    type="range" 
                    min="0" max="100" step="1"
                    value={loadForce} 
                    onChange={e => setLoadForce(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                />
           </div>
        </div>

        <AnimatePresence>
          {isSuccess && !isBroken && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-8 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full"
            >
              <CheckCircle className="text-emerald-400 w-5 h-5" />
              <span className="text-emerald-400 font-medium font-mono text-sm">OPTIMAL STRESS TOLERANCE! +150 XP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
