"use client";

import { useEffect, useRef } from "react";

const ASCII_LOGO = [
  "    ██████  ██████  ███████ ",
  "   ██    ██ ██   ██ ██      ",
  "   ██    ██ ██   ██ █████   ",
  "   ██    ██ ██   ██ ██      ",
  "    ██████  ██████  ██      ",
];

export default function AsciiCover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chars = " .:-=+*#%@";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const fontSize = 10;
    const cols = Math.floor(width / fontSize);
    const rows = Math.floor(height / fontSize);

    let time = 0;
    let animFrame: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time);
          const charIndex = Math.floor((wave + 1) / 2 * (chars.length - 1));
          const char = chars[charIndex];
          const alpha = (wave + 1) / 2 * 0.5;

          ctx.font = `${fontSize}px JetBrains Mono, monospace`;
          ctx.fillStyle = `rgba(160, 224, 171, ${alpha})`;
          ctx.fillText(char, x * fontSize, y * fontSize);
        }
      }

      // Draw logo in center
      const logoY = Math.floor(rows / 2) - Math.floor(ASCII_LOGO.length / 2);
      const logoX = Math.floor(cols / 2) - Math.floor(ASCII_LOGO[0].length / 2);
      
      ASCII_LOGO.forEach((line, i) => {
        ctx.font = `bold ${fontSize * 1.2}px JetBrains Mono, monospace`;
        ctx.fillStyle = `rgba(255, 172, 46, ${0.8 + Math.sin(time * 2) * 0.2})`;
        ctx.fillText(line, logoX * fontSize, (logoY + i) * fontSize);
      });

      time += 0.05;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        opacity: 0.3,
      }}
    />
  );
}
