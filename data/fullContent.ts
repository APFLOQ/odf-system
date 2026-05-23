export const modulesContent: Record<string, {
  title: string;
  phase: string;
  num: string;
  description: string;
  topics: {
    id: string;
    title: string;
    tag: string;
    content: string;
  }[];
}> = {
  "m1": {
    title: "Change Point Detection — Más Allá del CUSUM Básico",
    phase: "Módulo 1 — Fundamentos",
    num: "01",
    description: "El problema central de la detección de regímenes: dado un proceso estocástico {Xₜ}, determinar si sus parámetros fundamentales (media, varianza, covarianza) cambian en algún punto τ desconocido.",
    topics: [
      {
        id: "pelt",
        title: "PELT — Pruned Exact Linear Time (Killick, Fearnhead, Eckley 2012)",
        tag: "core",
        content: `
PELT es el algoritmo de referencia para detección de múltiples change points cuando se necesita exactitud. La innovación central es usar programación dinámica con podas (pruning) que reducen la complejidad de O(n²) a O(n) en promedio.

### La mecánica de la poda

El algoritmo minimiza una función de costo penalizada: Q(τ₁...τₖ) = Σᵢ C(y_{τᵢ₋₁:τᵢ}) + β·K, donde C(y_{s:t}) mide la "inconsistencia" del segmento [s,t] y β es el factor de penalización.

La poda funciona así: para cada punto t, se mantiene una lista de "candidatos". Si el costo de pasar por un candidato es mayor que el costo de saltarlo, ese candidato se poda permanentemente.

### La penalización óptima

- **BIC**: pen = log(n) · 2 · σ²_returns
- **AIC**: pen = 2 · 2 · σ²_returns
- **HQC**: pen = 2 · log(log(n)) · σ²_returns
- Para returns diarios típicos: pen ≈ 0.03-0.08
- Para 5-min bars: pen ≈ 0.5-2.0

### Código Python

\`\`\`python
import numpy as np
import ruptures as rpt

# Datos: returns diarios de NQ
returns = np.load('nq_daily_returns.npy')

# PELT — detección automática del número de cambios
algo_pelt = rpt.Pelt(model='rbf').fit(returns)
changepoints_pelt = algo_pelt.predict(pen=0.05)

# BinSeg — cuando necesitas especificar el número máximo
algo_binseg = rpt.BinSeg(model='l2').fit(returns)
changepoints_binseg = algo_binseg.predict(n_bkps=8)

# Validación: comparar con fechas conocidas de eventos
known_events = ['2020-03-16', '2020-11-09', '2022-02-24']

def compute_detection_metrics(true_breaks, detected_breaks, tolerance=5):
    hits = 0; lags = []
    for tb in true_breaks:
        distances = [abs(tb - db) < tolerance for db in detected_breaks]
        min_dist = min(distances) if distances else 999
        if min_dist <= tolerance: hits += 1; lags.append(min_dist)
    precision = hits / len(detected_breaks) if detected_breaks else 0
    recall = hits / len(true_breaks) if true_breaks else 0
    adl = np.mean(lags) if lags else 999
    return {'precision': precision, 'recall': recall, 'adl': adl}
\`\`\`

### Fórmula

C(y_{s:t}) = Σᵢ₌ₛᵗ₋₁ (yᵢ - μ_{s:t})²

PELT recursion: F(t) = min_{s<t} { F(s) + C(y_{s:t}) + β }

### Aplicación en NQ

En datos intradiarios (5-min), PELT con pen=0.05 detecta típicamente 8-15 change points por día de trading. Los más importantes ocurren en apertura (9:30-10:00) y cerca del cierre (15:00-15:30). Medir el average detection lag (ADL) para calibrar.
        `
      },
      {
        id: "bocpd",
        title: "BOCPD — Bayesian Online Changepoint Detection",
        tag: "advanced",
        content: `
Adams & MacKay (2007) desarrollaron el algoritmo BOCPD, que calcula recursivamente P(rₜ | x₁:t) donde rₜ es el "run length" — el tiempo transcurrido desde el último change point.

### El concepto de run length

La variable clave es rₜ ∈ {0, 1, 2, ...} donde rₜ = k significa "el último cambio ocurrió hace exactamente k barras". La distribución P(rₜ | x₁:t) es el output principal del algoritmo.

### La hazard function

| Hazard Function | Fórmula | Comportamiento | Uso recomendado |
|-----------------|---------|----------------|------------------|
| Constante | H(r) = 1/λ | Tasa uniforme de cambio | Datos con cambios frecuentes |
| Geométrica | H(r) = 1 - pᵒˡᵈ | Decae con el run length | Regímenes con duración variable |
| Uniforme | H(r) = 1 si r ≥ L | Cambio obligatorio tras L barras | Regímenes con duración máxima conocida |

Para datos de mercado intradiario, la hazard function geométrica con p_old = 0.999 (media de duración ≈ 1000 barras) es un buen punto de partida.

### Fórmula

P(rₜ = r | x₁:t₋₁) = P(rₜ₋₁ = r-1 | x₁:t₋₁) · (1 - H(r))

p(xₜ | r, params) = Student_t(xₜ; μ, σ²·(r+1)/r, ν)

### Código Python

\`\`\`python
import numpy as np
from scipy.stats import t as student_t

class BOCPD:
    def __init__(self, hazard_func=lambda r: 1.0/100):
        self.hazard = hazard_func
        self.run_lengths = np.array([1.0])
        self.stats = [{'mu': 0.0, 'kappa': 1.0, 'alpha': 1.0, 'beta': 1.0}]
    
    def predictive_pdf(self, x, stats):
        df = 2 * stats['alpha']
        scale = np.sqrt(stats['beta'] / stats['alpha'] / stats['kappa'])
        return student_t.pdf(x, df, loc=stats['mu'], scale=scale)
    
    def update(self, x):
        self.run_lengths = np.concatenate([[0.0], self.run_lengths])
        self.stats = [{'mu': 0.0, 'kappa': 1.0, 'alpha': 1.0, 'beta': 1.0}] + self.stats
        new_run_lengths = np.zeros_like(self.run_lengths)
        for r in range(len(self.run_lengths)):
            H_r = self.hazard(r)
            prob_continue = (1 - H_r) * self.run_lengths[r]
            prob_changepoint = H_r * np.sum(self.run_lengths * np.arange(len(self.run_lengths)) >= r)
            evidence = self.predictive_pdf(x, self.stats[r])
            new_run_lengths[r] = prob_continue * evidence
        self.run_lengths = new_run_lengths
        self.run_lengths /= (self.run_lengths.sum() + 1e-100)
        for r in range(1, len(self.stats)):
            s = self.stats[r]
            new_mu = (s['kappa'] * s['mu'] + x) / (s['kappa'] + 1)
            new_kappa = s['kappa'] + 1
            new_alpha = s['alpha'] + 0.5
            new_beta = s['beta'] + (s['kappa'] / (s['kappa'] + 1)) * (x - s['mu'])**2 / 2
            self.stats[r] = {'mu': new_mu, 'kappa': new_kappa, 'alpha': new_alpha, 'beta': new_beta}
        return self.run_lengths.copy()
    
    def changepoint_probability(self): return self.run_lengths[0]
    def expected_run_length(self): return np.sum(self.run_lengths * np.arange(len(self.run_lengths)))

# Uso: streaming detection para trading intradiario
p_old = 0.995
hazard = lambda r: 1 - p_old
detector = BOCPD(hazard_func=hazard)

for tick_price in live_price_stream():
    ret = np.log(tick_price / prev_price)
    probs = detector.update(ret)
    if detector.changepoint_probability() > 0.6:
        print(f"⚠ CHANGEPOINT: P={detector.changepoint_probability():.3f}")
    prev_price = tick_price
\`\`\`

### Aplicación directa para trading

BOCPD produce una serie temporal de P(r₀=0 | x₁:t) = probabilidad de que el último cambio ocurrió "ahora". Cuando esta probabilidad supera un threshold (típicamente 0.6-0.8), tienes una señal de transición de régimen.
        `
      },
      {
        id: "structural-breaks",
        title: "Structural Breaks — Tests Formales (Chow, Andrews, Bai-Perron)",
        tag: "core",
        content: `
Los tests de structural break responden a una pregunta diferente a los métodos de change point: dado que sabes (o sospechas) que hay un cambio en los parámetros del modelo, ¿cuál es la evidencia estadística para rechazarlo?

### Chow Test (1960)

Gregory Chow (1960) desarrolló el test para cuando el break point τ es conocido a priori. La hipótesis nula es que los coeficientes son iguales antes y después de τ.

### Fórmula

F = [(RSS_pooled - (RSS₁ + RSS₂)) / k] / [(RSS₁ + RSS₂) / (n - 2k)]

donde:
- RSS_pooled = residual sum of squares bajo H₀ (no break)
- RSS₁, RSS₂ = residual sum of squares en cada submuestra
- k = número de parámetros, n = total de observaciones
- Distribución: F(k, n-2k) bajo H₀

**Limitación severa:** si estimas τ de los datos, la distribución del estadístico cambia y el test se invalida.

### Andrews SupF y Bai-Perron

Andrews (1993) propuso buscar el break point sobre todo el rango posible. Bai & Perron (1998, 2003) desarrollaron el framework completo para múltiples cambios desconocidos.

\`\`\`python
# Bai-Perron con ruptures
import ruptures as rpt

y = np.load('market_returns.npy')
algo = rpt.Dynp(model="l2", min_size=5).fit(y)

for k in range(1, 8):
    bkps = algo.predict(n_bkps=k)
    n_params = k * (x.shape[1])
    residuals = compute_residuals(y, x, bkps)
    rss = np.sum(residuals**2)
    bic = n_params * np.log(len(y)) + len(y) * np.log(rss / len(y))
    print(f"k={k}: BIC={bic:.1f}")
\`\`\`
        `
      },
      {
        id: "information-criteria",
        title: "Criterios de información y selección del número de regímenes K",
        tag: "core",
        content: `
La selección de K (número de regímenes) es uno de los problemas más delicados en la práctica. K=2 es casi siempre demasiado simple para mercados financieros; K>5 introduce sobreparametrización.

### Los tres criterios principales

**AIC (Akaike Information Criterion):**
AIC = 2k - 2ln(L̂), donde k es el número de parámetros. Tiende a sobreestimar K en muestras finitas.

**BIC (Bayesian Information Criterion):**
BIC = k·ln(n) - 2ln(L̂). BIC penaliza más agresivamente. Teóricamente consistente.

**HQIC (Hannan-Quinn):**
HQ = 2k·ln(ln(n)) - 2ln(L̂). Compromiso entre AIC y BIC.

| Criterio | Penalización | Tendencia | Uso óptimo |
|----------|--------------|-----------|------------|
| AIC | 2k | Sobrestima K | Forecasting puro |
| BIC | k·ln(n) | Subrestima K | Identificación de regímenes |
| HQIC | 2k·ln(ln(n)) | Intermedio | Dependencia temporal fuerte |

### Cross-validation para series temporales

\`\`\`python
def wf_cv_hmm(returns, max_K=6, train_size=500, step=50):
    results = {k: [] for k in range(1, max_K+1)}
    for start in range(0, len(returns)-train_size, step):
        train = returns[start:start+train_size]
        test = returns[start+train_size:start+train_size+step]
        for K in range(1, max_K+1):
            model = GaussianHMM(n_components=K)
            model.fit(train.reshape(-1,1))
            ll = model.score(test.reshape(-1,1))
            results[K].append(ll)
    return {k: np.mean(v) for k, v in results.items()}
\`\`\`

**Regla práctica:** Para ES/NQ con datos diarios, K=3 captura "bull trending", "bear trending", y "range/mean-reversion". K=4 añade "crisis/crash" como estado separado.
        `
      }
    ]
  },
  "m4": {
    title: "Hamilton Markov-Switching Model — Arquitectura Completa",
    phase: "Módulo 2 — MS Models",
    num: "02",
    description: "El paper de James D. Hamilton (1989) estableció el marco teórico que subyace a toda la detección moderna de regímenes.",
    topics: [
      {
        id: "ms-specification",
        title: "Especificación del MS-AR(p) y las tres variantes",
        tag: "advanced",
        content: `
El modelo MS-AR(p): yₜ = μ(Sₜ) + Σᵢ φᵢ(Sₜ)(yₜ₋ᵢ - μ(Sₜ₋ᵢ)) + σ(Sₜ)εₜ

### Tres variantes

**MSM (Markov Switching in Mean):** Solo la media μ(Sₜ) cambia. Útil para modelar cambios en el drift sin cambios en la volatilidad.

**MSV (Markov Switching in Variance):** Solo la varianza σ²(Sₜ) cambia. Especialmente útil para regímenes de volatilidad.

**MSMV (Markov Switching in Mean and Variance):** Ambos parámetros cambian. La especificación más general.

| Variante | Parámetros por estado | Parámetros totales (K=2) | Aplicación |
|----------|----------------------|-------------------------|------------|
| MSM | μ₁, μ₂, σ², φ₁...φₚ | 2K + 1 + p + K² | Cambios en drift |
| MSV | μ, σ₁², σ₂², φ₁...φₚ | 1 + K + p + K² | Regímenes de volatilidad |
| MSMV | μ₁, μ₂, σ₁², σ₂², φ₁...φₚ | 2K + K + p + K² | Regímenes completos |

### La matriz de transición P

\`\`\`
P = | p₁₁  p₁₂ |
    | p₂₁  p₂₂ |

E[duración | régimen i] = 1 / (1 - pᵢᵢ)

// Ejemplo: p₁₁ = 0.97, p₂₂ = 0.90
// E[duración bull] = 1/(1-0.97) = 33.3 días
// E[duración bear] = 1/(1-0.90) = 10 días
\`\`\`

### Código Python

\`\`\`python
from statsmodels.tsa.regime_switching.markov_autoregression import MarkovAutoregression

model = MarkovAutoregression(
    endog=returns,
    k_regimes=2,
    order=1,
    switching_ar=True,
    switching_mean=True,
    switching_variance=True,
    trend='c'
)

result = model.fit(method='bfgs', maxiter=500, n_init=50, ic_tol=1e-8)

filtered_probs = result.smoothed_marginal_probabilities[0]
regime = (filtered_probs > 0.5).astype(int)

transition_matrix = result.params['transition'].reshape(2,2)
p_bull_bull = transition_matrix[0,0]
print(f"P(bull→bull) = {p_bull_bull:.4f}")
print(f"E[duración bull] = {1/(1-p_bull_bull):.1f} días")
\`\`\`
        `
      },
      {
        id: "hamilton-filter",
        title: "Filtro de Hamilton y Smoother de Kim",
        tag: "advanced",
        content: `
El filtro de Hamilton es el corazón computacional del MS model. Calcula recursivamente las probabilidades de estar en cada régimen.

### Algoritmo de filtrado

**Prediction step:** ξₜ₊₁|t = P' · ξₜ|t

**Update step:** ξₜ₊₁|t₊₁ = (ηₜ₊₁ ⊙ ξₜ₊₁|t) / Σⱼ ηₜ₊₁(j)·ξₜ₊₁|j

donde ηₜ(i) = P(yₜ|Sₜ=i, y₁:t₋₁)

### Código Python

\`\`\`python
import numpy as np
from scipy.stats import norm

class HamiltonFilter:
    def __init__(self, K=2, mu=0, sigma=1):
        self.K = K
        self.params = {'mu': np.array(mu), 'sigma': np.array(sigma)}
        self.P = np.array([[0.95,0.05],[0.10,0.90]])
    
    def likelihood(self, y, state):
        mu = self.params['mu'][state]
        sigma = self.params['sigma'][state]
        return norm.pdf(y, loc=mu, scale=sigma)
    
    def filter(self, y_series):
        T = len(y_series)
        filtered = np.zeros((T, self.K))
        xi = np.array([0.7, 0.3])
        
        for t in range(T):
            xi_pred = self.P.T @ xi
            eta = np.array([self.likelihood(y_series[t], s) for s in range(self.K)])
            xi_unnorm = eta * xi_pred
            xi = xi_unnorm / xi_unnorm.sum()
            filtered[t] = xi
        return filtered
    
    def smooth(self, y_series, filtered):
        T = len(y_series)
        smoothed = np.zeros((T, self.K))
        smoothed[-1] = filtered[-1]
        
        for t in range(T-2, -1, -1):
            xi_pred = self.P.T @ filtered[t]
            for j in range(self.K):
                eta_j = self.likelihood(y_series[t+1], j)
                smoothed[t, j] = filtered[t, j] * (self.P[j] @ (smoothed[t+1] * eta_j)) / (xi_pred[j] + 1e-10)
            smoothed[t] /= smoothed[t].sum()
        return smoothed

hmm = HamiltonFilter(K=2, mu=[0.03,-0.04], sigma=[0.8,1.5])
filtered_probs = hmm.filter(nq_returns)
smoothed_probs = hmm.smooth(nq_returns, filtered_probs)
\`\`\`

**Precision numérica:** Usar log-space para evitar underflow cuando las likelihoods son muy pequeñas.
        `
      }
    ]
  },
  "m7": {
    title: "Hidden Markov Models — Arquitectura y los Tres Problemas de Rabiner",
    phase: "Módulo 3 — HMM",
    num: "03",
    description: "Lawrence Rabiner (1989) formalizó la teoría de HMMs con tres problemas fundamentales.",
    topics: [
      {
        id: "forward",
        title: "Problema 1 — Evaluation: Algoritmo Forward",
        tag: "core",
        content: `
Dada una secuencia de observaciones O = (o₁, o₂, ..., oT) y un modelo λ = (A, B, π), ¿cuál es la probabilidad P(O|λ)?

### Algoritmo Forward

**Inicialización:** α₁(i) = πᵢ · bᵢ(o₁)

**Recursión:** αₜ(j) = bⱼ(oₜ) · Σᵢ [αₜ₋₁(i) · aᵢⱼ]

**Terminación:** P(O|λ) = Σᵢ αT(i)

### Código Python

\`\`\`python
import numpy as np
from scipy.special import logsumexp

def forward_log(observations, A, B, pi):
    T = len(observations)
    K = len(pi)
    log_alpha = np.zeros((T, K))
    
    log_alpha[0] = pi + B[:, observations[0]]
    
    for t in range(1, T):
        for j in range(K):
            log_alpha[t, j] = B[j, observations[t]] + logsumexp(log_alpha[t-1] + A[:, j])
    
    log_likelihood = logsumexp(log_alpha[-1])
    return log_alpha, log_likelihood
\`\`\`

**Importancia del log-space:** Para secuencias largas (T > 100), usar log-space para evitar underflow.
        `
      },
      {
        id: "viterbi",
        title: "Problema 2 — Decoding: Algoritmo de Viterbi",
        tag: "core",
        content: `
El decoding pregunta: ¿cuál es la secuencia de estados más probable?

### Viterbi

\`\`\`python
def viterbi(observations, A, B, pi):
    T = len(observations)
    K = len(pi)
    delta = np.zeros((T, K))
    psi = np.zeros((T, K), dtype=int)
    
    delta[0] = pi + B[:, observations[0]]
    
    for t in range(1, T):
        for j in range(K):
            scores = delta[t-1] + A[:, j]
            psi[t, j] = np.argmax(scores)
            delta[t, j] = np.max(scores) + B[j, observations[t]]
    
    q_star = np.zeros(T, dtype=int)
    q_star[T-1] = np.argmax(delta[T-1])
    
    for t in range(T-2, -1, -1):
        q_star[t] = psi[t+1, q_star[t+1]]
    
    return q_star, delta, psi
\`\`\`

**Diferencia:** Viterbi encuentra la secuencia óptima global, mientras que el decoding marginal toma argmax en cada timestep independientemente.
        `
      },
      {
        id: "baum-welch",
        title: "Problema 3 — Learning: Baum-Welch (EM para HMM)",
        tag: "advanced",
        content: `
Baum-Welch es un caso especial del algoritmo EM (Expectation-Maximization) para HMMs.

### E-step
Calcular las expectativas de los estados ocultos dado el modelo actual (forward-backward).

### M-step
Actualizar los parámetros maximizando la log-likelihood esperada.

\`\`\`python
def baum_welch(observations, n_states, n_iter=100):
    # Inicialización
    A = np.random.rand(n_states, n_states)
    A = A / A.sum(axis=1, keepdims=True)
    B = np.random.randn(n_states, 2)
    pi = np.random.rand(n_states)
    
    for _ in range(n_iter):
        # E-step: forward-backward
        alpha, beta = forward_backward(observations, A, B, pi)
        
        # M-step: actualizar parámetros
        A, B, pi = update_parameters(alpha, beta, observations)
    
    return A, B, pi
\`\`\`

### Tipos de HMM

- **Gaussian HMM**: emisiones gaussianas
- **GMM-HMM**: mezclas de gaussianas
- **Student-t HMM**: para capturar fat tails
        `
      }
    ]
  }
};

