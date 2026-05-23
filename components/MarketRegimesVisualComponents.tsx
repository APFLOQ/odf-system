"use client";

import { useState } from "react";

export function Timeline({ items }: { items: Array<{ period: string; title: string; description: string; color: string }> }) {
  return (
    <div className="relative pl-12 my-8">
      <div className="absolute left-[17px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--color-cosmic-violet)] via-[var(--color-sunflare-yellow)] to-[var(--color-quantum-teal)] opacity-40" />
      {items.map((item, i) => (
        <div key={i} className="relative pb-10 last:pb-0">
          <div
            className="absolute -left-[42px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-[9px] font-semibold border-2 z-10"
            style={{
              backgroundColor: `${item.color}20`,
              borderColor: item.color,
              color: item.color,
            }}
          >
            {`W${i * 2 + 1}`}
          </div>
          <div className="bg-[#0b0e16] border border-[rgba(255,255,255,0.04)] rounded-xl p-6">
            <div className="font-mono text-[11px] mb-2 opacity-60">{item.period}</div>
            <h4 className="text-[16px] font-semibold text-[var(--color-holo-white)] mb-2">{item.title}</h4>
            <p className="text-[14px] text-[var(--color-stardust-gray)] leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopicCard({
  title,
  tag,
  tagColor = "core",
  children,
}: {
  title: string;
  tag?: string;
  tagColor?: "core" | "advanced" | "quant";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const tagStyles = {
    core: "bg-[rgba(59,130,246,0.15)] text-[#93c5fd]",
    advanced: "bg-[rgba(239,68,68,0.15)] text-[#fca5a5]",
    quant: "bg-[rgba(139,92,246,0.15)] text-[#c4b5fd]",
  };

  const iconColors = {
    core: "text-[var(--color-sunflare-yellow)]",
    advanced: "text-[var(--color-cosmic-violet)]",
    quant: "text-[var(--color-quantum-teal)]",
  };

  return (
    <div className={`bg-[#0b0e16] border border-[rgba(255,255,255,0.04)] rounded-xl mb-4 overflow-hidden transition-all duration-200 ${open ? "border-[rgba(255,255,255,0.08)]" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <span className={`${iconColors[tagColor]} text-lg`}>▸</span>
          <span className="text-[17px] font-semibold text-[var(--color-holo-white)] text-left">{title}</span>
          {tag && (
            <span className={`font-mono text-[9px] px-2 py-1 rounded font-semibold uppercase tracking-wide ${tagStyles[tagColor]}`}>
              {tag}
            </span>
          )}
        </div>
        <span className={`text-lg text-[var(--color-ghost-gray)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-[rgba(255,255,255,0.04)] p-8">
          {children}
        </div>
      )}
    </div>
  );
}

export function Subtopic({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      <h5 className="font-mono text-[14px] font-semibold text-[var(--color-holo-white)] mb-3 flex items-center gap-3">
        <span className="text-[var(--color-cosmic-violet)] bg-[rgba(59,130,246,0.12)] px-2 py-1 rounded text-[10px]">▶</span>
        {title}
      </h5>
      <div className="pl-7">
        {typeof children === "string" ? (
          <p className="text-[14.5px] text-[var(--color-stardust-gray)] leading-relaxed mb-4 last:mb-0">{children}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#07090e] border border-[rgba(255,255,255,0.08)] rounded-lg p-5 my-6 font-mono text-[13px] text-[var(--color-quantum-teal)] overflow-x-auto whitespace-pre leading-relaxed">
      {children}
    </div>
  );
}

export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-[rgba(59,130,246,0.08)] border-[rgba(59,130,246,0.18)] text-[var(--color-cosmic-violet)]",
    warning: "bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.18)] text-[var(--color-sunflare-yellow)]",
    success: "bg-[rgba(16,185,129,0.08)] border-[rgba(16,185,129,0.18)] text-[var(--color-quantum-teal)]",
  };

  const icons = {
    info: "◈",
    warning: "⚠",
    success: "✓",
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg border my-6 text-[14.5px] leading-relaxed ${styles[type]}`}>
      <span className="text-lg flex-shrink-0">{icons[type]}</span>
      <div className="text-[var(--color-stardust-gray)]">{children}</div>
    </div>
  );
}

export function ResourcePills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {items.map((item, i) => (
        <span
          key={i}
          className="font-mono text-[11px] px-3 py-1.5 rounded bg-[#10131c] border border-[rgba(255,255,255,0.08)] text-[var(--color-stardust-gray)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="bg-[#10131c] text-[var(--color-stardust-gray)] font-semibold p-3 text-left border border-[rgba(255,255,255,0.04)] font-mono text-[10px] uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
              {row.map((cell, j) => (
                <td key={j} className="p-3 border border-[rgba(255,255,255,0.04)] text-[var(--color-stardust-gray)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ModuleSection({
  num,
  title,
  subtitle,
  children,
}: {
  num: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 border-t border-[rgba(255,255,255,0.04)]">
      <div className="mb-12">
        <div className="font-mono text-[11px] text-[var(--color-ghost-gray)] tracking-widest mb-3">{num}</div>
        <h2 className="text-[40px] font-bold text-[var(--color-holo-white)] tracking-tight mb-3">{title}</h2>
        <p className="text-[15px] text-[var(--color-ghost-gray)] max-w-2xl leading-relaxed">{'// '}{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function HeroSection({
  title,
  subtitle,
  stats,
}: {
  title: string;
  subtitle: string;
  stats: Array<{ num: string; label: string; color: string }>;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_15%_35%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_85%_75%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(ellipse_60%_40%_at_50%_90%,rgba(6,182,212,0.04),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25" style={{ maskImage: "radial-gradient(ellipse_80%_80%_at_50%_50%,black_20%,transparent_70%)" }}></div>
      <div className="relative z-10 max-w-5xl">
        <div className="font-mono text-[11px] text-[var(--color-cosmic-violet)] tracking-[0.25em] uppercase mb-5">{'// Guía de estudio avanzada'}</div>
        <h1 className="text-[clamp(52px,9vw,96px)] font-extrabold text-[var(--color-holo-white)] tracking-[-0.04em] leading-[0.92] mb-7">
          {title}
          <span className="bg-gradient-to-r from-[var(--color-cosmic-violet)] via-[#a78bfa] to-[var(--color-quantum-teal)] bg-clip-text text-transparent"> Market</span>
          <br />
          <span className="bg-gradient-to-r from-[var(--color-cosmic-violet)] via-[#a78bfa] to-[var(--color-quantum-teal)] bg-clip-text text-transparent">Regimes</span>
        </h1>
        <p className="text-[17px] text-[var(--color-stardust-gray)] max-w-2xl leading-relaxed mb-12">{subtitle}</p>
        <div className="flex gap-14 flex-wrap">
          {stats.map((s, i) => (
            <div key={i}>
              <span className="font-mono text-[36px] font-bold" style={{ color: s.color }}>{s.num}</span>
              <span className="block font-mono text-[11px] text-[var(--color-ghost-gray)] uppercase tracking-widest mt-2">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
