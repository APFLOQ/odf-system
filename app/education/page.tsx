"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import {
  educationCategories,
  categoryLabels,
  categoryColors,
  categoryDescriptions,
  topicsByCategory,
  lectures,
} from "@/data/educationVault";
import type { EducationCategory } from "@/data/educationVault";

export default function EducationLandingPage() {
  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        {/* Hero */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="font-mono text-[11px] tracking-[0.2em] uppercase block mb-4"
                style={{ color: "#8052ff" }}
              >
                Education
              </span>
              <h1
                className="font-primary text-[clamp(36px,6vw,56px)] font-bold tracking-[-0.03em] mb-5"
                style={{ color: "var(--color-polar-white)" }}
              >
                The vault.
              </h1>
              <p
                className="font-primary text-[18px] max-w-[600px] leading-relaxed mb-8"
                style={{ color: "var(--color-ash-gray)" }}
              >
                A complete knowledge system for trading. 8 categories. 27 lectures. 100+ topics. 
                Everything the Obsidian vault taught you, now structured for the web.
              </p>

              {/* Lecture Track CTA */}
              <Link
                href="/education/lectures"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(128, 82, 255, 0.12)",
                  border: "1px solid rgba(128, 82, 255, 0.3)",
                  color: "#8052ff",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Lecture Track (L1-L27)
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="px-6 pb-20">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {educationCategories.map((cat, idx) => {
                const color = categoryColors[cat];
                const topicCount = topicsByCategory[cat]?.length || 0;
                const lectureCount = lectures.filter(l => l.category === cat).length;
                
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                  >
                    <Link
                      href={`/education/${cat}`}
                      className="block p-6 rounded-xl transition-all duration-300 group h-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${color}40`;
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-[18px] font-bold"
                        style={{
                          background: `${color}15`,
                          color: color,
                        }}
                      >
                        {categoryLabels[cat].charAt(0)}
                      </div>
                      <h3
                        className="font-primary text-[18px] font-semibold mb-2"
                        style={{ color: "var(--color-polar-white)" }}
                      >
                        {categoryLabels[cat]}
                      </h3>
                      <p
                        className="text-[13px] leading-relaxed mb-4"
                        style={{ color: "var(--color-ash-gray)" }}
                      >
                        {categoryDescriptions[cat]}
                      </p>
                      <div className="flex gap-3 text-[11px] font-mono" style={{ color: "#6d6d6d" }}>
                        <span>{topicCount} topics</span>
                        {lectureCount > 0 && <span>· {lectureCount} lectures</span>}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </DiscordGate>
  );
}
