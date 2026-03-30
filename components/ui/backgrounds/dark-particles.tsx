"use client"

import { useEffect, useRef } from "react"

export function DarkParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    
    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2
        })
    }

    let mouse = { x: 0, y: 0 }
    
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    }
    
    window.addEventListener("mousemove", handleMouseMove)

    const draw = () => {
       ctx.fillStyle = "#09090b" // Dark background
       ctx.fillRect(0, 0, w, h)
       
       ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
       ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"

       particles.forEach((p, i) => {
           p.x += p.vx
           p.y += p.vy

           if (p.x < 0 || p.x > w) p.vx *= -1
           if (p.y < 0 || p.y > h) p.vy *= -1

           ctx.beginPath()
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
           ctx.fill()
           
           // Connect to nearby particles
           for (let j = i + 1; j < particles.length; j++) {
               const p2 = particles[j]
               const dx = p.x - p2.x
               const dy = p.y - p2.y
               const dist = Math.sqrt(dx*dx + dy*dy)
               
               if (dist < 150) {
                   ctx.lineWidth = 1 - dist/150
                   ctx.beginPath()
                   ctx.moveTo(p.x, p.y)
                   ctx.lineTo(p2.x, p2.y)
                   ctx.stroke()
               }
           }
           
           // Connect to mouse
           const dx = p.x - mouse.x
           const dy = p.y - mouse.y
           const dist = Math.sqrt(dx*dx + dy*dy)
           if (dist < 200) {
               ctx.strokeStyle = "rgba(100, 200, 255, 0.1)"
               ctx.lineWidth = 1 - dist/200
               ctx.beginPath()
               ctx.moveTo(p.x, p.y)
               ctx.lineTo(mouse.x, mouse.y)
               ctx.stroke()
               ctx.strokeStyle = "rgba(255, 255, 255, 0.05)" // Reset
           }
       })
       
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
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
