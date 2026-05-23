"use client";

import { motion } from "framer-motion";

export default function LimitOrderBookDiagram() {
  const bidLevels = [
    { price: "5,244.50", size: 67, pct: 85 },
    { price: "5,244.25", size: 31, pct: 40 },
    { price: "5,244.00", size: 88, pct: 100 },
  ];
  const askLevels = [
    { price: "5,245.00", size: 25, pct: 30 },
    { price: "5,244.75", size: 18, pct: 22 },
    { price: "5,244.50", size: 42, pct: 50 },
  ];

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Limit Order Book (ES)
      </h4>
      
      {/* Ask Side */}
      <div className="space-y-1.5 mb-3">
        {askLevels.map((level, i) => (
          <motion.div
            key={`ask-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-mono w-[70px] text-right" style={{ color: "#f87171" }}>
              {level.price}
            </span>
            <div className="flex-1 h-6 bg-[rgba(255,255,255,0.03)] rounded overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level.pct}%` }}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded"
                style={{ background: "linear-gradient(90deg, rgba(248,113,113,0.2), rgba(248,113,113,0.08))" }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono" style={{ color: "var(--color-stardust-gray)" }}>
                {level.size} contracts
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spread */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="py-2 text-center border-y border-[rgba(255,255,255,0.06)] my-2"
      >
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>
          Spread: 0.25 pts ($12.50)
        </span>
      </motion.div>

      {/* Bid Side */}
      <div className="space-y-1.5 mt-3">
        {bidLevels.map((level, i) => (
          <motion.div
            key={`bid-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-mono w-[70px] text-right" style={{ color: "#34d399" }}>
              {level.price}
            </span>
            <div className="flex-1 h-6 bg-[rgba(255,255,255,0.03)] rounded overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level.pct}%` }}
                transition={{ delay: i * 0.15 + 1.2, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded"
                style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.2), rgba(52,211,153,0.08))" }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono" style={{ color: "var(--color-stardust-gray)" }}>
                {level.size} contracts
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-5 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#34d399]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Bid (buyers)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#f87171]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Ask (sellers)</span>
        </div>
      </div>
    </div>
  );
}
