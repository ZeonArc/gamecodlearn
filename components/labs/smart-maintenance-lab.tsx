"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Gauge, Activity, AlertCircle, RefreshCw } from "lucide-react"

export function SmartMaintenanceLab() {
  const [dataStream, setDataStream] = useState<{ time: number, temp: number, rpm: number }[]>([])
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  
  const [aiReport, setAiReport] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulation parameters
  const [motorState, setMotorState] = useState<"healthy" | "overheating" | "failing">("healthy")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTime(t => t + 1)
        
        let newTemp = 70 + Math.random() * 5
        let newRpm = 1750 + Math.random() * 20

        if (motorState === "overheating") {
            newTemp += 30 + Math.random() * 10
            newRpm -= 50
        } else if (motorState === "failing") {
            newTemp += 50 + Math.random() * 20
            newRpm -= 300 + Math.random() * 100
        }

        setDataStream(prev => {
            const next = [...prev, { time: time + 1, temp: newTemp, rpm: newRpm }]
            if (next.length > 20) return next.slice(next.length - 20) // Keep last 20
            return next
        })
      }, 500) // 2 events per second
    }
    return () => clearInterval(interval)
  }, [isActive, time, motorState])

  const generateMaintenanceDiary = async () => {
    if (dataStream.length < 5) return

    setIsGenerating(true)
    setAiReport(null)

    const recentData = dataStream.slice(-5)
    const avgTemp = (recentData.reduce((acc, curr) => acc + curr.temp, 0) / 5).toFixed(1)
    const avgRpm = (recentData.reduce((acc, curr) => acc + curr.rpm, 0) / 5).toFixed(1)
    
    const contextPrompt = `Act as an AI Predictive Maintenance Logger for an Industrial IoT Motor.
Recent 5-second telemetry scan:
- Average Temp: ${avgTemp}°C
- Average RPM: ${avgRpm}

Normal thresholds: Temp < 85°C, RPM ~ 1750.
Write a 2-sentence formal maintenance diary entry diagnosing the health of the motor. If it is overheating or failing, issue a predictive alert (e.g., 'Motor likely to fail in X days...'). Be highly analytical and concise.`

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Generate Maintenance Log", context: contextPrompt })
      })
      const data = await res.json()
      setAiReport(data.response.replace(/\*/g, '').replace(/#/g, ''))
    } catch (err) {
      setAiReport("IoT Gateway Error. Unable to generate diagnostic log.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full bg-[#0a0f18] border border-blue-900/30 rounded-2xl p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-black pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-cyan-950 border border-cyan-800 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Gauge className="text-cyan-400 w-5 h-5" /> 
             </div>
             <div>
                 <h3 className="text-xl font-bold text-slate-200 tracking-wide uppercase">Smart Maintenance Diary</h3>
                 <p className="text-xs text-slate-500 font-mono tracking-widest">IoT TELEMETRY & AI PREDICTIVE LOGGING</p>
             </div>
          </div>
          <div className="flex gap-2">
              <Button onClick={() => setIsActive(!isActive)} variant="outline" size="sm" className={isActive ? "border-amber-500/50 text-amber-500" : "border-emerald-500/50 text-emerald-500"}>
                  {isActive ? "PAUSE DATALINK" : "ACTIVATE IoT SENSORS"}
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
            
            {/* Live Telemetry Monitors */}
            <div className="lg:col-span-2 bg-[#0d1421] border border-slate-800 rounded p-4 h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-2">
                         <Activity className="w-4 h-4 text-cyan-500" /> LIVE SENSOR STREAM (MOTOR Alpha-09)
                    </span>
                    <div className="flex gap-2">
                        <Button size="icon" onClick={() => setMotorState("healthy")} className={`w-6 h-6 rounded ${motorState === "healthy" ? "bg-emerald-600" : "bg-slate-800"}`} title="Simulate Healthy" />
                        <Button size="icon" onClick={() => setMotorState("overheating")} className={`w-6 h-6 rounded ${motorState === "overheating" ? "bg-amber-600" : "bg-slate-800"}`} title="Simulate Overheating" />
                        <Button size="icon" onClick={() => setMotorState("failing")} className={`w-6 h-6 rounded ${motorState === "failing" ? "bg-red-600" : "bg-slate-800"}`} title="Simulate Failure" />
                    </div>
                </div>

                <div className="flex-1 w-full bg-[#05080f] rounded border border-slate-900 overflow-hidden relative flex items-end">
                    {/* Simulated "Monitor" drawing raw HTML/CSS bars to avoid heavy charting library dependencies in this specific file */}
                    {dataStream.map((data, i) => {
                        const tempHeight = Math.min((data.temp / 150) * 100, 100)
                        const rpmHeight = Math.min((data.rpm / 2000) * 100, 100)
                        
                        return (
                            <div key={data.time} className="flex-1 flex flex-col justify-end mx-[1px] group relative h-full items-center pb-2">
                                <div className="absolute w-full bottom-0 bg-red-500/20" style={{ height: `${tempHeight}%` }} />
                                <div className="absolute w-full bottom-0 bg-cyan-500" style={{ height: `${rpmHeight}%`, opacity: 0.7 }} />
                            </div>
                        )
                    })}
                    {dataStream.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm font-mono uppercase tracking-widest italic">
                            Awaiting Datalink...
                        </div>
                    )}

                    {/* Threshold Lines */}
                    <div className="absolute w-full border-t border-red-500/20 border-dashed" style={{ bottom: '56%' }} title="Critical Temp Threshold" />
                </div>
            </div>

            {/* AI Diagnostics Panel */}
            <div className="bg-[#0b121c] border border-cyan-900/30 rounded p-4 flex flex-col relative h-[300px]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs uppercase font-bold text-cyan-100 tracking-widest">AI LLM Auto-Logger</span>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar text-sm font-mono leading-relaxed bg-black/40 p-4 rounded border border-white/5">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full text-cyan-600 animate-pulse text-xs">
                            <RefreshCw className="w-5 h-5 animate-spin mb-2" />
                            Synthesizing maintenance logs...
                        </div>
                    ) : aiReport ? (
                        <span className={aiReport.includes("fail") || aiReport.includes("overheat") ? "text-amber-400" : "text-emerald-400"}>
                            {aiReport}
                        </span>
                    ) : (
                        <span className="text-slate-600 italic">Click Generate below to snapshot current telemetry and write predictive maintenance log. Minimum 5 datapoints required.</span>
                    )}
                </div>

                <Button 
                    onClick={generateMaintenanceDiary} 
                    disabled={isGenerating || dataStream.length < 5} 
                    className="w-full bg-cyan-900 hover:bg-cyan-800 border border-cyan-700 text-cyan-100 font-bold uppercase tracking-widest text-xs"
                >
                    Generate AI Log
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
