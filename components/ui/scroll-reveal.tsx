"use client"

import { useRef } from "react"
import { motion, useInView, useAnimation, Variant } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  width?: "fit" | "full"
  delay?: number
}

export function ScrollReveal({ children, className, width = "full", delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  const variants: Record<string, Variant> = {
    hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
    visible: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transition: { duration: 0.6, delay: delay, ease: "easeOut" } 
    },
  }

  return (
    <div ref={ref} className={cn(width === "full" ? "w-full" : "w-fit", className)} style={{ overflow: "visible" }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  )
}
