"use client"

import { useAnimation, motion } from "framer-motion"
import { useEffect } from "react"

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  threshold?: number
  rootMargin?: string
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  stagger = 0.05,
  threshold = 0.1,
  rootMargin = "-50px",
}: SplitTextProps) {
  const letters = Array.from(text)
  const ctrls = useAnimation()
  
  // Custom simple intersection observer effect for Framer Motion
  useEffect(() => {
    ctrls.start("visible")
  }, [ctrls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            delayChildren: delay,
            staggerChildren: stagger 
        } 
    },
  }

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={ctrls}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
