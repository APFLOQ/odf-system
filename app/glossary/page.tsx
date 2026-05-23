"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DiscordGate from "@/app/components/DiscordGate";

const glossaryTerms = [
  { letter: "A", terms: [
    { term: "adf-test", name: "ADF Test", desc: "Augmented Dickey-Fuller test - statistical test to determine if a time series is stationary or contains a unit root.", link: "/dashboard" },
    { term: "aic", name: "AIC", desc: "Akaike Information Criterion - model selection metric that balances model fit against complexity.", link: "/dashboard" },
    { term: "amihud", name: "Amihud Illiquidity", desc: "Measure of price impact from trading volume - ratio of absolute return to dollar volume.", link: "/content/order-flow" },
    { term: "arbitrage", name: "Arbitrage", desc: "Risk-free profit from price discrepancies across markets or instruments.", link: "/dashboard" },
    { term: "arr", name: "ARR", desc: "Absolute Return - total return on an investment ignoring benchmarks.", link: "/content/risk-management" },
  ]},
  { letter: "B", terms: [
    { term: "backward-induction", name: "Backward Induction", desc: "Dynamic programming method solving optimization problems by working backwards from final period.", link: "/dashboard" },
    { term: "bai-perron", name: "Bai-Perron Test", desc: "Test for multiple structural breaks in time series data.", link: "/dashboard" },
    { term: "baum-welch", name: "Baum-Welch Algorithm", desc: "EM algorithm for estimating parameters in Hidden Markov Models.", link: "/content/hmm" },
    { term: "bic", name: "BIC", desc: "Bayesian Information Criterion - model selection using penalty for complexity.", link: "/dashboard" },
    { term: "bocpd", name: "BOCPD", desc: "Bayesian Online Changepoint Detection - algorithm for detecting regime changes in real-time.", link: "/content/change-point" },
    { term: "bollinger-bands", name: "Bollinger Bands", desc: "Volatility bands placed above and below a moving average.", link: "/dashboard" },
  ]},
  { letter: "C", terms: [
    { term: "change-point", name: "Change Point", desc: "Point in time where statistical properties of a time series change significantly.", link: "/content/change-point" },
    { term: "chow-test", name: "Chow Test", desc: "Statistical test for structural breaks at a known point in time.", link: "/dashboard" },
    { term: "clustering", name: "Clustering", desc: "Unsupervised machine learning method to group similar observations.", link: "/content/machine-learning" },
    { term: "coint", name: "Cointegration", desc: "Statistical property where non-stationary series have a long-run equilibrium relationship.", link: "/dashboard" },
    { term: "copula", name: "Copula", desc: "Mathematical function for modeling dependence structure between random variables.", link: "/content/correlation" },
    { term: "cusum", name: "CUSUM", desc: "Cumulative Sum test for detecting shifts in mean of a process.", link: "/dashboard" },
  ]},
  { letter: "D", terms: [
    { term: "dcc-garch", name: "DCC-GARCH", desc: "Dynamic Conditional Correlation GARCH - model for time-varying correlations between assets.", link: "/content/correlation" },
    { term: "delta", name: "Delta", desc: "Rate of change of option price with respect to underlying price.", link: "/content/greeks" },
    { term: "delta-gamma", name: "Delta-Gamma", desc: "Option pricing method approximating price changes using first and second derivatives.", link: "/content/greeks" },
    { term: "dispersion", name: "Dispersion Trading", desc: "Strategy trading the spread between index implied volatility and constituent implied volatilities.", link: "/content/volatility" },
    { term: "drawdown", name: "Drawdown", desc: "Peak-to-trough decline in portfolio or account value.", link: "/content/risk-management" },
    { term: "dom", name: "DOM", desc: "Depth of Market - visualization of limit order book showing bid/ask sizes.", link: "/content/order-flow" },
  ]},
  { letter: "E", terms: [
    { term: "em-algorithm", name: "EM Algorithm", desc: "Expectation-Maximization - iterative method for finding maximum likelihood estimates.", link: "/content/hmm" },
    { term: "ewma", name: "EWMA", desc: "Exponentially Weighted Moving Average - method for smoothing time series with decaying weights.", link: "/content/volatility" },
  ]},
  { letter: "F", terms: [
    { term: "factor-model", name: "Factor Model", desc: "Statistical model explaining returns through exposure to underlying risk factors.", link: "/dashboard" },
    { term: "filter", name: "Filter Rules", desc: "Trading strategy based on price momentum signals.", link: "/dashboard" },
    { term: "footprint", name: "Footprint Chart", desc: "Volume-at-price visualization showing buying and selling activity at each price level.", link: "/content/order-flow" },
  ]},
  { letter: "G", terms: [
    { term: "gamma", name: "Gamma", desc: "Rate of change of delta with respect to underlying price - convexity of option.", link: "/content/greeks" },
    { term: "gamma-scalp", name: "Gamma Scalping", desc: "Strategy of dynamically hedging delta exposure to profit from time decay.", link: "/content/greeks" },
    { term: "garch", name: "GARCH", desc: "Generalized Autoregressive Conditional Heteroskedasticity - model for time-varying volatility.", link: "/content/volatility" },
    { term: "gex", name: "GEX", desc: "Gamma Exposure - aggregate gamma of all options in the market indicating dealer positioning.", link: "/content/options-flow" },
    { term: "greeks", name: "The Greeks", desc: "Sensitivity measures (Delta, Gamma, Theta, Vega, Rho) quantifying option price risk.", link: "/content/greeks" },
  ]},
  { letter: "H", terms: [
    { term: "har", name: "HAR", desc: "Heterogeneous Autoregressive - model capturing volatility at different time horizons (day, week, month).", link: "/content/volatility" },
    { term: "hmm", name: "Hidden Markov Model", desc: "Stochastic model where system transitions between hidden states generating observable outputs.", link: "/content/hmm" },
    { term: "hedge-ratio", name: "Hedge Ratio", desc: "Ratio of option delta to underlying position needed for delta neutrality.", link: "/content/greeks" },
  ]},
  { letter: "I", terms: [
    { term: "imbalance", name: "Order Flow Imbalance", desc: "Net buying or selling pressure calculated from order book dynamics.", link: "/content/order-flow" },
    { term: "irs", name: "Implied Rolling Straddle", desc: "Options strategy exploiting term structure of implied volatility.", link: "/content/volatility" },
    { term: "iv", name: "Implied Volatility", desc: "Volatility parameter making theoretical option price equal to market price.", link: "/content/volatility" },
    { term: "iv-rank", name: "IV Rank", desc: "Current implied volatility relative to historical range.", link: "/content/volatility" },
  ]},
  { letter: "K", terms: [
    { term: "kelly", name: "Kelly Criterion", desc: "Position sizing formula maximizing logarithmic utility of expected growth.", link: "/content/risk-management" },
    { term: "keltner", name: "Keltner Channel", desc: "Volatility-based channel using ATR for band construction.", link: "/dashboard" },
    { term: "kmeans", name: "K-Means", desc: "Clustering algorithm partitioning data into K distinct groups.", link: "/content/machine-learning" },
  ]},
  { letter: "L", terms: [
    { term: "long-gamma", name: "Long Gamma", desc: "Position where gamma is positive - benefits from volatility and time to resolution.", link: "/content/regimes" },
    { term: "lppl", name: "LPPL", desc: "Log-Periodic Power Law - model for bubble dynamics and crash prediction.", link: "/dashboard" },
  ]},
  { letter: "M", terms: [
    { term: "markov-chain", name: "Markov Chain", desc: "Stochastic process where future state depends only on current state (memoryless).", link: "/content/markov" },
    { term: "markov-switching", name: "Markov Switching", desc: "Time series model where parameters switch according to hidden Markov process.", link: "/content/markov" },
    { term: "max-drawdown", name: "Max Drawdown", desc: "Largest peak-to-trough decline in portfolio history.", link: "/content/risk-management" },
    { term: "mean-reversion", name: "Mean Reversion", desc: "Statistical property where prices tend to return to long-term average.", link: "/dashboard" },
    { term: "momentum", name: "Momentum", desc: "Tendency of prices to continue moving in same direction.", link: "/dashboard" },
  ]},
  { letter: "N", terms: [
    { term: "nfp", name: "NFP", desc: "Non-Farm Payrolls - US employment data release causing high volatility.", link: "/content/macro" },
    { term: "normalizer", name: "Normalizer", desc: "Technique for transforming data to have zero mean and unit variance.", link: "/dashboard" },
  ]},
  { letter: "O", terms: [
    { term: "opex", name: "OpEx", desc: "Options Expiration - Friday when options contracts expire.", link: "/content/options-flow" },
    { term: "order-flow", name: "Order Flow", desc: "Analysis of incoming market orders to understand supply/demand dynamics.", link: "/content/order-flow" },
  ]},
  { letter: "P", terms: [
    { term: "pelt", name: "PELT", desc: "Pruned Exact Linear Time - efficient algorithm for change point detection.", link: "/content/change-point" },
    { term: "pin", name: "PIN", desc: "Probability of Informed Trading - measure of information asymmetry in markets.", link: "/content/microstructure" },
    { term: "pnl", name: "PnL", desc: "Profit and Loss - financial result of trading activity.", link: "/dashboard" },
    { term: "portfolio-construction", name: "Portfolio Construction", desc: "Process of selecting and weighting assets to achieve return objectives.", link: "/content/risk-management" },
    { term: "price-action", name: "Price Action", desc: "Analysis of price movements without indicators.", link: "/content/microstructure" },
  ]},
  { letter: "R", terms: [
    { term: "regime", name: "Market Regime", desc: "Distinct market state characterized by specific statistical properties (trending, ranging, high/low vol).", link: "/content/regimes" },
    { term: "regime-switching", name: "Regime Switching", desc: "Model where underlying parameters change based on hidden state transitions.", link: "/content/markov" },
    { term: "regression", name: "Regression", desc: "Statistical method for modeling relationship between variables.", link: "/dashboard" },
    { term: "rho", name: "Rho", desc: "Sensitivity of option price to interest rate changes.", link: "/content/greeks" },
    { term: "risk-parity", name: "Risk Parity", desc: "Portfolio allocation strategy equalizing risk contribution from each asset.", link: "/content/risk-management" },
    { term: "roll-yield", name: "Roll Yield", desc: "Return from rolling futures contracts when term structure is contango/backwardation.", link: "/content/volatility" },
  ]},
  { letter: "S", terms: [
    { term: "sar", name: "SAR", desc: "Stop and Reverse - trading system that reverses position on stop triggers.", link: "/dashboard" },
    { term: "sharpe", name: "Sharpe Ratio", desc: "Risk-adjusted return metric: (Return - Risk-free) / Standard Deviation.", link: "/content/risk-management" },
    { term: "short-gamma", name: "Short Gamma", desc: "Position where gamma is negative - benefits from time decay and low vol.", link: "/content/regimes" },
    { term: "sortino", name: "Sortino Ratio", desc: "Risk-adjusted return using downside deviation instead of total volatility.", link: "/content/risk-management" },
    { term: "smoothing", name: "Smoothing", desc: "Technique for reducing noise in time series data.", link: "/dashboard" },
    { term: "sprt", name: "SPRT", desc: "Sequential Probability Ratio Test - method for quickest detection of regime change.", link: "/content/change-point" },
    { term: "stochastic-vol", name: "Stochastic Volatility", desc: "Model where volatility follows its own random process.", link: "/content/volatility" },
    { term: "structural-break", name: "Structural Break", desc: "Point where time series properties change significantly.", link: "/dashboard" },
    { term: "support-resistance", name: "Support & Resistance", desc: "Price levels where buying/selling pressure historically reverses.", link: "/content/microstructure" },
  ]},
  { letter: "T", terms: [
    { term: "tape", name: "Tape", desc: "Time and Sales - record of all trades with size and time.", link: "/content/order-flow" },
    { term: "theta", name: "Theta", desc: "Time decay - rate of change of option price with respect to time.", link: "/content/greeks" },
    { term: "tick", name: "Tick", desc: "Smallest price movement in a market.", link: "/content/microstructure" },
    { term: "transaction-costs", name: "Transaction Costs", desc: "Fees and slippage incurred when executing trades.", link: "/content/risk-management" },
  ]},
  { letter: "V", terms: [
    { term: "vega", name: "Vega", desc: "Sensitivity of option price to changes in implied volatility.", link: "/content/greeks" },
    { term: "vix", name: "VIX", desc: "CBOE Volatility Index - measure of 30-day implied volatility of S&P 500.", link: "/content/volatility" },
    { term: "vol-regime", name: "Volatility Regime", desc: "Market state characterized by high or low volatility levels.", link: "/content/volatility" },
    { term: "vol-surface", name: "Vol Surface", desc: "3D visualization of implied volatility across strikes and expirations.", link: "/content/volatility" },
    { term: "volume-profile", name: "Volume Profile", desc: "Distribution of trading volume across price levels.", link: "/content/order-flow" },
    { term: "vpin", name: "VPIN", desc: "Volume-synchronized Probability of Informed Trading - volume-based PIN measure.", link: "/content/microstructure" },
    { term: "vwap", name: "VWAP", desc: "Volume Weighted Average Price - benchmark for execution quality.", link: "/content/order-flow" },
    { term: "viterbi", name: "Viterbi Algorithm", desc: "Dynamic programming algorithm for finding most likely state sequence in HMM.", link: "/content/hmm" },
  ]},
  { letter: "W", terms: [
    { term: "wbs", name: "WBS", desc: "Wild Binary Segmentation - method for detecting multiple change points.", link: "/content/change-point" },
    { term: "win-rate", name: "Win Rate", desc: "Percentage of profitable trades to total trades.", link: "/content/risk-management" },
  ]},
  { letter: "Y", terms: [
    { term: "yield-curve", name: "Yield Curve", desc: "Relationship between interest rates and maturity dates.", link: "/content/macro" },
  ]},
];

