"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import { lectures, categoryColors } from "@/data/educationVault";

const phases = [
  { name: "Foundations", range: [1, 3], color: "#8052ff" },
  { name: "Macro", range: [4, 9], color: "#06b6d4" },
  { name: "Options", range: [10, 15], color: "#f59e0b" },
  { name: "Orderflow", range: [16, 21], color: "#10b981" },
  { name: "Trading Strategy", range: [22, 27], color: "#ef4444" },
];

export default function LecturesPage() {
  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        {/* Hero */}
        <section className="pt-20 pb-12 px-6">
          <div className="max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/education"
                className="inline-flex items-center gap-2 text-[var(--color-ghost-gray)] hover:text-white mb-6 transition-colors text-[13px]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Education
              </Link>

              <h1
                className="font-primary text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.03em] mb-4"
                style={{ color: "var(--color-polar-white)" }}
              >
                Lecture Track
              </h1>
              <p className="text-[16px] max-w-[500px] leading-relaxed" style={{ color: "var(--color-ash-gray)" }}>
                27 lectures. 5 phases. From zero to top-bottom ticking. 
                Do not skip steps. Each phase builds on the last.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-6 pb-20">
          <div className="max-w-[900px] mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[19px] top-0 bottom-0 w-[2px] hidden md:block"
                style={{ background: "linear-gradient(to bottom, rgba(128,82,255,0.3), rgba(239,68,68,0.3))" }}
              />

              {phases.map((phase, phaseIdx) => {
                const phaseLectures = lectures.filter(
                  l => l.number >= phase.range[0] && l.number <= phase.range[1]
                );

                return (
                  <div key={phase.name} className="mb-12">
                    {/* Phase header */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: phaseIdx * 0.1 }}
                      className="flex items-center gap-4 mb-6 md:pl-12"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                        style={{ background: `${phase.color}15`, color: phase.color, border: `2px solid ${phase.color}30` }}
                      >
                        {phaseIdx + 1}
                      </div>
                      <div>
                        <h2 className="text-[18px] font-semibold text-[var(--color-polar-white)]">
                          Phase {phaseIdx + 1}: {phase.name}
                        </h2>
                        <p className="text-[12px]" style={{ color: "var(--color-ghost-gray)" }}>
                          Lectures {phase.range[0]}–{phase.range[1]}
                        </p>
                      </div>
                    </motion.div>

                    {/* Lectures */}
                    <div className="space-y-3 md:pl-12">
                      {phaseLectures.map((lec, idx) => {
                        const color = categoryColors[lec.category];
                        return (
                          <motion.div
                            key={lec.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: phaseIdx * 0.1 + idx * 0.05 }}
                          >
                            <Link
                              href={`/education/lectures/${lec.id}`}
                              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                              style={{
                                background: "rgba(255, 255, 255, 0.02)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${color}30`;
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                              }}
                            >
                              <span
                                className="font-mono text-[13px] font-bold w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${color}10`, color }}
                              >
                                {lec.number.toString().padStart(2, "0")}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-medium text-[var(--color-polar-white)] truncate group-hover:text-white transition-colors">
                                  {lec.title}
                                </h3>
                                {lec.tags.length > 0 && (
                                  <div className="flex gap-2 mt-1">
                                    {lec.tags.slice(0, 3).map(tag => (
                                      <span key={tag} className="text-[10px] font-mono uppercase" style={{ color: "var(--color-ghost-gray)" }}>
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <svg
                                className="w-5 h-5 text-[#3d3d3d] group-hover:text-white transition-colors shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </DiscordGate>
  );
}
