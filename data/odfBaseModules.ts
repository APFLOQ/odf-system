export const orderFlowModules = {
  "order-flow": {
    title: "Order Flow — Microstructure and Tape Reading",
    phase: "Module 11 — Order Flow",
    topics: [
      {
        title: "AMT — Auction Market Theory",
        tag: "core",
        content: `Auction Market Theory

"Markets are continuous two-way auctions. Their sole purpose is to facilitate trade and discover fair value."
Source: Steidlmayer (CBOT, 1980s)

---

What AMT Is

Auction Market Theory treats financial markets as continuous two-way auctions where price moves by the constant negotiation of buyers and sellers. The market has two core objectives:

1. Facilitate trade — bring buyers and sellers together
2. Seek fair price — find the level where buyers and sellers are in relative agreement

AMT was developed by J. Peter Steidlmayer at the Chicago Board of Trade in the early 1980s. He introduced Market Profile as its visual expression.

Key distinction: Value (where most trading occurs, where buyers and sellers agree) is separate from Price (the current advertised level). Prices away from value are "unfair" until supply or demand brings the market to a new balance.

---

The Three Variables

Variable | What It Measures
---|---
Price | Where the market is advertising
Time | How long price spends at each level (acceptance vs. rejection)
Volume | Amount of participation at each level

These three together reveal where the market found consensus (value) and where it rejected prices (imbalance).

---

Price vs Value — The Core Distinction

Price = current advertisement in the auction. Where the market is right now.

Value = the area where most trading occurs. Where buyers and sellers willingly transact. Associated with high volume nodes (HVNs), the Value Area (VA), and the Point of Control (POC).

The mechanism: When price moves away from value, it creates opportunity. Without a strong catalyst for a new trend, prices at "unfair" levels tend to revert back to the value area. This is the mechanical basis for mean-reversion trades.

---

Market States — Balance vs Imbalance

Balanced Market (Equilibrium):
- Price rotating in a range near fair value
- High volume at the value area (acceptance)
- No strong directional bias
- Bell-curve Market Profile shape
- Short-term traders dominate
- Strategy: mean reversion — fade extremes, target POC/VWAP

Imbalanced Market (Trending / Discovery):
- One side of the auction dominates
- Price "goes into discovery" seeking a new fair value
- Strong directional movement, price moves through levels quickly
- Low time spent at prices (single prints, tails)
- Often driven by "other time frame" (OTF) institutional participants
- Skewed or elongated Market Profile shape
- Strategy: trend following — trade pullbacks in direction of imbalance

Trading Strategy = f(Market State)
Balance → Mean reversion
Imbalance → Trend following

---

The Five AMT Trading Rules

Rule 1: If price re-enters a previous balance area, it often retests one edge then travels to the opposite edge (range rotation).

Rule 2: Once price is accepted beyond a balance, it will usually continue in that direction until meeting the next balance (often the prior POC).

Rule 3: Balanced conditions call for patience and fading extremes.

Rule 4: Trending conditions call for momentum trading aligned with the dominant side of the auction.

Rule 5: Avoid chasing "unfair" prices. Respond to how the market responds to value.

---

The Three AMT States (Practical Framework)

Jewraj's integration of AMT with volume profile identifies three live states:

1. Seeking Balance — Price is moving toward a balance area. In transit between zones of acceptance.
2. Accepting Balance — Price agrees with the current balance area. Two-sided trade is active.
3. Rejecting Balance — Price disagrees with the current balance area. Buyers and sellers think price should be elsewhere.

"When price tests a lower balance edge and then tests an upper balance edge and agrees with both extremes — we are now seeking balance at a different level."

---

Price Discovery Process

Price Discovery = Auction Process + Order Flow + New Information

The market constantly tests prices higher and lower until finding areas where:
- Buyers are willing to buy
- Sellers are willing to sell
- Both agree on fair value

Integration with microstructure: AMT aligns with academic concepts of continuous double auction markets, order flow dynamics, and liquidity provision and price discovery.

---

Participant Types in AMT Context

Short-term traders (locals): Take liquidity with aggressive market orders. Their trades cause imbalances. They represent the noise.

Long-term institutional players (OTF — Other Time Frame): Provide liquidity, shift price from imbalance to balance. Their actions define the real structural moves.

Understanding which type is in control predicts whether the market will continue rotating in a range or break into a directional trend.

---

Practical Implementation (5-Step Process)

1. Identify current market state (balanced or imbalanced)
2. Locate key auction levels (value area, POC, prior balance areas)
3. Wait for price to reach decision points (value extremes, breakout levels)
4. Confirm with orderflow (aggression, acceptance/rejection)
5. Enter with clear risk management (stops at acceptance/rejection levels)

---

Orderflow Confirmation Tools for AMT

Tool | What It Confirms
---|---
DOM | Liquidity at key levels
Tape | Market aggression (market orders hitting bids/offers)
Delta | Which side is in control
Tape speed | Fast = strong imbalance, Slow = balance`
      },
      {
        title: "Volume Profile",
        tag: "core",
        content: `Volume Profile

"Volume Profile is behavioral, not mechanical. HVNs represent zones of past agreement; LVNs represent zones of past disagreement or urgency."

---

The Purpose

Volume Profile is a participation and acceptance map. It is not support/resistance lines — it is a distribution showing where the auction conducted business and where it did not.

Volume at Price = Participation Fingerprint

The histogram reveals where the market accepted price (heavy trade = HVN) versus rejected it (quick movement = LVN).

---

How Volume Profiles Are Built

Three-step construction:
1. Choose a time window — single session, visible range, anchored range, or multiple sessions
2. Divide price range into rows (bins) — tick resolution or larger bin size
3. Sum executed volume → horizontal histogram showing volume distribution across price

Critical: Bin size matters. Too large → erases LVNs and blurs node chunks. Too fine → noisy. Start tick-level, incrementally increase to 2–4 tick bins.

---

Core Reference Levels

Level | Definition | Behavior
---|---|---
POC | Price with highest traded volume | Maximum acceptance, acts as magnet on future rotations
Value Area (VA) | Range containing 68% of total volume | Core acceptance zone, major trading activity
VAH | Value Area High — upper boundary | Key resistance when approached from below
VAL | Value Area Low — lower boundary | Key support when approached from above
Balance Extremes | Edges of large volume chunks | Where buyers/sellers think price is too high/too low

---

HVNs and LVNs — The Critical Distinction

High Volume Nodes (HVNs):
- Local peaks where volume is concentrated
- Represent acceptance and "fair value" zones
- Two-sided trade occurred here — order flow balanced
- Price slows or rotates when revisiting HVNs — they are memory points for participation
- Use: expect friction, possible mean-reversion

Low Volume Nodes (LVNs):
- Local valleys where relatively little volume traded
- Formed during rapid movement — "fast price"
- Represent rejection or unfair value zones
- Price traverses LVNs quickly — little resistance, gap-like behavior
- Use: expect fast moves through, treat as transition zones

---

Volume Profile Types

1. Session Profiles: Aggregates volume-at-price for a defined session. Critical: separate day session from overnight. Volume and transactions are dramatically higher during primary market hours. Lumping all hours together hides structure.

2. Visible-Range Profiles: Calculates over what's currently visible on chart. Dynamic — recalculates as you zoom/pan. Good for exploration, not for fixed reference.

3. Fixed-Range & Anchored Profiles: User-chosen time span — stable and controlled. Anchored version: start at a structural pivot or event (major swing low, FOMC announcement, contract roll), extend to present.

4. Split Profiles: Handles multi-distribution days — avoids forcing a single bell curve on a day with two distinct value areas. Essential for double-distribution days.

---

Balance Areas — The Most Important Concept

"Balance is the most important concept — more important than HVNs, VAH/VAL, or any other metric. Focus on the prominent chunks of all nodes and their edges."

Identifying Balance Areas: Look for prominent chunks of volume — areas where you can see clear boundaries defined by fat volume nodes on both sides.

Multi-horizon profile setup:
- 30-day: recent balance formation and current acceptance zones
- 84-day: slightly longer-term balance areas
- 180-day: major balance areas from the past half year
- 1-year: longest-term structural acceptance zones

Balance Edge Properties:
- Not precise to the tick — they represent a vicinity of a few points
- Price respects balance edges — reactions and rotations are common
- Can align with other structure features (gaps, key technical levels) → higher confluence
- Balance gives you levels AND context — both targets and directional framework

---

Volume Profile Strategies

Mean Reversion to VPOC:
Price has a probabilistic tendency to revert to the volume point of control:
P(reversion) = 1 − e^(−λ × |price − VPOC|)
Higher distance from VPOC = higher probability of reversion. Works best in balanced, rotational conditions.

LVN Breakout:
When price breaks through an LVN on strong volume and stacked imbalances → expect fast, gap-like move to the next HVN.

HVN Mean-Reversion:
Price entering an HVN → expect consolidation and rotation. Fade extremes within HVN, target POC.

---

Common Mistakes

1. Session-definition error — saying "today's profile" without specifying day-only vs full session. Non-negotiable: separate day session.
2. Row-size errors — using 4–8 tick bins hides LVNs. Start tick-level.
3. Misinterpreting buy/sell volume — TradingView uses candle direction (approximation), not true aggressor-side.
4. Overfitting "magnet" narratives — deterministic thinking. Use for hypothesis generation and risk framing, not certainty.

---

Complete Process

1. Run multiple volume profile timeframes (D1, W1, 30-day, 1-year)
2. Identify prominent balance areas (fronts of volume between nodes)
3. Mark the edges of those balances
4. Trade reactions at the edges
5. Use balance areas for directional context and targets
6. Integrate with key concepts (overlapping balances, identifying key balance)`
      },
      {
        title: "Profile Levels — POC, VAH, VAL, HVN, LVN",
        tag: "core",
        content: `Profile Levels — Core Reference Points

The language of volume and time distribution.

---

POC — Point of Control

The price level with the highest traded volume (Volume Profile) or most TPOs (Market Profile). Represents maximum acceptance — where the most business was conducted.

Properties:
- Acts as a magnet for price on future rotations
- Often becomes support in uptrends, resistance in downtrends
- Mean-reversion target from session extremes
- Naked POC (untested from prior session) = strong future S/R
- Developing POC shifts intra-session as price accepts new levels
- Migrating POC trends directionally — indicates conviction

---

VPOC — Volume Point of Control

The price with the absolute highest traded volume. Often used interchangeably with POC, but specifically refers to the volume-based calculation.

Properties:
- More significant than TPO-based POC for institutional reference
- Magnetic pull on price
- Naked VPOC from prior sessions = strong unfinished auction reference

---

Value Area High (VAH)

The upper boundary of the Value Area — the range containing 70% of traded volume. Represents the top of accepted fair value for the period.

Properties:
- Key resistance when approached from below
- When price is above VAH: trading at a premium — expect either acceptance (continuation) or rejection (reversion to VAH then POC)
- Entry for mean-reversion shorts in balanced conditions

---

Value Area Low (VAL)

The lower boundary of the Value Area. Represents the bottom of accepted fair value.

Properties:
- Key support when approached from above
- When price is below VAL: trading at a discount — expect either acceptance (continuation lower) or rejection (bounce to VAL then POC)
- Entry for mean-reversion longs in balanced conditions

---

High Volume Node (HVN)

A local peak in the volume profile where significant volume accumulated. Represents acceptance and fair value.

Properties:
- Two-sided trade occurred here — order flow balanced
- Price slows or rotates when revisiting HVNs (friction zone)
- Memory points for participation — institutions remember these levels
- Use: expect consolidation and mean-reversion around HVNs

---

Low Volume Node (LVN)

A local valley in the volume profile where minimal volume traded. Formed during rapid, directional movement.

Properties:
- Represents rejection or 'unfair value'
- Price traverses LVNs quickly — gap-like behaviour
- No support/resistance (by definition — nobody traded here)
- Whipsaw risk is high inside LVNs
- Use: expect fast moves through LVNs; LVN breakouts can be explosive

---

Single Prints and Tails

Price levels where only one TPO letter appears, indicating the market moved through so fast it never accepted price there.

Properties:
- 'Unfinished business' — price will typically return to fill them
- At profile extremes = tails = strong initiative activity
- Mark the edge of the auction
- Represent a known future magnet for price

Trading implication: Single prints at extremes are targets for mean-reversion trades from the other extreme.

---

Initial Balance (IB)

The price range established in the first hour (or first 2 TPO brackets) of the regular trading session.

Properties:
- Sets the daily context and tone
- Wide IB = strong directional flow, expect range extensions
- Narrow IB = uncertainty, balanced conditions likely
- IB boundaries often act as key intraday support/resistance

IB Extension Target:
Extension Target = IBhigh/low ± 2 × IBrange`
      },
      {
        title: "Footprint Chart",
        tag: "advanced",
        content: `Footprint Chart

"The footprint is the most powerful orderflow tool — and the most commonly misused."

---

What the Footprint Is

The footprint chart (also called "numbers bars" or "volumetric bars") is a structured view of the trade stream mapped onto price and time. It aggregates trades indexed by time and price level, with each trade attributed to either bid-side or ask-side execution.

Critical distinction: The footprint shows executed volume at each price level inside a bar. It is NOT showing resting orders in the book — it shows what actually traded.

Three dimensions revealed:
- Where (at what price)
- When (in which bar)
- Who was aggressive (buyer or seller)

---

Bid-Side vs Ask-Side

Side | Meaning | Who Was Aggressive
---|---|---
Ask-side volume (right/green) | Volume executed at the ask | Aggressive buyers — market buy orders that lifted offers
Bid-side volume (left/red) | Volume executed at the bid | Aggressive sellers — market sell orders that hit bids

Example: When "500" prints on the ask side at 6500.00, that means 500 contracts traded at 6500.00 where the buyer was the aggressor.

---

Trade Classification Quality

This is the most important technical fact about footprint charts. Classification quality directly affects signal reliability.

Case 1: Exchange-Provided Aggressor Flags (Best): CME Market-by-Order (MBO) feeds provide order-level detail. Bid/ask split is closest to ground-truth.

Case 2: Quote-Based Classification (Common): Compare trade price to contemporaneous quotes. Trades at or above the ask → buy-initiated. Trades at or below the bid → sell-initiated.

Case 3: Tick Rule / Heuristic (Weakest): Trade price above prior trade price → classified as buy. Provably imperfect.

Always know which classification method your platform uses. TradingView uses candle direction (approximation). Professional platforms use quote-based or exchange-based classification (true delta).

---

Bar Construction Types

Type | Construction | Advantage | Challenge
---|---|---|---
Time bars | Fixed interval (1m, 5m, etc.) | Consistent time periods, easy comparison | Volume varies dramatically
Range bars | Fixed price range | Normalizes volatility | Bar boundaries are activity-dependent
Volume bars | Fixed traded volume | Normalizes participation | Backdating effects in pattern recognition

---

Key Patterns — Initiative vs Passive

Large ask-side prints: Buyers were impulsive, did not want to wait. Incurred buying. Price typically builds.

Large bid-side prints: Sellers were impulsive, hit the bid. Price typically declines.

The Imbalance Formula:
Imbalance Ratio = |Bid Volume − Ask Volume| / (Bid Volume + Ask Volume)
- > 70%: Strong directional conviction
- 50–70%: Moderate bias
- < 50%: Balanced (chop)

Stacked Imbalances: Multiple consecutive price levels with 70%+ imbalance in same direction → institutional flow → trend continuation signal.

Absorption:
Large volume at a level without price movement:
Absorption Score = Volume at Level / Price Movement (ticks)
High score = someone absorbing (strong hands defending). Signal: Likely reversal zone.

Exhaustion:
Decreasing volume on directional move:
Exhaustion Ratio = Volume_current_swing / Volume_previous_swing
Ratio < 0.7 → exhaustion confirmed. Trend losing steam. Signal: Reduce position, watch for delta divergence.

---

Common Mistakes

Mistake 1: Ignoring trade classification quality.

Mistake 2: Trading every imbalance automatically. Context required:
- Is it at a structure extreme (VAL, VAH, key level)?
- Is it in the direction of prior bar momentum?
- What happened to price after the imbalance?

Mistake 3: Not accounting for order size/segmentation.

Mistake 5: Treating range/volume/time bars as equivalent.

Mistake 7: Assuming all large prints = institutional interest.`
      },
      {
        title: "Delta — Bid-Ask Delta",
        tag: "core",
        content: `Delta — Bid-Ask Delta

"The question is never 'what is delta?' The question is 'what is delta doing to price at this location?'"

---

What Delta Measures

Delta is a measurement of initiative (aggressive) execution. Built from executed trades, classified as either ask-side or bid-side.

Delta = Ask Volume − Bid Volume

Sign | Meaning
---|---
Positive | More buy aggression than sell aggression. Liquidity takers were net buyers.
Negative | More sell aggression than buy aggression. Liquidity takers were net sellers.

Delta does not measure who "won" the auction. It measures how much initiative flow executed on each side.

---

The Three Delta Scopes

1. Price-Level Delta (Row Delta): Delta computed per price row inside a footprint bar. Useful for microstructure reads: where aggression concentrated. Helps detect absorption and failed continuation at a specific price.

2. Bar Delta (Candle/Bar Total Delta): Delta summed across all price rows in the bar. Used for bar-to-bar comparisons. Used in "delta divergence" concepts.

3. Session / Range Delta (Cumulative Delta / CVD): Delta accumulated across many bars. Useful for seeing session-wide initiative imbalance.

---

What Delta Is NOT

Delta is commonly mis-sold as a "who is in control" meter:
- Delta is not a direct measurement of "smart money"
- Delta is not a direct measurement of net positioning
- Delta is not proof that buyers are "strong" or sellers are "weak"
- Delta is not a DOM measurement
- Delta is not a standalone signal

Delta is a measurement of aggressive execution, not a measurement of auction outcome.

---

The Only Relationship That Matters: Delta vs Price

Delta With Follow-Through | Delta With No Follow-Through
---|---
Positive delta + price lifting | Positive delta but price does not advance
Negative delta + price pressing lower | Negative delta but price does not decline
Initiative flow is "getting paid" | Absorption, exhaustion, or structural resistance

The informational edge is most often in failed aggression and absorption — not in big delta numbers by themselves.

---

CVD Divergence — The Most Powerful Signal

Bearish Divergence (Top Tick Signal):
Price: Higher High → Higher High → Higher High
CVD: Lower High → Lower High → Lower High

Interpretation: Price is still advancing but each push requires progressively less aggressive buying. The buyers are exhausted. Imminent reversal.

Bullish Divergence (Bottom Tick Signal):
Price: Lower Low → Lower Low → Lower Low
CVD: Higher Low → Higher Low → Higher Low

Interpretation: Price is still falling but each push requires progressively less aggressive selling. The sellers are exhausted.

---

Multi-Timeframe Confirmation

CVD divergence is most reliable when it appears across multiple timeframes simultaneously:

Maximum confluence:
- 1H: CVD divergence building for 3–4 hours (macro exhaustion)
- 15m: Delta declining on each successive push (tactical exhaustion)
- 5m: Absorption appearing at the current push (micro exhaustion)
- 1m: Reversal candle forming (execution signal)

When the divergence is visible on 1H, 15m, and 5m simultaneously → structural reversal, not noise.

---

Execution Protocol

Bearish CVD Divergence (Short Entry):
1. Identify CVD making lower highs while price makes higher highs (5m or 15m chart minimum)
2. Confirm structural level: price at call wall, VPOC, VAH, or composite POC
3. Confirm footprint: absorption visible at the extreme
4. Confirm DOM: resting offers absorbing aggressive buyers
5. Wait for the first bar that closes below the prior bar's low on elevated negative delta
6. Enter short on that bar
7. Stop: above the CVD divergence high
8. Target T1: prior session VPOC or VAL

Bullish CVD Divergence (Long Entry): Mirror image.`
      },
      {
        title: "VWAP — Volume Weighted Average Price",
        tag: "core",
        content: `VWAP — Volume Weighted Average Price

"VWAP is a practical intraday proxy for fair value. It is best treated as a reference point and mean-reversion target, not as a standalone entry trigger."

---

What VWAP Is

VWAP is the average price weighted by volume over the session.

VWAP = Σ(Pᵢ × Vᵢ) / ΣVᵢ

Where Pᵢ = trade price at print i, Vᵢ = volume at print i.

It provides a running snapshot of where the market has done the most business — the volume-weighted consensus of fair value for the session.

---

What VWAP Actually Tells You

- Where the session's volume-weighted consensus is
- A clear framework for location: premium vs. discount
- Whether the auction is in balance or discovery

VWAP gives location, not direction. The edge comes from combining VWAP location with structure and order flow.

---

The Core Use Case

Jewraj's primary use: mean reversion target, not standalone entry signal.

When price is far from VWAP → it is trading away from fair value. In balanced/rotational conditions, price has a strong tendency to rotate back toward VWAP as the auction seeks efficiency.

VWAP is an objective:
- The most obvious fair-value re-test location
- Natural place for profit-taking, rebalancing, and two-sided trade
- Widely referenced → reinforces it as a magnet

---

Why Mean-Reversion to VWAP Works

Mean reversion is NOT because VWAP is "magic." It happens because:
1. VWAP marks where the majority of volume has traded
2. Markets revisit areas of heavy participation because liquidity is better and price discovery is "easier"
3. Extensions away from VWAP require continued aggressive participation — when that participation weakens, rotation becomes likely

The most important idea: Reversion happens because the auction away from VWAP stalls and fails to attract new committed participation.

---

VWAP Regimes

Rotational / Balanced | Directional / Discovery
---|---
Price oscillates around value | Price holds away from VWAP
Moves away from VWAP have diminishing follow-through | Pullbacks are shallow and may not reach VWAP
VWAP behaves like session's center of gravity | VWAP lags while value is being re-priced

---

Execution Framework

Correct sequence: VWAP is the target. Structure and order flow justify the trade.

1. Look for price to extend away from VWAP (premium or discount)
2. Wait for structural and/or order flow evidence that continuation is failing (CVD divergence, absorption)
3. VWAP becomes the objective or partial target — not the reason to trade

---

Common Mistakes

- Treating VWAP like an automatic bounce line
- Forcing mean reversion on a clear trend day
- Using VWAP as an entry instead of a location framework
- Having no invalidation (no point where the thesis is clearly wrong)
- Confusing a VWAP touch with VWAP acceptance (the market can tag it and continue)`
      },
      {
        title: "DOM — Depth of Market",
        tag: "core",
        content: `DOM — Depth of Market

"DOM is best used to evaluate the quality of liquidity at the top of book and how that liquidity behaves as price approaches a reference. The informational edge is in response: does liquidity hold, absorb, and stabilize price, or does it vanish and allow fast traversal?"

---

What the DOM Is

The Depth of Market (DOM), also known as the order book or Level II, is a real-time display of all active buy and sell orders at different price levels. It shows how many contracts traders are willing to buy (bids) or sell (asks) at each price — revealing market liquidity and depth.

Critical component: DOM is not just passive limit orders — it's equally about watching aggressive market orders hitting the bid and ask in real time.

---

Order Book Structure

ASK SIDE (sellers):
- 5,245.00 | [25 contracts] ← Best ask (lowest offer)
- 5,244.75 | [18 contracts]
- 5,244.50 | [42 contracts]
----------------------- SPREAD
BID SIDE (buyers):
- 5,244.50 | [67 contracts] ← Best bid (highest buy offer)
- 5,244.25 | [31 contracts]
- 5,244.00 | [88 contracts]

Key elements:
- Bid prices/sizes: Highest bid = most aggressive buyer. Large bid sizes = strong buy-side liquidity
- Ask prices/sizes: Lowest ask = lowest price sellers accept. Large ask sizes = heavy sell-side liquidity
- Market depth: Range of price levels and cumulative volume on each side
- Bid-ask spread: In liquid ES, typically 1 tick (0.25 points) during active hours

---

What DOM Tells You

- Anticipate price movements before they occur
- Refine entry and exit timing to the tick level
- Spot manipulation and false liquidity (spoofing)
- Gauge immediate supply and demand concentration
- Read aggression by watching market orders hit the bid/ask
- Distinguish initiative vs responsive order flow

---

Key DOM Signals

Absorption: Large resting orders absorb many market orders without price moving much. Big player absorbing supply or demand. Telltale sign: A large number of market trades printing at a price but price doesn't advance.

Stacking (Layering): Many large orders added (layered) on one side, creating a "wall." Additional 300, 400, 500 contracts appearing on bid side = buyers increasingly eager.

Spoofing and Order Cancellation: Large order appears out of nowhere, disappears as price approaches, repeated "place and cancel" patterns.

Key: Look at whether stacks hold or vanish as price approaches. If they vanish → spoofing. If they absorb → genuine.

---

When to Ignore the DOM

- First 60 seconds after data releases (algos dominate)
- During OPEX Friday open (AM settlement distortion)
- When VIX is rapidly spiking (liquidity providers leave)
- During news bombs (DOM liquidity withdraws instantly)

In these environments DOM is noise. Use higher-timeframe structure and wait for normalization.

---

DOM + Heatmap + Tape Integration

Tool | What It Shows
---|---
Heatmap | Where liquidity was (historical)
DOM | Where liquidity is (current)
Tape | Where liquidity got hit (executed)

Together: complete liquidity picture across time.`
      },
      {
        title: "Tape (Time and Sales)",
        tag: "core",
        content: `Tape (Time and Sales)

"Tape is only high-signal when interpreted with location. Aggression that produces progress is continuation. Aggression that fails to move price is usually absorption, exhaustion, or a stronger counterparty."

---

What the Tape Is

The Time & Sales is a high-resolution execution feed. It shows every trade that executed, in real time, in order. Each print contains: timestamp, execution price, quantity, and side (bid/ask if available).

Key distinction: The tape is NOT the order book. The order book shows resting orders. The tape shows executed trades — orders that were actually matched and filled.

The tape is the closest you get to seeing real-time market aggression.

---

Reading the Tape: Bullish vs Bearish

Bullish Tape | Bearish Tape
---|---
Strong ask-side volume dominance | Strong bid-side volume dominance
Buying prints larger than selling | Selling prints larger than buying
Prints moving price higher | Prints moving price lower
Price accumulation at multiple levels | Distribution across multiple levels

---

Key Patterns

Momentum / Velocity Pattern: Aggressive single-direction pressure through consecutive price levels. Burst: bid>ask = 30+100+150+200 — 500 cumulative contracts pushing through price. Price keeps advancing in the same direction.

Signal: Continuation — trade with the momentum direction.

Exhaustion Pattern: Tape hits a price where momentum is present but absorbed — concentration of active prints at a single level with no follow-through. Price stays at a level for multiple large prints. No advancement despite heavy volume.

Signal: Reversal candidate — especially at structural levels.

Absorption Pattern: Price moves to a level where prints actively occur through large passive liquidity. Multiple large ask-side entries at the same price. Aggressive volume but price stalls (non-progress).

Signal: Strong hands at this level — reversal or consolidation ahead.

Iceberg / Passive Large Orders: Hidden large interest identified by small consistent prints: Single prints small (20–50 contracts) appearing consistently at many price levels.

Signal: Significant institutional position being built/defended.

Sweep vs Absorption: Sweep: aggressive buy orders push rapidly through multiple levels → then price fades when sweep exhausts.

Signal: If no follow-through after the sweep → fade the sweep.

---

The Key Reading Principle

"Read prints not as isolated events, but as sequences and conversations between buyers and sellers."

Patterns need confluence — prints alone rarely mean enough. Always read tape in context of:
- Structure (where is price relative to VAH, VAL, POC, VWAP?)
- Prior participation (is this level an HVN or LVN?)
- Delta context (is CVD confirming or diverging?)

---

Common Misinterpretations

Pitfall 1: Overtrading — reacting to every print without reading the complete context.

Pitfall 2: Overreaction to single large prints — individual large orders can be hedges, reversals, or noise. Require pattern, not just size.

Pitfall 3: Confusing pace/momentum with direction — heavy buying tape does not automatically mean long. Check structure first.

Pitfall 4: Ignoring size relativity — "large" is always relative to this market right now.`
      },
      {
        title: "TPO and Market Profile",
        tag: "advanced",
        content: `TPO and Market Profile

"TPO is a time-based view of the auction. Wide TPO development signals value building. Thin zones behave like traverse areas until proven otherwise."

---

Origin

Developed by J. Peter Steidlmayer at the CBOT in the 1980s. Steidlmayer, a floor trader, sought to visualize the "natural organization" of markets beyond bar charts. The TPO evolved from his work on the Liquidity Data Bank (LDB).

---

What a TPO Is

Each letter represents a 30-minute period (default) where price traded at a given level:
- A = 9:30–10:00 (opening)
- B = 10:00–10:30
- C = 10:30–11:00
- ...continuing through the session

More letters at a price = more time spent = acceptance
Fewer letters at a price = price moved through quickly = rejection

The profile is a histogram rotated 90 degrees. The statistical foundation: one standard deviation from the mean = 68–70% value area (Gaussian distribution).

---

Key Metrics

Point of Control (POC): Price with the most TPOs. Represents the fairest price through a time-price approach. Acts as a gravity point.

Variations:
- Developing POC: Intra-session POC that shifts as the session progresses
- Naked POC: Never revisited from a prior session — acts as magnet and strong S/R
- Migrating POC: Trends directionally — indicates directional conviction

Value Area (VA): Range capturing 68–70% of TPO letters (one standard deviation).

Tails and Single Prints: Among the most important profile metrics. Two or more single TPOs stacked vertically at the profile extremes = prices very quickly rejected. Mark the edge of the auction.

Initial Balance (IB): First two brackets (A–B, first hour's range). Sets the daily tone.
- Wide IB = Strong directional flow, expect range extensions
- Narrow IB = Uncertainty, balanced conditions likely

IB Extension Target:
Extension Target = IBhigh/low ± 2 × IBrange

---

The Five Day Types

1. Normal Day: Bell-curve profile, POC in center, balanced two-sided trade. Strategy: Fade from extremes to POC. Mean-revert.

2. Normal Variation Day: Similar to Normal but slight directional bias. POC slightly off-center (60/40 split). Strategy: Lean in direction of bias, still fade extremes.

3. Trend Day: Elongated, thin profile. POC at one extreme. Minimal two-sided trade. Rule: DO NOT fade the trend. Trade pullbacks in direction of trend.

4. Non-Trend Day: Sideways consolidation, wide value area, POC in middle. Strategy: Tight range trades, reduce size, take profits quickly.

5. Double Distribution Day: Two separate value areas, gap or quick move between them, two POCs. Strategy: Trade between the distributions; the gap is an LVN.

---

Multi-Timeframe Composite Analysis

Session composite: Intraday value reference.
Weekly composite: Shows where the week's fair value is. Key for swing trading context.
Monthly composite: Defines major structural zones. Where institutions have been accumulating.

Why composites matter for top/bottom ticking: Major tops and bottoms typically form when price moves far outside the monthly or quarterly composite value area. The further from long-term value → more vulnerable to mean-reversion.`
      },
      {
        title: "Heatmap",
        tag: "advanced",
        content: `Heatmap

"Heatmap is a context filter, not an execution trigger. The level matters only if it is still live in the current auction, which is validated through DOM and price response."

---

What the Heatmap Is

The heatmap is a visual representation of the limit order book's historical state — displaying where liquidity was present over time. Unlike the DOM (which shows current resting orders), the heatmap provides a time-based record of where limit orders existed at each price level throughout the session.

The heatmap reveals where market participants placed their limit orders historically, creating a visual 'memory' of liquidity distribution.

---

Color Interpretation

Color | Meaning
---|---
Bright/Hot (Red, Orange, Yellow, White) | High liquidity zones — many limit orders were resting
Dark/Cold (Dark Blue, Black) | Low liquidity zones — few or no resting orders
Gradient transitions | How liquidity density changes across price levels

---

Heatmap vs DOM

DOM | Heatmap
---|---
Shows current pending orders right now | Shows historical depth over time
Updates in real-time | Maintains a record of where liquidity was
Forward-looking: present liquidity awaiting execution | Backward-looking: past liquidity patterns
Dynamic snapshot of immediate supply/demand | Temporal map of liquidity evolution

Together: heatmap shows where liquidity was, DOM shows where liquidity is, footprint shows where liquidity got hit.

---

Core Visual Elements

Color Intensity Gradient: Brighter = denser (more limit orders waiting to be filled). Darker = sparser (fewer or no limit orders).

Horizontal Bands (Price Levels):
- Bright horizontal bands: Sustained liquidity provision at that level — consistent support/resistance
- Dark horizontal bands: Price rarely attracted resting orders — price passes through quickly

Volume Shelves and Drop-offs: The edge of bright levels — where high liquidity transitions to low liquidity:
- Clear boundaries: Stark transition — exactly where market was/wasn't willing to provide liquidity
- Fade boundaries: Gradual transition — indecision in market structure

---

Key Patterns

Signal Levels: Persistent bright zones across multiple time slices = significant price areas commanding significant liquidity.

Liquidity Walls: Multiple adjacent price levels each maintaining persistent liquidity. Align with DOM when price approaches. Price tends to struggle through these areas.

Blank Prints and Voids: Isolated bright spots with dark zones on either side. May indicate brief flashes (spoofing or non-commitment) or short-lived orders placed and quickly canceled.

Liquidity Migration Patterns: Gradual movement of bright zones over time reveals directional bias:
- Upward migration: Liquidity moving to higher price zones → bullish
- Downward migration: Liquidity moving to lower price zones → bearish

---

Common Mistakes

Pitfall 1: Confusing historical depth with current depth. Always confirm brightness with DOM.

Pitfall 2: Ignoring absolute vs relative scaling. Different sessions adjust contrast differently. Know your baseline.

Pitfall 3: Overweighting aged bright zones. A bright zone from 4 hours ago may no longer be relevant. Discount time decay.

Pitfall 4: Treating isolated spikes as structure. Single-time isolated spikes ≠ repeated bright zones spanning many time slices.

Pitfall 7: Assuming all bright zones will hold. When price returns to a previously bright zone → watch for DOM confirmation and price reaction.`
      }
    ]
  }
};

