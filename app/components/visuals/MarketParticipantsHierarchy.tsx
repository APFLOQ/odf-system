"use client";

import { motion } from "framer-motion";

const participants = [
  { name: "Central Banks", role: "Price maker", impact: "High", color: "#8052ff", desc: "Set rates, QE/QT, direct intervention" },
  { name: "Dealers / MMs", role: "Liquidity provider", impact: "High", color: "#06b6d4", desc: "Provide quotes, gamma hedge, warehouse risk" },
  { name: "Institutions", role: "Flow driver", impact: "High", color: "#f59e0b", desc: "Pension funds, mutual funds, large block orders" },
  { name: "HFTs", role: "Microstructure arb", impact: "Medium", color: "#10b981", desc: "Latency arb, spoofing, quote stuffing" },
  { name: "Vol Target Funds", role: "Vol seller", impact: "Medium", color: "#ec4899", desc: "Sell vol systematically, rebalance on vol spikes" },
  { name: "Retail", role: "Noise / sentiment", impact: "Low", color: "#6366f1", desc: "Sentiment indicator, often wrong at extremes" },
];

export default function MarketParticipantsHierarchy() {
  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Market Participants Hierarchy
      </h4>

      <div className="space-y-2">
        {participants.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="group relative"
          >
            <div
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${p.color}30`;
                e.currentTarget.style.background = `${p.color}08`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              {/* Impact indicator */}
              <div
                className="w-1 h-8 rounded-full shrink-0"
                style={{ background: p.color, opacity: p.impact === "High" ? 1 : 0.5 }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--color-polar-white)]">{p.name}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    {p.impact}
                  </span>
                </div>
                <span className="text-[11px] block truncate" style={{ color: "var(--color-ghost-gray)" }}>
                  {p.role}
                </span>
              </div>

              {/* Expand icon */}
              <svg className="w-4 h-4 text-[#3d3d3d] group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Description tooltip on hover */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileHover={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-[11px] px-4 py-2" style={{ color: "var(--color-ash-gray)" }}>
                {p.desc}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Flow arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>
          Information flows top → bottom
        </span>
      </motion.div>
    </div>
  );
}
