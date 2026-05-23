"use client";

import { motion } from "framer-motion";

export default function CorrelationMatrix() {
  const assets = ["ES", "NQ", "CL", "GC", "EUR", "VIX"];
  const correlations = [
    [1.00, 0.92, 0.15, -0.08, 0.22, -0.75],
    [0.92, 1.00, 0.12, -0.05, 0.18, -0.70],
    [0.15, 0.12, 1.00, 0.05, -0.10, 0.20],
    [-0.08, -0.05, 0.05, 1.00, -0.15, 0.10],
    [0.22, 0.18, -0.10, -0.15, 1.00, -0.30],
    [-0.75, -0.70, 0.20, 0.10, -0.30, 1.00],
  ];

  function getColor(value: number): string {
    if (value > 0.5) return `rgba(52,211,153,${0.2 + value * 0.5})`;
    if (value > 0) return `rgba(52,211,153,${value * 0.3})`;
    if (value > -0.5) return `rgba(248,113,113,${Math.abs(value) * 0.3})`;
    return `rgba(248,113,113,${0.2 + Math.abs(value) * 0.5})`;
  }

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Cross-Asset Correlation Matrix
      </h4>

      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          {/* Header */}
          <div className="flex">
            <div className="w-10" />
            {assets.map((a) => (
              <div key={a} className="flex-1 text-center">
                <span className="text-[10px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>
                  {a}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {assets.map((rowAsset, i) => (
            <div key={rowAsset} className="flex items-center">
              <div className="w-10 text-right pr-2">
                <span className="text-[10px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>
                  {rowAsset}
                </span>
              </div>
              {assets.map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i * 6 + j) * 0.015 + 0.2, duration: 0.3 }}
                  className="flex-1 aspect-square flex items-center justify-center m-0.5 rounded"
                  style={{ background: getColor(correlations[i][j]) }}
                >
                  <span className="text-[9px] font-mono" style={{ color: Math.abs(correlations[i][j]) > 0.5 ? "white" : "var(--color-ghost-gray)" }}>
                    {correlations[i][j].toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4 text-[9px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#34d399]/50" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[rgba(255,255,255,0.04)]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#f87171]/50" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Negative</span>
        </div>
      </div>
    </div>
  );
}
