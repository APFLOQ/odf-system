"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    let animFrame: number;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const size = isHovering ? 32 : 16;
        ringRef.current.style.transform = `translate(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, [isHovering]);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.15s ease, height 0.15s ease, border-color 0.15s ease",
          opacity: isVisible ? 1 : 0,
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.9)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: "difference",
        }}
      />
      <style jsx global>{`
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [role="button"], input, textarea, select {
            cursor: none;
          }
        }
      `}</style>
    </>
  );
}
