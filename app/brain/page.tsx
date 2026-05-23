"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";
import topicData from "@/data/topics.json";

interface Topic {
  id: string;
  name: string;
  short: string;
}

interface Category {
  id: string;
  name: string;
  topics: Topic[];
}

interface Relation {
  source: string;
  target: string;
  type: string;
}

const CATEGORY_COLORS: Record<string, { border: string; text: string; glow: string }> = {
  foundation: { border: "#8052ff", text: "#c4b5fd", glow: "rgba(128, 82, 255, 0.4)" },
  structure: { border: "#06b6d4", text: "#a5f3fc", glow: "rgba(6, 182, 212, 0.4)" },
  advanced: { border: "#ffb829", text: "#fde68a", glow: "rgba(255, 184, 41, 0.4)" },
  applications: { border: "#15846e", text: "#6ee7b7", glow: "rgba(21, 132, 110, 0.4)" },
};

interface GraphNode {
  id: string;
  name: string;
  short: string;
  level: "main" | "sub";
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
}

interface GraphLink {
  source: string;
  target: string;
}

function generateGraphData(data: typeof topicData) {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  data.categories.forEach((cat: Category) => {
    nodes.push({
      id: cat.id,
      name: cat.name,
      short: cat.name,
      level: "main",
      category: cat.id,
      x: 0, y: 0, vx: 0, vy: 0,
      mass: 3,
    });

    cat.topics.forEach((topic: Topic) => {
      nodes.push({
        id: topic.id,
        name: topic.name,
        short: topic.short,
        level: "sub",
        category: cat.id,
        x: 0, y: 0, vx: 0, vy: 0,
        mass: 1,
      });

      links.push({ source: cat.id, target: topic.id });
    });
  });

  data.relations.forEach((rel: Relation) => {
    links.push({ source: rel.source, target: rel.target });
  });

  return { nodes, links };
}