export const optionsFlowModules = {
  "options-flow": {
    title: "Options Flow — GEX, Dealer Hedging, and Market Structure",
    phase: "Module 12 — Options Flow",
    topics: [
      {
        title: "GEX — Gamma Exposure",
        tag: "core",
        content: `GEX — Gamma Exposure

---

Definition

GEX is the aggregate gamma that dealers hold across all outstanding options, converted to dollars of futures they must buy or sell per 1% move in the underlying.

GEX = Σᵢ [Γᵢ × OIᵢ × 100 × S² × 0.01]

---

GEX Regimes

GEX | Dealer Position | Market Behaviour | Strategy
---|---|---|---
Positive (large) | Net long gamma | Mean-reverting, suppressed vol, pinning | Fade extremes, range trade
Near zero | Unstable | Transitioning — unpredictable | Reduce size
Negative | Net short gamma | Amplifying, trending, squeeze risk | Trend-follow breakouts

---

The Pinning Mechanism

In positive GEX: dealers sell into rallies and buy into dips to remain delta-neutral → mechanically pulls price back toward high-OI strikes → "pinning" effect.

In negative GEX: dealers buy into rallies and sell into dips → amplifies every move.

---

GEX Flip Level

The price at which aggregate dealer gamma crosses from positive to negative. Crossing this level changes the entire market regime from mean-reversion to amplification.

When spot crosses the gamma flip with momentum:
1. Identify the gamma flip level (SpotGamma "Zero Gamma" or "Gamma Flip" line)
2. Price breaks through on volume confirmation
3. Regime changes instantly — dealers now amplify instead of dampen
4. Enter in direction of break
5. Stop: back above the flip by > 5 ES points (confirmed genuine flip)
6. Target: next major structural level (VPOC, put wall strike)

---

Sources

SpotGamma · Volland.com · Squeezemetrics

---

Key Insight

The goal is not to "predict dealers." The goal is to recognise when hedging mechanics make price behaviour more likely to trend, pin, or chop.`
      },
      {
        title: "Call and Put Walls",
        tag: "core",
        content: `Call and Put Walls

---

Definitions

Call Wall: The highest OI call strike above current price. Acts as a magnetic ceiling — dealer hedging flows resist upside extension above it. In positive GEX, it's where the pin is anchored.

Put Wall: The highest OI put strike below current price. Acts as magnetic floor in positive GEX. In negative GEX, breaking the put wall accelerates downside (dealers forced to sell more futures).

---

Mechanics

Near the call wall:
- Dealers short calls at that strike → must buy futures as price rises
- Approaching the call wall → accelerating dealer buying → potential for explosive break above
- In pinning regime → price decelerates as it approaches (dealers selling surface above)

Near the put wall:
- Dealers short puts at that strike → must sell futures as price falls
- Approaching the put wall → accelerating dealer selling → potential for trap door below
- In pinning regime → price decelerates as it approaches (dealers buying below)

---

Trading Rules

Between the walls (positive GEX):
- Mean-reversion is your friend
- Fade extremes, target VPOC between the walls
- This is the range-bound approach

Wall breach (negative GEX):
- Wall breach on volume + stacked imbalances = momentum trade
- Do not fade — follow the break
- Target next structural level or the opposing wall`
      },
      {
        title: "Dealer Hedging Mechanics",
        tag: "advanced",
        content: `Dealer Hedging Mechanics

"Dealer hedging is the transmission mechanism. When dealers must adjust hedges quickly, that hedging becomes real buy/sell orderflow in the underlying."

---

The Core Mechanism

Dealers warehouse the other side of options trades, then hedge their risk in the underlying. This hedging becomes actual futures buy/sell flow — completely mechanical, regardless of the dealer's directional view.

The goal is not to "predict dealers." The goal is to recognise when hedging mechanics make price behaviour more likely to trend, pin, or chop.

---

Delta Hedging — Directional Neutralisation

Delta hedging is the act of trading the underlying to offset option delta.

Dealer Position | Delta Exposure | Hedge Action
---|---|---
Short calls | Short delta (negative) | Buy underlying futures
Short puts | Long delta (positive) | Sell underlying futures

What changes over time: Delta is not constant. When spot moves, delta changes. So hedges must be continuously rebalanced.

As price rises → call delta increases → dealer must buy MORE futures
As price falls → put delta increases → dealer must sell MORE futures

---

Gamma Hedging — Hedging the Hedge

Gamma tells you how fast delta changes. This dictates whether hedging is mean-reverting or trend-amplifying.

Dealer Long Gamma (Stabilising — Positive GEX Regime):
If dealers are net long gamma (e.g., they bought options from customers):
- As price rises → delta increases → dealers SELL to rebalance
- As price falls → delta decreases → dealers BUY to rebalance
- Effect: Dampens moves, encourages chop and mean-reversion

Dealer Short Gamma (Destabilising — Negative GEX Regime):
If dealers are net short gamma (e.g., they sold options to customers — the most common case):
- As price rises → dealers must BUY MORE to stay delta-neutral
- As price falls → dealers must SELL MORE
- Effect: Amplifies moves, increases squeeze and liquidation risk

---

Vanna and Charm — Second-Order Dealer Flows

Vanna (∂Δ/∂σ = ∂ν/∂S): When implied volatility changes, delta changes → additional hedging required. As IV falls (vol compression), delta of OTM options changes → systematic dealer flows. This is the "vol crush rally" mechanic.

Charm (∂Δ/∂t): As time passes, delta decays → dealers must adjust hedges even without price movement. At end of day: dealers with large near-expiry positions must rebalance for overnight risk.

---

The GEX Feedback Loop

Positive GEX (Dealers Long Gamma):
Price rises → Dealer delta increases → Dealer SELLS futures
Price falls → Dealer delta decreases → Dealer BUYS futures
Result: Mean-reverting, suppressed volatility, pinning behaviour

Negative GEX (Dealers Short Gamma):
Price rises → Dealer delta increases → Dealer BUYS MORE futures
Price falls → Dealer delta increases → Dealer SELLS MORE futures
Result: Amplifying, trending, squeeze risk

---

Common Misreads

- "Call buying = bullish" — Only if you know dealers are short the calls AND the hedging will dominate.
- Ignoring strike location — Gamma is concentrated near ATM. Far OTM options have minimal hedging impact.
- Ignoring time-to-expiry — 0DTE options have explosive gamma near ATM.
- Treating hedging as a guarantee — Dealer mechanics create pressure, not certainty.`
      },
      {
        title: "Sweeps and Blocks",
        tag: "advanced",
        content: `Sweeps and Blocks — Options Flow

"A large premium print with no structure context is often noise. Treat options prints as context that shapes expectation — not as entries."

---

Sweeps

A sweep is an options order routed across multiple exchanges simultaneously to ensure immediate, complete execution. Priority is speed over price — someone believes being fast matters more than saving a few cents.

What a Sweep Usually Implies:
- Urgency: willingness to cross spreads
- Desire to get filled NOW
- Often front expiry and near the money
- Caution: urgency can be hedging, not directional conviction

Repeated Sweeps = Conviction:
One sweep = ambiguous (hedge, volatility trade, speculative probe, quick test)
Repeated sweeps at the same strike in the same direction = conviction and urgency.

---

Blocks

A block is a large options trade, often negotiated or crossed. Executed bilaterally — dealer-to-institution — outside the exchange's electronic book.

How to Interpret Blocks:
- Opening institutional risk (new directional or volatility bet)
- Closing a hedge (reduces information content)
- One leg of a spread (must check for the other leg)

They are not automatically directional. Size alone does not determine intent.

---

Spreads — Where the Intent Lives

Most "smart" institutional options activity is expressed via spreads. Ignoring the second leg means misclassifying the trade.

Spread Type | Intent
---|---
Vertical | Directional with defined risk
Calendar / Diagonal | Volatility / time structure
Ratio / Backspread | Convexity demand
Straddle / Strangle | Event-driven, direction-neutral vol bet

---

The Gamma Feedback Loop (Why Sweeps Move Futures)

Calls swept → Dealers sell calls → Dealers short gamma
→ Dealers must buy futures to delta-hedge
→ Price rises
→ Call delta increases → Dealers must buy MORE futures
→ Loop continues until sweep exhausted

This is why strong moves often start after sweeps, not before. The sweep is the trigger; dealer gamma hedging is the engine.

---

The 5-Step Sweep Confirmation Filter

1. Is it a sweep? (Execution type — crosses multiple exchanges)
2. Is it repeated? (Same strike, same direction, 2+ times in same session)
3. Is the strike significant? (High OI already? Near current price?)
4. Does netflow align? (Overall day's flow in the same direction?)
5. Does price confirm? (Holding above support / breaking resistance?)

All 5: A-grade signal. 4/5: B-grade. 3 or fewer: Do not trade — wait for more confirmation.`
      },
      {
        title: "Implied Volatility and Skew",
        tag: "core",
        content: `Implied Volatility and Skew

---

Implied Volatility (IV)

The implied volatility (IV) is the σ value you must input into the Black-Scholes model to match the market price of an option. It is the market's consensus forecast of future realised volatility over the option's life.

IV is a forward-looking pricing metric — not a prediction, but a risk transfer price.

Market price → Black-Scholes model → Implied σ

---

IV vs Realised Volatility

IV tends to trade above realised volatility (volatility risk premium — option sellers are compensated for taking on risk).

When IV >> realised vol: options are expensive → selling vol has positive EV
When IV ≈ or < realised vol: options are cheap → buying vol has positive EV

---

Key IV Applications

1. VIX = model-free 30-day SPX IV
2. VXN = Nasdaq-100 equivalent → historically 2–5 points above VIX
3. Put skew = OTM puts cost more than OTM calls
4. Term structure = short-dated IV vs long-dated IV
5. IV crush = drop after event resolution

---

Volatility Smile

For equity indices (SPX), OTM put IV >> OTM call IV. Called "negative skew" or "downward slope." Reflects demand for downside protection.

For currencies and single stocks, IV on both wings is higher than ATM — a "smile" shape. Reflects expectations of extreme moves in either direction.

---

Put Skew

Put skew is the phenomenon where OTM put options have higher implied volatility than ATM options:

IV_OTM put > IV_ATM > IV_OTM call

Why Put Skew Exists:
1. Crash risk / fear: Puts are bid up as portfolio protection by institutional investors
2. Leverage effect: When stocks fall, realised volatility rises, making puts worth more
3. Convexity premium: Put buyers are buying tail insurance that dealers are reluctant to sell

Reading Skew:
- High put skew (25Δ put IV − 25Δ call IV > 8%): Elevated fear, heavy institutional protection. Cautious for longs.
- Low/compressed put skew (spread < 4%): Complacency. Market unhedged. Vulnerable to vol expansion. Classic top tick setup condition.
- Inverted skew (calls bid over puts): Unusual. Signals either upside squeeze risk or short-squeeze demand.

---

Sticky Strike vs Sticky Delta

Sticky Strike: IV per strike stays constant. When S rises, the ATM strike changes but the vol surface does not move.

Sticky Delta (Money Stickiness): IV per delta stays constant. The surface "slides" with S. Common in equities during normal conditions.

In practice, the market is somewhere between sticky strike and sticky delta, depending on the regime.

---

Term Structure of Volatility

Normal (Contango): IV short-term < IV long-term. Sellers of options receive premium. Normal market conditions.

Inverted (Backwardation): IV short-term > IV long-term. Signals immediate stress. Buyers of options have the advantage.`
      },
      {
        title: "Net Delta Exposure and NDE",
        tag: "advanced",
        content: `Net Delta Exposure

---

Definition

Net Delta Exposure (NDE) measures the aggregate delta exposure that dealers hold from options activity. It tells you how much directional pressure dealers face and must hedge.

Formula: Net Delta = Σ (Delta_i × Position_i)

Where Delta is the option delta and position is the net directional exposure (long calls = positive, short calls = negative).

---

Interpretation

Net Delta | What It Means
---|---
Large Positive | Dealers are net long delta → must sell into rallies, buy into dips (stabilising)
Large Negative | Dealers are net short delta → must buy into rallies, sell into dips (amplifying)
Near Zero | Dealers roughly balanced → market less constrained by hedging flow

---

NDE vs GEX

GEX measures the aggregate gamma exposure (second-order effect of delta changes).
NDE measures the current delta exposure (first-order effect on price).

When GEX and NDE are both positive or both negative → aligned pressure → strong directional move.
When GEX and NDE oppose each other → mixed pressure → choppy, range-bound.

---

Key Insight

The goal is not to "predict dealers." The goal is to recognise when hedging mechanics make price behaviour more likely to trend, pin, or chop.

NDE tells you the current directional pressure. GEX tells you how that pressure will change as price moves. Together they frame the market's mechanical behavior.`
      }
    ]
  }
};

