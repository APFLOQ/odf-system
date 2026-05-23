"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AutoTracker() {
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

  return null;
}