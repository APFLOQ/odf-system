"use client";

import dynamic from "next/dynamic";

const LimitOrderBookDiagram = dynamic(() => import("./LimitOrderBookDiagram"), { ssr: false });
const GEXDiagram = dynamic(() => import("./GEXDiagram"), { ssr: false });
const GEXDecisionFlowchart = dynamic(() => import("./GEXDecisionFlowchart"), { ssr: false });
const KellySimulator = dynamic(() => import("./KellySimulator"), { ssr: false });
const MarketParticipantsHierarchy = dynamic(() => import("./MarketParticipantsHierarchy"), { ssr: false });
const MacroEventTimeline = dynamic(() => import("./MacroEventTimeline"), { ssr: false });
const YieldCurveDiagram = dynamic(() => import("./YieldCurveDiagram"), { ssr: false });
const GreeksDiagram = dynamic(() => import("./GreeksDiagram"), { ssr: false });
const FootprintHeatmap = dynamic(() => import("./FootprintHeatmap"), { ssr: false });
const CorrelationMatrix = dynamic(() => import("./CorrelationMatrix"), { ssr: false });
const SetupChecklist = dynamic(() => import("./SetupChecklist"), { ssr: false });
const NormalDistribution = dynamic(() => import("./NormalDistribution"), { ssr: false });
const DrawdownCurve = dynamic(() => import("./DrawdownCurve"), { ssr: false });

interface TopicVisualsProps {
  topicId: string;
  title: string;
  category: string;
}

export default function TopicVisuals({ topicId, title, category }: TopicVisualsProps) {
  const lowerTitle = title.toLowerCase();
  const lowerId = topicId.toLowerCase();

  // ===== ORDERFLOW =====
  if (category === "orderflow") {
    if (lowerTitle.includes("dom") || lowerTitle.includes("limit order") || lowerTitle.includes("microstructure") || lowerTitle.includes("order book")) {
      return <LimitOrderBookDiagram />;
    }
    if (lowerTitle.includes("footprint") || lowerTitle.includes("heatmap") || lowerTitle.includes("bid-ask")) {
      return <FootprintHeatmap />;
    }
  }

  // ===== OPTIONS =====
  if (category === "options") {
    if (lowerTitle.includes("gex") || lowerTitle.includes("gamma exposure")) {
      return <GEXDiagram />;
    }
    if (lowerTitle.includes("greek") || lowerTitle.includes("delta") || lowerTitle.includes("theta") || lowerTitle.includes("vega")) {
      return <GreeksDiagram />;
    }
    if (lowerTitle.includes("dealer hedging") || lowerTitle.includes("strategy") || lowerTitle.includes("regime")) {
      return <GEXDecisionFlowchart />;
    }
  }

  // ===== RISK =====
  if (category === "risk") {
    if (lowerTitle.includes("kelly") || lowerTitle.includes("position sizing")) {
      return <KellySimulator />;
    }
    if (lowerTitle.includes("drawdown") || lowerTitle.includes("equity")) {
      return <DrawdownCurve />;
    }
  }

  // ===== PARTICIPANTS =====
  if (category === "participants") {
    return <MarketParticipantsHierarchy />;
  }

  // ===== MACRO =====
  if (category === "macro") {
    if (lowerTitle.includes("catalyst") || lowerTitle.includes("calendar") || lowerTitle.includes("nfp") || lowerTitle.includes("fomc")) {
      return <MacroEventTimeline />;
    }
    if (lowerTitle.includes("yield") || lowerTitle.includes("rates") || lowerTitle.includes("treasury")) {
      return <YieldCurveDiagram />;
    }
  }

  // ===== QUANT =====
  if (category === "quant") {
    if (lowerTitle.includes("distribution") || lowerTitle.includes("statistical") || lowerTitle.includes("normal")) {
      return <NormalDistribution />;
    }
    if (lowerTitle.includes("correlation") || lowerTitle.includes("dispersion")) {
      return <CorrelationMatrix />;
    }
  }

  // ===== TRADING STRATEGY =====
  if (category === "trading-strategy") {
    if (lowerTitle.includes("checklist") || lowerTitle.includes("setup") || lowerTitle.includes("pre-session")) {
      return <SetupChecklist />;
    }
  }

  // ===== FOUNDATIONS =====
  if (category === "foundations") {
    if (lowerTitle.includes("market structure") || lowerTitle.includes("futures")) {
      return <MarketParticipantsHierarchy />;
    }
  }

  // Default: try to match by title keywords across all categories
  if (lowerTitle.includes("dom") || lowerTitle.includes("order book")) return <LimitOrderBookDiagram />;
  if (lowerTitle.includes("gex") || lowerTitle.includes("gamma")) return <GEXDiagram />;
  if (lowerTitle.includes("kelly") || lowerTitle.includes("sizing")) return <KellySimulator />;
  if (lowerTitle.includes("participant") || lowerTitle.includes("dealer") || lowerTitle.includes("hft")) return <MarketParticipantsHierarchy />;
  if (lowerTitle.includes("catalyst") || lowerTitle.includes("calendar")) return <MacroEventTimeline />;
  if (lowerTitle.includes("yield") || lowerTitle.includes("rates")) return <YieldCurveDiagram />;
  if (lowerTitle.includes("greek")) return <GreeksDiagram />;
  if (lowerTitle.includes("footprint")) return <FootprintHeatmap />;
  if (lowerTitle.includes("correlation")) return <CorrelationMatrix />;
  if (lowerTitle.includes("checklist") || lowerTitle.includes("setup")) return <SetupChecklist />;
  if (lowerTitle.includes("distribution") || lowerTitle.includes("statistics")) return <NormalDistribution />;
  if (lowerTitle.includes("drawdown")) return <DrawdownCurve />;

  return null;
}