export const macroModules = {
  "macro": {
    title: "Macro — Narrative, Catalysts, and Market Drivers",
    phase: "Module 13 — Macro",
    topics: [
      {
        title: "Interest Rates",
        tag: "core",
        content: `Interest Rates

---

The Foundation of All Markets

Interest rates are the single most important macro variable. They affect:
- Cost of capital for all assets
- Discount rate for future cash flows
- Leverage availability
- Currency valuations
- Risk appetite / risk-off dynamics

The Fed Funds Rate is the policy anchor. All other rates (treasuries, corporate bonds, mortgages, etc.) price off this foundation.

---

Federal Reserve Policy

The Fed controls the Fed Funds Rate through:
- Open market operations (buying/selling Treasuries)
- Discount window lending
- Forward guidance (communication about future rate paths)

Key concepts:
- Neutral rate: The rate at which policy is neither stimulative nor restrictive
- Real vs nominal rates: Nominal - inflation = Real rate
- Taylor Rule: Fed response to inflation and employment gaps

---

Rate Expectations and Market Pricing

Markets price rates ahead of Fed decisions. The curve embeds expectations of:
- Future rate path (where will Fed take rates?)
- Terminal rate (where will rates settle?)
- Cut/cap cycle (how many cuts in this cycle?)

Key tools:
- CME FedWatch: Implied probability of rate decisions
- SOFR futures: Market's rate expectations
- Treasury yields: Real yield (TIPS) vs nominal

---

Trading Implications

Rising rates:
- Headwind for equities (higher discount rate)
- Support for USD
- Typically negative for gold
- Can be positive for banks (net interest margin)

Falling rates:
- Support for equities (lower discount rate)
- Negative for USD
- Positive for gold
- Can squeeze short USD positions

---

Central Bank Communication

The most important signal is not the rate decision itself, but the accompanying statement and press conference. Key things to watch:
- "Higher for longer" language = hawkish
- "Data-dependent" = flexible, await next report
- "Risks balanced" = neutral
- "Monitor labor market" = dovish pivot possible

---

Leading Indicators

Fed funds futures curve: Where is the market pricing rates in 3, 6, 12 months?
Yield curve shape: Inverted (2s10s) typically signals recession risk
Real yields: TIPS yields = market's inflation expectations`
      },
      {
        title: "Treasury Yields",
        tag: "core",
        content: `Treasury Yields

---

The World Benchmark

US Treasury yields are the world's risk-free rate and the benchmark for all other assets. They set the discount rate for global markets.

Key maturities:
- 2-Year: Expectations for Fed policy (most rate-sensitive)
- 5-Year: Medium-term economic expectations
- 10-Year: The benchmark — used for equity valuations, mortgages, etc.
- 30-Year: Long-term growth and inflation expectations

---

Yield Curve Dynamics

Normal (Upward sloping): Short rates < long rates. Banks profit from maturity transformation. Growth environment.

Flat: Short rates ≈ long rates. Transition zone. Typically precedes inversion or steepening.

Inverted (Downward sloping): Short rates > long rates. Recession signal. Banks under pressure.

Steepening after inversion: Potential regime change. May signal recession ending.

---

Reading the Curve

2s10s spread: The difference between 10Y and 2Y yields. Most watched curve segment.
- Inverted: 2Y yield > 10Y yield
- Steepening: 10Y rising faster than 2Y (or 2Y falling faster)
- Flattening: Spread narrowing

Curve inversions historically lead recessions by 6-18 months. Not a timing tool — a probability signal.

---

What Drives Treasury Yields

Supply and demand for safe assets:
- Foreign central banks (reserve management)
- Foreign sovereign wealth funds
- Domestic pension/insurance (liability matching)
- Demand for collateral (repo, derivatives)

 flight to quality:
- Risk-off events → flows into Treasuries → yields fall
- Risk-on events → flows out of Treasuries → yields rise

---

Trading Implications

Rising yields (bear steepening):
- EUR/USD headwind (if USD strengthens)
- Support for financial stocks (banks)
- Negative for long-duration assets (bonds, growth stocks)
- Positive for USD

Falling yields (bull steepening):
- Support for equities (growth stocks)
- EUR/USD tailwind (if USD weakens)
- Negative for banks
- Positive for gold

---

TIPS and Real Yields

TIPS (Treasury Inflation-Protected Securities) yield = Real yield (inflation-adjusted)
Nominal yield - breakeven inflation = Real yield

Real yield is the true cost of capital. When real yields rise:
- Equity multiples compress (higher discount rate)
- Economic growth headwind
- Gold headwind (gold pays no yield)

When real yields fall:
- Equity multiples expand
- Economic growth tailwind
- Gold support`
      },
      {
        title: "Inflation",
        tag: "core",
        content: `Inflation

---

The Macro Variable That Dominates

Inflation is the rate of change in prices. Central banks mandate price stability as their primary function. Every major market move of the past decade has been driven by inflation expectations.

Types:
- CPI (Consumer Price Index): What consumers pay for goods and services
- PPI (Producer Price Index): What producers pay (leading indicator for CPI)
- PCE (Personal Consumption Expenditures): Fed's preferred inflation measure
- Core: Excludes food and energy (more stable signal)

---

The Phillips Curve

The theoretical relationship between unemployment and inflation:
- Low unemployment → wage pressure → higher inflation
- High unemployment → wage weakness → lower inflation

In practice: This relationship broke down post-2021. Other factors matter more:
- Global supply chains
- Energy prices
- Productivity trends
- Inflation expectations (anchored vs unanchored)

---

The Fed's Response Function

The Fed raises rates when inflation is above target (2%) and economy is strong.
The Fed cuts rates when inflation is below target or recession risk rises.

The key is not the level of inflation but the TREND and the REACTION FUNCTION.

Fed reaction function:
- "Transitory" = dovish (let inflation run hot)
- "Persistent" = hawkish (act forcefully)
- "Anchor expectations" = credibly communicate future path

---

Breakeven Inflation

Breakeven inflation = Nominal yield - Real yield (TIPS)
This is the market's implied inflation expectation.

Example:
- 10Y nominal yield: 4.5%
- 10Y TIPS real yield: 2.0%
- Breakeven inflation: 2.5%

If breakeven rises above Fed target → Fed may need to act
If breakeven falls → deflation fears or Fed credibility

---

Trading Implications

High inflation:
- Fed forced to stay hawkish
- Real yields rise (headwind for equities)
- Commodity support (hard assets)
- USD support

Falling inflation:
- Fed pivot opportunity
- Real yields fall (tailwind for equities)
- Bond support
- Gold support

Commodity inflation (energy, metals):
- Different dynamics than service inflation
- May force Fed action despite weak economy
- stagflation risk if growth slows while inflation stays high`
      },
      {
        title: "Employment Data",
        tag: "core",
        content: `Employment Data

---

The Labor Market as Leading Indicator

The employment situation is the most timely snapshot of economic health. Labor markets lead economic cycles:
- Employment lags GDP at cycle end (businesses wait to lay off)
- Employment leads GDP at cycle start (businesses hire before demand)

Jobs report timing: First Friday of each month (8:30 AM ET)

---

Key Components

Nonfarm Payrolls (NFP): Monthly change in employed workers.
- Positive = economy adding jobs
- Negative = economy losing jobs
- Revisions can be massive (30-100K revisions common)

Unemployment Rate: Percentage of labor force seeking work.
- Falls = tight labor market
- Rises = softening

Average Hourly Earnings: Wage inflation signal.
- MoM change × 12 = annual rate
- Watch for acceleration/deceleration trends

Labor Force Participation: Percentage of working-age population in workforce.
- Rising = more people entering job market
- Falling = people giving up job search

---

Market Reaction Rules

Strong report (NFP > 200K, falling unemployment, rising wages):
- Hawkish for Fed
- USD support
- Equities headwind
- Treasury yields rise

Weak report (NFP < 100K, rising unemployment):
- Dovish for Fed
- USD headwind
- Equities support
- Treasury yields fall

Mixed signals: Focus on the trend, not the single report.

---

Leading vs Lagging

Lagging indicators:
- Unemployment rate
- Average hourly earnings

Leading indicators:
- Initial jobless claims (weekly)
- Challenger job cuts
- ADP (often but not always correlated with NFP)

---

Trading the Report

Pre-positioning:
- Friday before: Vol spike, position for move
- Monday-Tuesday: Position for range expansion

During the report:
- First reaction usually correct
- 15-minute follow-through confirms
- Wait for 1-hour candle close before committing

Common patterns:
- Headline miss but wages beat = mixed
- Revisions can change the picture by 50K+
- Seasonal adjustments distort January, September

---

Real-World Application

Focus on:
1. Deviation from consensus (big miss/rise moves markets)
2. Trend vs one-month (is it a blip or reversal?)
3. Composition (is weakness in goods or services?)
4. Fed reaction function (are they watching this data?)`
      },
      {
        title: "Geopolitical Risk",
        tag: "core",
        content: `Geopolitical Risk

---

Non-Economic Forces That Move Markets

Geopolitical events break the normal correlation structure between assets. They create:
- Flight to quality (Treasuries, USD, gold)
- Supply chain disruptions (inflation)
- Confidence shocks (risk-off)
- Policy responses (central banks react)

Key characteristic: Geopolitical risk is unpredictable and can be long-lasting.

---

Types of Geopolitical Events

Military conflicts:
- Direct impact on energy prices (oil, natural gas)
- Defense stocks
- Safe haven flows (gold, Treasuries, USD)

Trade wars:
- Supply chain disruption
- Currency manipulation
- Inflation in affected sectors

Sanctions:
- Energy market disruption
- Currency implications (USD weaponization)
- Commodity supply shocks

Political instability:
- Emerging market sell-off
- Currency weakness
- Policy uncertainty premium

---

Market Reaction Framework

Immediate (hours to days):
- Flight to quality (bonds, USD, gold)
- Risk-off (equities lower)
- Volatility spike (VIX, OVX)
- Energy prices spike (if conflict affects supply)

Medium-term (days to weeks):
- Diplomacy and de-escalation
- Supply chain adjustments
- Policy response (Fed, central banks)

Long-term (months):
- Structural changes to supply chains
- Energy transition acceleration
- Defense spending increases
- New trade relationships

---

Trading Geopolitical Risk

The challenge: Geopolitical events are unpredictable and can escalate or de-escalate suddenly.

Common patterns:
- Initial spike is often a sell-the-news opportunity
- "Buy the rumor, sell the fact" applies to most geopolitical events
- Wars end eventually — long-term opportunity after initial spike

Safe haven assets:
- US Treasuries (primary)
- USD (secondary)
- Gold (tertiary)
- Swiss Franc
- JPY

Risk assets under pressure:
- EM equities and currencies
- High-beta stocks
- Consumer discretionary
- Emerging market bonds

---

Key Distinction

Geopolitical risk ≠ economic risk
- Economic risk is cyclical and mean-reverting
- Geopolitical risk can be structural and persistent
- Diversification helps with economic risk, not always with geopolitical risk`
      },
      {
        title: "FOMC Decision",
        tag: "core",
        content: `FOMC Decision

---

The Most Important Event in Markets

The Federal Open Market Committee meets ~8 times per year to set the Fed Funds rate. This is the most market-moving event for US assets.

Meeting schedule: Check Fed calendar for exact dates.

---

The Full Package

Each meeting produces:
1. Policy rate decision (Fed Funds target range)
2. Statement (changes in language indicate Fed thinking)
3. Economic projections (dot plot shows expected rate path)
4. Press conference (Powell Q&A can move markets)

---

Rate Decision

The Fed can:
- Raise rates (hawkish)
- Cut rates (dovish)
- Hold rates (neutral)
- Make emergency cuts (crisis response)

The market prices the decision 2-3 days ahead based on Fed funds futures.

---

The Statement

The statement language changes indicate Fed stance:
- "Higher for longer" = hawkish
- "Data-dependent" = neutral/flexible
- "Strong labor market" = less urgency to cut
- "Appropriate to maintain restrictive policy" = hawkish
- "Risks to employment and inflation balanced" = neutral
- "Some additional progress on inflation" = dovish

---

Dot Plot

The Summary of Economic Projections shows each Fed official's forecast for rates over the next 3 years.

- Count dots at each level = market's expected rate path
- Changes in median dot = Fed's intended path
- Difference between dots and market pricing = trade opportunity

---

Press Conference

Powell's tone and answers are market-moving. Key phrases:
- "We are nowhere near confident" = dovish
- "Need to see more data" = neutral
- "Inflation is too high" = hawkish
- "Financial conditions have tightened" = watching impact

---

Trading the FOMC

Pre-event:
- Option plays (straddles/strangles for vol spike)
- Directional if clear positioning

During:
- Reaction to surprise element
- Statement language changes
- Dot plot shifts

Post-event:
- Follow-through if price action confirms
- Powell Q&A is often the real move

---

Common Patterns

- "Sell the news" on widely expected moves
- Surprise hawk/cut causes largest moves
- Statement changes more important than rate decision
- "Fed put" = market expects Fed to support economy (affects risk appetite)`
      },
      {
        title: "CPI Release",
        tag: "core",
        content: `CPI Release

---

The Inflation Report

Consumer Price Index (CPI) is the primary measure of inflation. Released monthly by the Bureau of Labor Statistics.

Timing: Typically the second week of the month (8:30 AM ET)

---

The Components

Headline CPI: All items
- Food (15% of index)
- Energy (10% of index)
- All items less food and energy (core CPI)

Core CPI: The Fed's preferred measure is actually PCE, but CPI core is watched closely.

CPI weights are fixed (updated annually). Know the major components:
- Shelter (33%) — lags real-time housing
- Transportation (17%)
- Food (15%)
- Medical (10%)
- Energy (8%)

---

Reading the Report

MoM change: Monthly inflation rate
YoY change: Annual inflation rate (what the Fed watches)

Core CPI is the "real" signal because it removes volatile food and energy.

Key: Watch the TREND, not one month.
- Is inflation accelerating or decelerating?
- Is it moving toward the 2% target?

---

Market Reaction

Hot CPI (above expectations, rising):
- Fed forced to stay hawkish
- Equity headwind
- Bond headwind (yields rise)
- USD support

Cold CPI (below expectations, falling):
- Fed pivot opportunity
- Equity support
- Bond support (yields fall)
- Gold support

---

Services vs Goods

Services inflation (particularly shelter) is stickier than goods inflation.
- Goods inflation can normalize quickly with supply chains
- Services inflation requires wages to fall

The "supercore" or "super services" = services ex-housing (transportation, medical, recreation). This is the stickiest.

---

Trading the CPI

Pre-release:
- Vol crush expected (options expensive)
- Directional positioning based on expectations

Post-release:
- Immediate reaction (first 5-15 minutes)
- 1-hour follow-through (confirm or fade)
- Subsequent days (trend based on reaction)

Common pattern: "Buy the rumor, sell the fact" — big move before, fade after.`
      },
      {
        title: "NFP Release",
        tag: "core",
        content: `NFP Release

---

The Jobs Report

Nonfarm Payrolls (NFP) is the most important labor market report. Released monthly by the Bureau of Labor Statistics.

Timing: First Friday of each month (8:30 AM ET)

---

The Components

NFP: Total nonfarm payroll employment change
- Excludes farm workers, private household workers, nonprofits

Unemployment Rate: U3 (official unemployment measure)

Average Hourly Earnings: Wage inflation
- MoM × 12 = annual rate approximation

Labor Force Participation: % of working-age population working

Underemployment (U6): Includes marginally attached + part-time for economic reasons

---

Reading the Report

Strong jobs (>200K, falling unemployment, rising wages):
- Fed hawkish fuel
- USD support
- Equities headwind
- Bonds headwind

Weak jobs (<100K, rising unemployment):
- Fed dovish fuel
- USD headwind
- Equities support
- Bonds support

The composition matters:
- Goods vs services employment
- Full-time vs part-time
- Hours worked (if falling = softening)

---

Market Reaction Rules

First reaction is usually correct:
- Beat expectations → USD higher, bonds lower, equities mixed
- Miss expectations → USD lower, bonds higher, equities mixed

But watch:
- Revisions to prior months (can be -30K to +100K)
- Seasonal adjustments distort Jan, Sep
- One month is not a trend

---

The Trend vs the Print

The market doesn't trade the report — it trades the TREND.

Three consecutive weak reports = recession signal
Three consecutive strong reports = no Fed pivot

Also watch:
- Average hourly earnings trend (wage inflation)
- Unemployment trajectory (increasing = softening)
- Participation rate (rising = confidence)

---

Trading the NFP

Pre-release:
- Options straddle/strangle for vol spike
- Position for direction based on expectations

During:
- Wait for first 15-min candle close
- Do not chase the initial spike

Post-release:
- 1-hour follow-through confirms or fades
- Look for subsequent days trend

---

Key Insight

Jobs is a coincident indicator, not a leading indicator. By the time jobs weaken significantly, the recession is already underway.

But it matters for Fed reaction function:
- Strong jobs = Fed can stay hawkish
- Weak jobs = Fed pivot opportunity`
      }
    ]
  }
};

