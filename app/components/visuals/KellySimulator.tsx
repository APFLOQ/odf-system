"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function KellySimulator() {
  const [winRate, setWinRate] = useState(55);
  const [avgWin, setAvgWin] = useState(2);
  const [avgLoss, setAvgLoss] = useState(1);

  const b = avgWin / avgLoss;
  const p = winRate / 100;
  const q = 1 - p;
  const kelly = Math.max(0, (b * p - q) / b);
  const halfKelly = kelly / 2;
  const quarterKelly = kelly / 4;

  const expectedValue = (p * avgWin) - (q * avgLoss);

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Kelly Criterion Simulator
      </h4>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--color-ghost-gray)" }}>Win Rate</span>
            <span style={{ color: "var(--color-polar-white)" }}>{winRate}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="80"
            value={winRate}
            onChange={(e) => setWinRate(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8052ff ${(winRate - 30) / 50 * 100}%, rgba(255,255,255,0.08) ${(winRate - 30) / 50 * 100}%)`,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--color-ghost-gray)" }}>Avg Win ($)</span>
            <span style={{ color: "#34d399" }}>${avgWin.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={avgWin}
            onChange={(e) => setAvgWin(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #34d399 ${(avgWin - 0.5) / 4.5 * 100}%, rgba(255,255,255,0.08) ${(avgWin - 0.5) / 4.5 * 100}%)`,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--color-ghost-gray)" }}>Avg Loss ($)</span>
            <span style={{ color: "#f87171" }}>${avgLoss.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={avgLoss}
            onChange={(e) => setAvgLoss(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f87171 ${(avgLoss - 0.5) / 2.5 * 100}%, rgba(255,255,255,0.08) ${(avgLoss - 0.5) / 2.5 * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: "rgba(128,82,255,0.06)" }}>
          <span className="text-[12px]" style={{ color: "var(--color-ash-gray)" }}>Full Kelly</span>
          <motion.span
            key={kelly}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-[18px] font-bold font-mono"
            style={{ color: "#8052ff" }}
          >
            {(kelly * 100).toFixed(1)}%
          </motion.span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
          <span className="text-[12px]" style={{ color: "var(--color-ash-gray)" }}>Half Kelly (Recommended)</span>
          <motion.span
            key={halfKelly}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-[16px] font-semibold font-mono"
            style={{ color: "var(--color-polar-white)" }}
          >
            {(halfKelly * 100).toFixed(1)}%
          </motion.span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
          <span className="text-[12px]" style={{ color: "var(--color-ash-gray)" }}>Expected Value per $1 Risk</span>
          <span className={`text-[14px] font-mono font-semibold ${expectedValue > 0 ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
            {expectedValue > 0 ? '+' : ''}{expectedValue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-5">
        <div className="h-3 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden flex">
          <motion.div
            animate={{ width: `${Math.min(kelly * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #8052ff, #a78bfa)" }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: "var(--color-ghost-gray)" }}>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
