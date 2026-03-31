"use client"

import { motion } from "framer-motion"

interface ShinyTextProps {
  children: React.ReactNode
  disabled?: boolean
  speed?: number
  className?: string
}

export function ShinyText({
  children,
  disabled = false,
  speed = 3,
  className = "",
}: ShinyTextProps) {
  if (disabled) return <span className={className}>{children}</span>

  return (
    <motion.span
      className={`inline-block text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
      }}
      initial={{ backgroundPosition: "100% 50%" }}
      animate={{ backgroundPosition: "-100% 50%" }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* We layer the base text behind the animated highlight for seamless fallbacks */}
      <span className="relative">
        <span className="absolute inset-0 text-inherit mix-blend-overlay">{children}</span>
        {children}
      </span>
    </motion.span>
  )
}
