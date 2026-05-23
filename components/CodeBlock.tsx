"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  title?: string;
  code: string;
  annotations?: string[];
}

export function CodeBlock({ language, title, code, annotations }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-dots">
          <span className="code-dot red" />
          <span className="code-dot yellow" />
          <span className="code-dot green" />
        </div>
        {title && <span className="code-title">{title}</span>}
        <span className="code-lang">{language}</span>
      </div>
      <div className="code-content">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {annotations && annotations.length > 0 && (
        <div style={{ padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {annotations.map((ann, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px",
                color: "#5a6478",
                marginBottom: i < annotations.length - 1 ? "8px" : 0,
              }}
            >
              <span style={{ color: "#60a5fa" }}>→</span> {ann}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}