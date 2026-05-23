"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import TopicVisuals from "@/app/components/visuals/TopicVisuals";
import { lectures, categoryLabels, categoryColors } from "@/data/educationVault";

export default function LecturePage() {
  const params = useParams();
  const lectureId = params?.id as string;

  const lecture = lectures.find(l => l.id === lectureId);

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight-void)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lecture not found</h1>
          <Link href="/education/lectures" className="text-[var(--color-cosmic-violet)] hover:underline">
            ← Back to Lectures
          </Link>
        </div>
      </div>
    );
  }

  const color = categoryColors[lecture.category];
  const currentIndex = lectures.findIndex(l => l.id === lectureId);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

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
            <Link href="/education/lectures" className="hover:text-white transition-colors">Lectures</Link>
            <span>/</span>
            <span className="text-[var(--color-polar-white)]">L{lecture.number}</span>
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
                className="w-14 h-14 rounded-xl flex items-center justify-center text-[18px] font-bold font-mono"
                style={{ background: `${color}15`, color, border: `2px solid ${color}25` }}
              >
                {lecture.number.toString().padStart(2, "0")}
              </span>
              <div>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider"
                  style={{ color }}
                >
                  {lecture.phase} · {categoryLabels[lecture.category]}
                </span>
                <h1
                  className="font-primary text-[clamp(24px,3.5vw,36px)] font-bold tracking-[-0.02em]"
                  style={{ color: "var(--color-polar-white)" }}
                >
                  {lecture.title.replace(/^L\d+\s*—\s*/, "")}
                </h1>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--color-ghost-gray)" }}>
                <span>Lecture {lecture.number} of 27</span>
                <span>{Math.round((lecture.number / 27) * 100)}% complete</span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lecture.number / 27) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          </motion.div>

          {/* Two-column layout: Content left, Visual right */}
          <div className="lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:items-start">
            {/* Left column — Content */}
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
                <MarkdownRenderer content={lecture.content} category={lecture.category} />
              </div>
            </motion.div>

            {/* Right column — Visual Element (sticky) */}
            <div className="mt-8 lg:sticky lg:top-28">
              <TopicVisuals topicId={lecture.id} title={lecture.title} category={lecture.category} />
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-8">
            <div className="flex justify-between items-center">
              {prevLecture ? (
                <Link
                  href={`/education/lectures/${prevLecture.id}`}
                  className="flex items-center gap-2 text-[13px] transition-colors hover:text-white"
                  style={{ color: "var(--color-ash-gray)" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>Previous</div>
                    <div className="text-[var(--color-polar-white)]">{prevLecture.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextLecture ? (
                <Link
                  href={`/education/lectures/${nextLecture.id}`}
                  className="flex items-center gap-2 text-[13px] transition-colors hover:text-white text-right"
                  style={{ color: "var(--color-ash-gray)" }}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ghost-gray)" }}>Next</div>
                    <div className="text-[var(--color-polar-white)]">{nextLecture.title}</div>
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
