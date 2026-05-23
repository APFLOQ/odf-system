"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { courseContent } from "@/data/courseContent";
import DiscordGate from "@/app/components/DiscordGate";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Module {
  id: string;
  title: string;
  subtitle?: string;
  topics: {
    id: string;
    title: string;
    content?: string;
  }[];
}

interface Phase {
  id: string;
  num: string;
  name: string;
  description: string;
  color: string;
  category: "foundation" | "structure" | "advanced" | "applications";
  modules?: Module[];
}

const phases: Phase[] = [
  { id: "00", num: "00", name: "Plan de estudio", description: "Secuencia óptima de aprendizaje", color: "#8052ff", category: "foundation" },
  { id: "01", num: "01", name: "Bases estadísticas", description: "El lenguaje matemático detrás de todo", color: "#06b6d4", category: "foundation" },
  { id: "02", num: "02", name: "Regime Switching", description: "Hamilton (1989) y su familia extendida", color: "#ffb829", category: "foundation" },
  { id: "03", num: "03", name: "Hidden Markov Models", description: "El framework probabilístico para regímenes latentes", color: "#15846e", category: "structure" },
  { id: "04", num: "04", name: "Volatility Regimes", description: "La dimensión más crítica para trading", color: "#8052ff", category: "structure" },
  { id: "05", num: "05", name: "Order Flow Regimes", description: "Regímenes a nivel de trades y DOM", color: "#06b6d4", category: "structure" },
  { id: "06", num: "06", name: "Correlation Regimes", description: "Cuando todo se mueve juntos (o no)", color: "#ffb829", category: "structure" },
  { id: "07", num: "07", name: "Machine Learning", description: "Más allá de los modelos paramétricos", color: "#15846e", category: "advanced" },
  { id: "08", num: "08", name: "Options Market Regimes", description: "El mercado de opciones como regime indicator", color: "#8052ff", category: "advanced" },
  { id: "09", num: "09", name: "Real-Time Detection", description: "Detección online sin look-ahead bias", color: "#06b6d4", category: "advanced" },
  { id: "10", num: "10", name: "Trading Applications", description: "De la teoría a la aplicación real", color: "#ffb829", category: "applications" },
  { id: "order-flow", num: "11", name: "Order Flow", description: "AMT, Volume Profile, Footprints, Delta, VWAP, DOM, Tape", color: "#15846e", category: "applications" },
  { id: "options-flow", num: "12", name: "Options Flow", description: "GEX, Dealer Hedging, Sweeps, Blocks, OPEX", color: "#8052ff", category: "applications" },
  { id: "macro", num: "13", name: "Macro", description: "Interest Rates, Treasury Yields, Inflation, FOMC, CPI, NFP", color: "#06b6d4", category: "applications" },
  { id: "microstructure", num: "14", name: "Microstructure", description: "Reading the Tape, Price Action, Candles, S/R", color: "#ffb829", category: "applications" },
  { id: "regimes", num: "15", name: "Market Regimes", description: "Long Gamma, Short Gamma, OpEx Pinning, QE", color: "#15846e", category: "applications" },
  { id: "risk-management", num: "16", name: "Risk Management", description: "Position Sizing, Kelly, Convexity, Drawdown", color: "#8052ff", category: "applications" },
  { id: "participants", num: "17", name: "Market Participants", description: "Dealers, HFTs, Institutions, Retail, Vol Target Funds", color: "#06b6d4", category: "applications" },
  { id: "quant", num: "18", name: "Quantitative Finance", description: "Black-Scholes, Dispersion, NDX vs SPX, Statistical Arb", color: "#ffb829", category: "applications" },
  { id: "volatility", num: "19", name: "Volatility", description: "VIX, IV Skew, IV Crush, Vol Regimes", color: "#15846e", category: "applications" },
  { id: "greeks", num: "20", name: "The Greeks", description: "Delta, Gamma, Theta, Vega", color: "#8052ff", category: "applications" },
  { id: "practice", num: "21", name: "Practice", description: "Top Tick, Bottom Tick, Pre-Session, Trade Invalidation", color: "#06b6d4", category: "applications" },
  { id: "lectures", num: "22", name: "Lectures", description: "L1 to L27 - All lectures", color: "#ffb829", category: "applications" },
];

