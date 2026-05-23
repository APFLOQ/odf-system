"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import TopicVisuals from "@/app/components/visuals/TopicVisuals";
import {
  topicsByCategory,
  categoryLabels,
  categoryColors,
  educationCategories,
} from "@/data/educationVault";
import type { EducationCategory } from "@/data/educationVault";
import { educationSupplements } from "@/data/educationExpansion";

export default function TopicPage() {
  const params = useParams();
  const category = params?.category as EducationCategory;
  const topicId = params?.topic as string;

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
  const topic = topics.find(t => t.id === topicId);
  const color = categoryColors[category];

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight-void)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Topic not found</h1>
          <Link href={`/education/${category}`} className="text-[var(--color-cosmic-violet)] hover:underline">
            ← Back to {categoryLabels[category]}
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = topics.findIndex(t => t.id === topicId);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[12px] mb-8"
            style={{ color: "var(--color-ghost-gray)" }}
          >
            <Link href="/education" className="hover:text-white transition-colors">Education</Link>
            <span>/</span>
            <Link href={`/education/${category}`} className="hover:text-white transition-colors" style={{ color }}>
              {categoryLabels[category]}
            </Link>
            <span>/</span>
            <span className="text-[var(--color-polar-white)]">{topic.title}</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold"
                style={{
                  background: `${color}12`,
                  color,
                  border: `1px solid ${color}25`,
                }}
              >
                {categoryLabels[category]}
              </span>
              {topic.tags.length > 0 && (
                <div className="flex gap-2">
                  {topic.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase" style={{ color: "var(--color-ghost-gray)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h1
              className="font-primary text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.02em] mb-4"
              style={{ color: "var(--color-polar-white)" }}
            >
              {topic.title}
            </h1>
            {topic.wikilinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[11px]" style={{ color: "var(--color-ghost-gray)" }}>Related:</span>
                {topic.wikilinks.slice(0, 5).map((link, i) => {
                  const linkSlug = link.split("/").pop()?.replace(/\.md$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";
                  return (
                    <Link
                      key={i}
                      href={`/education/${category}/${linkSlug}`}
                      className="text-[11px] hover:underline"
                      style={{ color }}
                    >
                      {link.split("/").pop()?.replace(/\.md$/, "")}
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Two-column layout: Content left, Visual right */}
          <div className="lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:items-start">
            {/* Left column — Content + Supplements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="pb-16 mt-8"
            >
              <div
                className="rounded-2xl border p-8 md:p-10"
                style={{
                  background: "rgba(255, 255, 255, 0.015)",
                  borderColor: "rgba(255, 255, 255, 0.06)",
                }}
              >
                <MarkdownRenderer content={topic.content} category={category} />
              </div>

              {/* Supplements from Official Sources */}
              {(() => {
                const relevantSupplements = educationSupplements.filter(
                  s => s.category === category && (
                    s.targetTopic.toLowerCase().includes(topic.title.toLowerCase()) ||
                    topic.title.toLowerCase().includes(s.targetTopic.toLowerCase()) ||
                    s.targetTopic === '*' ||
                    (category === 'foundations' && s.targetTopic.includes('Futures')) ||
                    (category === 'options' && (topic.title.includes('GEX') || topic.title.includes('Option') || topic.title.includes('Greek'))) ||
                    (category === 'macro' && (topic.title.includes('Macro') || topic.title.includes('Yield') || topic.title.includes('CPI'))) ||
                    (category === 'orderflow' && (topic.title.includes('Order') || topic.title.includes('DOM') || topic.title.includes('Footprint'))) ||
                    (category === 'risk' && (topic.title.includes('Risk') || topic.title.includes('Kelly') || topic.title.includes('Position'))) ||
                    (category === 'quant' && (topic.title.includes('Quant') || topic.title.includes('Black') || topic.title.includes('Correlation'))) ||
                    (category === 'participants' && (topic.title.includes('Participant') || topic.title.includes('COT') || topic.title.includes('Dealer'))) ||
                    (category === 'trading-strategy' && (topic.title.includes('Strategy') || topic.title.includes('Setup') || topic.title.includes('Checklist')))
                  )
                );
                if (relevantSupplements.length === 0) return null;
                return (
                  <div className="mt-6 space-y-6">
                    <h3 className="text-[14px] font-mono uppercase tracking-[0.15em] mb-4" style={{ color }}>
                      Expanded Analysis & Official Sources
                    </h3>
                    {relevantSupplements.map((supplement, idx) => (
                      <motion.div
                        key={supplement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className="rounded-2xl border p-6 md:p-8"
                        style={{
                          background: "rgba(255, 255, 255, 0.015)",
                          borderColor: "rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-[16px] font-semibold text-[var(--color-polar-white)] mb-1">
                              {supplement.title}
                            </h4>
                            <p className="text-[11px] font-mono" style={{ color: "var(--color-ghost-gray)" }}>
                              Source: {supplement.source}
                            </p>
                          </div>
                          <span
                            className="px-2 py-1 rounded text-[10px] font-mono uppercase shrink-0"
                            style={{
                              background: `${color}12`,
                              color,
                              border: `1px solid ${color}25`,
                            }}
                          >
                            {categoryLabels[category]}
                          </span>
                        </div>
                        <div className="mb-4">
                          <MarkdownRenderer content={supplement.content} category={category} />
                        </div>
                        {supplement.keyTakeaways.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                            <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--color-ghost-gray)" }}>
                              Key Takeaways
                            </p>
                            <ul className="space-y-1.5">
                              {supplement.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="text-[13px] text-[var(--color-stardust-gray)] flex items-start gap-2">
                                  <span className="text-[var(--color-cosmic-violet)] mt-1">•</span>
                                  {takeaway}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>

            {/* Right column — Visual Element (sticky) */}
            <div className="mt-8 lg:sticky lg:top-28">
              <TopicVisuals topicId={topic.id} title={topic.title} category={category} />
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-8">
            <div className="flex justify-between items-center">
              {prevTopic ? (
                <Link
                  href={`/education/${category}/${prevTopic.id}`}
                  className="flex items-center gap-2 text-[13px] transition-colors hover:text-white"
                  style={{ color: "var(--color-ash-gray)" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>Previous</div>
                    <div className="text-[var(--color-polar-white)]">{prevTopic.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextTopic ? (
                <Link
                  href={`/education/${category}/${nextTopic.id}`}
                  className="flex items-center gap-2 text-[13px] transition-colors hover:text-white text-right"
                  style={{ color: "var(--color-ash-gray)" }}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>Next</div>
                    <div className="text-[var(--color-polar-white)]">{nextTopic.title}</div>
                  </div>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </main>
    </DiscordGate>
  );
}
