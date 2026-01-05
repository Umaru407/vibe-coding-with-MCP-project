"use client";

import { motion } from "motion/react";

interface AiStatusIndicatorProps {
  status: "streaming" | "completed";
}

export function AiStatusIndicator({ status }: AiStatusIndicatorProps) {
  if (status === "streaming") {
    return (
      <motion.div
        className="h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-primary/20"
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  return (
    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-primary/20" />
  );
}
