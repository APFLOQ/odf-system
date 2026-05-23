"use client";

import { motion } from "framer-motion";

export default function YieldCurveDiagram() {
  const yields = [
    { month: "3M", rate: 4.8, label: "4.8%" },
    { month: "6M", rate: 4.6, label: "4.6%" },
    { month: "1Y", rate: 4.3, label: "4.3%" },
    { month: "2Y", rate: 4.1, label: "4.1%" },
    { month: "5Y", rate: 3.9, label: "3.9%" },
    { month: "10Y", rate: 4.0, label: "4.0%" },
    { month: "30Y", rate: 4.2, label: "4.2%" },
  ];

  const maxRate = 5.0;

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Yield Curve (Normal vs Inverted)
      </h4>

      <div className="relative h-[200px] flex items-end justify-around px-2">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-[rgba(255,255,255,0.04)]"
            style={{ bottom: `${(i / 4) * 100}%` }}
          />
        ))}

        {yields.map((y, i) => {
          const height = (y.rate / maxRate) * 100;
          const isInverted = i > 0 && y.rate < yields[i - 1].rate;
          return (
            <motion.div
              key={y.month}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / yields.length}%` }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
                className="w-4 rounded-t-sm relative"
                style={{
                  background: isInverted
                    ? "linear-gradient(to top, rgba(248,113,113,0.4), rgba(248,113,113,0.1))"
                    : "linear-gradient(to top, rgba(52,211,153,0.4), rgba(52,211,153,0.1))",
                }}
              />
              <span className="text-[9px] font-mono mt-2" style={{ color: "var(--color-ghost-gray)" }}>
                {y.month}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.8 }}
                className="text-[9px] font-mono absolute -top-4"
                style={{ color: isInverted ? "#f87171" : "#34d399" }}
              >
                {y.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#34d399]/40" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#f87171]/40" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Inverted</span>
        </div>
      </div>
    </div>
  );
}
