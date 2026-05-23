"use client";

interface TimelineItem {
  period: string;
  title: string;
  description: string;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const defaultColors = [
  "#60a5fa",
  "#a78bfa",
  "#22d3ee",
  "#22c55e",
  "#f59e0b",
  "#f472b6",
  "#fb923c",
  "#34d399",
];

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="timeline-visual">
      <div className="timeline-line" />
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div
            className="timeline-dot"
            style={{
              backgroundColor: `${item.color || defaultColors[index % defaultColors.length]}20`,
              borderColor: item.color || defaultColors[index % defaultColors.length],
              color: item.color || defaultColors[index % defaultColors.length],
            }}
          >
            {`W${index * 2 + 1}`}
          </div>
          <div className="timeline-content">
            <div className="timeline-period">{item.period}</div>
            <div className="timeline-title">{item.title}</div>
            <div className="timeline-desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}