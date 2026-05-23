"use client";

interface RegimeCell {
  label: string;
  title: string;
  description: string;
  color?: string;
}

interface RegimeMatrixProps {
  cells: RegimeCell[];
  title?: string;
}

export function RegimeMatrix({ cells, title }: RegimeMatrixProps) {
  return (
    <div>
      {title && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#5a6478",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
          }}
        >
          {title}
        </div>
      )}
      <div className="regime-matrix">
        {cells.map((cell, index) => (
          <div
            key={index}
            className="regime-cell"
            style={{
              borderColor: cell.color ? `${cell.color}30` : undefined,
            }}
          >
            <div
              className="regime-cell-label"
              style={{ color: cell.color }}
            >
              {cell.label}
            </div>
            <div className="regime-cell-title">{cell.title}</div>
            <div className="regime-cell-desc">{cell.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}