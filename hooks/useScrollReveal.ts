"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ScrollRevealReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export function useScrollReveal(threshold = 0.1): ScrollRevealReturn {
  const internalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    internalRef.current = node;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = internalRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return { ref: internalRef, isVisible };
}
