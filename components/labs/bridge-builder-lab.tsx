"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Activity, ShieldAlert, CheckCircle, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

export function BridgeBuilderLab() {
  const [thickness, setThickness] = useState<number>(5) // Cross-sectional area multiplier
  const [material, setMaterial] = useState<"Wood" | "A36 Steel" | "Titanium">("A36 Steel")
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<"pending" | "success" | "broke" | "expensive">("pending")
  const [liveLoad, setLiveLoad] = useState<number>(0) // The position of the truck

  const MAX_BUDGET = 50000

  // Material Properties
  const matProps = {
    "Wood": { strength: 10, costPerUnit: 100, color: "bg-amber-700/80" },
    "A36 Steel": { strength: 40, costPerUnit: 400, color: "bg-slate-400" },
    "Titanium": { strength: 80, costPerUnit: 1500, color: "bg-slate-200" }
  }

  // Derived metrics
  const totalCost = thickness * 10 * matProps[material].costPerUnit
  const loadCapacity = thickness * matProps[material].strength
  const requiredCapacity = 120 // 120 kN needed for the truck
  const safetyFactor = loadCapacity / requiredCapacity

  const runSimulation = () => {
      setIsSimulating(true)
      setResult("pending")
      setLiveLoad(0)

      // Animate the truck driving across
      let pos = 0
      const interval = setInterval(() => {
          pos += 5
          setLiveLoad(pos)

          if (pos > 100) {
              clearInterval(interval)
              setIsSimulating(false)
              if (safetyFactor < 1.0) {
                  setResult("broke")
              } else if (totalCost > MAX_BUDGET) {
                  setResult("expensive")
              } else if (safetyFactor >= 1.5 && safetyFactor < 3.0) {
                  setResult("success")
              } else if (safetyFactor >= 3.0) {
                  setResult("expensive") // Over-engineered = expensive
              }
          } else if (pos > 40 && pos < 60 && safetyFactor < 1.0) {
              // Bridge breaks when truck is in the middle
              clearInterval(interval)
              setIsSimulating(false)
              setResult("broke")
          }
      }, 50)
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Activity className="text-indigo-400 w-5 h-5 bg-indigo-500/10 p-1 rounded" /> 
               Truss Optimization Lab
             </h3>
             <p className="text-sm text-slate-400">Design a bridge that supports the <span className="font-bold text-white">120 kN Live Load</span> without exceeding the <span className="text-emerald-400 font-mono">${MAX_BUDGET.toLocaleString()}</span> budget. Safety Factor must be ≥ 1.5.</p>
          </div>
        </div>

        {/* Bridge Visualizer */}
        <div className="w-full max-w-4xl bg-gradient-to-b from-sky-900/20 to-sky-950/80 rounded-xl border border-white/5 p-12 relative flex justify-center items-end h-[350px] shadow-inner mb-8 overflow-hidden">
            
            {/* The River */}
            <div className="absolute bottom-0 w-full h-16 bg-blue-500/10 backdrop-blur border-t border-blue-500/30" />
            
            {/* The Land */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-800/80 border-t-2 border-r-2 border-stone-600 rounded-tr-lg" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-stone-800/80 border-t-2 border-l-2 border-stone-600 rounded-tl-lg" />

            {/* The Bridge (Truss) */}
            <div className="w-[calc(100%-16rem)] h-full absolute bottom-32 flex justify-center items-end">
                <div className={cn("w-full transition-all duration-300 relative", result === "broke" ? "rotate-12 translate-y-10" : "")} style={{ height: thickness * 4 }}>
                    {/* Deck */}
                    <div className={cn("w-full border-t flex justify-between absolute bottom-0", matProps[material].color)} style={{ height: thickness, borderTopWidth: thickness / 2 }}>
                        {/* Internal Truss beams visually approximated */}
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className={cn("w-px h-16 -mt-16 transform -skew-x-45 opacity-50", matProps[material].color)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* The Live Load (Truck) */}
            {(isSimulating || result !== "pending") && (
                <motion.div 
                    initial={{ left: '0%' }}
                    animate={{ 
                        left: `${liveLoad}%`, 
                        y: result === "broke" && liveLoad > 40 ? 100 : 0,
                        rotate: result === "broke" && liveLoad > 40 ? 45 : 0
                    }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className="absolute bottom-32 z-20"
                    style={{ marginLeft: '4rem' }}
                >
                    <div className="w-16 h-10 bg-rose-600 rounded drop-shadow-2xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                </motion.div>
            )}

            {result === "broke" && (
                <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center z-30">
                     <span className="text-4xl font-black text-red-500 backdrop-blur px-8 py-4 bg-black/60 rounded-xl uppercase tracking-widest border-2 border-red-500/50">
                         STRUCTURAL FAILURE
                     </span>
                </div>
            )}
        </div>

        {/* Construction Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl text-sm mb-6">
            
            <div className="bg-zinc-900/80 p-5 rounded border border-white/5">
                 <p className="text-slate-500 uppercase font-mono tracking-widest mb-3">1. Select Material</p>
                 <div className="grid grid-cols-1 gap-2">
                     {(["Wood", "A36 Steel", "Titanium"] as const).map(m => (
                         <Button 
                             key={m} size="sm" 
                             variant={material === m ? "default" : "outline"}
                             onClick={() => {setMaterial(m); setResult("pending")}}
                             className={cn("justify-start", material === m ? "bg-indigo-600 hover:bg-indigo-700" : "")}
                         >
                             {m}
                         </Button>
                     ))}
                 </div>
            </div>

            <div className="bg-zinc-900/80 p-5 rounded border border-white/5 space-y-4">
                 <p className="text-slate-500 uppercase font-mono tracking-widest flex justify-between">
                     2. Member Thickness
                     <span className="text-indigo-400 font-bold">{thickness}x</span>
                 </p>
                 <input 
                    type="range" 
                    min="1" max="20" step="1"
                    value={thickness} 
                    onChange={e => {setThickness(parseInt(e.target.value)); setResult("pending")}}
                    className="w-full accent-indigo-500"
                />
                <div className="text-[11px] text-slate-400 space-y-1 font-mono mt-4">
                    <div className="flex justify-between">
                         <span>Load Capacity:</span>
                         <span className={loadCapacity < requiredCapacity ? "text-red-400" : "text-emerald-400"}>{loadCapacity} kN</span>
                    </div>
                     <div className="flex justify-between">
                         <span>Safety Factor:</span>
                         <span className={safetyFactor < 1.0 ? "text-red-400" : safetyFactor > 3.0 ? "text-yellow-400" : "text-emerald-400"}>
                             {safetyFactor.toFixed(2)}
                         </span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/80 p-5 rounded border border-white/5 flex flex-col justify-between">
                 <div>
                    <p className="text-slate-500 uppercase font-mono tracking-widest flex justify-between mb-2">
                         3. Project Cost
                     </p>
                     <div className={cn("text-3xl font-black tracking-tighter", totalCost > MAX_BUDGET ? "text-red-500" : "text-emerald-500")}>
                         ${totalCost.toLocaleString()}
                     </div>
                 </div>
                 
                 <Button 
                     onClick={runSimulation} 
                     disabled={isSimulating}
                     className={cn("w-full font-bold", totalCost > MAX_BUDGET ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700")}
                 >
                     RUN LIVE LOAD TEST
                 </Button>
            </div>
        </div>

        {/* Feedback Area */}
        <AnimatePresence>
            {result === "success" && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-full"
                >
                    <CheckCircle className="text-emerald-400 w-5 h-5" />
                    <span className="text-emerald-400 font-medium font-mono text-sm">VALUE ENGINEERING OPTIMIZED! PERFECT DESIGN.</span>
                </motion.div>
            )}
            {result === "expensive" && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-8 py-4 rounded-xl text-center"
                >
                    <span className="text-yellow-400 font-bold font-mono">PROJECT OVER BUDGET 💰</span>
                    <span className="text-sm text-yellow-500/80">Your bridge is safe, but it's completely over-engineered. Reduce thickness or use cheaper materials to fall under the $50k budget.</span>
                </motion.div>
            )}
            {result === "broke" && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 bg-red-500/10 border border-red-500/30 px-8 py-4 rounded-xl text-center"
                >
                    <ShieldAlert className="text-red-400 w-6 h-6" />
                    <span className="text-red-400 font-bold font-mono">CATASTROPHIC FAILURE 💥</span>
                    <span className="text-sm text-red-400/80">The structural safety factor dropped below 1.0. The bridge collapsed under the live load.</span>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  )
}
