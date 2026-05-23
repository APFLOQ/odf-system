export const completeContent: Record<string, any> = {
  // MÓDULO 1: Fundamentos (m1)
  "m1": {
    title: "Change Point Detection — Más Allá del CUSUM Básico",
    phase: "Módulo 1 — Fundamentos",
    topics: [
      {
        title: "PELT — Pruned Exact Linear Time (Killick, Fearnhead, Eckley 2012)",
        tag: "core",
        content: `
PELT es el algoritmo de referencia para detección de múltiples change points. La innovación central es usar programación dinámica con podas (pruning) que reducen la complejidad de O(n²) a O(n) en promedio.

### 1.1 La mecánica de la poda

El algoritmo minimiza: Q(τ₁...τₖ) = Σᵢ C(y_{τᵢ₋₁:τᵢ}) + β·K

La poda funciona así: para cada punto t, se mantiene una lista de "candidatos". Si el costo de pasar por un candidato es mayor que el costo de saltarlo, ese candidato se poda permanentemente.

### 1.2 La penalización óptima

- **BIC**: pen = log(n) · 2 · σ²_returns
- **AIC**: pen = 2 · 2 · σ²_returns  
- **HQC**: pen = 2 · log(log(n)) · σ²_returns
- Para returns diarios: pen ≈ 0.03-0.08
- Para 5-min bars: pen ≈ 0.5-2.0
        `
      },
      {
        title: "BOCPD — Bayesian Online Changepoint Detection",
        tag: "advanced",
        content: `
Adams & MacKay (2007) desarrollaron BOCPD, que calcula recursivamente P(rₜ | x₁:t) donde rₜ es el "run length".

### 2.1 El concepto de run length

rₜ ∈ {0, 1, 2, ...} donde rₜ = k significa "el último cambio ocurrió hace exactamente k barras".

### 2.2 La hazard function

| Hazard Function | Fórmula | Comportamiento |
|-----------------|---------|----------------|
| Constante | H(r) = 1/λ | Tasa uniforme |
| Geométrica | H(r) = 1 - pᵒˡᵈ | Decae con el run length |
| Uniforme | H(r) = 1 si r ≥ L | Cambio obligatorio tras L barras |

Para datos de mercado, p_old = 0.999 es buen punto de partida.
        `
      },
      {
        title: "Structural Breaks — Tests Formales (Chow, Andrews, Bai-Perron)",
        tag: "core",
        content: `
Los tests de structural break prueban si hay evidencia suficiente para declarar un cambio.

### Chow Test (1960)

F = [(RSS_pooled - (RSS₁ + RSS₂)) / k] / [(RSS₁ + RSS₂) / (n - 2k)]

**Limitación**: si estimas τ de los datos, el test se invalida.

### Bai-Perron

Framework completo para múltiples cambios desconocidos. El algoritmo usa programación dinámica O(n²) y tests secuenciales.

### Código

\`\`\`python
import ruptures as rpt
y = np.load('market_returns.npy')
algo = rpt.Dynp(model="l2", min_size=5).fit(y)
for k in range(1, 8):
    bkps = algo.predict(n_bkps=k)
    # Calcular BIC/AIC
\`\`\`
        `
      },
      {
        title: "Criterios de información y selección del número de regímenes K",
        tag: "core",
        content: `
La selección de K es uno de los problemas más delicados. K=2 es demasiado simple; K>5 introduce sobreparametrización.

### AIC vs BIC vs HQIC

| Criterio | Penalización | Tendencia |
|----------|--------------|-----------|
| AIC | 2k | Sobrestima K |
| BIC | k·ln(n) | Subrestima K |
| HQIC | 2k·ln(ln(n)) | Intermedio |

**Regla práctica**: Para ES/NQ con datos diarios, K=3-4 es el rango óptimo.
        `
      }
    ]
  },

  // MÓDULO 2: MS Models (m4, m5)
  "m4": {
    title: "Hamilton Markov-Switching Model — Arquitectura Completa",
    phase: "Módulo 2 — MS Models",
    topics: [
      {
        title: "Especificación del MS-AR(p) y las tres variantes",
        tag: "advanced",
        content: `
El modelo MS-AR(p): yₜ = μ(Sₜ) + Σᵢ φᵢ(Sₜ)(yₜ₋ᵢ - μ(Sₜ₋ᵢ)) + σ(Sₜ)εₜ

### MSM, MSV y MSMV

| Variante | Parámetros | Aplicación |
|----------|------------|------------|
| MSM | Solo μ cambia | Cambios en drift |
| MSV | Solo σ² cambia | Regímenes de volatilidad |
| MSMV | Ambos cambian | Regímenes completos |

### Matriz de transición P

E[duración | régimen i] = 1 / (1 - pᵢᵢ)
        `
      },
      {
        title: "Filtro de Hamilton y Smoother de Kim",
        tag: "advanced",
        content: `
El filtro de Hamilton calcula recursivamente las probabilidades de estar en cada régimen.

### Filtrado

Prediction: ξₜ₊₁|t = P' · ξₜ|t

Update: ξₜ₊₁|t₊₁ = (ηₜ₊₁ ⊙ ξₜ₊₁|t) / Σⱼ ηₜ₊₁(j)·ξₜ₊₁|j

### Código

\`\`\`python
class HamiltonFilter:
    def filter(self, y_series):
        for t in range(T):
            xi_pred = self.P.T @ xi
            eta = np.array([self.likelihood(y_series[t], s) for s in range(self.K)])
            xi_unnorm = eta * xi_pred
            xi = xi_unnorm / xi_unnorm.sum()
            filtered[t] = xi
        return filtered
\`\`\`
        `
      }
    ]
  },

  // MÓDULO 3: HMM (m7, m8, m9)
  "m7": {
    title: "Hidden Markov Models — Arquitectura y los Tres Problemas de Rabiner",
    phase: "Módulo 3 — HMM",
    topics: [
      {
        title: "Problema 1 — Evaluation: Algoritmo Forward",
        tag: "core",
        content: `
Dada una secuencia de observaciones O y un modelo λ, ¿cuál es P(O|λ)?

### Forward

α₁(i) = πᵢ · bᵢ(o₁)

αₜ(j) = bⱼ(oₜ) · Σᵢ [αₜ₋₁(i) · aᵢⱼ]

P(O|λ) = Σᵢ αT(i)

**Importante**: Usar log-space para evitar underflow.
        `
      },
      {
        title: "Problema 2 — Decoding: Algoritmo de Viterbi",
        tag: "core",
        content: `
¿Cuál es la secuencia de estados más probable?

### Código

\`\`\`python
def viterbi(observations, A, B, pi):
    for t in range(1, T):
        for j in range(K):
            scores = delta[t-1] + A[:, j]
            psi[t, j] = np.argmax(scores)
            delta[t, j] = np.max(scores) + B[j, observations[t]]
    # Backtrack
    q_star = np.zeros(T, dtype=int)
    for t in range(T-2, -1, -1):
        q_star[t] = psi[t+1, q_star[t+1]]
    return q_star
\`\`\`
        `
      },
      {
        title: "Problema 3 — Learning: Baum-Welch (EM para HMM)",
        tag: "advanced",
        content: `
Baum-Welch alterna entre:
- E-step: calcular expected sufficient statistics
- M-step: maximizar expected log-likelihood

### Fórmulas

γₜ(i) = αₜ(i)βₜ(i) / Σⱼ αₜ(j)βₜ(j)

ξₜ(i,j) = αₜ(i)aᵢⱼbⱼ(oₜ₊₁)βₜ₊₁(j) / P(O|λ)

π̂ᵢ = γ₁(i)
âᵢⱼ = Σₜ ξₜ(i,j) / Σₜ Σₖ ξₜ(i,k)
        `
      }
    ]
  },

  // MÓDULO 4: Volatilidad (m10, m11, m12)
  "m10": {
    title: "Volatility Regimes — RS-GARCH, HAR-RV, VIX Term Structure",
    phase: "Módulo 4 — Volatilidad",
    topics: [
      {
        title: "HAR-RV — Heterogeneous Autoregressive Realized Volatility",
        tag: "quant",
        content: `
HAR-RV modela la volatilidad como combinación de componentes de diferentes horizontes:

RV_{t+1} = c + β_D·RV_t + β_W·RV^(W)_t + β_M·RV^(M)_t + εₜ

### Interpretación
- β_D ≈ 0.4-0.6 (persistencia diaria)
- β_W ≈ 0.1-0.2 (contribución semanal)
- β_M ≈ 0.05-0.15 (contribución mensual)

### Código

\`\`\`python
def har_rv_regression(rv):
    df = pd.DataFrame({'RV': rv})
    df['RV_D'] = rv
    df['RV_W'] = rv.rolling(5).mean().shift(1)
    df['RV_M'] = rv.rolling(22).mean().shift(1)
    X = df[['RV_D', 'RV_W', 'RV_M']].dropna()
    y = df['RV'].dropna()
    return LinearRegression().fit(X, y)
\`\`\`
        `
      },
      {
        title: "VIX Term Structure — Contango vs Backwardation",
        tag: "core",
        content: `
La pendiente de la curva VIX es uno de los indicadores de régimen más seguidos.

### Contango
Curva con pendiente positiva. Régimen normal donde vendedores de opciones reciben prima.

### Backwardation
VIX spot > VIX3M > VIX6M. Régimen de stress donde buyers de opciones tienen ventaja.

### VVIX
VVIX = volatilidad del VIX. VVIX alto + VIX bajo = complacencia frágil.

### Variance Risk Premium
VP = IV² - RV²
- VP > 0 → normal
- VP < 0 → stress
        `
      }
    ]
  },

  // MÓDULO 5: Microestructura (m13, m14)
  "m13": {
    title: "Microestructura y Order Flow — PIN, VPIN, OFI",
    phase: "Módulo 5 — Microestructura",
    topics: [
      {
        title: "PIN — Probability of Informed Trading",
        tag: "advanced",
        content: `
PIN cuantifica la probabilidad de que una orden venga de un trader informado.

PIN = α / (α + μ)

donde α = probabilidad de news, μ = tasa de noise traders

### VPIN (Volume-synchronized)
VPIN = |V_buy - V_sell| / V_total

VPIN > 0.5 → percentil 90 → régimen de alta toxicidad
VPIN > 0.7 → percentil 99 → crash inminente
        `
      },
      {
        title: "OFI — Order Flow Imbalance y DOM Regimes",
        tag: "advanced",
        content: `
OFI captura el desequilibrio entre presión compradora y vendedora.

OFI = ΔAsk_size - ΔBid_size

### Regímenes de DOM

**Absorption**: nivel defensivo institucional que no se atraviesa
**Exhaustion**: precio se mueve sin aumento de volumen (divergencia)

### Código

\`\`\`python
class VPINCalculator:
    def update(self, trade):
        side = self.classify_trade(trade)
        if side == 'buy':
            self.bucket_buys[-1].append(size)
        else:
            self.bucket_sells[-1].append(size)
        return self.current_vpin()
\`\`\`
        `
      }
    ]
  },

  // MÓDULO 6: Correlaciones (m16, m17, m18)
  "m16": {
    title: "Correlation Regimes — DCC-GARCH, Copulas",
    phase: "Módulo 6 — Correlaciones",
    topics: [
      {
        title: "DCC-GARCH (Engle 2002)",
        tag: "core",
        content: `
DCC-GARCH para matrices de correlación dinámicas.

Paso 1: Estimar GARCH univariados
Paso 2: Calcular residuos estandarizados  
Paso 3: Estimar la dinámica de correlación

Qₜ = (1-a-b)·S + a·uₜ₋₁uₜ₋₁' + b·Qₜ₋₁
        `
      },
      {
        title: "Copulas",
        tag: "advanced",
        content: `
Las copulas capturan dependencia no-lineal y tail dependence.

**Tipos**:
- Gaussian: correlación lineal
- Student-t: tail dependence
- Clayton: dependencia asimétrica

La correlación Gaussiana subestima la probabilidad de crashes conjuntos.
        `
      }
    ]
  },

  // MÓDULO 7: ML (m19, m20, m21)
  "m19": {
    title: "Machine Learning para Clasificación de Regímenes",
    phase: "Módulo 7 — ML",
    topics: [
      {
        title: "GMM — Gaussian Mixture Model clustering",
        tag: "core",
        content: `
GMM es un HMM sin dependencia temporal.

### Feature space
- return_rolling (5 días)
- vol_rolling (20 días)
- skew_rolling
- vol_ratio = RV/IV
- vix_level, vix_slope
- ofi_rolling

### Código

\`\`\`python
from sklearn.mixture import GaussianMixture

for K in range(2, 8):
    gmm = GaussianMixture(n_components=K)
    gmm.fit(features_scaled)
    bic_scores.append(gmm.bic(features_scaled))

best_K = np.argmin(bic_scores) + 2
\`\`\`
        `
      },
      {
        title: "LSTM para clasificación de regímenes",
        tag: "advanced",
        content: `
LSTM captura dependencias de largo plazo.

### Arquitectura
LSTM(64) → Dropout(0.3) → LSTM(32) → Dropout(0.3) → Dense(K, softmax)

**Critical**: Usar walk-forward validation, nunca random split para series temporales.

\`\`\`python
model = Sequential([
    LSTM(64, input_shape=(20, n_features), return_sequences=True),
    Dropout(0.3),
    LSTM(32),
    Dropout(0.3),
    Dense(3, activation='softmax')
])
\`\`\`
        `
      }
    ]
  },

  // MÓDULO 8: Opciones (m22, m23, m24)
  "m22": {
    title: "Options Regimes — GEX/DEX, Vol Surface, 0DTE",
    phase: "Módulo 8 — Opciones",
    topics: [
      {
        title: "GEX / DEX — Gamma Exposure",
        tag: "core",
        content: `
GEX (Gamma Exposure) = Σ Γ · ΔS · OpenInterest

 DEX = dealers' gamma net exposure

**Concepción**:
- Dealers long gamma = estabilizadores (hedge direction)
- Dealers short gamma = desestabilizadores

### Charm y vanna flows
Mecanismos por los cuales el hedging de opciones distorsiona el subyacente.
        `
      },
      {
        title: "Vol Surface — Skew, Term Structure, Butterfly",
        tag: "advanced",
        content: `
La superficie de volatilidad revela el precio del riesgo por strike y vencimiento.

### Skew
At-the-money vs out-of-the-money vol diferencia.

### Term Structure
Contango vs backwardation en la curva de vols.

### Butterfly
Relación entre strikes extremos y el centro.
        `
      },
      {
        title: "0DTE — Zero Days to Expiration",
        tag: "advanced",
        content: `
0DTE: opciones con menos de 1 día de vida.

**Características**:
- Gamma extremamente alta
- Theta decay acelerado
- Volumen de opciones supera al subyacente

**Estrategias**:
- Directional con gestión de riesgo estricta
- Iron condors para captura de prima
        `
      }
    ]
  },

  // MÓDULO 9: Real-Time (m25, m26)
  "m25": {
    title: "Real-Time Detection — SPRT, CUSUM, Particle Filters",
    phase: "Módulo 9 — Real-Time",
    topics: [
      {
        title: "SPRT & CUSUM — Sequential Probability Ratio Test",
        tag: "core",
        content: `
SPRT minimiza el expected sample size para detectar cambios.

### SPRT

H₀: μ = μ₀
H₁: μ = μ₁

Log-likelihood ratio: Sₙ = Σ log(Λᵢ)

Decision:
- Sₙ > a → aceptar H₁
- Sₙ < b → aceptar H₀  
- a ≤ Sₙ ≤ b → continuar muestreando

### CUSUM

CUSUM = Σ (xₜ - μ₀)

Alertas cuando CUSUM sale de los bands ±k.
        `
      },
      {
        title: "Particle Filters — Sequential Monte Carlo",
        tag: "advanced",
        content: `
Particle filters usan simulaciones para tracking de estados.

### Algoritmo

1. **Prediction**: propagate particles según modelo
2. **Update**: reweight según likelihood
3. **Resampling**: eliminar partículas de baja weight

\`\`\`python
class ParticleFilter:
    def predict(self):
        for p in self.particles:
            p.x += p.v + np.random.normal(0, self.Q)
    
    def update(self, observation):
        for p in self.particles:
            weight = self.likelihood(observation, p.x)
            p.weight *= weight
        self.normalize_weights()
        self.resample()
\`\`\`
        `
      }
    ]
  },

  // MÓDULO 10: Trading (m28, m29, m30)
  "m28": {
    title: "Trading Applications — Position Sizing, Strategy Selection, Portfolio",
    phase: "Módulo 10 — Trading",
    topics: [
      {
        title: "Kelly Fraction y Volatility Targeting por Régimen",
        tag: "core",
        content: `
### Kelly regime-conditional

f*(Sₜ=k) = μₖ / σ²ₖ

f_total = Σₖ P(Sₜ=k | datos) · f*(k)

### Volatility targeting

size = σ_target / σ_forecast(Sₜ)

- Normal (σ=15%): size = 1x
- Crisis (σ=45%): size = 0.33x

### Código

\`\`\`python
class RegimeAwareSizer:
    def kelly_by_regime(self, regime):
        params = self.regime_params[regime]
        f_raw = params['mu'] / (params['sigma']**2)
        return max(f_raw * 0.25, 0)  # ¼ Kelly
    
    def get_size(self, regime_probs):
        return sum(p * self.kelly_by_regime(r) for r, p in regime_probs.items())
\`\`\`
        `
      },
      {
        title: "Regime-Strategy Mapping y el Edge de la Transición",
        tag: "advanced",
        content: `
### Matriz Estrategia-Régimen

| Régimen | Estrategia |
|---------|------------|
| Bull trending | Trend following, momentum |
| Bear trending | Short, fade rallies |
| Range | Mean-reversion, stat arb |
| Crisis | Defensive, tail hedges |

### El edge de la transición

Ejecutar cambio cuando P(nuevo_régimen) ∈ [0.3, 0.4]

threshold = 0.3 + ADL/100

Con ADL=5: threshold = 0.35
        `
      },
      {
        title: "Portfolio Construction y Risk Budgeting",
        tag: "practice",
        content: `
### Asignación por régimen

strategy_allocation = Σₖ P(Sₜ=k) · W(k)

donde W(k) = pesos por estrategia en régimen k

### Risk Budgeting

1. Definir riesgo objetivo por estrategia
2. Ajustar por régimen
3. Rebalancear con regime probabilities
        `
      }
    ]
  }
};

