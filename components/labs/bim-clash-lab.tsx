"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle, AlertOctagon, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function BimClashLab() {
  const [elevation, setElevation] = useState<number>(10) // Z-axis elevation of HVAC duct
  const [xOffset, setXOffset] = useState<number>(0) // X-axis bypass
  const [isClashing, setIsClashing] = useState<boolean>(true)
  const [isOptimal, setIsOptimal] = useState<boolean>(false)

  // Beam coordinates (Fixed structural element)
  const beamY = 50
  const beamZ = 12
  const beamWidth = 20
  const beamHeight = 4

  // Check clash logic
  useEffect(() => {
    // Duct bounding box
    const ductTop = elevation + 2
    const ductBottom = elevation - 2
    // Beam bounding box
    const beamTop = beamZ + beamHeight/2
    const beamBottom = beamZ - beamHeight/2

    // Check Z-axis overlap
    const zClash = (ductTop > beamBottom && ductBottom < beamTop)
    
    // Check X-axis offset (if user routes around it)
    const xClash = Math.abs(xOffset) < 15 // Must route at least 15 units X to bypass

    if (zClash && xClash) {
        setIsClashing(true)
        setIsOptimal(false)
    } else {
        setIsClashing(false)
        // If they bypass by going directly *under* the beam tightly (elevation 8 or 9) and 0 X offset
        // OR if they route tightly around X.
        if (Math.abs(100 - (Math.abs(xOffset) * 2 + Math.abs(10 - elevation) * 5)) < 40) {
            setIsOptimal(true) // Cost-effective routing
        } else {
            setIsOptimal(false) // Safe, but expensive routing
        }
    }
  }, [elevation, xOffset])

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Building2 className="text-zinc-400 w-5 h-5 bg-zinc-500/10 p-1 rounded" /> 
               BIM Clash Resolution
             </h3>
             <p className="text-sm text-slate-400">Reroute the flexible HVAC duct (Blue) to avoid the rigid Structural I-Beam (Red).</p>
          </div>
        </div>

        {/* 3D-ish Viewer Area */}
        <div className="w-full max-w-4xl bg-zinc-950/80 rounded-xl border border-zinc-800 p-8 relative flex flex-col justify-center items-center h-[320px] shadow-inner mb-8 overflow-hidden perspective-1000">
           
           {/* Grid Floor */}
           <div className="absolute bottom-0 w-full h-32 bg-[linear-gradient(to_right,#3f3f4640_1px,transparent_1px),linear-gradient(to_bottom,#3f3f4640_1px,transparent_1px)] bg-[size:20px_20px] [transform:rotateX(60deg)_scale(2)] opacity-30" />

           {/* Clash Warning Overlay */}
           {isClashing && (
             <div className="absolute top-4 right-4 bg-red-900/50 border border-red-500/50 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse z-40">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Hard Clash Detected</span>
             </div>
           )}

           <div className="relative w-full max-w-lg h-48 flex items-center justify-center transform-style-3d">
              
              {/* Structural I-Beam (Fixed in center) */}
              <div 
                 className="absolute w-full h-6 bg-red-900/80 border-y-4 border-red-600 shadow-[0_5px_15px_rgba(220,38,38,0.2)] z-20 flex items-center justify-center"
                 style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                  <span className="text-[10px] font-mono font-bold text-red-300 tracking-widest">W12x26 STRUCTURAL BEAM</span>
              </div>

              {/* HVAC Duct (Movable by User) */}
              <motion.div 
                 animate={{ 
                     y: (10 - elevation) * 10,  // Move vertical
                     x: xOffset * 5             // Move horizontal
                 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
                 className={cn(
                    "absolute w-16 h-16 rounded shadow-xl border-2 flex items-center justify-center backdrop-blur bg-blue-500/20",
                    isClashing ? "border-red-500/80 z-20" : "border-blue-400/80 z-30"
                 )}
              >
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-blue-200">MEP DUCT</span>
                 </div>
              </motion.div>

           </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
           <div className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    Elevation (Z-Axis) Offset
                    <span className="font-bold text-blue-400">
                        {elevation} ft
                    </span>
                </label>
                <input 
                    type="range" 
                    min="0" max="20" step="1"
                    value={elevation} 
                    onChange={e => setElevation(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                />
                <p className="text-[10px] text-slate-500">Drop duct below beam or raise above.</p>
           </div>
           
           <div className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    Lateral (X-Axis) Bypass
                    <span className="font-bold text-blue-400">
                        {xOffset} ft
                    </span>
                </label>
                <input 
                    type="range" 
                    min="-30" max="30" step="1"
                    value={xOffset} 
                    onChange={e => setXOffset(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                />
                 <p className="text-[10px] text-slate-500">Route duct around the beam horizontally.</p>
           </div>
        </div>

        {/* Feedback Area */}
        <div className="min-h-[80px] mt-8 w-full flex justify-center items-center">
            <AnimatePresence mode="wait">
            {!isClashing && isOptimal && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-8 py-3 rounded-xl"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-emerald-400 w-5 h-5" />
                        <span className="text-emerald-400 font-bold font-mono text-sm tracking-wide">CLASH RESOLVED (OPTIMAL)</span>
                    </div>
                    <span className="text-xs text-emerald-500/80">Cost-effective routing achieved. +200 XP</span>
                </motion.div>
            )}
            {!isClashing && !isOptimal && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-8 py-3 rounded-xl"
                >
                    <div className="flex items-center gap-2">
                        <Info className="text-yellow-400 w-5 h-5" />
                        <span className="text-yellow-400 font-bold font-mono text-sm tracking-wide">CLASH RESOLVED (SUB-OPTIMAL)</span>
                    </div>
                    <span className="text-xs text-yellow-500/80">Too much extra piping used. Try routing tighter to the beam!</span>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
