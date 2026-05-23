"use client";

import Link from "next/link";
import React from "react";

interface MarkdownRendererProps {
  content: string;
  category?: string;
}

export default function MarkdownRenderer({ content, category }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = "";
  let inTable = false;
  let tableRows: string[][] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 text-[var(--color-stardust-gray)]">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1).filter(r => r.some(c => c.trim() && !c.includes("---")));
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                {header.map((h, i) => (
                  <th key={i} className="text-left py-2 px-3 text-[var(--color-ash-gray)] font-semibold uppercase text-[11px] tracking-wider">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 px-3 text-[var(--color-stardust-gray)]" dangerouslySetInnerHTML={{ __html: renderInline(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const renderInline = (text: string): string => {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-polar-white)]">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--color-cosmic-violet)] text-[13px] font-mono">$1</code>')
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, link, label) => {
        const slug = link.split("/").pop().replace(/\.md$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return `<a href="/education/${category || 'foundations'}/${slug}" class="text-[var(--color-cosmic-violet)] hover:underline">${label || link}</a>`;
      })
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-cosmic-violet)] hover:underline">$1</a>');
  };

  lines.forEach((line, i) => {
    // Code blocks
    if (line.startsWith("```")) {
      flushList();
      flushTable();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.replace("```", "").trim();
        codeContent = [];
      } else {
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111118] border-b border-[rgba(255,255,255,0.06)]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              <span className="ml-auto text-[11px] text-[var(--color-ghost-gray)] uppercase font-mono">{codeLanguage || "code"}</span>
            </div>
            <pre className="p-4 text-[13px] text-[var(--color-stardust-gray)] overflow-x-auto font-mono leading-relaxed">
              {codeContent.join("\n")}
            </pre>
          </div>
        );
        inCodeBlock = false;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      flushTable();
      elements.push(<div key={`br-${i}`} className="h-2" />);
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      flushTable();
      const quoteText = line.replace("> ", "");
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-2 border-[var(--color-cosmic-violet)] pl-4 py-1 my-4 text-[var(--color-ash-gray)] italic">
          <span dangerouslySetInnerHTML={{ __html: renderInline(quoteText) }} />
        </blockquote>
      );
      return;
    }

    // Table
    if (line.startsWith("|")) {
      flushList();
      if (!inTable) inTable = true;
      const cells = line.split("|").filter(c => c.trim() !== "").map(c => c.trim());
      if (!cells.every(c => c.match(/^-+$/))) {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable();
    }

    // List items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(line.replace(/^[-*]\s+/, ""));
      return;
    } else if (inList && line.startsWith("  ")) {
      listItems[listItems.length - 1] += " " + line.trim();
      return;
    } else if (inList) {
      flushList();
    }

    // Headers
    if (line.startsWith("#### ")) {
      elements.push(
        <h5 key={i} className="text-[16px] font-semibold text-[var(--color-ash-gray)] mt-6 mb-2">
          {line.replace("#### ", "")}
        </h5>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="text-[18px] font-semibold text-[var(--color-polar-white)] mt-8 mb-3 tracking-tight">
          {line.replace("### ", "")}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="text-[22px] font-bold text-[var(--color-polar-white)] mt-10 mb-4 tracking-tight">
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      // Skip H1 - handled by page title
    } else {
      // Regular paragraph
      elements.push(
        <p key={i} className="text-[15px] text-[var(--color-stardust-gray)] leading-[1.7] mb-4" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      );
    }
  });

  flushList();
  flushTable();

  return <div className="max-w-none">{elements}</div>;
}
