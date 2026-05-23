"use client";

import { motion } from "framer-motion";

export default function GreeksDiagram() {
  const greeks = [
    { name: "Delta", range: "0 to 1", desc: "Price sensitivity", color: "#06b6d4" },
    { name: "Gamma", range: "0 to ∞", desc: "Delta acceleration", color: "#f59e0b" },
    { name: "Theta", range: "-∞ to 0", desc: "Time decay", color: "#ef4444" },
    { name: "Vega", range: "0 to ∞", desc: "Vol sensitivity", color: "#10b981" },
    { name: "Rho", range: "-∞ to ∞", desc: "Rate sensitivity", color: "#8b5cf6" },
  ];

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Option Greeks at a Glance
      </h4>

      <div className="space-y-3">
        {greeks.map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="flex items-center gap-4 p-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[12px] font-bold font-mono shrink-0"
              style={{ background: `${g.color}15`, color: g.color }}
            >
              {g.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[var(--color-polar-white)]">{g.name}</span>
                <span className="text-[10px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>
                  {g.range}
                </span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--color-ash-gray)" }}>
                {g.desc}
              </p>
            </div>
            {/* Visual bar */}
            <div className="w-16 h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden shrink-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(i + 1) * 20}%` }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.6 }}
                className="h-full rounded-full"
                style={{ background: g.color, opacity: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