export const microstructureModules = {
  "microstructure": {
    title: "Microstructure — Reading the Tape",
    phase: "Module 14 — Microstructure",
    topics: [
      {
        title: "R1 — Price Action Fundamentals",
        tag: "core",
        content: `R1 — Price Action Fundamentals

---

What R1 Teaches

R1 is the foundation of reading raw market data. It focuses on interpreting price movement itself — before any indicators, before any volume analysis. You learn to see what price is doing, not what you think it should do.

Core principle: Price is the final output of all information, sentiment, and order flow. Learning to read price accurately is the most important skill.

---

The Building Blocks

1. Momentum
Price moves in waves. Momentum measures the strength of each wave:
- Strong momentum: Price accelerates in one direction, creating longer candles
- Weakening momentum: Each push smaller than the last — exhaustion signal
- Momentum divergence: Price makes new highs but momentum doesn't confirm → reversal setup

2. Structure
Markets move in sequences of higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). Breaking structure signals a potential shift in control.

3. Location
Same price action means different things at different locations:
- A bullish candle at support = potential long
- A bullish candle at resistance = potential rejection
- A bearish candle at resistance = potential short
- A bearish candle at support = potential reversal

---

The R1 Framework

Step 1: Identify the trend (higher highs/lows or lower highs/lows)
Step 2: Find key levels (swing highs, swing lows, value areas)
Step 3: Wait for price to reach a decision point
Step 4: Read the response (acceptance or rejection)
Step 5: Enter in direction of the response

---

Common Mistakes

- Trading setups without knowing the location
- Ignoring momentum signals
- Confusing pullbacks with reversals
- Over-analyzing noise vs genuine structure breaks`
      },
      {
        title: "R2 — Candlestick Patterns",
        tag: "core",
        content: `R2 — Candlestick Patterns

---

Why Candles Matter

Candlestick patterns are visual representations of the battle between buyers and sellers in a given time period. They reveal the psychology of the auction — who won, who lost, and whether the battle is decisive or contested.

---

Single Candle Patterns

Doji: Open = Close. Indecision. The buyers and sellers reached equilibrium. High reliability as a reversal signal when appearing at key levels.

Gravestone Doji: Open/Close near the low. Sellers rejected higher prices. Bearish signal at resistance.

Dragonfly Doji: Open/Close near the high. Buyers rejected lower prices. Bullish signal at support.

Hammer: Small body, long lower shadow. Buyers stepped in after a sell-off. Bullish reversal when at support.

Shooting Star: Small body, long upper shadow. Sellers stepped in after an advance. Bearish reversal when at resistance.

---

Multi-Candle Patterns

Engulfing: Current candle's body fully engulfs prior candle's body. Strong reversal signal when at key levels.

Morning/Evening Star: Three-candle reversal pattern. Star candle with gaps on both sides signals reversal.

Three White Soldiers: Three consecutive bullish candles with higher closes. Strong bullish continuation.

Three Black Crows: Three consecutive bearish candles with lower closes. Strong bearish continuation.

---

Key Principles

1. Location is everything. The same pattern at support vs resistance has completely different implications.

2. Context matters more than the pattern. A doji in the middle of a trend is less significant than a doji at a key level.

3. Confirmation improves reliability. Wait for the next candle to confirm direction.

4. Volume confirms conviction. Large candles with high volume = real move. Small candles = lack of commitment.`
      },
      {
        title: "R3 — Support and Resistance",
        tag: "core",
        content: `R3 — Support and Resistance

---

What Support and Resistance Is

Support and resistance are price levels where the battle between buyers and sellers has historically paused or reversed. These levels exist because market memory — participants remember where price previously stalled.

Key principle: The more times a level is tested, the weaker it becomes. Eventually, it breaks — and former support becomes resistance (and vice versa).

---

Types of Support and Resistance

1. Horizontal levels: Where price repeatedly reversed. The more tests, the more significant.

2. Trendlines: Angled support/resistance connecting swing highs or lows. More dynamic.

3. Dynamic levels: Moving averages, VWAP, Bollinger bands that adjust with price.

4. Psychological levels: Round numbers where traders place orders (e.g., 5000, 1.1000 in EUR/USD).

5. Session levels: Previous high/low, open, close, value area boundaries.

---

Key Principles

Supply and Demand Imbalance:
Support and resistance exist because of imbalance. When buyers overwhelmed sellers at a level, it became support. When sellers overwhelmed buyers, it became resistance.

Polarisation:
The more times price tests a level without breaking it, the more orders accumulate on both sides. Eventually, one side wins decisively and the level breaks with explosive movement.

Former support becomes resistance:
When a level breaks, the orders that were previously buying now become selling pressure. This is why broken support often acts as resistance.

---

Trading S/R

1. When price approaches S/R: Watch for reaction (bounce or break)
2. Look for order flow confirmation at the level
3. If price breaks through with momentum → follow the break
4. If price rejects at the level → fade in the opposite direction
5. Place stops beyond the level, not just past it

---

Common Mistakes

- Drawing too many levels (focus on the most obvious 3-5)
- Assuming S/R is a precise line (it's a zone)
- Ignoring confluence with other tools
- Chasing breaks that immediately reverse`
      },
      {
        title: "R4 — Trend and Momentum",
        tag: "core",
        content: `R4 — Trend and Momentum

---

Understanding Trends

A trend is the general direction of price movement over time. The market exists in one of three states:
- Uptrend: Higher highs and higher lows
- Downtrend: Lower highs and lower lows
- Range: No clear directional bias

Key principle: Trade with the trend, not against it. The path of least resistance is in the direction of the trend.

---

Trend Analysis

Higher Highs and Higher Lows: The definition of an uptrend. Each pullback finds buyers at a higher level than the previous pullback.

Lower Highs and Lower Lows: The definition of a downtrend. Each rally finds sellers at a lower level than the previous rally.

Break of Structure (BOS): When price breaks above a prior high (uptrend) or below a prior low (downtrend), the trend is confirmed or accelerating.

Change of Character (CHoCH): When price breaks below a prior higher low (in an uptrend) or above a prior lower high (in a downtrend). Early warning of potential trend change.

---

Momentum Indicators

Momentum measures the speed of price change. It identifies:
- Accelerating trends (momentum increasing)
- Decelerating trends (momentum decreasing → exhaustion)
- Trend reversals (momentum divergence)

RSI (Relative Strength Index):
- Above 70: Overbought (bullish but potentially exhausting)
- Below 30: Oversold (bearish but potentially reversing)
- Divergence: Price makes new high but RSI makes lower high → bearish divergence

MACD:
- Histogram positive and growing = bullish momentum
- Histogram negative and falling = bearish momentum
- Cross above/below zero line = momentum shift
- Divergence with price = reversal signal

---

The Momentum Framework

1. Identify the trend direction (using price structure)
2. Use momentum to find entry timing (divergence at key levels)
3. Confirm with order flow (aggression in direction of trend)
4. Exit when momentum diverges or structure breaks

---

Common Mistakes

- Fighting the trend (trading against higher timeframe direction)
- Taking reversals too early (wait for confirmation)
- Ignoring momentum divergence signals
- Overcomplicating with too many indicators`
      },
      {
        title: "R5 — Market Sessions",
        tag: "core",
        content: `R5 — Market Sessions

---

The Four Market Sessions

Markets move differently depending on which session is active. Each session has distinct characteristics:

1. Asian Session (11 PM - 6 AM ET):
- Low volatility, choppy range-bound movement
- Tokyo and Hong Kong are primary drivers
- USD/JPY, AUD/USD most active
- Good for range trading strategies

2. European Session (3 AM - 12 PM ET):
- Higher volatility begins
- London is primary driver
- Major news events often timed to European open
- Breakout strategies become relevant

3. US Session (8 AM - 5 PM ET):
- Highest volatility of the day
- All major US markets active
- Key economic data releases (8:30 AM, 10 AM)
- Best for trend-following and momentum strategies

4. Overlap Sessions:
- US/European overlap (8-12 PM ET): Highest volume
- Most liquid, best for intraday trading
- Breakouts most reliable during overlap

---

Session-Specific Strategies

Asian Session:
- Mean reversion (price often rotates to session extremes)
- Watch for range boundaries
- Low volume = unreliable breakouts

European Open:
- Breakout trades from early range
- News event trading
- Watch for London fix (12 PM ET)

US Open:
- First 30-60 minutes: Highest volatility
- Wait for initial chaos to settle
- Trading the actual direction, not the opening spike

US Close (3-5 PM ET):
- Institutional positioning for next day
- Can see late-day reversals
- Lighter volume

---

Key Times to Know (ET)

- 8:30 AM: Major economic data
- 9:00 AM: Chicago PMI
- 9:45 AM: PMI final
- 10:00 AM: ISM, consumer confidence
- 10:30 AM: Energy inventory data
- 11:00 AM: Fed speaker (when scheduled)
- 12:00 PM: London fix
- 2:00 PM: 10-year Treasury auction
- 3:00 PM: Beige Book (when scheduled)

---

Pre-Session Checklist

Before each trading session:
1. Check overnight developments
2. Identify key levels from prior session
3. Note scheduled news/events
4. Define range expectations
5. Plan entries at specific levels
6. Set alerts for breakouts`
      }
    ]
  }
};

export const regimesModules = {
  "regimes": {
    title: "Market Regimes — Gamma, Volatility, and Structural States",
    phase: "Module 15 — Regimes",
    topics: [
      {
        title: "Long Gamma Regime",
        tag: "advanced",
        content: `Long Gamma Regime

---

What It Means

A long gamma regime occurs when dealers hold net positive gamma exposure — meaning they bought options from customers. In this state, dealers must sell into rallies and buy into dips to remain delta-neutral.

---

Market Behavior

In a long gamma environment:
- Price tends to gravitate toward strikes with high open interest (pinning)
- Volatility is suppressed — big moves are rare
- Mean reversion is the dominant strategy
- Price oscillates within a range bounded by key strikes

The pinning mechanism: As price moves away from a high-OI strike, dealer hedging flows push price back toward that strike. This creates a self-reinforcing pull toward the "pin."

---

Trading Implications

- Range trading works best
- Mean reversion to the pin is high probability
- Momentum strategies underperform
- Breaking the range requires sustained flow
- Avoid trend-following during this regime

---

Key Levels

Call Wall: The highest OI call strike above current price. Acts as resistance in long gamma.
Put Wall: The highest OI put strike below current price. Acts as support in long gamma.

Between the walls = chop. Outside the walls = potential range expansion.

---

Recognizing Long Gamma

- VIX relatively low and stable
- GEX reading positive
- Price oscillating between known levels
- Delta hedging flows visible in tape
- Short-dated options expensive relative to realised`
      },
      {
        title: "Short Gamma Regime",
        tag: "advanced",
        content: `Short Gamma Regime

---

What It Means

A short gamma regime occurs when dealers hold net negative gamma exposure — meaning they sold options to customers. In this state, dealers must buy into rallies and sell into dips to remain delta-neutral.

---

Market Behavior

In a short gamma environment:
- Price can move explosively in either direction
- Volatility is amplified — small moves become large moves
- Momentum strategies outperform
- Gaps and squeeze events are common
- Hedging flows become the dominant market force

The amplification mechanism: As price moves in one direction, dealer hedging flows push it further in that direction. This creates a feedback loop that can persist until the imbalance is resolved.

---

Trading Implications

- Trend following is the dominant strategy
- Stop runs are common as dealers hedge
- Volatility spikes are likely
- Mean reversion is dangerous
- Risk management is critical due to rapid moves

---

Short Gamma Triggers

- Large put/call ratio (>1.5)
- Gamma flip level breached
- Dealers forced to sell into rallies as price rises
- Short-dated options positioning (0DTE culture)
- VIX rising rapidly

---

Recognizing Short Gamma

- VIX elevated or spiking
- GEX reading negative
- Rapid directional moves
- Stops getting hunted
- Delta hedging flows visible as large momentum`
      },
      {
        title: "OpEx Pinning",
        tag: "advanced",
        content: `OpEx Pinning

---

What OpEx Is

Options Expiration (OpEx) occurs every Friday. On this day, dealers must delta-hedge their options positions. This creates predictable flows that can pin price near key strikes.

---

The Weekly OpEx Effect

The most significant pinning occurs at:
- Weekly expiries: Every Friday
- Monthly expiries: Third Friday of each month (major)
- Quarterly expiries: Third Friday of March, June, September, December (largest — "quad witching")

---

The Gamma Pin

As expiration approaches:
- Dealers must delta-hedge to remain neutral
- This creates mechanical flows toward strikes with high open interest
- Price gets "pinned" near these strikes
- The effect is strongest in the last hour of trading

The mechanics:
- Price above a high-OI strike → dealers must sell to hedge (pushes down)
- Price below a high-OI strike → dealers must buy to hedge (pushes up)
- Net effect: Price gravitates toward the strike

---

Key OpEx Rules

1. Wednesday: "OpEx effect" begins — dealers start adjusting hedges
2. Thursday: Positioning ahead of Friday expiry
3. Friday morning: Pinning most visible
4. Friday afternoon (2-4 PM ET): Pinning effect intensifies
5. Friday close: "Pin and dump" or "pin and pump" — price pins, then moves after close

---

Quarterly OpEx (Quad Witching)

Third Friday of March, June, September, December:
- Largest options expiry of the quarter
- Maximum pinning potential
- Heavy positioning in SPX, SPY, QQQ
- Large Emini futures position changes
- Can cause significant intraday volatility

---

Trading OpEx

OpEx weeks tend to be range-bound early, with potential for larger moves on Friday afternoon.

Watch for:
- High OI strikes from the prior week's positioning
- Wednesday-Thursday range establishing the pinning zone
- Friday close "unpinning" — mechanical flows cease after close
- Next-week gap potential after OpEx unwind`
      },
      {
        title: "QE and Market Regimes",
        tag: "advanced",
        content: `QE and Market Regimes

---

What QE Does

Quantitative Easing (QE) is central bank asset purchases designed to lower long-term interest rates and stimulate economic activity. It fundamentally changes market behavior.

---

The QE Effect on Markets

QE creates artificial demand for assets:
- Treasury purchases push yields lower
- Risk asset purchases push equity prices higher
- Liquidity injection reduces volatility
- Credit spreads compress

---

Post-QE Regime Changes

When QE ends or reverses (QT — Quantitative Tightening):
- Liquidity is removed from the system
- Correlations change
- Volatility rises
- Risk assets face headwinds
- Dispersion between assets increases

---

How to Trade QE Cycles

QE Expansion:
- Buy the dip in equities
- Hold duration (bonds)
- Compressed risk premiums
- Low volatility environment

QE Tightening:
- Reduce equity exposure
- Short duration (rate rises)
- Watch for liquidity stress
- Higher volatility, more dispersion

---

Key Macro Connections

Fed balance sheet changes correlate with:
- S&P 500 performance (when expanding)
- Treasury yield direction
- Gold prices (inverse relationship)
- USD strength
- Emerging market flows

Monitor: Fed balance sheet weekly (Thursday release) for the size and pace of QE/QT.`
      }
    ]
  }
};