export default function Glossary() {
  const [activeLetter, setActiveLetter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const letters = ["all", ...glossaryTerms.map(g => g.letter)];

  const filteredTerms = glossaryTerms.map(group => ({
    ...group,
    terms: group.terms.filter(t => 
      (activeLetter === "all" || group.letter === activeLetter) &&
      (searchTerm === "" || t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
       t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(g => g.terms.length > 0);

  return (
    <DiscordGate>
      <main className="min-h-screen py-12 px-6" style={{ background: "var(--color-midnight-void)" }}>
        <div className="max-w-[1432px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="font-ui text-[12px] tracking-[0.15em] block mb-4" style={{ color: "var(--color-violet)" }}>
              03 - Glossary
            </span>
            <h1 className="font-display text-[40px] mb-4" style={{ color: "var(--color-frost-white)" }}>
              Terms & Concepts
            </h1>
            <p className="font-ui text-[16px] max-w-[600px]" style={{ color: "var(--color-whisper-gray)" }}>
              Complete index of terms and concepts in regime analysis, trading, and market microstructure.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            {letters.map((letter, idx) => (
              <motion.button
                key={letter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setActiveLetter(letter)}
                className="px-4 py-2.5 rounded-full font-ui text-[13px] transition-all duration-300"
                style={{
                  background: activeLetter === letter ? "var(--color-violet)" : "var(--color-deep-space)",
                  color: activeLetter === letter ? "white" : "var(--color-whisper-gray)",
                  border: `1px solid ${activeLetter === letter ? "var(--color-violet)" : "var(--color-border)"}`,
                }}
              >
                {letter === "all" ? "All" : letter}
              </motion.button>
            ))}

            <div className="relative flex-1 min-w-[200px] max-w-[300px] ml-auto">
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-full font-ui text-[14px] transition-all duration-200"
                style={{
                  background: "var(--color-deep-space)",
                  color: "var(--color-frost-white)",
                  border: "1px solid var(--color-border)",
                  outline: "none",
                }}
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-whisper-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeLetter}-${searchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-12"
            >
              {filteredTerms.map((group, gIdx) => (
                <motion.div
                  key={group.letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gIdx * 0.1 }}
                >
                  <h2 className="font-ui text-[32px] font-bold mb-6 pb-4 border-b" style={{ color: "var(--color-violet)", borderColor: "var(--color-border)" }}>
                    {group.letter}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.terms.map((term, tIdx) => (
                      <motion.div
                        key={term.term}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (gIdx * group.terms.length + tIdx) * 0.02 }}
                      >
                        <Link
                          href={term.link || "#"}
                          className="block p-6 rounded-[10px] transition-all duration-300 group h-full"
                          style={{ background: "var(--color-deep-space)", border: "1px solid var(--color-border)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-violet)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                          <h3 className="font-ui text-[16px] font-medium mb-2 transition-colors duration-200" style={{ color: "var(--color-frost-white)" }}>
                            {term.name}
                          </h3>
                          <p className="font-ui text-[13px] leading-relaxed" style={{ color: "var(--color-whisper-gray)" }}>
                            {term.desc}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredTerms.length === 0 && (
            <div className="text-center py-20">
              <p className="font-ui text-[16px]" style={{ color: "var(--color-whisper-gray)" }}>
                No terms found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </DiscordGate>
  );
}