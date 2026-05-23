"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DecisionNode {
  id: string;
  text: string;
  yes?: string;
  no?: string;
  result?: string;
}

const nodes: Record<string, DecisionNode> = {
  start: { id: "start", text: "Is GEX positive at current spot?", yes: "pinning", no: "amplification" },
  pinning: { id: "pinning", text: "Is price near a high-OI strike?", yes: "fade", no: "range" },
  amplification: { id: "amplification", text: "Is VIX expanding?", yes: "trend", no: "watch" },
  fade: { id: "fade", text: "Fade the move. Dealers will sell rallies / buy dips.", result: "STRATEGY: Sell calls above / Sell puts below strike" },
  range: { id: "range", text: "Range trade. Low conviction direction.", result: "STRATEGY: Iron condor or straddle sale" },
  trend: { id: "trend", text: "Trend follow. Momentum will accelerate.", result: "STRATEGY: Buy directional / Sell opposite wing" },
  watch: { id: "watch", text: "Wait. Structure unclear.", result: "STRATEGY: Reduce size. No new entries." },
};

export default function GEXDecisionFlowchart() {
  const [currentNode, setCurrentNode] = useState<string>("start");
  const [history, setHistory] = useState<string[]>(["start"]);

  const node = nodes[currentNode];

  const handleChoice = (choice: "yes" | "no") => {
    const next = choice === "yes" ? node.yes : node.no;
    if (next) {
      setCurrentNode(next);
      setHistory([...history, next]);
    }
  };

  const reset = () => {
    setCurrentNode("start");
    setHistory(["start"]);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)]">
      <h4 className="text-[13px] font-mono uppercase tracking-wider text-center mb-5" style={{ color: "var(--color-ash-gray)" }}>
        GEX Strategy Decision Tree
      </h4>

      {/* History breadcrumbs */}
      <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
        {history.map((h, i) => (
          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-ghost-gray)" }}>
            {i === 0 ? "START" : i === history.length - 1 ? "NOW" : `${i}`}
          </span>
        ))}
      </div>

      {/* Current Node */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <div
            className="p-5 rounded-xl mb-4"
            style={{
              background: node.result ? "rgba(128,82,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${node.result ? "rgba(128,82,255,0.2)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-polar-white)" }}>
              {node.text}
            </p>
            {node.result && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-[12px] font-semibold"
                style={{ color: "#8052ff" }}
              >
                {node.result}
              </motion.p>
            )}
          </div>

          {!node.result && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleChoice("yes")}
                className="px-5 py-2 rounded-lg text-[13px] font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  color: "#34d399",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleChoice("no")}
                className="px-5 py-2 rounded-lg text-[13px] font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171",
                }}
              >
                No
              </button>
            </div>
          )}

          {node.result && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={reset}
              className="px-5 py-2 rounded-lg text-[13px] transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--color-ash-gray)",
              }}
            >
              Restart
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
