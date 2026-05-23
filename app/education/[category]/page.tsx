"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import {
  topicsByCategory,
  lectures,
  categoryLabels,
  categoryColors,
  categoryDescriptions,
  educationCategories,
} from "@/data/educationVault";
import type { EducationCategory } from "@/data/educationVault";

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as EducationCategory;

  if (!educationCategories.includes(category)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight-void)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category not found</h1>
          <Link href="/education" className="text-[var(--color-cosmic-violet)] hover:underline">
            ← Back to Education
          </Link>
        </div>
      </div>
    );
  }

  const topics = topicsByCategory[category] || [];
  const catLectures = lectures.filter(l => l.category === category);
  const color = categoryColors[category];

  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        {/* Header */}
        <section className="pt-20 pb-12 px-6">
          <div className="max-w-[1100px] mx-auto">
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

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] font-bold"
                  style={{ background: `${color}15`, color }}
                >
                  {categoryLabels[category].charAt(0)}
                </div>
                <div>
                  <h1
                    className="font-primary text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.02em]"
                    style={{ color: "var(--color-polar-white)" }}
                  >
                    {categoryLabels[category]}
                  </h1>
                </div>
              </div>
              <p className="text-[16px] max-w-[600px] leading-relaxed" style={{ color: "var(--color-ash-gray)" }}>
                {categoryDescriptions[category]}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-6 pb-20">
          {/* Lectures */}
          {catLectures.length > 0 && (
            <section className="mb-14">
              <h2 className="text-[14px] font-mono uppercase tracking-[0.15em] mb-5" style={{ color: color }}>
                Lectures
              </h2>
              <div className="space-y-3">
                {catLectures.map((lec, idx) => (
                  <motion.div
                    key={lec.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
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
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                      }}
                    >
                      <span
                        className="font-mono text-[13px] font-bold w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}12`, color }}
                      >
                        L{lec.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-medium text-[var(--color-polar-white)] truncate">
                          {lec.title}
                        </h3>
                        <p className="text-[12px]" style={{ color: "var(--color-ghost-gray)" }}>
                          {lec.phase} Phase
                        </p>
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
                ))}
              </div>
            </section>
          )}

          {/* Topics */}
          <section>
            <h2 className="text-[14px] font-mono uppercase tracking-[0.15em] mb-5" style={{ color: color }}>
              Topics ({topics.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link
                    href={`/education/${category}/${topic.id}`}
                    className="block p-5 rounded-xl transition-all duration-300 group"
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
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[15px] font-medium text-[var(--color-polar-white)] group-hover:text-white transition-colors">
                        {topic.title}
                      </h3>
                      <svg
                        className="w-4 h-4 text-[#4d4d4d] group-hover:text-white transition-colors shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {topic.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono uppercase"
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              color: "#6d6d6d",
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DiscordGate>
  );
}
