"use client";

import { motion } from "framer-motion";

export default function FootprintHeatmap() {
  const rows = 12;
  const priceLevels = Array.from({ length: rows }, (_, i) => 5244.00 + (rows - 1 - i) * 0.25);
  
  // Generate fake footprint data
  const data = priceLevels.map((price, i) => {
    const bid = Math.floor(Math.random() * 200) + 20;
    const ask = Math.floor(Math.random() * 200) + 20;
    const delta = ask - bid;
    return { price, bid, ask, delta };
  });

  const maxVol = Math.max(...data.map(d => Math.max(d.bid, d.ask)));

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Footprint Chart (Bid x Ask per Price)
      </h4>

      <div className="space-y-0.5">
        {data.map((row, i) => {
          const bidOpacity = row.bid / maxVol;
          const askOpacity = row.ask / maxVol;
          const isDeltaPositive = row.delta > 0;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 + 0.2 }}
              className="flex items-center gap-2 h-6"
            >
              {/* Bid bar */}
              <div className="flex-1 flex justify-end">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bidOpacity * 100}%` }}
                  transition={{ delay: i * 0.03 + 0.4, duration: 0.4 }}
                  className="h-4 rounded-sm flex items-center justify-end px-1"
                  style={{ background: `rgba(52,211,153,${0.15 + bidOpacity * 0.5})` }}
                >
                  <span className="text-[8px] font-mono" style={{ color: "#34d399" }}>
                    {row.bid}
                  </span>
                </motion.div>
              </div>

              {/* Price */}
              <div className="w-[60px] text-center">
                <span className={`text-[10px] font-mono ${isDeltaPositive ? "text-[#34d399]" : "text-[#f87171]"}`}>
                  {row.price.toFixed(2)}
                </span>
              </div>

              {/* Ask bar */}
              <div className="flex-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${askOpacity * 100}%` }}
                  transition={{ delay: i * 0.03 + 0.4, duration: 0.4 }}
                  className="h-4 rounded-sm flex items-center px-1"
                  style={{ background: `rgba(248,113,113,${0.15 + askOpacity * 0.5})` }}
                >
                  <span className="text-[8px] font-mono" style={{ color: "#f87171" }}>
                    {row.ask}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-4 text-[10px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#34d399]/30" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Bid Volume</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#f87171]/30" />
          <span style={{ color: "var(--color-ghost-gray)" }}>Ask Volume</span>
        </div>
      </div>
    </div>
  );
}