export const riskManagementModules = {
  "risk-management": {
    title: "Risk Management — Position Sizing, Convexity, and Drawdown",
    phase: "Module 16 — Risk Management",
    topics: [
      {
        title: "Overview of Risk Management",
        tag: "core",
        content: `Risk Management Overview

---

Why Risk Management Is Everything

Trading skill matters less than risk management. A trader with mediocre edges but excellent risk management will survive and compound. A trader with excellent edges but poor risk management will blow up.

The goal is not to make money. The goal is to not lose money. The money follows from not losing.

---

Core Principles

1. Risk per trade is fixed (not variable)
Never risk more than 1-2% of account on any single trade. This ensures you can survive a drawdown.

2. Position size determines risk
Stop loss distance × position size = dollar risk. Adjust position size to hit your target dollar risk, not vice versa.

3. Never average down to a losing position
Adding to losers is the fastest way to blow up. Cut losses quickly, let winners run.

4. Asymmetric risk/reward
A 2:1 or better reward-to-risk ratio means you can be wrong more than right and still be profitable.

---

The Risk Management Framework

Step 1: Define your account size and risk per trade
- Account × risk% = max dollar risk per trade
- Example: $100,000 account × 1% = $1,000 max risk

Step 2: Identify entry and stop loss levels
- Entry price - stop price = stop distance in points
- Stop distance × tick value = dollar risk per contract

Step 3: Calculate position size
- Max dollar risk / dollar risk per contract = contracts to trade
- Round down to a whole number

Step 4: Define target
- Target - entry = reward potential
- Reward / risk = reward-to-risk ratio
- Only take trades with 2:1 or better

---

The Kelly Criterion Preview

The Kelly Criterion helps determine optimal bet size given an edge. This will be covered in detail in the Bayesian Kelly topic.

The key insight: Even with a positive edge, overbetting destroys returns. Underbetting is always better than overbetting.

---

Psychology

Risk management fails when emotions take over:
- Fear of loss → exit winners too early
- Hope → hold losers too long
- Revenge trading → oversized positions to get back to even
- Overconfidence after wins → increase risk

The solution: Mechanical execution of your risk rules, regardless of how you feel.`
      },
      {
        title: "Bayesian Kelly Sizing",
        tag: "advanced",
        content: `Bayesian Kelly Sizing

---

What the Kelly Criterion Is

The Kelly Criterion determines the optimal fraction of your bankroll to risk on each bet, given your win rate and average win/loss size.

Formula: f* = (bp - q) / b
Where:
- b = net odds received on the wager (e.g., 2 for a 2:1 R:R)
- p = probability of winning
- q = probability of losing = 1 - p

---

The Kelly Fraction

Kelly gives you the optimal fraction of your bankroll to risk. Full Kelly is aggressive — most professionals use "Half Kelly" or "Quarter Kelly" for safety.

- Full Kelly: Maximum long-term growth but high volatility
- Half Kelly: 50% of full Kelly fraction — good balance
- Quarter Kelly: 25% of full Kelly fraction — very conservative

---

Applying to Trading

In trading, Kelly becomes:
Kelly % = Win Rate - (Loss Rate / Reward-to-Risk Ratio)

Example:
- Win rate: 50%
- Average win: $1,000
- Average loss: $500
- R:R ratio: 2:1

Kelly % = 0.50 - (0.50 / 2) = 0.50 - 0.25 = 0.25 = 25%

With Quarter Kelly: 25% × 0.25 = 6.25% of account per trade

---

Bayesian Updating

Bayesian probability updates your estimates as new information arrives. In trading:

1. Start with a prior belief about your edge
2. After each trade, update your win rate and R:R estimates
3. Recalculate Kelly sizing based on updated beliefs

This prevents overconfidence after a winning streak and excessive pessimism after a losing streak.

---

Practical Implementation

1. Track all trades in a journal
2. Calculate rolling win rate and average R:R (last 20-30 trades)
3. Apply Kelly formula
4. Use Half or Quarter Kelly to reduce volatility
5. Re-evaluate monthly as new data comes in

---

Common Mistakes

- Using full Kelly (too volatile for real trading)
- Ignoring variance (need large sample size for reliable estimates)
- Over-reacting to recent results (use rolling windows)
- Applying Kelly to short timeframes (needs statistical significance)`
      },
      {
        title: "Convexity in Trading",
        tag: "advanced",
        content: `Convexity in Trading

---

What Convexity Is

Convexity describes a non-linear relationship between risk and reward. In trading, convexity means your upside exceeds your downside in a way that isn't proportional.

Convex payoffs: Limited loss, unlimited gain (long options)
Concave payoffs: Limited gain, unlimited loss (short options, holding naked positions)

---

Convex vs Linear Payoffs

Linear (most trading):
- Risk $1 to make $1 = linear
- Risk $1 to make $2 = linear with better R:R
- Your P&L is directly proportional to your position

Convex (options, some futures strategies):
- Small initial risk, large potential upside
- Asymmetric payoff profile
- Positive convexity: returns to scale increase with size

---

Why Convexity Matters

Convexity in your book means:
- Small positions can generate large gains in the right conditions
- Downside is limited (when using long options or spreads)
- You can survive adverse scenarios that would blow up linear traders

Convexity is the insurance-like property of long options strategies:
- Pay premium upfront (known, limited cost)
- Receive large payout in extreme events (unknown, large reward)

---

Convexity in Portfolio Construction

Building a convex portfolio:
- Include long options positions for tail protection
- Long vol strategies provide convexity
- Long gamma positions in positive GEX environments
- Avoid short vol unless you have strong edge and deep pockets

The tradeoff: Convexity costs premium. Long options positions bleed theta. You pay for the convexity.

---

Practical Application

1. Measure the convexity of your portfolio (simulate extreme scenarios)
2. Ensure some portion of P&L is convex (options, tail hedges)
3. Don't be 100% linear — one bad scenario can wipe you out
4. Balance convex and linear positions based on your risk tolerance`
      },
      {
        title: "Drawdown Management",
        tag: "core",
        content: `Drawdown Management

---

What a Drawdown Is

A drawdown is the peak-to-trough decline in your account. It is measured as a percentage or dollar amount from your highest equity point.

Example: Account grows to $110,000, then falls to $90,000
Drawdown = ($110,000 - $90,000) / $110,000 = 18.2%

---

Why Drawdowns Matter

Drawdowns have asymmetric impact on recovery:
- 10% drawdown: Need 11% gain to recover
- 20% drawdown: Need 25% gain to recover
- 50% drawdown: Need 100% gain to recover
- 75% drawdown: Need 300% gain to recover

The deeper the drawdown, the harder it is to recover. This is why preserving capital is more important than chasing returns.

---

The Drawdown Spiral

The danger of large drawdowns:
1. Large loss → emotional impact → second-guessing your system
2. Desire to "get even fast" → increased risk → revenge trading
3. Increased risk → higher probability of another large loss
4. Another large loss → deeper drawdown → more emotional pressure
5. Cycle continues until trader stops or account is blown

---

Drawdown Limits

Define maximum tolerable drawdown BEFORE trading:
- Maximum daily drawdown (e.g., stop trading if -3% in a day)
- Maximum weekly drawdown (e.g., stop if -7% in a week)
- Maximum total drawdown (e.g., stop if -20% from peak)

When you hit a drawdown limit:
1. Stop trading immediately
2. Review what went wrong
3. Analyze if your system is broken or if variance caused it
4. Return only when you have a clear plan

---

Recovery After Drawdown

If you experience a drawdown:
1. Reduce position size (trade smaller until you regain confidence)
2. Focus on process, not P&L (follow your system)
3. Accept that you may need to win a higher percentage to recover
4. Do not increase risk to "catch up" (this leads to blowup)

Rule of thumb: After a 20% drawdown, trade at 50% size until your win rate normalizes.`
      },
      {
        title: "Position Sizing",
        tag: "core",
        content: `Position Sizing

---

The Most Important Decision

Position sizing determines your risk. More than entry timing, more than strategy selection, position sizing is the primary determinant of whether you'll survive as a trader.

Same strategy, different position sizing:
- Oversized positions: Blowup
- Proper sizing: Survive and compound
- Undersized positions: Survive but underperform

---

The Fixed Fractional Method

Risk a fixed percentage of account on each trade:
- 1% method: Risk 1% per trade → can lose 100 trades in a row before losing half your account
- 2% method: Risk 2% per trade → can lose 50 consecutive trades before losing half

The 2% rule is the maximum recommended for active traders.

---

The Kelly Sizing Method

Optimal fraction based on edge (see Bayesian Kelly topic). Most use Half Kelly or Quarter Kelly to reduce variance.

---

Fixed Lot vs Dynamic Sizing

Fixed Lot: Trade the same number of contracts every time. Simple but doesn't adapt to market conditions or account size.

Dynamic Sizing: Adjust position size based on account size, market volatility, or confidence level.

Better approach:
- Start with fixed fractional sizing
- Adjust for market conditions (smaller size in high-vol regimes)
- Increase size only after consistent profitability

---

Position Sizing for High-Vol Environments

During high-vol regimes (VIX elevated, news events):
- Reduce position size (larger moves can hit stops)
- Widen stops proportionally (reducing size keeps dollar risk constant)
- Better: reduce BOTH position size AND stop distance

Volatility-adjusted position sizing:
Position Size = (Account × Risk%) / (ATR × Multiplier)

This normalizes risk across different volatility regimes.

---

Common Mistakes

- Increasing size after wins (recency bias)
- Increasing size to recover from losses (revenge trading)
- Using round numbers instead of calculations
- Ignoring correlation between positions (over-concentrated risk)
- Not adjusting for market regime`
      }
    ]
  }
};

export const participantsModules = {
  "participants": {
    title: "Market Participants — Who Moves the Market",
    phase: "Module 17 — Participants",
    topics: [
      {
        title: "Dealers and Market Makers",
        tag: "core",
        content: `Dealers and Market Makers

---

Who They Are

Dealers (also called market makers) are firms that stand ready to buy and sell assets. They provide liquidity by maintaining bid and ask prices and profiting from the spread. They warehouse risk from customers who want to transfer it.

In options markets, dealers are the primary market makers who take the other side of retail and institutional option trades.

---

The Dealer Business Model

Dealers make money by:
- Collecting the bid-ask spread
- Diversifying risk across many positions
- Hedging exposure in the underlying market
- Using statistical models to price options accurately

The key: Dealers are not directional. They are delta-neutral hedgers. They don't care which way the market goes — they profit from the premium collected.

---

Why Dealers Matter

Dealer hedging flows can be the dominant force in markets:
- Options notional is enormous (multiple times underlying)
- Dealer hedging creates futures/equity flows
- These flows are mechanical and predictable
- Understanding dealer hedging reveals market mechanics

When you understand dealer hedging:
- You understand why markets pin near strikes
- You understand why gaps and squeezes occur
- You understand why OpEx Fridays behave predictably
- You understand the difference between trending and range-bound markets

---

Dealer Positioning Metrics

Key metrics to track:
- GEX (Gamma Exposure): Aggregate gamma dealers hold
- NDE (Net Delta Exposure): Directional pressure dealers face
- OI at strikes: Where dealers are most exposed
- VIX term structure: Dealer's vol expectations

---

Retail vs Dealer Positioning

When retail buys options, dealers sell them:
- Dealers collect premium
- Dealers must hedge (creating directional flow)
- This hedging can amplify moves

When retail sells options, dealers buy them:
- Dealers pay premium
- Dealers' hedging is more balanced
- This can suppress moves

The asymmetry: Retail tends to buy puts for protection, buy calls for excitement. This creates dealer positioning that leads to predictable hedging flows.`
      },
      {
        title: "High-Frequency Trading (HFT)",
        tag: "advanced",
        content: `High-Frequency Trading (HFT)

---

What HFT Is

HFT firms use co-located servers, sophisticated algorithms, and ultra-low latency connections to trade at speeds measured in microseconds. They dominate volume in liquid markets.

Key characteristics:
- Holding period: Microseconds to seconds
- Strategy: Market making, statistical arbitrage, latency arbitrage
- Edge: Speed, not information
- Volume share: 50-60% of US equity volume

---

HFT Strategies

1. Market Making:
Providing bid and ask quotes, earning the spread. HFTs post on both sides and earn from order flow.

2. Statistical Arbitrage:
Pricing inefficiencies between related instruments (e.g., ETF vs underlying stocks). Prices converge, generating small but frequent profits.

3. Latency Arbitrage:
Being first to react to information. Profiting from speed advantage over slower participants.

4. Predatory HFT:
- Quote stuffing: Overwhelming exchange with orders to slow competitors
- Momentum ignition: Creating artificial moves to trigger stop orders
- Order anticipation: Detecting large orders and trading ahead

---

What HFT Means for Traders

HFT creates both challenges and opportunities:

Challenges:
- Fast markets = faster adverse selection
- Stop orders can be "seen" before execution
- Quote data is dominated by HFT noise
- Traditional technical analysis less reliable

Opportunities:
- HFTs provide excellent liquidity (tight spreads)
- HFT reactions to news are visible in tape
- HFT flow can be traded against when it's exhausted
- Understanding HFT patterns improves reading of tape

---

How to Think About HFT

HFT is not an enemy or ally — it is a market structure element. You cannot outrun HFTs, but you can:
1. Trade less liquid instruments where HFT presence is lower
2. Use longer timeframes where HFT noise averages out
3. Trade with HFT flow when it shows directional conviction
4. Look for exhaustion in HFT-driven momentum

The key: In liquid markets, you're trading with and against HFTs. Understanding their patterns helps you anticipate short-term moves.`
      },
      {
        title: "Institutional Traders",
        tag: "core",
        content: `Institutional Traders

---

Who They Are

Institutional traders manage large sums of money for pension funds, endowments, sovereign wealth funds, and asset managers. They have different constraints and objectives than retail traders.

Key characteristics:
- Large position sizes
- Long time horizons
- Benchmark-relative performance
- Limited ability to enter/exit quickly
- Access to research, analysis, and macro information

---

Institutional Objectives

1. Beta Management:
Many institutions just need exposure to market returns. They buy index products and hold for long periods.

2. Alpha Generation:
Active managers try to beat their benchmark. They search for mispriced assets using fundamental and quantitative analysis.

3. Risk Hedging:
Endowment funds and pension funds hedge specific risks (inflation, currency, interest rates) with derivatives.

4. Liability Matching:
Pension funds match their assets to future liabilities. This drives long-duration bond buying.

---

How Institutions Trade

1. Portfolio Construction:
Build positions gradually to avoid market impact. Large orders are sliced into smaller pieces.

2. Execution Algorithms:
VWAP, TWAP, POV algorithms to execute large orders over time.

3. Block Trading:
Crossing large trades bilaterally to avoid market impact.

4. Soft Dollar Arrangements:
Using broker research in exchange for execution.

---

Trading With Institutions

You cannot replicate institutional scale, but you can:
1. Identify where institutions are positioned (positions disclosures, fund flows)
2. Trade in the same direction as institutional flow
3. Wait for institutional-driven moves to play out
4. Use institutional levels (key strikes, VWAP) as reference

Key insight: When institutions need to buy, they don't care about price — they care about execution certainty. This is why large-cap, liquid stocks with strong institutional ownership tend to be more stable.

---

Reading Institutional Flow

Institutional positioning indicators:
- Fund flow data (mutual funds, ETFs)
- Options positioning (institutional size)
- Futures COT reports (commodity institutions)
- Large trade prints (block trades, upstairs crossing)`
      },
      {
        title: "Retail Traders",
        tag: "core",
        content: `Retail Traders

---

Who They Are

Retail traders are individual investors trading their own capital. They represent a significant portion of trading activity but are not the dominant force in price discovery.

Key characteristics:
- Small position sizes
- Emotional trading patterns
- Limited information access
- Tendency to buy highs, sell lows
- Attracted to options for leverage

---

Retail Behavior Patterns

1. Trend Chasing:
Buying after prices have risen, selling after prices have fallen. This is the opposite of buy low, sell high.

2. Hope and Fear:
Holding losing positions hoping for recovery, cutting winning positions too early due to fear.

3. Overconfidence:
After wins, believing they have skill rather than luck, leading to increased risk.

4. Attention-Driven:
Trading headlines, news, and social media rather than systematic analysis.

5. Options Preference:
Retail loves options for leverage but misunderstands probability and pricing.

---

What Retail Does to Markets

Retail flow tends to be:
- Wrong at turning points (buy tops, sell bottoms)
- Correct in the middle of trends (momentum following)
- Expensive for options (paying too much premium)

The information content of retail flow is often contrarian:
- When retail is heavily long → potential top
- When retail is heavily short → potential bottom
- Heavy put buying from retail → dealer hedging supports

---

Trading the Retail Edge

You can use retail positioning as a contrarian indicator:
- When retail is very bullish: Potential top, trade short
- When retail is very bearish: Potential bottom, trade long
- Heavy retail call buying: May cause short-term squeezes
- High retail participation in calls at a strike: Strike may act as magnet

Tools to track retail positioning:
- Tastytrade sentiment surveys
- FINRA margin debt
- Options volume ratios
- Social media sentiment (Twitter, Reddit)

---

Retail vs Professional Edge

The edge comes from:
1. Information (insiders, research, macro access)
2. Speed (HFT, co-location)
3. Capital (can hold through volatility)
4. Psychology (trained, disciplined, systematic)

Retail has none of these advantages. The retail edge must come from:
- Trading small enough to survive variance
- Being contrarian to consensus
- Using longer timeframes
- Focusing on probability and risk management`
      },
      {
        title: "Volatility Target Funds",
        tag: "advanced",
        content: `Volatility Target Funds

---

What Vol Target Funds Are

Volatility targeting (vol target) funds aim to maintain a constant level of portfolio volatility. They automatically adjust position size based on current market volatility.

The mechanism:
- When volatility is high → reduce position size
- When volatility is low → increase position size

This creates systematic, mechanical flows that are predictable and large.

---

Why They Matter

Vol target funds control enormous assets. Their systematic rebalancing creates predictable flows that can dominate market direction.

Key characteristics:
- Predictable behavior (you know what they'll do)
- Large flows (trillions in vol-targeting strategies)
- Creates correlation between volatility and returns
- Amplifies moves in both directions

---

The Volatility Feedback Loop

When VIX rises:
1. Vol target funds reduce exposure
2. Selling pressure → prices fall
3. Falling prices → VIX rises further
4. More selling → vol target funds reduce more
5. Loop continues until stabilization

This is why high volatility regimes tend to persist — vol target selling begets more selling.

When VIX falls:
1. Vol target funds increase exposure
2. Buying pressure → prices rise
3. Rising prices → VIX falls further
4. More buying → vol target funds increase more

This is why low volatility regimes can persist — vol target buying begets more buying.

---

Trading Implications

During high-vol regimes:
- Vol target selling adds to downside
- Reduce position sizes
- Don't fight the mechanical flow
- Wait for vol target rebalancing to stabilize

During low-vol regimes:
- Vol target buying adds to upside
- Trend following works well
- Risk-on environments persist

The vol target regime change:
- When VIX spikes dramatically → vol target selling dominant
- When VIX normalizes → vol target buying dominant
- The transition creates the best opportunities

---

Key Insight

Vol target funds are not trading on view — they are mechanically rebalancing. This means their flows are predictable and countercyclical to volatility. Understanding this helps you anticipate direction during vol regime shifts.`
      }
    ]
  }
};

