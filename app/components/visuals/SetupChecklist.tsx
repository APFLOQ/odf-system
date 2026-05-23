"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SetupChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const items = [
    { id: 1, text: "Check macro narrative (FOMC, CPI, NFP)", category: "Macro" },
    { id: 2, text: "Verify GEX / DEX levels", category: "Options" },
    { id: 3, text: "Check VIX term structure", category: "Vol" },
    { id: 4, text: "Identify key POC / VPOC levels", category: "Profile" },
    { id: 5, text: "Read DOM for absorption / exhaustion", category: "Orderflow" },
    { id: 6, text: "Check spread (R2 regime)", category: "Micro" },
    { id: 7, text: "Confirm delta divergence / CVD", category: "Orderflow" },
    { id: 8, text: "Size position per Kelly / risk limits", category: "Risk" },
  ];

  const toggle = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = Object.values(checked).filter(Boolean).length / items.length;

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-2" style={{ color: "var(--color-ash-gray)" }}>
        Pre-Session Setup Checklist
      </h4>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-[10px] font-mono mb-1" style={{ color: "var(--color-ghost-gray)" }}>
          <span>Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #5E0ED7, #8052ff)" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.2 }}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/[0.02]"
            style={{
              border: "1px solid rgba(255,255,255,0.04)",
              opacity: checked[item.id] ? 0.5 : 1,
            }}
          >
            <div
              className="w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0"
              style={{
                borderColor: checked[item.id] ? "#5E0ED7" : "rgba(255,255,255,0.15)",
                background: checked[item.id] ? "rgba(94,14,215,0.15)" : "transparent",
              }}
            >
              {checked[item.id] && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#5E0ED7"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[13px] ${checked[item.id] ? "line-through" : ""}`} style={{ color: checked[item.id] ? "var(--color-ghost-gray)" : "var(--color-polar-white)" }}>
                {item.text}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-ghost-gray)" }}>
              {item.category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