const categoryColors: Record<string, string> = {
  foundation: "#8052ff",
  structure: "#06b6d4",
  advanced: "#ffb829",
  applications: "#15846e",
};

const examples: Record<string, { title: string; description: string }[]> = {
  "00": [
    { title: "Semana 1-2: Bases estadísticas", description: "Stationarity, tests de Chow, CUSUM, criterios de información (AIC/BIC/HQ)." },
    { title: "Semana 3-4: Hamilton Markov Switching", description: "Filtro de Hamilton, MS-VAR, MS-GARCH. Implementación en statsmodels." },
    { title: "Semana 5-6: Hidden Markov Models", description: "Baum-Welch, Viterbi, Gaussian HMM vs GMM-HMM. hmmlearn en Python." },
  ],
  "01": [
    { title: "PELT Algorithm", description: "Programación dinámica O(n) para detección de change points." },
    { title: "BOCPD (Bayesian Online)", description: "Detección en tiempo real sin look-ahead bias." },
    { title: "Criterios AIC/BIC", description: "Selección del número óptimo de regímenes." },
  ],
  "02": [
    { title: "Hamilton Filter", description: "Inferencia sobre estados latentes usando probabilidades filtradas." },
    { title: "Kim Smoother", description: "Probabilidades suavizadas usando toda la muestra." },
    { title: "Duration Analysis", description: "Calcular duración esperada: E[duración] = 1/(1-p_ii)." },
  ],
  "03": [
    { title: "Rabiner's Three Problems", description: "Evaluación, decodificación y entrenamiento de HMMs." },
    { title: "Baum-Welch Algorithm", description: "EM algorithm para estimar parámetros sin etiquetas." },
    { title: "Viterbi Path", description: "Secuencia más probable de estados ocultos." },
  ],
  "04": [
    { title: "HAR-RV Model", description: "Heterogeneous Autoregressive - captura multiscale vol." },
    { title: "VIX Term Structure", description: "Curva de volatilidad explícita para sentimiento." },
    { title: "GARCH Extensions", description: "Modelos asimétricos (EGARCH, TGARCH) para leverage effect." },
  ],
  "05": [
    { title: "PIN/VPIN Metrics", description: "Probability of Informed Trading, Volume-synchronized PIN." },
    { title: "DOM Analysis", description: "Depth of Market - absorption y exhaustion patterns." },
    { title: "Delta Divergence", description: "Price moves without confirming delta - early warning." },
  ],
  "06": [
    { title: "Dynamic Conditional Correlation", description: "DCC-GARCH para correlaciones tiempo-variante." },
    { title: "Correlation Breakdown", description: "Cuando las correlaciones fallan en stress." },
    { title: "Cross-Asset Regimes", description: "SPX, NDX, VIX, DXY - regímenes conjuntos." },
  ],
  "07": [
    { title: "Random Forest Regime Detection", description: "Feature engineering para clasificación de regímenes." },
    { title: "LSTM for Sequential Regimes", description: "Redes recurrentes para patrones temporales." },
    { title: "Clustering Unsupervised", description: "K-means, DBSCAN para descubrimiento de regímenes." },
  ],
  "08": [
    { title: "Gamma Exposure (GEX)", description: "Net gamma de dealers como indicador de régimen." },
    { title: "Dealer Hedging Flows", description: "Cómo el delta-hedging crea presión de precio." },
    { title: "OPEX Pinning", description: "Efecto de vencimiento en niveles de precio." },
  ],
  "09": [
    { title: "Online Change Point Detection", description: "Algoritmos en tiempo real sin look-ahead." },
    { title: "Sequential Probability Ratio", description: "SPRT para detección rápida de cambios." },
    { title: "Kalman Filter Regimes", description: "Filtro de Kalman para estados latentes online." },
  ],
  "10": [
    { title: "Regime-Based Position Sizing", description: "Ajustar tamaño según régimen detectado." },
    { title: "Volatility Targeting", description: "Target vol constante ajustando exposición." },
    { title: "Regime Switching Strategies", description: "Cambiar estrategia según régimen actual." },
  ],
  "order-flow": [
    { title: "AMT - Auction Market Theory", description: "Steidlmayer's framework: price discovery, value areas, market states." },
    { title: "Volume Profile", description: "HVN/LVN, POC, Value Area. Histograma de volumen por nivel." },
    { title: "Delta Divergence", description: "Price moves without confirming delta - early warning." },
    { title: "DOM Reading", description: "Stacked bids/asks reveals institutional footprints." },
  ],
  "options-flow": [
    { title: "GEX - Gamma Exposure", description: "Net gamma from dealer positioning. Key for vol regime detection." },
    { title: "Dealer Hedging", description: "How market makers delta-hedge creates price pressure." },
    { title: "Sweeps & Blocks", description: "Large single prints reveal institutional flow." },
  ],
  "macro": [
    { title: "Interest Rates", description: "Fed Funds, SOFR, yield curve dynamics." },
    { title: "FOMC Meetings", description: "Dot plot, press conferences, guidance shifts." },
    { title: "NFP/CPI Releases", description: "High-volatility events - regime transitions." },
  ],
  "microstructure": [
    { title: "Tape Reading", description: "Time & sales analysis, order flow toxicity." },
    { title: "Price Action", description: "Structure, liquidity zones, order block absorption." },
    { title: "Support/Resistance", description: "Historical congestion zones, smart money levels." },
  ],
  "regimes": [
    { title: "Long Gamma Regime", description: "Dealer long gamma = mean reversion, low vol." },
    { title: "Short Gamma Regime", description: "Dealer short gamma = trending, high vol." },
    { title: "OpEx Week Dynamics", description: "Pinning, gamma flips, positioning shifts." },
  ],
  "risk-management": [
    { title: "Kelly Criterion", description: "Optimal bet sizing based on edge and odds." },
    { title: "Convexity Trading", description: "Asymmetric risk/reward structures." },
    { title: "Drawdown Control", description: "Maximum drawdown limits and recovery protocols." },
  ],
  "participants": [
    { title: "Market Makers", description: "Obligations, hedging behavior, inventory management." },
    { title: "HFTs", description: "Latency arbitrage, market making, statistical arbitrage." },
    { title: "Institutions", description: "Block trades, dark pools, algorithmic execution." },
  ],
  "quant": [
    { title: "Black-Scholes Model", description: "Options pricing, implied volatility, Greeks." },
    { title: "Dispersion Trading", description: "Index vs component volatility arbitrage." },
    { title: "Statistical Arbitrage", description: "Pairs trading, cointegration, mean reversion." },
  ],
  "volatility": [
    { title: "VIX Index", description: "CBOE Volatility Index, fear gauge, term structure." },
    { title: "IV Skew", description: "Implied volatility smile/skew, risk reversals." },
    { title: "IV Crush", description: "Post-event volatility collapse, earnings, FOMC." },
  ],
  "greeks": [
    { title: "Delta", description: "Price sensitivity, directional exposure, hedging ratio." },
    { title: "Gamma", description: "Delta sensitivity, convexity, acceleration." },
    { title: "Theta", description: "Time decay, premium erosion, calendar spreads." },
    { title: "Vega", description: "Volatility sensitivity, vega exposure, vol trading." },
  ],
  "practice": [
    { title: "Top Tick / Bottom Tick", description: "Identifying extremes, rejection patterns." },
    { title: "Pre-Session Analysis", description: "Overnight ranges, gap analysis, opening drive." },
    { title: "Trade Invalidation", description: "When to exit, thesis broken, risk management." },
  ],
  "lectures": [
    { title: "L1-L10: Foundations", description: "Statistical bases, regime theory, HMMs." },
    { title: "L11-L20: Advanced", description: "Order flow, options, microstructure." },
    { title: "L21-L27: Applications", description: "Trading strategies, risk management, practice." },
  ],
};

