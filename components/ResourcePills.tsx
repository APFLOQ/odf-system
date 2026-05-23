"use client";

interface Resource {
  name: string;
  url?: string;
  type?: "library" | "paper" | "documentation";
}

interface ResourcePillsProps {
  items: Resource[];
}

export function ResourcePills({ items }: ResourcePillsProps) {
  return (
    <div className="resource-pills">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-pill"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}

interface SimpleResourcePillsProps {
  items: string[];
}

export function SimpleResourcePills({ items }: SimpleResourcePillsProps) {
  return (
    <div className="resource-pills">
      {items.map((item, index) => (
        <span key={index} className="resource-pill">
          {item}
        </span>
      ))}
    </div>
  );
}