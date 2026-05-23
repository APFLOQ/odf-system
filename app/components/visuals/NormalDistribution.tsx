"use client";

import { motion } from "framer-motion";

export default function NormalDistribution() {
  const points = 40;
  const data = Array.from({ length: points }, (_, i) => {
    const x = (i / (points - 1)) * 6 - 3; // -3 to 3
    const y = Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
    return { x, y };
  });

  const maxY = Math.max(...data.map((d) => d.y));

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Normal Distribution vs Fat Tails
      </h4>

      <div className="relative h-[180px]">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-[rgba(255,255,255,0.04)] h-0" />
          ))}
        </div>

        {/* Normal curve */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            d={`M ${data.map((d, i) => `${(i / (points - 1)) * 100} ${100 - (d.y / maxY) * 80}`).join(" L ")}`}
            fill="none"
            stroke="#8052ff"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          {/* Area under curve */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            d={`M 0 100 L ${data.map((d, i) => `${(i / (points - 1)) * 100} ${100 - (d.y / maxY) * 80}`).join(" L ")} L 100 100 Z`}
            fill="rgba(128,82,255,0.08)"
          />
        </svg>

        {/* Fat tail annotation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-2 right-2 text-[9px] font-mono"
          style={{ color: "#f59e0b" }}
        >
          Fat tails: P(|x|&gt;3) = 0.3% normal, ~1% real
        </motion.div>
      </div>

      {/* X axis labels */}
      <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: "var(--color-ghost-gray)" }}>
        <span>-3σ</span>
        <span>-2σ</span>
        <span>-1σ</span>
        <span>0</span>
        <span>+1σ</span>
        <span>+2σ</span>
        <span>+3σ</span>
      </div>
    </div>
  );
}