export default function Brain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // All refs to avoid re-renders
  const stateRef = useRef({
    nodes: [] as GraphNode[],
    links: [] as GraphLink[],
    nodeMap: new Map<string, GraphNode>(),
    zoom: { x: 0, y: 0, k: 1 },
    dragNode: null as GraphNode | null,
    isPanning: false,
    panStart: { x: 0, y: 0 },
    panOffset: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    hasDragged: false,
    hoveredNode: null as GraphNode | null,
    animFrame: 0,
    simTicks: 0,
    maxTicks: 800,
    isSettled: false,
  });

  const graphData = useMemo(() => generateGraphData(topicData), []);

  const initLayout = useCallback((width: number, height: number) => {
    const state = stateRef.current;
    const centerX = width / 2;
    const centerY = height / 2;

    // Group nodes by category
    const categories = [...new Set(graphData.nodes.map(n => n.category))];
    const catAngleStep = (2 * Math.PI) / categories.length;

    state.nodes = graphData.nodes.map((n) => {
      const catIdx = categories.indexOf(n.category);
      const catAngle = catIdx * catAngleStep;

      // Tight spiral layout per category
      const spiralAngle = catAngle + (n.level === "sub" ? Math.random() * 0.8 - 0.4 : 0);
      const spiralRadius = n.level === "main" 
        ? 30 + Math.random() * 20 
        : 50 + Math.random() * 60;

      return {
        ...n,
        x: centerX + Math.cos(spiralAngle) * spiralRadius,
        y: centerY + Math.sin(spiralAngle) * spiralRadius,
        vx: 0, vy: 0,
      };
    });

    state.links = graphData.links;
    state.nodeMap.clear();
    state.nodes.forEach(n => state.nodeMap.set(n.id, n));
    state.simTicks = 0;
    state.isSettled = false;
  }, [graphData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    initLayout(canvas.width / Math.min(window.devicePixelRatio, 2), canvas.height / Math.min(window.devicePixelRatio, 2));

    window.addEventListener("resize", resize);

    // === PHYSICS ENGINE ===
    const runPhysics = () => {
      const width = canvas!.width / Math.min(window.devicePixelRatio, 2);
      const height = canvas!.height / Math.min(window.devicePixelRatio, 2);
      const nodes = state.nodes;
      const links = state.links;
      const centerX = width / 2;
      const centerY = height / 2;

      if (state.simTicks < state.maxTicks && !state.isSettled) {
        const t = state.simTicks / state.maxTicks;
        const alpha = Math.pow(1 - t, 1.5); // Strong cooling

        // 1. STRONG SPRING FORCE (connected nodes pull together)
        for (const link of links) {
          const s = state.nodeMap.get(link.source);
          const t2 = state.nodeMap.get(link.target);
          if (!s || !t2) continue;

          const dx = t2.x - s.x;
          const dy = t2.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

          // Very tight ideal distance
          const idealDist = s.level === "main" && t2.level === "main" ? 60 : 35;
          const stretch = dist - idealDist;
          const force = stretch * 0.12 * alpha; // Strong springs

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!state.dragNode || state.dragNode.id !== s.id) {
            s.vx -= fx / s.mass;
            s.vy -= fy / s.mass;
          }
          if (!state.dragNode || state.dragNode.id !== t2.id) {
            t2.vx += fx / t2.mass;
            t2.vy += fy / t2.mass;
          }
        }

        // 2. MINIMAL REPULSION (only very close nodes)
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

            // Only repel if very close
            const minDist = (a.level === "main" && b.level === "main") ? 100 : 25;
            if (dist < minDist) {
              const force = -15 * (1 - dist / minDist) * alpha;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (!state.dragNode || state.dragNode.id !== a.id) {
                a.vx += fx / a.mass;
                a.vy += fy / a.mass;
              }
              if (!state.dragNode || state.dragNode.id !== b.id) {
                b.vx -= fx / b.mass;
                b.vy -= fy / b.mass;
              }
            }
          }
        }

        // 3. STRONG CENTER GRAVITY (pulls everything to center)
        for (const node of nodes) {
          if (state.dragNode?.id === node.id) continue;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * 0.008 * alpha;
          node.vy += dy * 0.008 * alpha;
        }

        // 4. APPLY VELOCITY WITH HIGH DAMPING
        for (const node of nodes) {
          if (state.dragNode?.id === node.id) continue;
          node.vx *= 0.35; // Heavy damping
          node.vy *= 0.35;
          node.x += node.vx;
          node.y += node.vy;

          // Keep in bounds
          const pad = 40;
          node.x = Math.max(pad, Math.min(width - pad, node.x));
          node.y = Math.max(pad, Math.min(height - pad, node.y));
        }

        state.simTicks++;
      }
    };

    // === RENDER ===
    const render = () => {
      const width = canvas!.width / Math.min(window.devicePixelRatio, 2);
      const height = canvas!.height / Math.min(window.devicePixelRatio, 2);

      ctx!.clearRect(0, 0, width, height);

      const { x: zx, y: zy, k: zk } = state.zoom;

      ctx!.save();
      ctx!.translate(zx * zk, zy * zk);
      ctx!.scale(zk, zk);

      // Draw links
      for (const link of state.links) {
        const s = state.nodeMap.get(link.source);
        const t = state.nodeMap.get(link.target);
        if (!s || !t) continue;

        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(t.x, t.y);
        ctx!.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx!.lineWidth = 1 / zk;
        ctx!.stroke();
      }

      // Draw nodes
      for (const node of state.nodes) {
        const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.foundation;
        const isMain = node.level === "main";
        const isHovered = state.hoveredNode?.id === node.id;
        const size = isMain ? (isHovered ? 16 : 12) : (isHovered ? 10 : 6);

        // Glow effect
        if (isHovered || isMain) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, size + 8, 0, 2 * Math.PI);
          ctx!.fillStyle = colors.glow;
          ctx!.fill();
        }

        // Node circle
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx!.fillStyle = isMain ? colors.border : "rgba(16, 16, 16, 0.9)";
        ctx!.fill();
        ctx!.strokeStyle = colors.border;
        ctx!.lineWidth = isMain ? 2.5 : 1.5;
        ctx!.stroke();

        // Label
        if (isMain || zk > 1.3 || isHovered) {
          const label = isMain ? node.name : (node.short || node.name);
          const fontSize = isMain ? 13 : 10;
          ctx!.font = `${isMain ? 600 : 400} ${fontSize}px var(--font-mono), JetBrains Mono, monospace`;
          ctx!.fillStyle = isHovered ? "#fff" : colors.text;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(label, node.x, node.y + size + (isMain ? 16 : 12));
        }
      }

      ctx!.restore();

      state.animFrame = requestAnimationFrame(() => {
        runPhysics();
        render();
      });
    };

    state.animFrame = requestAnimationFrame(() => {
      runPhysics();
      render();
    });

    // === EVENT HANDLERS ===
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - state.zoom.x * state.zoom.k) / state.zoom.k,
        y: (e.clientY - rect.top - state.zoom.y * state.zoom.k) / state.zoom.k,
      };
    };

    const findNodeAt = (mx: number, my: number) => {
      for (let i = state.nodes.length - 1; i >= 0; i--) {
        const node = state.nodes[i];
        const size = node.level === "main" ? 20 : 12;
        const dx = mx - node.x;
        const dy = my - node.y;
        if (dx * dx + dy * dy < size * size) return node;
      }
      return null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getMousePos(e);
      const node = findNodeAt(pos.x, pos.y);
      if (node) {
        state.dragNode = node;
        state.mouse = pos;
        state.hasDragged = false;
        canvas!.style.cursor = "grabbing";
      } else {
        state.isPanning = true;
        state.panStart = { x: e.clientX, y: e.clientY };
        state.panOffset = { x: state.zoom.x, y: state.zoom.y };
        state.hasDragged = false;
        canvas!.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      if (state.dragNode) {
        state.hasDragged = true;
        const dx = pos.x - state.mouse.x;
        const dy = pos.y - state.mouse.y;
        const dragNode = state.dragNode;
        dragNode.x += dx;
        dragNode.y += dy;
        dragNode.vx = 0;
        dragNode.vy = 0;

        // Move connected sub-nodes with main node
        if (dragNode.level === "main") {
          for (const link of state.links) {
            const connectedId = link.source === dragNode.id ? link.target : 
                               link.target === dragNode.id ? link.source : null;
            if (connectedId) {
              const connected = state.nodeMap.get(connectedId);
              if (connected && connected.level === "sub") {
                connected.x += dx;
                connected.y += dy;
                connected.vx = 0;
                connected.vy = 0;
              }
            }
          }
        }

        state.mouse = pos;
      } else if (state.isPanning) {
        state.hasDragged = true;
        const dx = (e.clientX - state.panStart.x) / state.zoom.k;
        const dy = (e.clientY - state.panStart.y) / state.zoom.k;
        state.zoom.x = state.panOffset.x + dx;
        state.zoom.y = state.panOffset.y + dy;
      } else {
        const node = findNodeAt(pos.x, pos.y);
        state.hoveredNode = node;
        canvas!.style.cursor = node ? "pointer" : "default";
      }
    };

    const handleMouseUp = () => {
      state.dragNode = null;
      state.isPanning = false;
      canvas!.style.cursor = "default";
    };

    const handleClick = (e: MouseEvent) => {
      if (state.hasDragged) return;
      const pos = getMousePos(e);
      const node = findNodeAt(pos.x, pos.y);
      if (node && node.level === "sub") {
        router.push(`/content/${node.id}`);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.85 : 1.15;
      const rect = canvas!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const oldK = state.zoom.k;
      const newK = Math.max(0.3, Math.min(4, oldK * delta));
      const scale = newK / oldK;
      state.zoom.x = mouseX / newK - (mouseX / oldK - state.zoom.x) * scale;
      state.zoom.y = mouseY / newK - (mouseY / oldK - state.zoom.y) * scale;
      state.zoom.k = newK;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(state.animFrame);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [initLayout, router]);

  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "24px" }}
          >
            <span className="font-mono text-[11px] tracking-[0.15em] block mb-3" style={{ color: "#8052ff" }}>
              02 — KNOWLEDGE GRAPH
            </span>
            <h1 className="font-primary text-[32px] font-bold text-[#F3F3F3] mb-2">
              THE BRAIN
            </h1>
            <p className="font-mono text-[14px]" style={{ color: "#858585" }}>
              Drag to move · Scroll to zoom · Click to open
            </p>
          </motion.div>

          <div
            ref={containerRef}
            className="relative"
            style={{
              height: "calc(100vh - 220px)",
              minHeight: "400px",
              maxHeight: "800px",
              background: "var(--color-deep-space)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
            }}
          >
            <canvas ref={canvasRef} className="w-full h-full" style={{ cursor: "default" }} />

            <div className="absolute bottom-4 left-4 flex items-center gap-4 p-3 rounded-lg"
              style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(10px)" }}
            >
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: val.border }} />
                  <span className="font-mono text-[11px] capitalize" style={{ color: "#858585" }}>
                    {key}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg" style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#858585",
              }}>
                SCROLL TO ZOOM
              </div>
              <div className="px-3 py-1.5 rounded-lg" style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#858585",
              }}>
                DRAG NODES OR CANVAS
              </div>
            </div>
          </div>
        </div>
      </main>
    </DiscordGate>
  );
}
