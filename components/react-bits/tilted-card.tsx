"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface TiltedCardProps {
  children: React.ReactNode
  className?: string
  scaleOnHover?: number
  tiltFactor?: number // Higher means more extreme tilt
}

export function TiltedCard({
  children,
  className = "",
  scaleOnHover = 1.05,
  tiltFactor = 20,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth return to center
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  // Map mouse position to rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltFactor, -tiltFactor])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltFactor, tiltFactor])

  // Map mouse position to glare translate
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["-40%", "40%"])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-40%", "40%"])
  const glareOpacity = useTransform(y, [-0.5, 0, 0.5], [0.3, 0, 0.3])

  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    // Normalize mouse coords between -0.5 and 0.5
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5
    x.set(normalizedX)
    y.set(normalizedY)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setHovered(true)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: scaleOnHover }}
      className={`relative rounded-xl overflow-hidden cursor-pointer ${className}`}
    >
      {/* 3D content wrapper */}
      <div 
         style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} 
         className="w-full h-full relative z-10"
      >
        {children}
      </div>

      {/* Dynamic Glare Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-xl mix-blend-overlay"
        style={{
          opacity: glareOpacity,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), transparent 60%)",
          x: glareX,
          y: glareY,
          scale: 2,
        }}
      />
    </motion.div>
  )
}
