"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crosshair, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function GdtLab() {
  const [measurement, setMeasurement] = useState<number>(10.00) // Base dimension 10mm
  const [toleranceBand] = useState<number>(0.05) // +/- 0.05mm
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  
  // Simulated machining variance (-0.1 to +0.1)
  const [manufacturedSize, setManufacturedSize] = useState<number>(10.08) 

  const handleMeasure = () => {
    // Check if manufactured size is within baseline +/- tolerance
    if (Math.abs(manufacturedSize - 10.00) <= toleranceBand) {
        setIsSuccess(true)
    } else {
        setIsSuccess(false)
    }
  }

  const reset = () => {
      // Generate a new random manufactured size between 9.90 and 10.10
      const randomVariance = (Math.random() * 0.2) - 0.1
      setManufacturedSize(parseFloat((10.00 + randomVariance).toFixed(2)))
      setIsSuccess(null)
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Crosshair className="text-sky-400 w-5 h-5 bg-sky-500/10 p-1 rounded" /> 
               GD&T Tolerancing Lab
             </h3>
             <p className="text-sm text-slate-400">Design for Manufacturability. Ensure the machined part falls within the acceptable <span className="font-mono text-sky-400">±{toleranceBand}mm</span> limit.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={reset}
            className="border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Next Part
          </Button>
        </div>

        {/* Blueprint Viewer */}
        <div className="w-full max-w-4xl bg-blue-950/20 rounded-xl border-2 border-blue-500/20 p-12 relative flex flex-col justify-center items-center overflow-hidden mb-8 grid-background">
            
            {/* Blueprint Grid Styling (CSS class proxy) */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* The Part (Shaft/Cylinder cross section) */}
            <div className="border-2 border-blue-400/80 bg-blue-500/10 w-64 h-32 flex flex-col items-center justify-center relative backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                {/* Nominal Dimension Notation */}
                <div className="absolute -top-12 flex items-center w-full justify-between">
                    <div className="w-px h-10 bg-blue-400/50 absolute left-0 top-0" />
                    <div className="flex-1 border-t-2 border-blue-400 flex items-center justify-center mx-1 relative top-4">
                        <span className="bg-black/80 px-2 font-mono text-sm text-blue-300">
                             Ø 10.00 ±{toleranceBand}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-blue-400/50 absolute right-0 top-0" />
                </div>
            </div>

            {/* Simulated Measurement Tool (Calipers) */}
            <div className="mt-16 flex items-center justify-center p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl relative z-10 w-96">
                <div className="flex-1 flex justify-between items-center text-slate-400 font-mono text-xs">
                    <span>DIGITAL CALIPER</span>
                    <span className="text-2xl font-bold text-emerald-400 bg-black px-4 py-1 rounded shadow-inner">
                        {isSuccess === null ? "--.--" : manufacturedSize.toFixed(2)} <span className="text-sm">mm</span>
                    </span>
                </div>
            </div>
        </div>

        <div className="flex gap-4 mb-4">
            <Button size="lg" onClick={handleMeasure} disabled={isSuccess !== null} className="bg-sky-600 hover:bg-sky-700 w-48 font-bold">
                Measure Quality
            </Button>
        </div>

        {/* Results */}
        <div className="min-h-[60px] flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
                {isSuccess === true && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full"
                    >
                        <CheckCircle className="text-emerald-400 w-5 h-5" />
                        <span className="text-emerald-400 font-medium font-mono text-sm">PART APPROVED! IN TOLERANCE</span>
                    </motion.div>
                )}
                {isSuccess === false && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-full"
                    >
                        <AlertTriangle className="text-red-400 w-5 h-5" />
                        <span className="text-red-400 font-medium font-mono text-sm">REJECTED! OUT OF SPEC</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
