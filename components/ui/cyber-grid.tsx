"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function CyberGrid() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== "cyber") return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let offset = 0

    const draw = () => {
      ctx.fillStyle = "#050510" // Dark background
      ctx.fillRect(0, 0, w, h)
      
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)" // Cyan grid
      ctx.lineWidth = 1

      // Moving vertical lines
      const gridSize = 40
      
      // Perspective grid
      const horizon = h * 0.4
      
      for (let y = horizon; y < h; y += 20) {
        const progress = (y - horizon) / (h - horizon)
        const z = 1 / progress
        const speed = 2
        
        const yPos = y + (offset % 20) * progress
        if (yPos > h) continue

        ctx.beginPath()
        ctx.moveTo(0, yPos)
        ctx.lineTo(w, yPos)
        ctx.stroke()
      }

       for (let x = 0; x <= w; x += 100) {
          ctx.beginPath()
          ctx.moveTo(w/2, horizon)
          ctx.lineTo(x + (x - w/2) * 2, h)
          ctx.stroke()
       }

      offset += 0.5
      requestAnimationFrame(draw)
    }

    const resize = () => {
        w = canvas.width = window.innerWidth
        h = canvas.height = window.innerHeight
    }

    const animationId = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)

    return () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", resize)
    }
  }, [theme])

  if (theme !== "cyber") return null;

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none">
       {/* Retro Scanlines */}
        <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent,1px,#fff_1px,#fff_2px)]" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
        
       <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
