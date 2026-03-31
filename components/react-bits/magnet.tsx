"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  disabled?: boolean
  magnetStrength?: number
}

export function Magnet({ children, padding = 100, disabled = false, magnetStrength = 0.5 }: MagnetProps) {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !innerRef.current || !outerRef.current) return

    const { clientX, clientY } = e
    const rect = outerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    // Pull the child element towards the mouse based on strength multiplier
    setPosition({
      x: distanceX * magnetStrength,
      y: distanceY * magnetStrength
    })
    setIsActive(true)
  }

  const handleMouseLeave = () => {
    setIsActive(false)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={outerRef}
      className="relative flex items-center justify-center cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ padding: `${padding}px` }}
    >
      <motion.div
        ref={innerRef}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