export const allModules = [
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

// Contenido adicional de módulos
export const moreContent: Record<string, string> = {
  "m10": `
# Volatility Regimes — RS-GARCH, HAR-RV, VIX Term Structure

La volatilidad no es constante — cambia dramáticamente entre regímenes.

## HAR-RV — Heterogeneous Autoregressive Realized Volatility (Corsi 2009)

HAR-RV modela la volatilidad realizada como una combinación de componentes de diferentes horizontes temporales: diario (RV_D), semanal (RV_W), y mensual (RV_M).

### Fórmula

RV_{t+1} = c + β_D·RV_t + β_W·RV^(W)_t + β_M·RV^(M)_t + εₜ

donde:
- RV^(W)_t = (1/5)·Σ RV_{t-i} (media móvil 5 días)
- RV^(M)_t = (1/22)·Σ RV_{t-i} (media móvil 22 días)

### Código Python

\`\`\`python
import numpy as np
import pandas as pd

def compute_realized_vol(prices, frequency='5min'):
    returns = prices.pct_change().dropna()
    resampled = returns.resample(frequency).apply(lambda x: np.sqrt(np.sum(x**2)))
    rv = resampled.dropna()
    return rv

def har_rv_regression(rv, horizons=[1, 5, 22]):
    df = pd.DataFrame({'RV': rv})
    df['RV_D'] = rv
    for h, name in zip(horizons, ['RV_W', 'RV_M']):
        df[name] = rv.rolling(h).mean().shift(1)
    df = df.dropna()
    X = df[['RV_D', 'RV_W', 'RV_M']]
    y = df['RV']
    from sklearn.linear_model import LinearRegression
    model = LinearRegression().fit(X, y)
    return model
\`\`\`

### Interpretación de coeficientes típicos

- β_D ≈ 0.4-0.6 (alta persistencia diaria)
- β_W ≈ 0.1-0.2 (contribución semanal)
- β_M ≈ 0.05-0.15 (contribución mensual)
  `,
  "m11": `
# VIX Term Structure — Contango vs. Backwardation

El VIX no es solo un número — su estructura temporal revela cómo el mercado pricea el riesgo de volatilidad.

## Contango — régimen normal de mercado

Contango: la curva de futuros del VIX tiene pendiente positiva. Los vendedores de opciones reciben prima por esperar.

## Backwardation — régimen de stress

Backwardation: VIX spot > VIX3M > VIX6M. El mercado está en modo de hedging urgente.

## VVIX — la volatilidad del VVIX

VVIX alto + VIX bajo = mercado pagando por protección contra un spike súbito de vol.

## Variance Risk Premium

VP = IV² - RV²

- VP > 0 → normal (sellers de vol pagan prima)
- VP < 0 → stress (surprise de vol al alza)
  `,
  "m13": `
# PIN — Probability of Informed Trading (Easley & O'Hara 1987, 1992)

PIN cuantifica la probabilidad de que una orden provenga de un trader informado.

## El modelo

PIN = λᵢ / (λᵢ + λᵤ)

donde λᵢ = tasa de trades informados, λᵢ = tasa de noise traders

## VPIN — Volume-synchronized PIN

VPIN = |V_buy - V_sell| / V_total

VPIN como predictor de crashes: VPIN alto implica order flow desequilibrado → mayor probabilidad de flash crash.

### Código

\`\`\`python
class VPINCalculator:
    def __init__(self, bucket_size=100):
        self.bucket_size = bucket_size
        self.bucket_buys = []
        self.bucket_sells = []
    
    def update(self, trade):
        # Clasificar trade como buy o sell
        # Actualizar buckets
        return self.current_vpin()
    
    def current_vpin(self):
        buys = sum(len(b) for b in self.bucket_buys[-50:])
        sells = sum(len(b) for b in self.bucket_sells[-50:])
        total = buys + sells
        if total == 0: return np.nan
        return abs(buys - sells) / total
\`\`\`
  `,
  "m19": `
# GMM — Gaussian Mixture Model y clustering para regímenes

GMM es un HMM sin dependencia temporal: cada observación se asigna independientemente a uno de K clusters gaussianos.

## Feature space

- return_rolling (retorno acumulado 5 días)
- vol_rolling (volatilidad realizada 20 días)
- skew_rolling (skewness de retornos 20 días)
- vol_ratio = RV/IV
- vix_level, vix_slope
- ofi_rolling

### Código

\`\`\`python
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

features = build_market_features(nq_df)
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Selección de K por BIC
bic_scores = []
for K in range(2, 8):
    gmm = GaussianMixture(n_components=K, covariance_type='full')
    gmm.fit(features_scaled)
    bic_scores.append(gmm.bic(features_scaled))

best_K = np.argmin(bic_scores) + 2
gmm = GaussianMixture(n_components=best_K)
labels = gmm.fit_predict(features_scaled)
\`\`\`
  `,
  "m28": `
# Kelly Fraction por Régimen y Volatility Targeting

Kelly criterion es la apuesta óptima para maximizar el logarithm del capital.

## Kelly regime-conditional

f*(Sₜ=k) = μₖ / σ²ₖ

El sizing total se pondera por la incertidumbre de régimen:
f_total = Σₖ P(Sₜ=k | datos) · f*(k)

## Volatility targeting

size(contratos) = σ_target / σ_forecast(Sₜ)

En régimen normal (σ=15%): size = 1x
En crisis (σ=45%): size = 0.33x

### Código

\`\`\`python
class RegimeAwareSizer:
    def __init__(self, target_vol_annual=0.16):
        self.target_vol = target_vol_annual
        self.regime_params = {
            'bull': {'mu': 0.0003, 'sigma': 0.008},
            'bear': {'mu': -0.0004, 'sigma': 0.015},
            'neutral': {'mu': 0.0001, 'sigma': 0.010}
        }
    
    def kelly_by_regime(self, regime):
        params = self.regime_params[regime]
        f_raw = params['mu'] / (params['sigma']**2)
        return max(f_raw * 0.25, 0)  # ¼ Kelly
    
    def get_size(self, regime_probs):
        size = 0
        for regime, prob in regime_probs.items():
            size += prob * self.kelly_by_regime(regime)
        return size
\`\`\`
  `
};