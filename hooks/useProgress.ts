"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ActionType } from "@/lib/supabase";

const STORAGE_KEY = "odf_progress";

interface ProgressState {
  completedModules: string[];
  currentModule: string | null;
  startedAt: string;
  lastUpdated: string;
}

const defaultState: ProgressState = {
  completedModules: [],
  currentModule: null,
  startedAt: "",
  lastUpdated: "",
};

function getStoredProgress(): ProgressState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse progress from localStorage:", e);
  }
  return defaultState;
}

function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save progress to localStorage:", e);
  }
}

async function syncToSupabase(modules: string[]) {
  try {
    await fetch("/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedModules: modules }),
    });
  } catch (e) {
    console.error("Failed to sync progress to Supabase:", e);
  }
}

async function trackAction(action: ActionType, metadata?: Record<string, string | number | boolean>) {
  try {
    await fetch("/api/stats/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, metadata }),
    });
  } catch {}
}

function loadFromStorage(): ProgressState {
  return getStoredProgress();
}

export function useProgress() {
  const initialProgress = useMemo(() => loadFromStorage(), []);
  
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedRef = useRef<string>("");
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    setIsLoaded(true);

    fetch("/api/progress/sync")
      .then((res) => res.json())
      .then((data) => {
        if (data.completedModules?.length > 0) {
          setProgress((prev) => {
            const merged = [...new Set([...prev.completedModules, ...data.completedModules])];
            const newState = { ...prev, completedModules: merged };
            saveProgress(newState);
            return newState;
          });
        }
      })
      .catch(() => {});
  }, []);

  const scheduleSync = useCallback((modules: string[]) => {
    const key = modules.sort().join(",");
    if (key === lastSyncedRef.current) return;
    lastSyncedRef.current = key;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncToSupabase(modules);
    }, 2000);
  }, []);

  const markComplete = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      const newState = {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
        lastUpdated: new Date().toISOString(),
      };
      saveProgress(newState);
      scheduleSync(newState.completedModules);
      trackAction("module_complete", { module_id: moduleId });
      return newState;
    });
  }, [scheduleSync]);

  const markIncomplete = useCallback((moduleId: string) => {
    setProgress((prev) => {
      const newState = {
        ...prev,
        completedModules: prev.completedModules.filter((id) => id !== moduleId),
        lastUpdated: new Date().toISOString(),
      };
      saveProgress(newState);
      scheduleSync(newState.completedModules);
      trackAction("module_uncomplete", { module_id: moduleId });
      return newState;
    });
  }, [scheduleSync]);

  const setCurrentModule = useCallback((moduleId: string) => {
    setProgress((prev) => {
      const newState = {
        ...prev,
        currentModule: moduleId,
        lastUpdated: new Date().toISOString(),
      };
      saveProgress(newState);
      trackAction("module_start", { module_id: moduleId });
      return newState;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const newState = {
      ...defaultState,
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    saveProgress(newState);
    setProgress(newState);
    syncToSupabase([]);
  }, []);

  const isModuleCompleted = useCallback(
    (moduleId: string) => progress.completedModules.includes(moduleId),
    [progress.completedModules]
  );

  const toggleComplete = useCallback((moduleId: string) => {
    if (isModuleCompleted(moduleId)) {
      markIncomplete(moduleId);
    } else {
      markComplete(moduleId);
    }
  }, [isModuleCompleted, markComplete, markIncomplete]);

  const getProgressPercentage = useCallback(
    (totalModules: number) =>
      totalModules > 0 ? Math.round((progress.completedModules.length / totalModules) * 100) : 0,
    [progress.completedModules]
  );

  return {
    progress,
    isLoaded,
    markComplete,
    markIncomplete,
    toggleComplete,
    setCurrentModule,
    resetProgress,
    isModuleCompleted,
    getProgressPercentage,
    updateProgress: setProgress,
  };
}