export const quantModules = {
  "quant": {
    title: "Quantitative Finance — Models and Pricing",
    phase: "Module 18 — Quantitative Finance",
    topics: [
      {
        title: "Black-Scholes Model",
        tag: "advanced",
        content: `Black-Scholes Model

---

What It Is

The Black-Scholes model is the foundational options pricing model. It provides a theoretical price for European options based on five inputs.

The Formula (Call):
C = S × N(d₁) - K × e^(-rT) × N(d₂)

Where:
- S = Current stock price
- K = Strike price
- T = Time to expiration
- r = Risk-free rate
- σ = Implied volatility
- N() = Cumulative normal distribution

---

The Five Inputs

1. Spot Price (S): Current price of the underlying
2. Strike Price (K): The price at which the option can be exercised
3. Time to Expiration (T): Days/years until expiry
4. Risk-Free Rate (r): The "cost of carry" of owning the asset
5. Volatility (σ): The expected volatility of returns over the option's life

---

The Greeks in Black-Scholes

Delta (∂C/∂S): Rate of change of option price with respect to spot. Range 0 to 1 for calls, -1 to 0 for puts.

Gamma (∂²C/∂S²): Rate of change of delta. Highest near ATM, lowest far OTM.

Theta (∂C/∂T): Rate of time decay. Options lose value as expiration approaches.

Vega (∂C/∂σ): Sensitivity to volatility changes. Always positive for long options.

Rho (∂C/∂r): Sensitivity to interest rate changes. Usually small for short-dated options.

---

Assumptions and Limitations

Black-Scholes assumes:
- Log-normal price distribution
- Constant volatility
- No dividends (or continuous dividend yield)
- No transaction costs
- Continuous trading
- Constant interest rates

Reality violations:
- Volatility is not constant (volatility clustering)
- Fat tails in return distribution (crashes happen)
- Discrete trading, not continuous
- Transaction costs exist
- Jumps occur (flash crashes, gaps)

Despite its flaws, Black-Scholes is the industry standard because:
- It provides a reference price
- It's computationally tractable
- Implied vol extracted from it is useful
- Greeks derived from it guide hedging

---

Practical Use

1. Implied Volatility Extraction:
Market price → Black-Scholes → Implied σ
This "backed out" volatility is the market's consensus forecast.

2. Fair Value Comparison:
Model price vs market price → trade when mispricing exists

3. Greeks Hedging:
Use model Greeks to hedge option positions delta, gamma, vega`

      },
      {
        title: "Dispersion Trading",
        tag: "advanced",
        content: `Dispersion Trading

---

What It Is

Dispersion trading profits from the relationship between individual stock volatility and index volatility. It involves selling index volatility while buying single-stock volatility (or vice versa).

The intuition: Stocks move more than the index on average, but the correlation between stocks is less than 1. This means individual stock vol should be higher than index vol.

---

The Correlation Effect

Index volatility < Individual stock volatility (on average)

Why? Because stocks move independently — when one goes up, another might go down. These diversifiable moves cancel out in the index.

This relationship is measured by correlation. When correlation is high, stocks move together, and index vol approaches individual stock vol. When correlation is low, stocks move independently, and the gap widens.

---

Dispersion Trade Structure

Classic dispersion trade:
- Sell index options (low vol premium)
- Buy single-stock options (higher vol premium)
- Delta-hedge with the underlying

The hedge:
If done correctly, the index hedge cancels out, leaving you with pure correlation exposure.

---

When Dispersion Works

Dispersion trades are profitable when:
- Correlation is low (gap between stock and index vol is wide)
- Single-stock vol is elevated relative to index vol
- Implied correlation is cheap relative to realized

Best environment:
- Low macro stress (no "everything sells off together")
- High stock-specific volatility
- Index vol suppressed by diversification

---

When Dispersion Fails

Dispersion trades blow up when:
- Correlation spikes (2008, March 2020)
- "Correlation goes to 1" — all stocks fall together
- Index vol spikes, single-stock vol also spikes
- Hedge fails during market stress

This is why dispersion trading requires careful risk management:
- Monitor correlation constantly
- Size positions appropriately for tail risk
- Have a clear exit if correlation spikes

---

Key Insight

Dispersion trading exploits the gap between theoretical and realized correlation. It's a sophisticated strategy that requires volatility expertise, hedging sophistication, and risk discipline.`
      },
      {
        title: "NDX vs SPX — Volatility Differences",
        tag: "advanced",
        content: `NDX vs SPX — Volatility Differences

---

The Indexes

SPX: S&P 500 index, market-cap weighted, 500 large-cap US stocks
NDX: Nasdaq-100 index, market-cap weighted, 100 largest Nasdaq stocks

Key difference: Technology concentration
NDX is heavily weighted toward tech (Apple, Microsoft, Google, Amazon, Meta, Nvidia). These stocks have higher individual volatility.

---

Volatility Differences

General relationship: NDX implied volatility > SPX implied volatility

Why?
1. Higher individual stock weights → higher component volatility
2. Tech stocks have higher betas → amplify index moves
3. Concentration risk → fewer stocks means less diversification
4. Growth premium → tech stocks priced for future, more volatile

---

Historical Spread

NDX vol typically trades at a premium to SPX vol:
- Normal spread: 2-5 vol points
- During tech selloffs: Spread can widen to 10-15 points
- During "flight to safety" (buying SPX puts): SPX vol can exceed NDX

This spread creates:
- Relative value opportunities
- Cross-product hedging strategies
- Information about market regime

---

Trading the Spread

When NDX/SPX vol spread is wide:
- Tech stocks may be over-hedged
- NDX options expensive relative to SPX
- Selling NDX vol / buying SPX vol is the trade

When NDX/SPX vol spread is narrow:
- Tech stocks may be under-hedged
- SPX options relatively expensive
- Buying NDX vol / selling SPX vol is the trade

---

Key Insight

The NDX/SPX vol relationship is a macro-regime indicator. When the spread widens dramatically, it often signals tech stress or over-speculation. When the spread collapses, it can signal capitulation or a "buy everything" regime.`
      },
      {
        title: "Statistical Arbitrage",
        tag: "advanced",
        content: `Statistical Arbitrage

---

What It Is

Statistical arbitrage exploits predictable patterns in price data that arise from market inefficiencies. The key is that these patterns have a positive expected value over many repetitions.

Classic examples:
- Mean reversion: Prices that deviate from average tend to revert
- Momentum: Short-term continuation of trends
- Pairs trading: Two related securities revert to their historical spread

---

The Edge Concept

Statistical arbitrage requires:
1. A measurable edge (positive expected value)
2. Large sample size (law of large numbers)
3. Risk management (edge isn't always realized)

The edge is often small. A strategy with 51% win rate and 1:1 R:R is profitable over thousands of trades. But variance is high and drawdowns are real.

---

Mean Reversion

Prices tend to oscillate around fair value. When price deviates significantly, it tends to revert.

Key indicators:
- Z-score: How many standard deviations from mean
- Bollinger Bands: Price vs rolling standard deviation
- RSI: Overbought/oversold conditions
- Distance from VWAP

Mean reversion works best in:
- Range-bound markets
- High-vol regimes (larger deviations)
- Liquid instruments

---

Pairs Trading

Pairs trading involves going long one security and short a related security, betting that their spread will revert to mean.

Example: GOOG vs GOOGL
These should trade in a tight range. When the spread widens, one is relatively expensive.

Trade:
- Spread too wide → Short expensive, Long cheap
- Spread narrows → Both positions profitable

Pairs trading requires:
- High correlation between the two instruments
- Mean-reverting spread
- Careful sizing (often delta-neutral)
- Transaction cost management

---

Key Insight

Statistical arbitrage is not "free money." The edge is small, variance is high, and execution matters enormously. The traders who succeed have:
- Deep understanding of the edge
- Excellent execution technology
- Robust risk management
- Psychological discipline`
      }
    ]
  }
};

export const volatilityModules = {
  "volatility": {
    title: "Volatility — VIX, Skew, and Vol Regimes",
    phase: "Module 19 — Volatility",
    topics: [
      {
        title: "VIX and Market Fear",
        tag: "core",
        content: `VIX and Market Fear

---

What the VIX Is

The VIX (CBOE Volatility Index) is the market's expectation of 30-day forward-looking volatility for the S&P 500. It is calculated using SPX option prices.

Key facts:
- VIX is expressed as an annualized percentage
- VIX of 20 = expected 30-day move of ~20% annualized
- VIX of 40 = expected 30-day move of ~40% annualized
- Average VIX since 1990: ~19

---

How VIX Moves

VIX is not an asset you buy — it's an index. It moves based on:
1. SPX option prices (the inputs)
2. Demand for put options (fear drives buying)
3. Supply of call options (hedging drives selling)

VIX rises when:
- SPX falls rapidly
- Uncertainty increases
- Put buying surges
- Market participants hedge aggressively

VIX falls when:
- SPX rises steadily
- Uncertainty decreases
- Vol premium gets crushed
- "Everything is fine" complacency

---

VIX Interpretation

VIX Level | Market Regime | Interpretation
---|---|---
< 15 | Low vol, complacency | Risk-on environment, trending
15-25 | Normal range | Healthy market, balanced
25-40 | Elevated stress | Risk-off, hedging mode
> 40 | Crisis regime | Panic, maximum fear, potential bottom

---

Trading VIX

VIX cannot be traded directly (it's an index). Products that track VIX:
- VIX futures (contango/backwardation matters)
- VIX options (high premium, binary payoff)
- UVXY/TVIX (2x/3x leveraged VIX products — NOT long-term holds)
- SPX options (can replicate VIX exposure)

Common mistakes:
- Treating VIX products as long-term investments
- Ignoring contango cost in VIX futures
- Buying VIX at high levels expecting it to go higher
- Not understanding VIX product roll costs

---

VIX as a Sentiment Indicator

VIX extremes are contrarian indicators:
- Very high VIX (>40): Fear is maximum, potential for reversal (buy the dip)
- Very low VIX (<12): Complacency is maximum, potential for vol expansion (hedge)

But VIX can stay elevated for extended periods during true crises (2008-2009, 2020). Not every high VIX is a bottom.

The combination matters:
- VIX spiking + price falling = crisis mode
- VIX elevated but stable + price grinding higher = healthy uptrend`
      },
      {
        title: "Implied vs Realized Volatility",
        tag: "core",
        content: `Implied vs Realized Volatility

---

Two Types of Volatility

Implied Volatility (IV): Forward-looking. The volatility priced into options. Derived from option prices using Black-Scholes (or similar models). It's the market's forecast.

Realized Volatility (RV): Backward-looking. The actual volatility that occurred. Calculated from historical price returns.

IV = Market's prediction of future volatility
RV = What actually happened

---

The Volatility Risk Premium

Historically: IV > RV on average

This spread is the "volatility risk premium" — the compensation investors require for taking on volatility risk. Option sellers demand a premium for bearing the risk of large moves.

Implication: Selling options has positive expected value on average, but tail risk is real.

---

The IV/RV Ratio

IV / RV = Volatility Risk Premium Ratio

High ratio (>1.3): Options are expensive, selling vol has positive expected value
Low ratio (<1.0): Options are cheap, buying vol has positive expected value

The ratio oscillates over time:
- Risk-on: IV/RV falls (vol sellers unwind)
- Risk-off: IV/RV rises (hedgers buy puts)
- Crisis: IV/RV spikes to extreme levels

---

Trading the Spread

When IV > RV (options expensive):
- Sell options / buy vol products
- Collect the premium
- Expect vol crush after events

When IV < RV (options cheap):
- Buy options / sell vol products
- Pay for protection
- Position for vol expansion

The challenge: You need to be right about timing. Buying cheap options that get cheaper is painful.

---

Practical Application

1. Compare IV to your estimate of fair IV
2. Use RV as a baseline (what has been typical)
3. Consider the vol risk premium (how much is the market paying for protection?)
4. Trade the direction you expect IV to move

Remember: IV is a consensus forecast. If you have a better forecast, you have an edge.`
      },
      {
        title: "IV Crush",
        tag: "core",
        content: `IV Crush

---

What It Is

IV crush refers to the sudden drop in implied volatility (and thus option prices) after a known event occurs. It's called "crush" because it feels like the value of options has been destroyed.

---

Why It Happens

Before events (earnings, FDA decisions, FOMC meetings), uncertainty is high. Options prices reflect this uncertainty — IV is elevated.

After the event:
- Uncertainty is resolved (regardless of direction)
- The "insurance" value of options disappears
- IV drops rapidly
- All options in the event lose value (even those that were "correct")

---

The Pre-Event Trade

Selling options before known events profits from IV crush:
- Sell strangles/straddles before earnings
- Collect the elevated premium
- If price doesn't move much → profit from vol crush
- Risk: Large move in either direction destroys the position

This is why earnings strangles are often sold rather than bought — the IV premium is so elevated that selling it is profitable most of the time.

---

The Post-Event Trade

Buying options after IV crush:
- IV has collapsed (options are cheap)
- If uncertainty remains → IV may re-expand
- If directional move occurred → options on the winning side may continue to have value

Post-IV crush opportunities:
- Buying puts after a failed drug trial (if some uncertainty remains)
- Buying calls after a missed earnings (if the company recovers)
- Event risk spreads (long one event, short another)

---

The VIX Crush

Similar to IV crush in individual options, VIX often crushes after FOMC meetings:
- Before: Uncertainty high → VIX elevated
- After: Uncertainty resolved → VIX falls
- Trading: Selling VIX products before events, covering after

---

Key Insight

IV crush is predictable — you know when it will happen (events with known timing). This creates:
- Mechanical selling pressure on options before events
- Mechanical buying opportunity after events (for future positioning)

Understanding crush helps you:
- Not overpay for pre-event options
- Sell premium profitably before events
- Buy cheap options after events for future catalysts`
      },
      {
        title: "Volatility Regimes",
        tag: "core",
        content: `Volatility Regimes

---

What a Vol Regime Is

A volatility regime is the market's typical volatility state. Markets spend most of their time in "normal" vol environments, but periodically transition to high-vol or low-vol regimes.

Regimes are persistent — once volatility spikes or crushes, it tends to stay there for a while. This is called "volatility clustering."

---

The Three Regimes

1. Low Volatility Regime
Characteristics:
- VIX typically < 15
- Range-bound markets, mean reversion works
- Options cheap
- Trend following underperforms
- "The easy trade is to sell vol"

Transitions:
- Can persist for years (2012-2019 was relatively calm)
- Ends with shock event (flash crash, geopolitical, pandemic)

2. Normal Volatility Regime
Characteristics:
- VIX between 15-25
- Balanced buy/sell dynamics
- Moderate directional moves
- Options fairly priced
- Trend following and mean reversion both work

Transitions:
- Most common regime
- Transitions to high vol during stress events
- Transitions to low vol during sustained calm

3. High Volatility Regime
Characteristics:
- VIX > 25 (can go to 40-80 in crisis)
- Directional trending markets
- Options expensive
- Trend following outperforms
- "Sell rallies, buy dips" until regime changes

Transitions:
- Triggered by shocks (financial crisis, pandemic, war)
- Persists as vol target funds de-risk
- Ends when uncertainty resolves or central banks intervene

---

Trading Across Regimes

Low Vol Regime:
- Sell options (collect premium)
- Mean reversion strategies
- Smaller position sizes (less movement)
- Short vol positions

High Vol Regime:
- Buy options (hedge value)
- Trend following strategies
- Larger moves require wider stops
- Long vol positions

The transition is the key opportunity:
- Low → High: Buy options before the shock
- High → Low: Sell vol after the crisis resolves

---

Regime Indicators

What signals a regime change?

High → Low transition:
- VIX declining from peak
- Fed/central bank intervention
- News resolution (event uncertainty cleared)
- Vol target funds starting to add exposure

Low → High transition:
- VIX spiking
- Shock event (geopolitical, financial)
- Fear indicator rising (put buying surging)
- Credit spreads widening

The challenge: You don't know when the transition ends. High vol can persist longer than expected. Patience is required.`
      }
    ]
  }
};

export const greeksModules = {
  "greeks": {
    title: "The Greeks — Delta, Gamma, Theta, Vega",
    phase: "Module 20 — The Greeks",
    topics: [
      {
        title: "Introduction to the Greeks",
        tag: "core",
        content: `Introduction to the Greeks

---

What the Greeks Are

The Greeks are sensitivity measures that tell you how an option's price changes when various inputs change. They are the primary tools for managing option risk.

The five primary Greeks:
- Delta: Change in price for a $1 move in the underlying
- Gamma: Change in delta for a $1 move in the underlying
- Theta: Change in price per day (time decay)
- Vega: Change in price for a 1% change in implied volatility
- Rho: Change in price for a 1% change in interest rates

---

Why the Greeks Matter

1. Pricing: The Greeks tell you what an option should cost
2. Hedging: They tell you how to hedge option positions
3. Risk Management: They quantify your exposure to various risks
4. Strategy Selection: They help you choose the right strategy

---

The Two First-Order Greeks

Delta and Vega are the most important first-order Greeks. They tell you the direct sensitivity to market inputs.

Delta:
- Measures directional exposure
- Like owning or shorting stock
- Range: 0 to 1.0 for calls, -1.0 to 0 for puts
- ATM options have delta ≈ 0.50

Vega:
- Measures volatility exposure
- Long options have positive vega
- Short options have negative vega
- ATM options have the most vega

---

The Two Second-Order Greeks

Gamma and Theta are the second-order Greeks. They measure the rate of change of the first-order Greeks.

Gamma:
- Measures how fast delta changes
- Highest for ATM options
- Positive for long options, negative for short
- Risk factor for dealers hedging

Theta:
- Measures time decay
- Always negative for long options (time works against you)
- Positive for short options (time works for you)
- Accelerates as expiration approaches

---

The Option Position Greek Profile

Position | Delta | Gamma | Theta | Vega
---|---|---|---|---
Long Call | + | + | - | +
Short Call | - | - | + | -
Long Put | - | + | - | +
Short Put | + | - | + | -

---

Practical Use

The Greeks help you:
1. Size positions correctly (delta exposure)
2. Manage risk (gamma risk)
3. Time trades (theta decay)
4. Position for vol moves (vega exposure)

The goal: Build positions with Greeks that align with your market view, and manage them as the market moves.`
      },
      {
        title: "Delta — Directional Exposure",
        tag: "core",
        content: `Delta — Directional Exposure

---

What Delta Measures

Delta measures how much an option's price changes for a $1 move in the underlying asset. It tells you your equivalent stock position.

Delta = Change in option price / Change in underlying price

---

Delta Ranges

Call Options: 0 to 1.0
- Deep ITM calls: Delta ≈ 1.0 (acts like stock)
- ATM calls: Delta ≈ 0.50
- Deep OTM calls: Delta ≈ 0

Put Options: -1.0 to 0
- Deep ITM puts: Delta ≈ -1.0 (acts like short stock)
- ATM puts: Delta ≈ -0.50
- Deep OTM puts: Delta ≈ 0

---

Delta as Probability

Delta is approximately the probability of the option expiring ITM:
- Delta of 0.70 ≈ 70% chance of finishing ITM
- Delta of 0.50 = exactly ATM, 50% chance
- Delta of 0.10 = 10% chance

This is why ATM options are often used for probability-based strategies — they represent a 50/50 bet.

---

Delta in Practice

Position Delta:
If you own 10 call contracts with delta of 0.40:
Delta exposure = 10 × 100 shares × 0.40 = 400 shares equivalent

This is your directional exposure. You're effectively long 400 shares of the underlying.

Delta Hedging:
To make a delta-neutral position, you trade the underlying:
Delta hedge = Position delta / Underlying delta (which is 1)
= Buy/sell enough shares to offset position delta

Example: 400 share delta position → Sell 400 shares of stock to delta-neutral

---

Delta and Strategy

Strategy | Delta Position
---|---
Long Call | Long (bullish)
Short Call | Short (bearish)
Long Put | Short (bearish)
Short Put | Long (bullish)
Bull Call Spread | Long (mildly bullish)
Bear Put Spread | Short (mildly bearish)
Straddle | Neutral (directional bet is zero)

---

Key Insight

Delta tells you:
1. Your directional exposure (like shares)
2. Your probability of profit (approximately)
3. How much to hedge with stock/futures
4. How option prices will respond to underlying moves`
      },
      {
        title: "Gamma — Rate of Change of Delta",
        tag: "advanced",
        content: `Gamma — Rate of Change of Delta

---

What Gamma Measures

Gamma measures how fast delta changes when the underlying moves. It's the "delta of delta."

Gamma = Change in delta / Change in underlying price

---

Why Gamma Matters

When you buy options, you're long gamma. When you sell options, you're short gamma.

Long Gamma:
- Delta increases faster as price rises
- Delta decreases faster as price falls
- Benefits from large moves in either direction
- Like owning insurance that pays in big moves

Short Gamma:
- Delta changes more slowly
- Gets "short" the large moves
- Profits from time passing without large moves
- Like selling insurance and hoping nothing bad happens

---

Gamma Profile

Gamma is highest:
- At-the-money (ATM)
- Near expiration

Gamma is lowest:
- Deep in-the-money or out-of-the-money
- Far from expiration

The ATM gamma concentration near expiration is why 0DTE options are so dangerous for dealers — small price moves cause massive delta swings.

---

Gamma in Practice

If you own options and gamma is high:
- Each $1 move causes larger delta changes
- You need to hedge more frequently
- Large moves benefit you more than small moves
- Time decay (theta) is working against you faster

If you're short options and gamma is high:
- Delta changes slowly (you're "short the move")
- Large moves hurt you badly
- Time decay (theta) works for you

---

Gamma Risk

The risk of being short gamma (short options):
- "Gamma squeeze" — when underlying moves sharply, option sellers must hedge by buying/selling stock
- This hedging amplifies the underlying move
- Creates feedback loops that cause explosive price action

This is why:
- Short sellers get squeezed when prices rise rapidly
- Short puts cause banks to sell when prices fall
- Positive feedback loops in short gamma positions are dangerous`
      },
      {
        title: "Theta — Time Decay",
        tag: "core",
        content: `Theta — Time Decay

---

What Theta Measures

Theta measures how much value an option loses per day due to time passing. It's the cost of waiting.

Theta = Change in option price / Change in time (per day)

---

Theta is Negative for Long Options

When you buy options, theta works against you. Every day that passes, all else equal, your options are worth less.

Example:
- Option with theta of -0.05 loses $0.05 per day
- Over 30 days, loses $1.50 in time value
- Theta accelerates: the last 30 days before expiry are worse than the first 30

---

Theta is Positive for Short Options

When you sell options, theta works for you. Time passing is your friend.

Short option with theta of +0.05:
- Gains $0.05 per day
- Over 30 days, gains $1.50 in time value
- Collecting premium while waiting

This is why selling premium (naked puts, credit spreads, iron condors) is popular — you're collecting time value that decays in your favor.

---

Theta Profile

Theta is highest:
- At-the-money (ATM)
- Near expiration

Theta is lowest (approaches zero):
- Deep in-the-money (mostly intrinsic value)
- Deep out-of-the-money (very little value to decay)
- Far from expiration (decay is slow)

ATM options near expiration have maximum theta because:
- Most of their value is time value
- Each day that passes reduces that time value significantly
- ATM → OTM transition is rapid

---

Theta vs Gamma Tradeoff

Long options = Long gamma + Negative theta
- You pay for the right to benefit from large moves
- Time decay erodes your position

Short options = Short gamma + Positive theta
- You collect premium for giving up the right to large moves
- Time decay adds to your position

This is the fundamental tradeoff:
- Pay theta → own gamma (speculation, hedges)
- Collect theta → sell gamma (income, selling premium)

---

Practical Application

If you want to benefit from a move but worried about theta:
- Buy options with more time (lower theta per day)
- Buy ATM if you need delta exposure
- Buy OTM if you need cheap convexity

If you want to collect theta:
- Sell near-term ATM options (maximum theta)
- Be aware of gamma risk (large moves hurt you)
- Use spreads to reduce gamma risk`
      },
      {
        title: "Vega — Volatility Sensitivity",
        tag: "core",
        content: `Vega — Volatility Sensitivity

---

What Vega Measures

Vega measures how much an option's price changes when implied volatility changes by 1%.

Vega = Change in option price / Change in IV (per 1%)

---

Vega is Always Positive for Long Options

When you buy options, you benefit from an increase in volatility (IV goes up → option price goes up).

When IV falls, your long option position loses value even if the underlying doesn't move.

---

Vega Profile

Vega is highest:
- At-the-money (ATM)
- Far from expiration

Vega is lowest:
- Deep in-the-money or out-of-the-money
- Very near expiration

This is why long-dated ATM options are the most sensitive to IV changes — they have the most vega.

---

Vega in Practice

Example:
- You own 1 call option with vega of 0.15
- IV rises from 20% to 21% (+1%)
- Your call gains $0.15 × 100 shares = $15
- If IV falls from 20% to 19% (-1%)
- Your call loses $15

Long options with high vega:
- Benefit from "vol crush" recovery
- Lose when IV collapses (earnings crush, news resolution)
- Can be used as vol hedges

---

Vega and Implied Vol

IV changes are one of the main sources of P&L in options:

When you buy options and IV rises → big gains
When you buy options and IV falls → losses despite being "right direction"

This is why "being right on direction but losing money" happens:
- You bought calls because you thought stock would rise
- Stock did rise
- But IV collapsed (vol crush) → option lost value from IV
- Net P&L may be negative

---

Vega Risk Management

If you're long options:
- Monitor IV levels (are you paying high IV?)
- Have a view on whether IV will rise or fall
- Earnings approaching → IV will likely crush

If you're short options:
- You benefit from IV decline
- Risk if IV spikes (short gamma squeeze)
- Have a view on macro events that could spike vol

---

The Vega-Theta Tradeoff

Vega and theta are related:
- Long options: Long vega + Short theta (you pay for vol exposure)
- Short options: Short vega + Long theta (you collect for giving up vol exposure)

Understanding this tradeoff helps you choose strategies:
- High IV environment → selling vega is attractive
- Low IV environment → buying vega is attractive`
      }
    ]
  }
};

