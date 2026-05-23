"use client";

import { motion } from "framer-motion";

const events = [
  { time: "08:30 ET", event: "NFP Release", impact: "High", type: "employment", day: "1st Fri" },
  { time: "08:30 ET", event: "CPI Release", impact: "High", type: "inflation", day: "~13th" },
  { time: "14:00 ET", event: "FOMC Decision", impact: "Critical", type: "rates", day: "~8x/year" },
  { time: "08:30 ET", event: "GDP (Adv)", impact: "Medium", type: "growth", day: "Quarterly" },
  { time: "10:00 ET", event: "ISM Manufacturing", impact: "Medium", type: "growth", day: "1st of month" },
];

export default function MacroEventTimeline() {
  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Monthly Macro Catalyst Timeline
      </h4>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#06b6d4] to-[#8052ff] opacity-30" />

        <div className="space-y-4">
          {events.map((evt, i) => (
            <motion.div
              key={evt.event}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 + 0.2 }}
              className="flex items-start gap-4"
            >
              {/* Dot */}
              <div
                className="w-4 h-4 rounded-full shrink-0 mt-0.5 border-2"
                style={{
                  background: evt.impact === "Critical" ? "#ef4444" : evt.impact === "High" ? "#f59e0b" : "#06b6d4",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              />

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-mono" style={{ color: "var(--color-polar-white)" }}>
                    {evt.event}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase"
                    style={{
                      background: evt.impact === "Critical" ? "rgba(239,68,68,0.15)" : evt.impact === "High" ? "rgba(245,158,11,0.15)" : "rgba(6,182,212,0.15)",
                      color: evt.impact === "Critical" ? "#f87171" : evt.impact === "High" ? "#fbbf24" : "#22d3ee",
                    }}
                  >
                    {evt.impact}
                  </span>
                </div>
                <div className="flex gap-3 text-[10px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>
                  <span>{evt.time}</span>
                  <span>·</span>
                  <span>{evt.day}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact legend */}
      <div className="flex justify-center gap-4 mt-5 text-[9px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#06b6d4]" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Medium</span>
        </div>
      </div>
    </div>
  );
}
