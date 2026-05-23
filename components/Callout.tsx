"use client";

interface CalloutProps {
  type?: "info" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: "◈",
  warning: "⚠",
  success: "✓",
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <div className={`callout ${type}`}>
      <span className="callout-icon">{icons[type]}</span>
      <div style={{ flex: 1 }}>
        {title && <div className="callout-title">{title}</div>}
        <div className="callout-text">{children}</div>
      </div>
    </div>
  );
}