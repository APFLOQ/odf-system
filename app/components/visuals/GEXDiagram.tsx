"use client";

import { motion } from "framer-motion";

export default function GEXDiagram() {
  const strikes = [5200, 5225, 5250, 5275, 5300, 5325, 5350];
  const gexValues = [-80, -40, 20, 60, 45, -30, -70];
  
  const maxVal = Math.max(...gexValues.map(Math.abs));
  const currentPrice = 5275;

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        Gamma Exposure by Strike
      </h4>
      
      <div className="relative h-[220px]">
        {/* Zero line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[rgba(255,255,255,0.1)]" />
        <span className="absolute right-0 top-1/2 -mt-3 text-[9px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>0</span>
        
        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-6">
          {strikes.map((strike, i) => {
            const gex = gexValues[i];
            const height = Math.abs(gex) / maxVal * 70;
            const isPositive = gex > 0;
            const isCurrent = strike === currentPrice;
            
            return (
              <div key={strike} className="flex flex-col items-center relative" style={{ width: `${100 / strikes.length}%` }}>
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
                  className="w-6 rounded-t-sm"
                  style={{
                    background: isPositive 
                      ? "linear-gradient(to top, rgba(52,211,153,0.4), rgba(52,211,153,0.1))" 
                      : "linear-gradient(to bottom, rgba(248,113,113,0.4), rgba(248,113,113,0.1))",
                    position: "absolute",
                    bottom: isPositive ? "50%" : "auto",
                    top: isPositive ? "auto" : "50%",
                    border: isCurrent ? `1px solid ${isPositive ? '#34d399' : '#f87171'}` : 'none',
                  }}
                />
                
                {/* Strike label */}
                <div className="absolute bottom-0 text-center">
                  <span className={`text-[9px] font-mono ${isCurrent ? 'text-white font-bold' : ''}`} style={{ color: isCurrent ? 'white' : 'var(--color-ghost-gray)' }}>
                    {strike}
                  </span>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-[8px] text-[var(--color-cosmic-violet)]"
                    >
                      SPOT
                    </motion.div>
                  )}
                </div>
                
                {/* Value label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.8 }}
                  className="absolute text-[9px] font-mono"
                  style={{
                    color: isPositive ? '#34d399' : '#f87171',
                    bottom: isPositive ? `calc(50% + ${height}% + 4px)` : 'auto',
                    top: isPositive ? 'auto' : `calc(50% + ${height}% + 4px)`,
                  }}
                >
                  {gex > 0 ? '+' : ''}{gex}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Regime indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-4 p-3 rounded-lg text-center"
        style={{ background: "rgba(128,82,255,0.08)", border: "1px solid rgba(128,82,255,0.15)" }}
      >
        <span className="text-[11px]" style={{ color: "#8052ff" }}>
          Current Regime: Positive GEX (Mean-reverting / Pinning)
        </span>
      </motion.div>
    </div>
  );
}
