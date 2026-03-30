"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, Lightbulb, Battery, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function CircuitLab() {
  const [switches, setSwitches] = useState([false, false])
  const [gateType, setGateType] = useState<"AND" | "OR">("AND")
  const [isSuccess, setIsSuccess] = useState(false)

  // Logic calculation
  const output = gateType === "AND" 
    ? (switches[0] && switches[1])
    : (switches[0] || switches[1])

  useEffect(() => {
    if (output) {
      setIsSuccess(true)
    }
  }, [output])

  const toggleSwitch = (index: number) => {
    setSwitches(prev => prev.map((val, i) => i === index ? !val : val))
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-400 w-5 h-5" /> 
              Digital Logic Lab (ECE)
            </h3>
            <p className="text-sm text-slate-400">Configure the inputs to turn on the LED.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => { setSwitches([false, false]); setIsSuccess(false); }}
            className="border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Workspace */}
        <div className="w-full max-w-3xl aspect-[16/9] bg-black/60 rounded-xl border border-white/10 p-8 flex items-center justify-between relative shadow-inner">
          
          {/* Inputs */}
          <div className="flex flex-col gap-12">
            {[0, 1].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Battery className="w-6 h-6 text-emerald-400" />
                </div>
                {/* Switch */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSwitch(i)}
                  className={cn(
                    "w-16 h-8 rounded-full transition-colors relative",
                    switches[i] ? "bg-emerald-500" : "bg-slate-700"
                  )}
                >
                  <motion.div 
                    layout
                    className="w-6 h-6 bg-white rounded-full absolute top-1 object-cover shadow-sm"
                    initial={false}
                    animate={{ left: switches[i] ? "36px" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
                <div className={cn("w-12 h-1", switches[i] ? "bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-slate-700")} />
              </div>
            ))}
          </div>

          {/* Logic Gate */}
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-6 p-1 bg-slate-800 rounded-lg border border-slate-700">
              <button 
                onClick={() => setGateType("AND")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-mono font-bold transition-colors", gateType === "AND" ? "bg-blue-500/20 text-blue-400" : "text-slate-500 hover:text-slate-300")}
              >
                AND
              </button>
              <button 
                onClick={() => setGateType("OR")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-mono font-bold transition-colors", gateType === "OR" ? "bg-blue-500/20 text-blue-400" : "text-slate-500 hover:text-slate-300")}
              >
                OR
              </button>
            </div>

            <motion.div 
              key={gateType}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "w-24 h-24 rounded-2xl border-2 flex items-center justify-center font-black text-2xl shadow-xl z-10",
                gateType === "AND" 
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400 rounded-r-none rounded-l-md" 
                  : "border-purple-500/50 bg-purple-500/10 text-purple-400 rounded-l-[50%] rounded-r-[50%] skew-x-[-10deg]"
              )}
            >
              {gateType}
            </motion.div>
          </div>

          {/* Output Line */}
          <div className={cn("flex-1 h-1 transition-all duration-300", output ? "bg-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "bg-slate-700")} />

          {/* LED Output */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                boxShadow: output ? "0 0 40px 10px rgba(250, 204, 21, 0.4)" : "none",
                backgroundColor: output ? "#facc15" : "#334155"
              }}
              className="w-16 h-16 rounded-full border-4 border-slate-700/50 flex items-center justify-center relative z-10"
            >
              <Lightbulb className={cn("w-8 h-8 transition-colors duration-300", output ? "text-white" : "text-slate-500")} />
            </motion.div>
            <span className="font-mono text-xs text-slate-500 tracking-widest uppercase">Output</span>
          </div>

        </div>

        {/* Success State */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full"
            >
              <CheckCircle className="text-emerald-400 w-5 h-5" />
              <span className="text-emerald-400 font-medium">Circuit Completed! +50 XP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
