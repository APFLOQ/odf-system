"use client";

import { useEffect, useState } from "react";

export default function GlobalSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(160, 224, 171, 0.04), transparent 40%)`,
      }}
    />
  );
}
