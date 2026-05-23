"use client";

import katex from "katex";

interface FormulaBlockProps {
  label?: string;
  content: string;
}

export function FormulaBlock({ label, content }: FormulaBlockProps) {
  let renderedContent = "";

  try {
    renderedContent = katex.renderToString(content, {
      displayMode: true,
      throwOnError: false,
      output: "html",
    });
  } catch (e) {
    renderedContent = content;
  }

  return (
    <div className="formula-box">
      {label && <div className="formula-label">{label}</div>}
      <div
        className="formula-content"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </div>
  );
}

interface InlineFormulaProps {
  content: string;
}

export function InlineFormula({ content }: InlineFormulaProps) {
  let renderedContent = "";

  try {
    renderedContent = katex.renderToString(content, {
      displayMode: false,
      throwOnError: false,
      output: "html",
    });
  } catch (e) {
    renderedContent = content;
  }

  return (
    <span
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}