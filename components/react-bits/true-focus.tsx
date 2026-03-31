"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface TrueFocusProps {
  sentence: string;
  className?: string;
  focusClassName?: string;
}

export function TrueFocus({
  sentence,
  className = "",
  focusClassName = "text-slate-900 border-b-2 border-blue-500 bg-blue-50/50 rounded-lg px-1",
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {words.map((word, idx) => {
        const isHovered = hoveredIdx === idx;
        const isMuted = hoveredIdx !== null && hoveredIdx !== idx;

        return (
          <motion.span
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            animate={{
              filter: isMuted ? "blur(2px)" : "blur(0px)",
              opacity: isMuted ? 0.3 : 1,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`cursor-pointer transition-colors duration-300 ${
              isHovered ? focusClassName : "text-slate-600"
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
