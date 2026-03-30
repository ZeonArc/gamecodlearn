"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, BoxSelect, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function GamePhysicsLab() {
  const [gravity, setGravity] = useState<number>(9.8)
  const [bounciness, setBounciness] = useState<number>(0.5) // Restitution 0-1
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Game state
  const [yPos, setYPos] = useState(0) // 0 to 100% (top to bottom)
  const [isSuccess, setIsSuccess] = useState(false)

  // Specific puzzle constraints
  const targetReboundHeight = 40 // Needs to bounce up to exactly ~40% mark to hit "Target"

  useEffect(() => {
    if (!isPlaying) return

    let velocity = 0
    let position = 0
    let animationFrame: number
    let hasBounced = false

    const updatePhysics = () => {
      // Very crude 1D physics simulation
      velocity += gravity * 0.1 // Apply gravity
      position += velocity

      // Floor collision (100% height)
      if (position >= 100) {
        position = 100
        velocity = -velocity * bounciness
        hasBounced = true
      }

      setYPos(Math.min(100, Math.max(0, position)))

      // Win condition: after bouncing, velocity approaches 0 near target height
      if (hasBounced && velocity > -1 && velocity < 1 && position > (targetReboundHeight - 5) && position < (targetReboundHeight + 5)) {
         setIsSuccess(true)
         setIsPlaying(false)
         return
      }

      // Stop entirely if it settles on ground
      if (hasBounced && Math.abs(velocity) < 1 && position >= 99) {
          setIsPlaying(false)
          return
      }

      animationFrame = requestAnimationFrame(updatePhysics)
    }

    animationFrame = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPlaying, gravity, bounciness])

  const reset = () => {
    setIsPlaying(false)
    setYPos(0)
    setIsSuccess(false)
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2">
               <BoxSelect className="text-purple-400 w-5 h-5" /> 
               Physics Engine Dev (GameTech)
             </h3>
             <p className="text-sm text-slate-400">Tweak Gravity and Bounciness (Restitution) to land perfectly on the target ring.</p>
          </div>
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button onClick={() => setIsPlaying(true)} className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-2" /> Start Simulation
              </Button>
            ) : (
              <Button variant="outline" onClick={reset} className="border-white/10">
                <RotateCcw className="w-4 h-4 mr-2" /> Stop & Reset
              </Button>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl flex gap-8">
            {/* Simulation Viewport */}
            <div className="flex-1 h-96 bg-black/80 rounded-xl border-2 border-slate-800 relative overflow-hidden shadow-inner flex justify-center">
                
                {/* Target Ring Area */}
                <div 
                  className="absolute w-24 h-8 border-y-4 border-dashed border-emerald-500 float-animation flex items-center justify-center opacity-70"
                  style={{ top: `${targetReboundHeight}%`, transform: 'translateY(-50%)' }}
                >
                    <span className="text-[10px] font-mono text-emerald-400 tracking-widest font-bold">TARGET APEX</span>
                </div>

                {/* Physics Object Box */}
                <div 
                  className="absolute w-12 h-12 bg-purple-500 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.6)] z-10"
                  style={{ top: `${yPos}%`, transform: 'translateY(-100%)' }}
                >
                    {/* Character/Icon inside box */}
                    <div className="absolute inset-2 border-2 border-purple-300/50 rounded-sm" />
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-2 bg-gradient-to-t from-slate-700 to-slate-800" />
                
                {/* Grid lines */}
                {[20, 40, 60, 80].map(h => (
                    <div key={h} className="absolute w-full h-px bg-white/5" style={{ top: `${h}%` }}>
                        <span className="absolute left-2 -top-3 text-[9px] text-white/20 font-mono">{h}m</span>
                    </div>
                ))}
            </div>

            {/* Editor Sidebar */}
            <div className="w-64 flex flex-col gap-6">
                <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Gravity (m/s²)
                        <span className="text-blue-400 font-bold">{gravity.toFixed(1)}</span>
                    </label>
                    <input 
                        type="range" 
                        min="1" max="25" step="0.1"
                        value={gravity} 
                        onChange={e => setGravity(parseFloat(e.target.value))}
                        disabled={isPlaying}
                        className="w-full accent-purple-500"
                    />
                </div>

                <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                        Restitution (Bounce)
                        <span className="text-amber-400 font-bold">{bounciness.toFixed(2)}</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" max="1" step="0.05"
                        value={bounciness} 
                        onChange={e => setBounciness(parseFloat(e.target.value))}
                        disabled={isPlaying}
                        className="w-full accent-purple-500"
                    />
                </div>

                {/* Live Values box (Game Dev style) */}
                <div className="flex-1 bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-green-500/80">
                   {'>'} ENGINE.DEBUG<br/>
                   {'>'} POS_Y: {Math.round(yPos)}<br/>
                   {'>'} COLLISION: {yPos >= 100 ? 'TRUE' : 'FALSE'}<br/>
                   {'>'} STATE: {isPlaying ? 'RUNNING' : 'IDLE'}
                </div>
            </div>
        </div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-8 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full absolute bottom-4"
            >
              <CheckCircle className="text-emerald-400 w-5 h-5" />
              <span className="text-emerald-400 font-medium font-mono text-sm">PHYSICS PARAMS VERIFIED! +75 XP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