// Map the old IDs to new structure
export const modulesMap: Record<string, string> = {
  "cpd": "m1",
  "sb": "m1", 
  "ic": "m1",
  "hms": "m4",
  "hms-filter": "m4",
  "hmm-arch": "m7",
  "baum-welch": "m7",
  "hmm-multi": "m7",
  "vol-reg": "m10",
  "vix-term": "m10",
  "har-rv": "m10",
  "pin-vpin": "m13",
  "dom-foot": "m13",
  "dcc": "m16",
  "copulas": "m16",
  "risk-on": "m16",
  "gmm-clust": "m19",
  "ml-bocpd": "m19",
  "dl-reg": "m19",
  "gex-dex": "m22",
  "vol-surf": "m22",
  "odte": "m22",
  "sprt-cusum": "m25",
  "particles": "m25",
  "pos-size": "m28",
  "strat-sel": "m28",
  "portfolio": "m28"
};

export const allModulesList = [
  { id: "m1", title: "Change Point Detection", phase: "Módulo 1 — Fundamentos", icon: "01" },
  { id: "m2", title: "Structural Breaks", phase: "Módulo 1 — Fundamentos", icon: "02" },
  { id: "m3", title: "Information Criteria", phase: "Módulo 1 — Fundamentos", icon: "03" },
  { id: "m4", title: "Hamilton MS Model", phase: "Módulo 2 — MS Models", icon: "04" },
  { id: "m5", title: "Filtro Hamilton", phase: "Módulo 2 — MS Models", icon: "05" },
  { id: "m7", title: "Arquitectura HMM", phase: "Módulo 3 — HMM", icon: "06" },
  { id: "m8", title: "Baum-Welch", phase: "Módulo 3 — HMM", icon: "07" },
  { id: "m9", title: "HMM Multivariado", phase: "Módulo 3 — HMM", icon: "08" },
  { id: "m10", title: "Vol Regimes", phase: "Módulo 4 — Volatilidad", icon: "09" },
  { id: "m11", title: "VIX Term Structure", phase: "Módulo 4 — Volatilidad", icon: "10" },
  { id: "m12", title: "HAR-RV", phase: "Módulo 4 — Volatilidad", icon: "11" },
  { id: "m13", title: "PIN / VPIN", phase: "Módulo 5 — Microestructura", icon: "12" },
  { id: "m14", title: "DOM & Footprint", phase: "Módulo 5 — Microestructura", icon: "13" },
  { id: "m16", title: "DCC-GARCH", phase: "Módulo 6 — Correlaciones", icon: "14" },
  { id: "m17", title: "Copulas", phase: "Módulo 6 — Correlaciones", icon: "15" },
  { id: "m18", title: "Risk-On/Off", phase: "Módulo 6 — Correlaciones", icon: "16" },
  { id: "m19", title: "Clustering", phase: "Módulo 7 — ML", icon: "17" },
  { id: "m20", title: "BOCPD", phase: "Módulo 7 — ML", icon: "18" },
  { id: "m21", title: "Deep Learning", phase: "Módulo 7 — ML", icon: "19" },
  { id: "m22", title: "GEX / DEX", phase: "Módulo 8 — Opciones", icon: "20" },
  { id: "m23", title: "Vol Surface", phase: "Módulo 8 — Opciones", icon: "21" },
  { id: "m24", title: "0DTE", phase: "Módulo 8 — Opciones", icon: "22" },
  { id: "m25", title: "SPRT & CUSUM", phase: "Módulo 9 — Real-Time", icon: "23" },
  { id: "m26", title: "Particle Filters", phase: "Módulo 9 — Real-Time", icon: "24" },
  { id: "m28", title: "Position Sizing", phase: "Módulo 10 — Trading", icon: "25" },
  { id: "m29", title: "Strategy Selection", phase: "Módulo 10 — Trading", icon: "26" },
  { id: "m30", title: "Portfolio", phase: "Módulo 10 — Trading", icon: "27" },
];