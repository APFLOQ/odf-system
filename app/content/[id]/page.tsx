"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentRenderer } from "@/components/ContentRenderer";
import { useProgress } from "@/hooks/useProgress";
import { courseContent } from "@/data/courseContent";
import { odfBaseModules, odfBaseModulesList } from "@/data/odfBaseModules";
import DiscordGate from "@/app/components/DiscordGate";
import "@/styles/course.css";

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

export default function ModulePage({ params }: ModulePageProps) {
  const [moduleId, setModuleId] = useState<string>("market-regimes");
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { progress, markComplete, isModuleCompleted, isLoaded: progressLoaded } = useProgress();
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setModuleId(resolvedParams.id || "market-regimes");
      setIsLoaded(true);
    });
  }, [params]);

  const getModule = useCallback(() => {
    const isOdfBase = odfBaseModulesList.some(m => m.id === moduleId);
    
    if (isOdfBase) {
      const odfModule = odfBaseModules[moduleId as keyof typeof odfBaseModules];
      if (odfModule) {
        return {
          id: moduleId,
          title: odfModule.title,
          subtitle: odfModule.phase,
          modules: odfModule.topics.map((t, idx) => ({
            id: `topic-${idx}`,
            title: t.title,
            content: t.content,
            tag: t.tag,
            topics: [{ id: `topic-${idx}`, title: t.title, content: t.content, tag: t.tag }]
          })),
        };
      }
    }
    return courseContent[moduleId as keyof typeof courseContent];
  }, [moduleId]);

  const modules = useMemo(() => {
    const c = getModule() as any;
    return c?.modules || c?.topics || [];
  }, [getModule]);

  const activeModuleIndex = useMemo(() => {
    if (userSelectedIndex !== null && userSelectedIndex < modules.length) {
      return userSelectedIndex;
    }
    
    if (progress.currentModule && modules.length > 0) {
      const idx = modules.findIndex((m: any) => m.id === progress.currentModule);
      if (idx >= 0) return idx;
    }
    
    return 0;
  }, [userSelectedIndex, progress.currentModule, modules]);

  const handleModuleSelect = useCallback((modId: string) => {
    const idx = modules.findIndex((m: any) => m.id === modId);
    if (idx >= 0) {
      setUserSelectedIndex(idx);
    }
  }, [modules]);

  const handlePrevious = useCallback(() => {
    const prevIndex = activeModuleIndex - 1;
    if (prevIndex >= 0) {
      setUserSelectedIndex(prevIndex);
      router.push(`/content/${moduleId}?module=${modules[prevIndex].id}`, { scroll: true });
    }
  }, [activeModuleIndex, moduleId, modules, router]);

  const handleNext = useCallback(() => {
    const nextIndex = activeModuleIndex + 1;
    const currentModule = modules[activeModuleIndex];
    
    if (nextIndex < modules.length) {
      markComplete(currentModule?.id || "");
      setUserSelectedIndex(nextIndex);
      router.push(`/content/${moduleId}?module=${modules[nextIndex].id}`, { scroll: true });
    } else {
      markComplete(currentModule?.id || "");
    }
  }, [activeModuleIndex, modules, moduleId, markComplete, router]);

  const currentModule = modules[activeModuleIndex] as any;
  const allModules = modules;

  const getNavigation = useCallback(() => {
    const prevIndex = activeModuleIndex - 1;
    const nextIndex = activeModuleIndex + 1;
    
    return {
      prev: prevIndex >= 0 ? { id: allModules[prevIndex].id, title: allModules[prevIndex].title } : null,
      next: nextIndex < allModules.length ? { id: allModules[nextIndex].id, title: allModules[nextIndex].title } : null,
    };
  }, [activeModuleIndex, allModules]);

  const navigation = getNavigation();
  const isCompleted = currentModule ? isModuleCompleted(currentModule.id) : false;

  if (!isLoaded || !progressLoaded) {
    return (
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: "#858585" }}>Loading...</div>
        </div>
      </main>
    );
  }

  if (!currentModule) {
    return (
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 style={{ fontSize: "24px", color: "#F3F3F3", marginBottom: "16px" }}>Content not found</h1>
            <Link href="/dashboard" style={{ color: "#8052ff" }}>Back to Dashboard</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
      <header style={{ position: "sticky", top: "68px", zIndex: 40, background: "var(--color-midnight-void)", borderBottom: "1px solid var(--color-border)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#858585", fontSize: "14px" }}>
            <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ padding: "4px 12px", background: "rgba(128, 82, 255, 0.1)", color: "#8052ff", fontSize: "11px", borderRadius: "9999px" }}>
              Module {currentModule.id}
            </span>
            {isCompleted && (
              <span style={{ padding: "4px 12px", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", fontSize: "11px", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "4px" }}>
                <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        <aside style={{ display: "none", width: "280px", background: "#0c0c10", borderRight: "1px solid var(--color-border)", padding: "24px", position: "sticky", top: "136px", height: "calc(100vh - 136px)", overflowY: "auto" }} className="hidden lg:block">
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#858585", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Modulos
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {allModules.map((module: any, idx: number) => {
              const isModCompleted = isModuleCompleted(module.id);
              const isActive = idx === activeModuleIndex;
              
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    textAlign: "left",
                    background: isActive ? "rgba(128, 82, 255, 0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(128, 82, 255, 0.3)" : "1px solid transparent",
                    color: isActive ? "#ffffff" : "#858585",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#8052ff" }}>{module.id}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{module.title}</span>
                  {isModCompleted && (
                    <svg style={{ width: "16px", height: "16px", color: "#34d399", flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: "24px", padding: "16px", background: "var(--color-midnight-void)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: "12px", color: "#858585", marginBottom: "8px" }}>Progress</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#F3F3F3" }}>{progress.completedModules.length}</span>
              <span style={{ fontSize: "14px", color: "#858585" }}>/ {allModules.length}</span>
            </div>
          </div>
        </aside>

        <div style={{ flex: 1, padding: "32px" }}>
          <div style={{ maxWidth: "1000px" }}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#8052ff" }}>{currentModule.id}</span>
                <h1 style={{ fontSize: "34px", fontWeight: 700, color: "#F3F3F3" }}>{currentModule.title}</h1>
              </div>
              <p style={{ fontSize: "16px", color: "#858585", fontStyle: "italic", marginBottom: "16px" }}>{currentModule.subtitle}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {currentModule.topics?.map((topic: any, idx: number) => (
                <div key={topic.id || idx} style={{ background: "#0c0c10", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#F3F3F3" }}>{topic.title}</h2>
                    {topic.tag && (
                      <span style={{
                        padding: "4px 12px",
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        borderRadius: "9999px",
                        background: topic.tag === 'core' ? "rgba(59,130,246,0.15)" :
                                   topic.tag === 'advanced' ? "rgba(239,68,68,0.15)" :
                                   topic.tag === 'quant' ? "rgba(16,185,129,0.15)" :
                                   "rgba(255,255,255,0.1)",
                        color: topic.tag === 'core' ? "#60a5fa" :
                               topic.tag === 'advanced' ? "#f87171" :
                               topic.tag === 'quant' ? "#34d399" :
                               "#858585",
                      }}>
                        {topic.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "24px" }}>
                    <ContentRenderer
                      content={topic.content || ""}
                      formulas={topic.formulas}
                      callouts={topic.callouts}
                      resources={topic.resources}
                      codeExamples={topic.codeExamples}
                      diagram={topic.diagram}
                      exercise={topic.exercise}
                      timelineItems={topic.timelineItems}
                      comparisonData={topic.comparisonData}
                      regimeMatrixData={topic.regimeMatrixData}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
              <button
                onClick={handlePrevious}
                disabled={!navigation.prev}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 24px",
                  background: "var(--color-deep-space)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  color: navigation.prev ? "#F3F3F3" : "#858585",
                  cursor: navigation.prev ? "pointer" : "not-allowed",
                  opacity: navigation.prev ? 1 : 0.5,
                }}
              >
                <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "12px", color: "#858585" }}>Anterior</div>
                  <div style={{ fontSize: "14px" }}>{navigation.prev?.title || ""}</div>
                </div>
              </button>

              {navigation.next ? (
                <button
                  onClick={handleNext}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 24px",
                    background: "#8052ff",
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>Siguiente</div>
                    <div style={{ fontSize: "14px" }}>{navigation.next.title}</div>
                  </div>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => markComplete(currentModule.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 24px",
                    background: "#22c55e",
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>Completar</div>
                    <div style={{ fontSize: "14px" }}>Finalizar modulo</div>
                  </div>
                </button>
              )}
            </div>

            <div style={{ marginTop: "32px", padding: "24px", background: "#0c0c10", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                  onClick={() => markComplete(currentModule.id)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "2px solid",
                    borderColor: isCompleted ? "#8052ff" : "rgba(255,255,255,0.2)",
                    background: isCompleted ? "#8052ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {isCompleted && (
                    <svg style={{ width: "20px", height: "20px", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span style={{ fontSize: "14px", color: "#858585" }}>
                  {isCompleted ? "Module completed!" : "Mark as complete"}
                </span>
              </div>
              <Link href="/dashboard" style={{ fontSize: "13px", color: "#8052ff" }}>
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
    </DiscordGate>
  );
}