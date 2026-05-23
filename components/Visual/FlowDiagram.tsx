"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface FlowDiagramProps {
  code: string;
  title?: string;
}

export function FlowDiagram({ code, title }: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const renderDiagram = async () => {
      if (!code || !containerRef.current) return;
      
      try {
        const mermaid = (await import("mermaid")).default;
        
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "dark",
          themeVariables: {
            primaryColor: "#8b5cf6",
            primaryTextColor: "#e8ecf5",
            primaryBorderColor: "#3b82f6",
            lineColor: "#5a6478",
            secondaryColor: "#0b0e16",
            tertiaryColor: "#07090e",
            background: "#0b0e16",
            mainBkg: "#0b0e16",
            nodeBorder: "#27272a",
            clusterBkg: "#10131c",
            clusterBorder: "#27272a",
            titleColor: "#e8ecf5",
            fontFamily: "monospace",
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
        });

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const { svg } = await mermaid.render(id, code);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        setError(err.message || "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="mermaid-container">
        {title && <div className="mermaid-title">{title}</div>}
        <div style={{
          padding: "16px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          color: "#f87171",
          fontSize: "13px",
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-container">
      {title && <div className="mermaid-title">{title}</div>}
      <div
        ref={containerRef}
        className="mermaid"
        style={{ background: "transparent", padding: "16px 0" }}
      />
    </div>
  );
}