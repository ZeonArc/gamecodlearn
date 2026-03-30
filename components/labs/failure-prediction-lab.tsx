"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Activity, Thermometer, Hammer, Search, AlertTriangle } from "lucide-react"

export function FailurePredictionLab() {
  const [vibration, setVibration] = useState<number>(45) // Hz
  const [temperature, setTemperature] = useState<number>(80) // C
  const [cycles, setCycles] = useState<number>(1500) // Hours
  const [material, setMaterial] = useState<"A36 Steel" | "Aluminum 6061" | "Carbon Fiber">("A36 Steel")
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [story, setStory] = useState<string | null>(null)

  const askAiStoryteller = async () => {
    setIsAnalyzing(true)
    setStory(null)

    const forensicPrompt = `Act as an AI Forensic Engineering Storyteller. 
I have a machine part made of ${material}. 
Sensor Telemetry:
- Vibration: ${vibration} Hz
- Operating Temperature: ${temperature}°C
- Load Cycles: ${cycles} hours

Write a brief, 2-3 sentence 'human-like reasoning explanation' telling the story of WHY this part might fail soon. Use forensic engineering terminology (e.g. fatigue failure, thermal creep, micro-cracks, cyclic loading). Do not just list data. Tell the tragic story of the material's structural degradation over time.`

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Generate Failure Story", context: forensicPrompt })
      })
      const data = await res.json()
      // Remove any markdown formatting the API might add to keep it clean for UI
      setStory(data.response.replace(/\*/g, '').replace(/#/g, ''))
    } catch (err) {
      setStory("The AI failed to analyze the telemetry data. Communications offline.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Visual severity color based on stats
  const severity = (vibration > 70 || temperature > 110) ? "text-red-500" : (vibration > 50 || temperature > 90) ? "text-yellow-400" : "text-emerald-400"

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Search className="text-rose-400 w-5 h-5 bg-rose-500/10 p-1 rounded" /> 
               AI Failure Prediction Storyteller
             </h3>
             <p className="text-sm text-slate-400">Input sensor telemetry. The LLM acts as a forensic engineer to explain <span className="text-rose-400 font-bold">WHY</span> a failure will happen through a human-readable story.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
            {/* Visualizer & AI Output */}
            <div className="flex flex-col gap-4">
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 h-[220px] relative overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Abstract mechanical visualization based on vibration */}
                    <motion.div 
                        animate={{ x: [-vibration/10, vibration/10, -vibration/10] }}
                        transition={{ repeat: Infinity, duration: 100/vibration, ease: "linear" }}
                        className="w-32 h-16 border-4 border-slate-600 bg-slate-800 rounded relative"
                    >
                        <div className="absolute top-0 left-1/2 w-8 h-full bg-slate-900 border-x-2 border-slate-500 transform -translate-x-1/2" />
                        {temperature > 100 && (
                            <div className="absolute inset-0 bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
                        )}
                    </motion.div>
                    
                    <div className="mt-8 flex gap-4 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3"/> {vibration}Hz</span>
                        <span className="flex items-center gap-1"><Thermometer className="w-3 h-3"/> {temperature}°C</span>
                        <span className="flex items-center gap-1"><Hammer className="w-3 h-3"/> {material}</span>
                    </div>
                </div>

                <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-6 min-h-[160px] relative">
                    <div className="absolute -top-3 left-4 bg-blue-900 border border-blue-500 px-3 py-0.5 rounded-full text-[10px] font-bold text-blue-300 tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI FORENSIC ANALYSIS
                    </div>
                    
                    <div className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50 py-4">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                </motion.div>
                                <span className="animate-pulse">Synthesizing telemetry data into failure story...</span>
                            </div>
                        ) : story ? (
                            <span className={severity}>{story}</span>
                        ) : (
                           <span className="opacity-50 italic">Awaiting telemetry analysis. Adjust sliders and analyze to generate a failure prediction story.</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-6">
                
                <div className="space-y-3">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Operating Material
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(["A36 Steel", "Aluminum 6061", "Carbon Fiber"] as const).map(m => (
                            <Button 
                                key={m} size="sm" 
                                variant={material === m ? "default" : "outline"}
                                onClick={() => setMaterial(m)}
                                className={material === m ? "bg-rose-600 hover:bg-rose-700" : "text-xs"}
                            >
                                {m.split(" ")[0]}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Vibration Frequency
                        <span className={`font-bold ${vibration > 70 ? 'text-red-400' : 'text-blue-400'}`}>{vibration} Hz</span>
                    </label>
                    <input type="range" min="10" max="120" step="5" value={vibration} onChange={e => setVibration(parseInt(e.target.value))} className="w-full accent-rose-500" />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Operating Temperature
                        <span className={`font-bold ${temperature > 110 ? 'text-red-400' : 'text-orange-400'}`}>{temperature} °C</span>
                    </label>
                    <input type="range" min="20" max="250" step="10" value={temperature} onChange={e => setTemperature(parseInt(e.target.value))} className="w-full accent-orange-500" />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Load Cycles (Time)
                        <span className="font-bold text-slate-300">{cycles} hrs</span>
                    </label>
                    <input type="range" min="100" max="10000" step="100" value={cycles} onChange={e => setCycles(parseInt(e.target.value))} className="w-full accent-slate-500" />
                </div>

                <Button onClick={askAiStoryteller} disabled={isAnalyzing} className="w-full bg-blue-600 hover:bg-blue-700 font-bold border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <Sparkles className="w-4 h-4 mr-2" /> GENERATE AI FAILURE STORY
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
