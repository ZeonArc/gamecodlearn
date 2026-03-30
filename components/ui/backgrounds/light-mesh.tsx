"use client"

import { motion } from "framer-motion"

export function LightMesh() {
  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden bg-white pointer-events-none">
       {/* Animated Blobs */}
       <motion.div 
         animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
         }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-200/40 rounded-full blur-[100px]" 
       />
       
       <motion.div 
         animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
         }}
         transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
         className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-purple-200/40 rounded-full blur-[100px]" 
       />

       <motion.div 
         animate={{ 
            x: [0, 50, 0], 
            y: [0, 100, 0],
            opacity: [0.3, 0.6, 0.3]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 5 }}
         className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-pink-200/30 rounded-full blur-[120px]" 
       />
       
       {/* Subtle Grid Pattern Overlay */}
       <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" />
    </div>
  )
}
