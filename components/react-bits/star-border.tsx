"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  color?: string;
}

export function StarBorder({
  children,
  className = "",
  speed = 4,
  color = "#3b82f6", // Default light mode bright blue
}: StarBorderProps) {
  return (
    <div
      className={`relative inline-block overflow-hidden rounded-full p-[2px] cursor-pointer group ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, ${color} 100%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      />
      <div className="relative h-full w-full rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-900 group-hover:bg-slate-50 transition-colors">
        {children}
      </div>
    </div>
  );
}