function CategoryAnimation({ category }: { category: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animations: Record<string, (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void> = {
    foundation: (ctx, width, height, time) => {
      for (let i = 0; i < 30; i++) {
        const x = (Math.sin(time * 0.5 + i * 0.7) * 0.5 + 0.5) * width;
        const y = (Math.cos(time * 0.3 + i * 0.5) * 0.5 + 0.5) * height;
        const size = 2 + Math.sin(time + i) * 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 82, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }
    },
    structure: (ctx, width, height, time) => {
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const alpha = Math.sin(time * 0.5 + x * 0.02 + y * 0.02) * 0.15 + 0.15;
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    },
    advanced: (ctx, width, height, time) => {
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.02 + time) * 20 + Math.sin(x * 0.05 + time * 1.5) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255, 184, 41, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    applications: (ctx, width, height, time) => {
      const barCount = 8;
      const barWidth = width / barCount - 8;
      for (let i = 0; i < barCount; i++) {
        const barHeight = (Math.sin(time * 0.8 + i * 0.8) * 0.5 + 0.5) * height * 0.6;
        const x = i * (barWidth + 8) + 4;
        const y = height - barHeight;
        ctx.fillStyle = `rgba(21, 132, 110, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    },
  };

  const animate = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const anim = animations[category];
    if (anim) anim(ctx, width, height, time);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default function Dashboard() {
  const [activePhase, setActivePhase] = useState("00");
  const { progress, toggleComplete, isModuleCompleted } = useProgress();

  const totalModules = phases.length;
  const progressPercent = Math.round((progress.completedModules.length / totalModules) * 100);
  const phase = phases.find((p) => p.id === activePhase) || phases[0];
  const accent = categoryColors[phase.category] || "#8052ff";
  const categoryAccent = categoryColors[phase.category] || "#8052ff";

  const moduleExamples = examples[activePhase] || [];
  const moduleContent = courseContent[activePhase] || null;

  return (
    <DiscordGate>
      <main className="min-h-screen" style={{ background: "var(--color-midnight-void)" }}>
      <div style={{ position: "sticky", top: "64px", zIndex: 40, background: "var(--color-midnight-void)", borderBottom: "1px solid var(--color-border)", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1078px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="font-ui text-[13px]" style={{ color: "var(--color-ash-gray)" }}>Your Progress</span>
            <span className="font-ui text-[13px] font-medium" style={{ color: categoryAccent }}>{progressPercent}%</span>
          </div>
          <div style={{ height: "3px", background: "var(--color-deep-space)", borderRadius: "2px", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${categoryAccent}, var(--color-cyan))`, borderRadius: "2px" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
        <aside className="hidden lg:block" style={{ width: "280px", minHeight: "calc(100vh - 100px)", background: "var(--color-deep-space)", borderRight: "1px solid var(--color-border)", position: "sticky", top: "100px" }}>
          <div style={{ padding: "24px" }}>
            <h2 className="font-ui text-[12px] font-medium uppercase tracking-widest mb-6" style={{ color: "var(--color-ash-gray)" }}>
              Modules
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {phases.map((p) => {
                const isActive = p.id === activePhase;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => setActivePhase(p.id)}
                    whileHover={{ x: 4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      textAlign: "left",
                      background: isActive ? `${categoryColors[p.category]}15` : "transparent",
                      border: isActive ? `1px solid ${categoryColors[p.category]}40` : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span className="font-ui text-[11px] font-medium" style={{ color: categoryColors[p.category], minWidth: "20px" }}>
                      {p.num}
                    </span>
                    <span className="font-ui text-[13px]" style={{ color: isActive ? "white" : "var(--color-ash-gray)", lineHeight: 1.3 }}>
                      {p.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </aside>

        <div style={{ width: "100%", overflowX: "auto", padding: "16px" }} className="lg:hidden">
          <div style={{ display: "flex", gap: "8px", minWidth: "max-content" }}>
            {phases.map((p) => {
              const isActive = p.id === activePhase;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => setActivePhase(p.id)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "12px",
                    cursor: "pointer",
                    background: isActive ? `${categoryColors[p.category]}20` : "var(--color-deep-space)",
                    border: isActive ? `1px solid ${categoryColors[p.category]}50` : "1px solid var(--color-border)",
                    color: isActive ? categoryColors[p.category] : "var(--color-ash-gray)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {p.num}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, padding: "32px 40px" }}>
          <div style={{ maxWidth: "900px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span className="font-ui text-[12px]" style={{ color: categoryAccent }}>{phase.num}</span>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: categoryAccent }} />
                    <span className="font-ui text-[11px] uppercase tracking-wider" style={{ color: "var(--color-ash-gray)" }}>
                      {phase.category}
                    </span>
                  </div>
                  <h2 className="font-display text-[32px]" style={{ color: "var(--color-polar-white)", marginBottom: "8px" }}>
                    {phase.name}
                  </h2>
                  <p className="font-ui text-[16px]" style={{ color: "var(--color-ash-gray)", lineHeight: 1.4 }}>
                    {phase.description}
                  </p>
                </div>

                <div className="frosted-card" style={{ borderLeft: `3px solid ${categoryAccent}`, marginBottom: "16px", position: "relative", overflow: "hidden" }}>
                  <CategoryAnimation category={phase.category} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span className="font-ui text-[36px] font-bold" style={{ color: categoryAccent }}>{phase.num}</span>
                        <div>
                          <h3 className="font-ui text-[18px] font-medium" style={{ color: "var(--color-polar-white)" }}>{phase.name}</h3>
                          {moduleContent && (
                            <span className="font-ui text-[12px]" style={{ color: "var(--color-ash-gray)" }}>
                              {moduleContent.modules?.[0]?.topics?.length || moduleExamples.length} topics
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleComplete(phase.id)}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "2px solid",
                          borderColor: isModuleCompleted(phase.id) ? categoryAccent : "var(--color-border)",
                          background: isModuleCompleted(phase.id) ? categoryAccent : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isModuleCompleted(phase.id) && (
                          <svg style={{ width: "16px", height: "16px", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </motion.button>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h4 className="font-ui text-[14px] font-medium" style={{ color: "var(--color-polar-white)" }}>Examples</h4>
                        <span className="font-ui text-[12px]" style={{ color: "var(--color-ash-gray)" }}>{moduleExamples.length} examples</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {moduleExamples.map((example, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 4, borderColor: `${categoryAccent}40` }}
                            className="frosted-card"
                            style={{
                              padding: "16px 20px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <h5 className="font-ui text-[14px] font-medium text-white mb-2">{example.title}</h5>
                            <p className="font-ui text-[13px]" style={{ color: "var(--color-ash-gray)", lineHeight: 1.5 }}>{example.description}</p>
                          </motion.div>
                        ))}

                        {moduleExamples.length === 0 && (
                          <div className="frosted-card" style={{ padding: "24px", textAlign: "center" }}>
                            <p className="font-ui text-[14px]" style={{ color: "var(--color-ash-gray)" }}>No examples available for this module yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/module/${activePhase}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "24px",
                        fontFamily: "var(--font-ui)",
                        fontSize: "14px",
                        color: categoryAccent,
                        transition: "all 0.2s ease",
                      }}
                    >
                      Open Module
                      <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {moduleContent && moduleContent.description && (
                  <div className="frosted-card" style={{ marginTop: "16px" }}>
                    <h4 className="font-ui text-[14px] font-medium mb-4" style={{ color: "var(--color-polar-white)" }}>About this module</h4>
                    <p className="font-ui text-[14px]" style={{ color: "var(--color-ash-gray)", lineHeight: 1.6 }}>{moduleContent.description}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "var(--color-deep-space)", borderTop: "1px solid var(--color-border)", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1078px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span className="font-ui text-[24px] font-bold" style={{ color: "var(--color-polar-white)" }}>{progress.completedModules.length}</span>
            <span className="font-ui text-[14px]" style={{ color: "var(--color-ash-gray)" }}>/ {totalModules} completed</span>
          </div>
        </div>
      </div>
    </main>
    </DiscordGate>
  );
}
