"use client";

import { motion } from "framer-motion";

export default function DrawdownCurve() {
  const data = [
    0, 2, 5, 8, 12, 15, 14, 18, 22, 20, 25, 28, 26, 30, 35, 32, 38, 42, 40, 45,
    -2, -5, -3, -8, -12, -10, -15, -18, -14, -20, -25, -22, -28, -30, -26, -32, -35, -30, -38, -42,
    -35, -30, -25, -20, -15, -10, -5, 0, 5, 8,
  ];

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal;

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Equity Curve & Drawdown
      </h4>

      <div className="relative h-[180px]">
        {/* Zero line */}
        <div
          className="absolute left-0 right-0 h-px bg-[rgba(255,255,255,0.1)]"
          style={{ top: `${((maxVal - 0) / range) * 100}%` }}
        />

        {/* Equity line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 100} ${100 - ((d - minVal) / range) * 90 - 5}`).join(" L ")}`}
            fill="none"
            stroke="#5E0ED7"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Max drawdown marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute left-[70%] bottom-[15%]"
        >
          <div className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            Max DD: -42%
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: "var(--color-ghost-gray)" }}>
        <span>Start</span>
        <span>Trade 25</span>
        <span>Trade 50</span>
      </div>
    </div>
  );
}