export const practiceModules = {
  "practice": {
    title: "Practice — Setup Types and Execution",
    phase: "Module 21 — Practice",
    topics: [
      {
        title: "Top Tick — Exhaustion and Reversal",
        tag: "core",
        content: `Top Tick — Exhaustion and Reversal

---

What a Top Tick Is

A top tick is a market structure signal where price makes a higher high but the underlying strength (momentum, order flow, participation) fails to confirm. It's the foundation of bearish divergence.

The concept: Price can still push higher, but each push requires less and less strength. When the exhaustion is confirmed, price reverses.

---

Components of a Top Tick

1. Price: Higher high in the current move
2. Strength indicator: Lower high in delta, volume, or momentum
3. Location: At a key level (call wall, VAH, resistance, prior high)

When price makes a higher high but all indicators make lower highs → structural top.

---

Top Tick Checklist

For bearish top tick confirmation, all of the following:
1. Price making higher high
2. CVD making lower high (less aggressive buying)
3. Momentum diverging (RSI, MACD making lower high)
4. Location at key resistance (call wall, VPOC, VAH)
5. Absorption visible in footprint (buyers hitting, no price rise)

Plus: Rejection candle forming (shooting star, doji, engulfing bearish)

---

The Top Tick Setup

Setup:
- Uptrend with price at resistance
- Price makes higher high
- Indicators make lower high
- Absorption at the high

Entry:
- Short on the bar that confirms rejection
- When price closes below prior bar low
- With elevated negative delta on the break

Stop:
- Above the top tick high (the higher high)
- Typically 5-10 points in ES depending on timeframe

Target:
- Prior POC or VAL (mean reversion)
- VWAP (fair value reversion)
- Support levels below

---

Top Tick Execution Protocol

1. Identify: Price at resistance making higher high
2. Confirm: Indicators diverging (CVD, momentum)
3. Wait: Absorption visible in footprint
4. Trigger: Rejection candle with negative delta
5. Enter: Short on break of prior bar low
6. Stop: Above top tick high
7. Scale out: At VPOC and at halfway to target
8. Let runner: Keep 1/3 position for large move

---

Common Mistakes

- Taking a top tick without all components confirmed
- Entering before the candle closes (calling the top)
- Stop too tight (noise takes you out before reversal)
- Not waiting for absorption confirmation
- Fighting the trend (top tick only works at key levels)`
      },
      {
        title: "Bottom Tick — Exhaustion and Reversal",
        tag: "core",
        content: `Bottom Tick — Exhaustion and Reversal

---

What a Bottom Tick Is

A bottom tick is the mirror image of a top tick. Price makes a lower low but the underlying weakness (momentum, order flow, participation) fails to confirm. It's the foundation of bullish divergence.

The concept: Price can still fall, but each push requires less and less selling. When the exhaustion is confirmed, price reverses higher.

---

Components of a Bottom Tick

1. Price: Lower low in the current move
2. Strength indicator: Higher low in delta, volume, or momentum
3. Location: At a key level (put wall, VAL, support, prior low)

When price makes a lower low but all indicators make higher lows → structural bottom.

---

Bottom Tick Checklist

For bullish bottom tick confirmation, all of the following:
1. Price making lower low
2. CVD making higher low (less aggressive selling)
3. Momentum diverging upward (RSI, MACD making higher low)
4. Location at key support (put wall, VPOC, VAL)
5. Absorption visible in footprint (sellers hitting, no price fall)

Plus: Rejection candle forming (hammer, engulfing bullish, doji)

---

The Bottom Tick Setup

Setup:
- Downtrend with price at support
- Price makes lower low
- Indicators make higher low
- Absorption at the low

Entry:
- Long on the bar that confirms rejection
- When price closes above prior bar high
- With elevated positive delta on the break

Stop:
- Below the bottom tick low (the lower low)
- Typically 5-10 points in ES depending on timeframe

Target:
- Prior POC or VAH (mean reversion)
- VWAP (fair value reversion)
- Resistance levels above

---

Bottom Tick Execution Protocol

1. Identify: Price at support making lower low
2. Confirm: Indicators diverging upward (CVD, momentum)
3. Wait: Absorption visible in footprint
4. Trigger: Rejection candle with positive delta
5. Enter: Long on break of prior bar high
6. Stop: Below bottom tick low
7. Scale out: At VPOC and at halfway to target
8. Let runner: Keep 1/3 position for large move

---

Common Mistakes

- Taking a bottom tick without all components confirmed
- Entering before the candle closes (calling the bottom)
- Stop too tight (noise takes you out before reversal)
- Not waiting for absorption confirmation
- Fighting the trend (bottom tick only works at key levels)`
      },
      {
        title: "Pre-Session Setup",
        tag: "core",
        content: `Pre-Session Setup

---

Why Pre-Session Preparation Matters

Professional traders spend more time preparing than trading. The pre-session ritual defines your edge before the market opens.

The goal: Know what you're looking for before the market provides it. This prevents reactive trading and emotional decisions.

---

The Pre-Session Checklist

1. Overnight Summary
- What happened in Asian/European sessions?
- Any significant news or data?
- What was the US close?
- Where did price settle overnight?

2. Key Levels
- Prior session high/low
- Value area from prior session
- VPOC
- Any gaps (overnight or from prior days)
- Key structural levels (swing highs/lows)

3. Economic Data Calendar
- What's scheduled today?
- What time (8:30 AM, 10:00 AM, etc.)?
- What's the consensus expectation?
- How market typically reacts

4. Current Market State
- Is the market in a trend or range?
- Where is price relative to key levels?
- What's the overnight range?
- Is price extended?

5. Your Plan
- What are you looking for today?
- Long, short, or range trade?
- Specific entry triggers?
- Maximum loss you're willing to take?

---

Session-Specific Preparation

Pre-US Open (7:30-8:15 AM ET):
- Confirm overnight range
- Identify session extremes
- Note where price is relative to overnight range
- Set alerts for breakouts

During US Session (8:30 AM - 12:00 PM ET):
- High volatility window (8:30 data)
- Wait for initial chaos to settle
- Trade with the direction from the first 30-60 minutes

Afternoon Session (12:00 PM - 4:00 PM ET):
- London close positioning
- Fed speakers (if scheduled)
- Position for the close

---

Setting Up for Success

1. Review your last 5 trades — what went wrong?
2. Define your max daily loss before you start
3. Plan your first trade (don't start with "I'll see what happens")
4. Set alerts for key levels before the open
5. Be patient — wait for your setups
6. Don't force trades when nothing is there`
      },
      {
        title: "Trade Invalidation",
        tag: "core",
        content: `Trade Invalidation

---

What Invalidation Is

Every trade has a point where your thesis is proven wrong. That point is your invalidation. If price reaches it, you exit — not because you're emotional, but because the market has told you you're wrong.

Invalidation is not the same as your stop loss. Your stop is where you exit to manage risk. Your invalidation is where the trade thesis is negated.

---

Why Invalidation Matters

Without an invalidation:
- You don't know when to exit
- You hold losers hoping they turn around
- You don't have a clear reason to trade
- Emotion fills the gap

With invalidation:
- You know exactly when you're wrong
- You exit before the loss becomes catastrophic
- You have a framework for every decision
- Emotion is removed from the decision

---

Types of Invalidation

1. Structural Invalidation
Price breaks a level that confirms your thesis.

Long trade invalidated by:
- Breaking below the swing low
- Breaking below VWAP in a downtrend
- Breaking below the value area

Short trade invalidated by:
- Breaking above the swing high
- Breaking above VWAP in an uptrend
- Breaking above the value area

2. Time Invalidation
Price doesn't reach your entry in a set time.
- If price hasn't moved after X hours, the setup is dead
- Move on to the next opportunity

3. Process Invalidation
The setup conditions change before entry.
- Volatility regime shifts
- News changes the landscape
- The setup you identified no longer exists

---

Setting Invalidation Points

For long setups:
- Below key support
- Below VWAP (in bearish context)
- Below the entry candle low
- Below prior structure low

For short setups:
- Above key resistance
- Above VWAP (in bullish context)
- Above the entry candle high
- Above prior structure high

---

The Invalidation Rule

When your invalidation is violated:
1. Exit immediately (reduce loss)
2. Do not average down
3. Do not wait to see if it "bounces back"
4. Reassess: Was the invalidation wrong or was the trade wrong?
5. Move to the next setup

The market is always right. If your invalidation is violated, you were wrong. Accept it, reduce the loss, and move on.`
      }
    ]
  }
};

