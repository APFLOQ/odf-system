"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ActionType } from "@/lib/supabase";

export function useTrackAction() {
  const pathname = usePathname();

  const track = async (action: ActionType, metadata?: Record<string, string | number | boolean>) => {
    try {
      await fetch("/api/stats/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, metadata }),
      });
    } catch {
      // silently fail
    }
  };

  return { track };
}

export function useAutoTrack() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/stats/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "page_view",
        metadata: { path: pathname },
      }),
    }).catch(() => {});
  }, [pathname]);
}