export const lecturesModules = {
  "lectures": {
    title: "Lectures — L1 to L27",
    phase: "Module 22 — Lectures",
    topics: [
      {
        title: "L1 — Introduction to Order Flow",
        tag: "core",
        content: `L1 — Introduction to Order Flow

---

What Order Flow Is

Order flow is the study of trade execution — who is buying, who is selling, and how that information reveals future price direction.

Order flow analysis answers: "Where is the real money moving?"

---

Why Order Flow Matters

Price is the output of all buying and selling. Order flow analysis decodes the intent behind that buying and selling.

Traditional analysis (price charts) shows you WHAT happened.
Order flow analysis shows you WHO did it and WHY.

---

The Core Premise

Aggressive buyers move price up.
Aggressive sellers move price down.
The question is whether that aggression continues or gets absorbed.

---

Two Types of Market Participants

Initiative (Aggressive):
- Market orders that cross the spread
- People who want to buy/sell NOW
- Create immediate price impact
- Represent "new" positions

Passive:
- Limit orders sitting at bid/ask
- People willing to wait
- Provide liquidity
- Get taken when initiative comes

---

The Order Flow Framework

1. Who is in control? (buyers or sellers)
2. Where are they losing? (absorption)
3. Where are they winning? (follow-through)
4. Who is exhausted? (divergence)
5. What is the probability of the next move?

---

Tools of Order Flow

- Footprint charts: See bid/ask volume distribution
- DOM: See resting orders
- Tape (Time & Sales): See every print
- Delta: Net aggressive volume
- Cumulative Volume Delta (CVD): Session-long aggression

---

Key Insight

Order flow is not a holy grail. It's a lens through which to read the market. The edge comes from interpretation, location, and execution — not from any single indicator.`
      },
      {
        title: "L2 — VWAP",
        tag: "core",
        content: `L2 — VWAP

---

What VWAP Is

VWAP (Volume Weighted Average Price) is the average price of all trades, weighted by volume. It represents the consensus fair value for the session.

VWAP = Σ(Price × Volume) / ΣVolume

---

Why VWAP Matters

VWAP is the most referenced intraday level in institutional trading:
- Execution benchmark for large orders
- Fair value reference for fair price
- Stop loss clustering level
- Entry and exit target

---

Trading With VWAP

Price above VWAP = trading at a premium (bullish)
Price below VWAP = trading at a discount (bearish)

Mean Reversion to VWAP:
When price extends away from VWAP in a range-bound market, it tends to revert.

Trend Following with VWAP:
When price breaks through VWAP with momentum, it often continues.

---

VWAP as Support/Resistance

In an uptrend: VWAP acts as support
- Buy when price pulls back to VWAP
- Stop below VWAP

In a downtrend: VWAP acts as resistance
- Sell when price rallies to VWAP
- Stop above VWAP

---

VWAP Bands

Standard deviation bands around VWAP:
- +1σ, +2σ: Resistance levels
- -1σ, -2σ: Support levels
- Price at +2σ = extended, likely reversion
- Price at -2σ = extended, likely reversion

---

Common Mistakes

- Trading VWAP as a bounce line (it's a reference, not a guarantee)
- Forgetting VWAP is session-specific (resets each day)
- Ignoring the higher timeframe context
- Chasing price that's extended from VWAP without confirmation`
      },
      {
        title: "L3 — Delta",
        tag: "core",
        content: `L3 — Delta

---

What Delta Is

Delta measures the net aggressive buying or selling in a given period. It's the difference between ask-side volume and bid-side volume.

Delta = Ask Volume - Bid Volume

---

Reading Delta

Positive delta: More aggressive buying than selling
Negative delta: More aggressive selling than buying

The key: Delta tells you who was aggressive, not who won.

---

Cumulative Volume Delta (CVD)

Bar-by-bar delta summed over the session. Shows the running total of aggressive flow.

Rising CVD + Falling price = Bearish divergence
Falling CVD + Rising price = Bullish divergence

---

Divergence Signals

Top Tick (Bearish):
Price: Higher high
CVD: Lower high
→ Aggression is failing → reversal likely

Bottom Tick (Bullish):
Price: Lower low
CVD: Higher low
→ Selling is failing → reversal likely

---

Delta Execution

For bullish setups:
- Wait for positive delta confirmation
- Buy on bars with elevated positive delta
- CVD should be rising

For bearish setups:
- Wait for negative delta confirmation
- Sell on bars with elevated negative delta
- CVD should be falling

---

Key Insight

Delta is a tool, not a signal. Always combine delta with location, structure, and order flow. Delta alone tells you nothing — delta at support vs resistance means completely different things.`
      },
      {
        title: "L4 — Absorption",
        tag: "core",
        content: `L4 — Absorption

---

What Absorption Is

Absorption occurs when large orders are taken without price moving. Someone is absorbing the opposite flow, preventing price from moving in the direction of aggression.

The visual: Heavy volume at a level, but price barely moves.

---

How to Read Absorption

In the footprint:
- Large volume print at a price
- Minimal price movement (ticks or less)
- Aggressive side hitting but not moving price

On the tape:
- Rapid-fire prints at a level
- Price staying flat despite the prints
- Either someone absorbing or getting exhausted

---

Absorption Types

1. Absorption at Resistance (Bearish):
Large ask-side prints, price doesn't rise. Sellers are being absorbed.

2. Absorption at Support (Bullish):
Large bid-side prints, price doesn't fall. Buyers are being absorbed.

3. Exhaustion Absorption:
Large prints at the end of a move. The last of the aggression.

---

The Absorption Score

Absorption Score = Volume at Level / Price Movement (ticks)

High absorption score = someone absorbing (strong hands)
Low absorption score = normal trade (price moves with volume)

---

Trading Absorption

Bullish Absorption Setup:
1. Price at support or prior low
2. Large bid-side prints appear
3. Price doesn't fall (absorption)
4. Next candle: price rises
5. Entry: Break above absorption candle high

Bearish Absorption Setup:
1. Price at resistance or prior high
2. Large ask-side prints appear
3. Price doesn't rise (absorption)
4. Next candle: price falls
5. Entry: Break below absorption candle low

---

Key Insight

Absorption tells you WHERE strong hands are. When you see absorption, mark the level. Strong hands absorbing at a level often means price will reverse from that level.`
      },
      {
        title: "L5 — Market Structure",
        tag: "core",
        content: `L5 — Market Structure

---

What Market Structure Is

Market structure is the framework of highs, lows, and ranges that define the current market state. It's the foundation of all analysis.

---

The Three States

1. Trending (Directional):
- Higher highs and higher lows (uptrend)
- Lower highs and lower lows (downtrend)
- Momentum in one direction
- Strategy: Trade with the trend

2. Range-Bound (Balanced):
- Price oscillating between support and resistance
- No clear directional bias
- Strategy: Fade extremes, target opposite side

3. Transitioning:
- Breaking out of a range or trend
- Uncertainty about direction
- Strategy: Wait for confirmation

---

Break of Structure (BOS)

When price breaks a prior high/low in the direction of the trend:
- Confirms the trend
- Signals continuation
- Provides entry opportunity

In an uptrend: BOS = break above prior higher low
In a downtrend: BOS = break below prior lower high

---

Change of Character (CHoCH)

When price breaks a prior high/low AGAINST the direction of the trend:
- Signals potential reversal
- Structure is changing
- Be cautious of fading

In an uptrend: CHoCH = break below prior higher low
In a downtrend: CHoCH = break above prior lower high

---

Trading Structure

1. Identify the state (trend, range, transition)
2. Define key levels (swing highs, lows, range boundaries)
3. Wait for price at decision points (extremes, breakouts)
4. Trade the response (acceptance or rejection)
5. Manage the trade with structure

---

Key Insight

Market structure is the most important factor. A perfect setup at the wrong structure level is a bad trade. A mediocre setup at the right structure level is a good trade.`
      },
      {
        title: "L6 — Market Profile",
        tag: "core",
        content: `L6 — Market Profile

---

What Market Profile Is

Market Profile is a visualization of price distribution over time. It was developed by J. Peter Steidlmayer at the CBOT to show where prices traded and how long they spent there.

---

Key Metrics

POC (Point of Control):
- Price with most TPOs (time) or volume
- The "fairest" price through the session
- Acts as a magnet for future price

Value Area (VA):
- The range containing 70% of trading
- VAH = Value Area High
- VAL = Value Area Low
- Rejection zones

Tails:
- Single TPOs at extremes
- Price moved through quickly
- Signal "unfinished business"

---

Day Types

Normal Day:
- Bell-curve profile
- Two-sided trade
- Range-bound, mean-revert

Trend Day:
- Elongated profile
- One-sided trade
- Directional, trend following

Double Distribution:
- Two value areas
- Gap between them
- Major structural shift

---

Trading With Profile

At VAH: Look for rejection (short), confirm with order flow
At VAL: Look for rejection (long), confirm with order flow
At POC: Target for mean reversion
In Tail: Expect price to return (unfinished business)

---

Key Insight

Market Profile tells you WHERE the auction conducted business. Use it to identify the key levels, then wait for price to return to them.`
      },
      {
        title: "L7 — Volume Profile",
        tag: "core",
        content: `L7 — Volume Profile

---

What Volume Profile Is

Volume Profile is like Market Profile but uses actual traded volume instead of time (TPOs). It shows where the most volume occurred.

---

Key Concepts

High Volume Node (HVN):
- Where most trading occurred
- Acceptance zone
- Price tends to slow or reverse when revisiting

Low Volume Node (LVN):
- Where little trading occurred
- Traverse zone
- Price moves quickly through these areas

---

The Volume Profile Framework

1. Identify the prominent chunks (HVNs)
2. Mark the edges of the chunks (support/resistance)
3. Price at HVN → expect friction
4. Price at LVN → expect continuation
5. Trade the edges

---

VPOC

Volume Point of Control: The single price with the most volume.

Properties:
- Strongest acceptance level
- Magnetic for future price
- Key reference for mean reversion

---

Multi-Timeframe Profiles

D1/W1 profile: Major structural levels
30-day profile: Recent balance areas
Session profile: Intraday reference

Use multiple timeframes for confluence.

---

Trading With Volume Profile

Mean Reversion to VPOC:
When price is far from VPOC, expect reversion in range-bound markets.

LVN Breakout:
When price breaks through LVN, expect continuation to next HVN.

HVN Revisit:
When price returns to HVN, expect friction and possible reversal.

---

Key Insight

Volume Profile is behavioral. HVNs are where buyers and sellers agreed. LVNs are where they disagreed. The edges of HVNs are the key trading levels.`
      },
      {
        title: "L8 — Implied Volatility",
        tag: "core",
        content: `L8 — Implied Volatility

---

What Implied Volatility Is

Implied Volatility (IV) is the market's forecast of future volatility, extracted from option prices. It's what the options market "implies" volatility will be.

---

IV vs Realized Volatility

IV: Forward-looking (what the market expects)
Realized: Backward-looking (what actually happened)

The gap between IV and RV is the volatility risk premium.

---

When IV is High

IV high = options expensive
- Earnings, events approaching
- Market stress
- Fear elevated
- Selling options is attractive

---

When IV is Low

IV low = options cheap
- Calm market
- Complacency elevated
- Buying options is attractive

---

IV in Trading

Before Events:
- IV elevated → sell options (collect premium)
- Risk: large move crushes you

After Events:
- IV collapsed → buy options (cheap)
- Position for future vol

---

Key Insight

IV is a forecast. If you can forecast IV better than the market, you have an edge. Track the IV/RV ratio to know when options are expensive or cheap.`
      },
      {
        title: "L9 — The Greeks",
        tag: "core",
        content: `L9 — The Greeks

---

The Five Greeks

Delta: Directional exposure (like owning stock)
Gamma: Rate of change of delta
Theta: Time decay
Vega: Volatility sensitivity
Rho: Interest rate sensitivity

---

Delta

Long Call: Positive delta
Long Put: Negative delta
ATM options: Delta ≈ 0.50

---

Gamma

Long options: Positive gamma (delta accelerates favorably)
Short options: Negative gamma (delta accelerates against you)

ATM options have highest gamma.

---

Theta

Long options: Negative theta (time decay hurts)
Short options: Positive theta (time decay helps)

Near expiration, theta accelerates.

---

Vega

Long options: Positive vega (rise when IV rises)
Short options: Negative vega (fall when IV falls)

ATM options have highest vega.

---

Key Insight

Understanding the Greeks allows you to build positions with specific risk profiles. Match your market view to the appropriate Greek exposure.`
      },
      {
        title: "L10 — Gamma and GEX",
        tag: "advanced",
        content: `L10 — Gamma and GEX

---

Gamma in Options

Gamma measures how fast delta changes. High gamma = delta changes rapidly with price moves.

---

GEX (Gamma Exposure)

GEX aggregates gamma across all SPX options, converted to futures terms.

GEX = Σ(Γ × OI × 100 × S² × 0.01)

---

What GEX Tells You

Positive GEX:
- Dealers long gamma
- Mean-reverting
- Vol suppressed
- Pinning likely

Negative GEX:
- Dealers short gamma
- Trending, amplifying
- Vol expansion
- Squeeze risk

---

The Pinning Mechanism

When dealers are long gamma (positive GEX):
- As price rises → dealers sell → pushes price down
- As price falls → dealers buy → pushes price up
- Result: Price gravitates toward high-OI strikes

---

Trading With GEX

Low GEX environment:
- Expect range-bound, mean reversion
- Fade the edges

Negative GEX environment:
- Expect trending moves
- Don't fade — follow

---

Key Insight

GEX tells you the market regime. Positive GEX = chop. Negative GEX = trend. Adjust your strategy accordingly.`
      },
      {
        title: "L11 — Vanna and Charm",
        tag: "advanced",
        content: `L11 — Vanna and Charm

---

Vanna

Vanna = ∂Δ/∂σ = ∂ν/∂S

Vanna is how delta changes when volatility changes. It's the second-order Greek related to vega-delta interaction.

---

Why Vanna Matters

When IV falls (vol crush):
- Delta of OTM options changes
- This creates systematic dealer hedging flows
- These flows are predictable

The vol crush rally:
- IV falls → put deltas decrease
- Dealers must sell stock to re-hedge
- This selling pressure → then reversal
- At reversal, dealers buy back → rally

---

Charm

Charm = ∂Δ/∂t

Charm is how delta changes over time. At expiration, charm causes dealers to adjust hedges.

---

End-of-Day Charm Effect

At 3:00 PM CT on OpEx Friday:
- Charm is highest
- Dealers must rebalance for overnight risk
- Creates additional hedging flow
- Can cause late-day pinning or reversal

---

Key Insight

Vanna and charm explain flows that aren't visible in standard delta analysis. They're the "second-order" dealer mechanics that create predictable market behavior.`
      },
      {
        title: "L12 — Options Flow Basics",
        tag: "core",
        content: `L12 — Options Flow Basics

---

What Options Flow Is

Options flow analysis studies the buying and selling of options contracts to identify institutional positioning.

---

Reading Flow

Call buying: Bullish (expect price rise)
Put buying: Bearish (expect price fall)
Call selling: Bearish (seller thinks price won't rise)
Put selling: Bullish (seller thinks price won't fall)

---

Sweeps vs Blocks

Sweep: Crossing multiple exchanges to get filled immediately. Signals urgency.

Block: Large bilateral trade. Signals institutional size.

---

Premium as Signal

Low premium trades: Likely retail hedging or speculation
High premium trades: Likely institutional (they can afford it)

---

Key Insight

Options flow tells you where large players are positioning. Use it to understand the market's directional bias, but always confirm with price action.`
      },
      {
        title: "L13 — Advanced Options Flow",
        tag: "advanced",
        content: `L13 — Advanced Options Flow

---

Net Flow Analysis

Sum of all puts minus all calls over a period:
- Positive net flow = more put buying = bearish
- Negative net flow = more call buying = bullish

---

OI Changes

Open Interest increasing + price rising = fresh buying
Open Interest increasing + price falling = fresh selling
Open Interest decreasing + price rising = short covering
Open Interest decreasing + price falling = long liquidation

---

Strike Analysis

High OI at strikes:
- Acts as magnets for price (pinning)
- Creates dealer hedging flows
- Levels of support/resistance

---

The Flow Framework

1. Track net flow direction (puts vs calls)
2. Identify high OI strikes
3. Look for sweep activity at key strikes
4. Confirm with price action
5. Trade the alignment

---

Key Insight

Advanced flow analysis combines flow direction, OI changes, and strike analysis. It's not about any single trade — it's about understanding the aggregate positioning of the market.`
      },
      {
        title: "L14 — Macro Fundamentals",
        tag: "core",
        content: `L14 — Macro Fundamentals

---

What Macro Is

Macro is the study of broad economic forces that drive markets:
- Central bank policy
- Economic data
- Geopolitical events
- Global capital flows

---

The Macro Framework

1. Growth: GDP, PMI, employment
2. Inflation: CPI, PPI, PCE
3. Policy: Fed rate, QE, guidance
4. Risk: Geopolitical, financial stress

---

Central Banks

Fed (US):
- Controls interest rates
- Controls money supply
- Sets the tone for global markets

ECB, BOJ, BOE:
- Regional policies
- Impact EUR, JPY, GBP
- Interact with USD dynamics

---

Trading Macro

Macro drives the highest timeframes:
- Identify the macro regime (risk-on/off)
- Align trades with macro direction
- Use order flow for timing

---

Key Insight

Macro is the tide. Order flow is the wave. Don't fight the macro tide when trading intraday.`
      },
      {
        title: "L15 — Macro Trading",
        tag: "core",
        content: `L15 — Macro Trading

---

Applying Macro to Trading

Macro provides direction. Order flow provides timing.

The process:
1. Identify macro regime (bull/bear, risk-on/off)
2. Define key macro levels (Fed rates, CPI, NFP)
3. Wait for order flow confirmation
4. Execute with tight risk management

---

Data Trading

Major data events (NFP, CPI, FOMC):
- Vol spike before
- Direction after
- Wait for 15-minute candle close
- Follow the reaction

---

Key Insight

Macro sets the stage. Order flow executes the trade. Never ignore macro context when trading intraday.`
      },
      {
        title: "L16 — Tape Reading",
        tag: "core",
        content: `L16 — Tape Reading

---

What the Tape Is

The tape (Time & Sales) is a real-time record of every trade. It shows price, size, and direction for each print.

---

Reading the Tape

Size: Large prints = institutional
Speed: Fast prints = urgency
Location: Where prints occur matters
Pattern: Sequences of prints vs single prints

---

Tape Patterns

Momentum: Consecutive prints in one direction
Exhaustion: Prints at extremes, not moving price
Absorption: Large prints, price not moving
Sweep: Rapid hitting through levels

---

Key Insight

The tape tells you who is aggressive and where. Always read tape in context of structure and location.`
      },
      {
        title: "L17 — Tape Reading Advanced",
        tag: "advanced",
        content: `L17 — Tape Reading Advanced

---

Multi-Timeframe Tape

1-minute tape: Short-term momentum
5-minute tape: Session trends
Hourly tape: Structural flow

Multi-timeframe confluence = highest probability

---

Tape vs Order Flow

Tape shows executed volume (what happened)
Order flow shows the flow (who did it)

Combined: The complete picture

---

Advanced Patterns

Icebergs: Hidden large orders (small consistent prints)
Sweep: Rapid through multiple levels
Absorption: Taking without moving
Exhaustion: Last of the move

---

Key Insight

Advanced tape reading combines multi-timeframe analysis with pattern recognition. The goal is to identify institutional flow and trade with it.`
      },
      {
        title: "L18 — Trading Plan",
        tag: "core",
        content: `L18 — Trading Plan

---

Why a Trading Plan Matters

A trading plan removes emotion from trading. It defines what you're looking for before you see it.

---

Components of a Trading Plan

1. Market Analysis:
- What is the market doing?
- What is the structure?
- What are the key levels?

2. Trade Setup:
- What are you looking for?
- What confirms the setup?
- Where is invalidation?

3. Execution:
- Entry rules
- Position sizing
- Stop loss
- Target

4. Review:
- What went well?
- What went wrong?
- What to improve?

---

The Daily Plan

Each day before the open:
- Review overnight price action
- Identify key levels
- Note scheduled news
- Define your trades
- Set alerts

---

Key Insight

A trading plan is not rigid. It's a framework that guides decisions. Follow it when the market cooperates. Adapt it when it doesn't.`
      },
      {
        title: "L19 — Risk Management",
        tag: "core",
        content: `L19 — Risk Management

---

The Most Important Topic

Risk management is more important than entry. A trader with mediocre entries but excellent risk management survives. A trader with perfect entries but poor risk management blows up.

---

The Rules

1. Never risk more than 1-2% per trade
2. Always know your invalidation before entry
3. Cut losses immediately
4. Let winners run
5. Never average down
6. Respect drawdown limits

---

Position Sizing

Dollar risk = (Entry - Stop) × Point value
Contracts = Max risk / Dollar risk per contract

Always size to your max dollar risk, never guess.

---

Key Insight

The goal is to survive. Survive long enough, and the wins take care of themselves.`
      },
      {
        title: "L20 — Trading Psychology",
        tag: "core",
        content: `L20 — Trading Psychology

---

The Psychological Challenge

Trading is 80% psychology, 20% mechanics. The tools are easy to learn. The psychology is hard to master.

---

Common Psychological Errors

1. Revenge Trading: Trying to recover losses with larger trades
2. Overtrading: Trading too frequently without edge
3. Confirmation Bias: Only seeing information that supports your view
4. Disposition Effect: Holding losers too long, cutting winners too early
5. Recency Bias: Overweighting recent experience

---

The Psychological Framework

1. Accept that losses are part of trading
2. Focus on process, not P&L
3. Follow your system mechanically
4. Take breaks when emotional
5. Review with detachment

---

Key Insight

The market doesn't care about your emotions. Control them, or they'll control your account.`
      },
      {
        title: "L21 — Trading as a Business",
        tag: "core",
        content: `L21 — Trading as a Business

---

The Business Mindset

Trading is a business, not a hobby. Treat it like one.

---

Components of a Trading Business

1. Capital: The money you're trading with
2. Edge: Your statistical advantage
3. Risk Management: How you protect capital
4. Record Keeping: Track everything
5. Continuous Improvement: Always learning

---

Business Metrics

- Win rate
- Average win/loss ratio
- Expectancy: (Win% × AvgWin) - (Loss% × AvgLoss)
- Maximum drawdown
- Risk-adjusted return

---

The Professional Approach

1. Treat trading as a job
2. Keep detailed records
3. Review regularly
4. Improve continuously
5. Protect capital first

---

Key Insight

Building a trading business takes years. The goal is to compound capital while surviving. Patience and discipline are the competitive advantages.`
      },
      {
        title: "L22 — Advanced Concepts",
        tag: "advanced",
        content: `L22 — Advanced Concepts

---

Advanced Order Flow

- Multi-timeframe delta analysis
- Absorption at structural levels
- Exhaustion patterns
- Dealer hedging flow prediction

---

Advanced Volatility

- Dispersion trading
- Volatility surface dynamics
- Term structure arbitrage
- Correlation regimes

---

Advanced Options

- Vanna/Charm flows
- Gamma dynamics
- Dispersion strategies
- Exotic structures

---

The Path Forward

Master the basics first. Then layer in advanced concepts. The foundation must be solid.

---

Key Insight

Advanced concepts build on fundamentals. Don't skip steps.`
      },
      {
        title: "L23 — Putting It All Together",
        tag: "core",
        content: `L23 — Putting It All Together

---

The Integrated Approach

1. Macro: Define the environment
2. Structure: Identify the state
3. Levels: Mark the key prices
4. Flow: Wait for confirmation
5. Execute: Enter with risk management
6. Review: Learn from every trade

---

The Checklist

Before every trade:
- What is the macro context?
- What is the structure?
- Where are the key levels?
- What is the order flow saying?
- Where is my invalidation?
- What is my position size?

---

Key Insight

Trading is a system. Every component must work together. Weakness in any component weakens the whole.`
      },
      {
        title: "L24 — Building Your Edge",
        tag: "core",
        content: `L24 — Building Your Edge

---

What an Edge Is

An edge is a statistical advantage that, when applied consistently over many trades, produces positive expectancy.

Edge = Win Rate × Average Win - Loss Rate × Average Loss

---

Sources of Edge

1. Information: Knowing something others don't
2. Execution: Getting better prices
3. Psychology: Following the system
4. Position Sizing: Optimal bet sizing
5. Strategy: Exploiting market inefficiencies

---

Developing Your Edge

1. Find what works for you
2. Test it extensively
3. Document the rules
4. Follow mechanically
5. Refine continuously

---

Key Insight

Your edge doesn't need to be unique. It needs to be consistent.`
      },
      {
        title: "L25 — Institutional Flow",
        tag: "advanced",
        content: `L25 — Institutional Flow

---

Who Moves the Market

Institutions control the majority of market volume. Their flow dominates price action.

---

Reading Institutional Flow

1. Options positioning: Where large players are hedging
2. Futures COT: Commitment of Traders reports
3. Block trades: Large bilateral transactions
4. Mega cap volume: When institutions move

---

Trading With Institutions

1. Identify institutional levels (high OI strikes, VWAP, value)
2. Wait for institutional flow confirmation (delta, absorption)
3. Trade in the direction of institutional flow
4. Manage the trade with institutional targets

---

Key Insight

Institutions are predictable in their behavior, not in their timing. Trade with them when you see their flow, not before.`
      },
      {
        title: "L26 — Real Trading",
        tag: "core",
        content: `L26 — Real Trading

---

From Theory to Practice

The hardest part of trading is execution. Knowing and doing are different.

---

The Real Trading Checklist

1. Pre-session: Plan before the open
2. In-session: Follow your plan
3. Post-session: Review every trade
4. Weekly: Analyze patterns
5. Monthly: Measure progress

---

Common Pitfalls

- Overtrading
- Not following the plan
- Ignoring risk management
- Letting emotions win
- Chasing losses

---

Key Insight

Real trading requires discipline, patience, and humility. The market will test all of them.`
      },
      {
        title: "L27 — The Path Forward",
        tag: "core",
        content: `L27 — The Path Forward

---

The Journey

Trading mastery is a years-long journey. Most quit in the first year. Those who persist and improve survive.

---

The Framework

1. Learn: Absorb everything
2. Practice: Paper trade first
3. Execute: Small size
4. Grow: Increase as you prove yourself
5. Master: Compound over time

---

The Mindset

- Be humble
- Be patient
- Be disciplined
- Be curious
- Be persistent

---

Final Thought

The goal is not to get rich quickly. The goal is to build a skill that compounds over a lifetime. Respect the process. Respect the market. Respect yourself.

Trade well.`
      }
    ]
  }
};

export const odfBaseModules = {
  ...orderFlowModules,
  ...optionsFlowModules,
  ...macroModules,
  ...microstructureModules,
  ...regimesModules,
  ...riskManagementModules,
  ...participantsModules,
  ...quantModules,
  ...volatilityModules,
  ...greeksModules,
  ...practiceModules,
  ...lecturesModules
};

export const odfBaseModulesList = Object.keys(odfBaseModules).map((key) => ({
  id: key,
  ...(odfBaseModules as any)[key],
}));

export default odfBaseModules;