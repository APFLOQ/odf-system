export const modulesData: Record<string, {
  title: string;
  phase: string;
  description: string;
  topics: {
    id: string;
    title: string;
    tag: string;
    content: string;
  }[];
}> = {
  cpd: {
    title: "Change Point Detection",
    phase: "Fundamentos",
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
\`\`\`

### Fórmula

C(y_{s:t}) = Σᵢ₌ₛᵗ₋₁ (yᵢ - μ_{s:t})²

PELT recursion: F(t) = min_{s<t} { F(s) + C(y_{s:t}) + β }

### Aplicación en NQ

En datos intradiarios (5-min), PELT con pen=0.05 detecta típicamente 8-15 change points por día de trading. Los más importantes ocurren en apertura (9:30-10:00) y cerca del cierre (15:00-15:30).
        `
      },
      {
        id: "bocpd",
        title: "BOCPD — Bayesian Online Changepoint Detection",
        tag: "avanzado",
        content: `
Adams & MacKay (2007) desarrollaron el algoritmo BOCPD, que calcula recursivamente P(rₜ | x₁:t) donde rₜ es el "run length" — el tiempo transcurrido desde el último change point.

### El concepto de run length

La variable clave es rₜ ∈ {0, 1, 2, ...} donde rₜ = k significa "el último cambio ocurrió hace exactamente k barras". La distribución P(rₜ | x₁:t) es el output principal del algoritmo.

### La hazard function

| Hazard Function | Fórmula | Comportamiento |
|-----------------|---------|----------------|
| Constante | H(r) = 1/λ | Tasa uniforme de cambio |
| Geométrica | H(r) = 1 - pᵒˡᵈ | Decae con el run length |
| Uniforme | H(r) = 1 si r ≥ L | Cambio obligatorio tras L barras |

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
        # ... (continúa)
\`\`\`
        `
      }
    ]
  },
  sb: {
    title: "Structural Breaks",
    phase: "Fundamentos",
    description: "Structural breaks ocurren cuando cambios significativos interrumpen el proceso generador de datos subyacente.",
    topics: [
      {
        id: "chow",
        title: "Chow Test",
        tag: "core",
        content: `
### Overview

El test de Chow se utiliza para detectar un cambio estructural en un punto conocido. Es un test F que compara la suma de cuadrados residual de los modelos separados con la del modelo completo.

### Fórmula

F = [(SSR_restricted - SSR_full) / k] / [SSR_full / (n - 2k)]

donde k es el número de parámetros y n es el tamaño de la muestra.

### Aplicación

Si conoces el momento del cambio (ej. crisis financiera 2008), el Chow test te dice si los parámetros antes y después son significativamente diferentes.
        `
      },
      {
        id: "bai-perron",
        title: "Bai-Perron Multiple Breaks",
        tag: "advanced",
        content: `
### Overview

El método de Bai-Perron (1998, 2003) estima múltiples cambios estructurales endógenamente, sin especificar a priori el número de cambios.

### Implementación

El algoritmo encuentra el número óptimo de breaks minimizando el criterio de información (BIC, LWZ).

### Consideraciones

- Requiere especificar el número máximo de breaks
- Sensible a la longitud mínima de cada segmento
- Computacionalmente intensivo para series largas
        `
      }
    ]
  },
  ic: {
    title: "Information Criteria",
    phase: "Fundamentos",
    description: "Criterios para seleccionar el número óptimo de regímenes.",
    topics: [
      {
        id: "bic-aic",
        title: "BIC vs AIC vs HQIC",
        tag: "core",
        content: `
### BIC (Bayesian Information Criterion)

BIC = -2·log(L) + k·log(n)

Penaliza más la complejidad. Favorece modelos más simples.

### AIC (Akaike Information Criterion)

AIC = -2·log(L) + 2k

Penaliza menos la complejidad. Mejor para predicción.

### HQIC (Hannan-Quinn)

HQIC = -2·log(L) + 2k·log(log(n))

Penalización intermedia.

### Comparación

| Criterio | Uso recomendado |
|----------|-----------------|
| BIC | Análisis histórico, muchos datos |
| AIC | Predicción, pocos datos |
| HQIC | Equilibrio |
        `
      }
    ]
  },
  hms: {
    title: "Hamilton Markov Switching",
    phase: "Estructura",
    description: "El paper de Hamilton (1989) es el origen de todo. Implementar desde cero: el filtro de Hamilton (forward pass), el smoother de Kim (backward pass).",
    topics: [
      {
        id: "hamilton-filter",
        title: "Hamilton Filter",
        tag: "core",
        content: `
### El filtro de Hamilton

El algoritmo de Hamilton (1989) estima los parámetros de un modelo Markov Switching usando el filtro de Kalman.

### Paso forward

P(sₜ | y₁ₜ) ∝ Σₛₜ₋₁ P(sₜ | sₜ₋₁) · P(yₜ | sₜ, y₁ₜ₋₁) · P(sₜ₋₁ | y₁ₜ₋₁)

### Matriz de transición

P = [p₁₁  p₁₂
     p₂₁  p₂₂]

donde pᵢⱼ = P(sₜ = j | sₜ₋₁ = i)

### Código Python

\`\`\`python
import numpy as np
from scipy.stats import norm

def hamilton_filter(y, pi0, P, mu, sigma):
    T = len(y)
    n_states = len(pi0)
    
    filtered_probs = np.zeros((T, n_states))
    likelihoods = np.zeros(T)
    
    for t in range(T):
        # Predicción
        pred_probs = P @ filtered_probs[t-1] if t > 0 else pi0
        
        # Update
        for j in range(n_states):
            likelihoods[t] += pred_probs[j] * norm.pdf(y[t], mu[j], sigma[j])
        
        for j in range(n_states):
            filtered_probs[t, j] = pred_probs[j] * norm.pdf(y[t], mu[j], sigma[j]) / likelihoods[t]
    
    return filtered_probs, likelihoods
\`\`\`
        `
      },
      {
        id: "kim-smoother",
        title: "Kim Smoother",
        tag: "advanced",
        content: `
### El smoother de Kim

El smoother de Kim (1994) usa los datos completos para estimar las probabilidades de estado, en contraste con el filtro que solo usa datos hasta el momento actual.

### Backward recursion

P(sₜ | y₁ₜ) se convierte en P(sₜ | y₁ₜ) → P(sₜ | y₁ₜ)

### Diferencia

- **Filtered**: P(sₜ | y₁ₜ) — usa datos hasta t
- **Smoothed**: P(sₜ | y₁ₜ) — usa todos los datos (más preciso para análisis histórico)
        `
      }
    ]
  },
  hmm: {
    title: "Hidden Markov Models",
    phase: "Estructura",
    description: "Rabiner (1989) estableció la teoría formal de HMM con tres problemas: Evaluation, Decoding, Learning.",
    topics: [
      {
        id: "rabiner",
        title: "Rabiner's Three Problems",
        tag: "core",
        content: `
### Problema 1: Evaluation

Calcular P(O|λ) — la probabilidad de la secuencia de observaciones dado el modelo.

**Solución**: Algoritmo Forward

### Problema 2: Decoding

Encontrar la secuencia óptima de estados dado el modelo y las observaciones.

**Solución**: Algoritmo de Viterbi

### Problema 3: Learning

Estimar los parámetros λ del modelo maximizando P(O|λ).

**Solución**: Algoritmo de Baum-Welch (EM)

### Tipos de HMM

- **Gaussian HMM**: emisiones gaussianas (para retornos de futuros)
- **GMM-HMM**: mezclas de gaussianas para distribuciones más complejas
- **Student-t HMM**: para capturar fat tails (kurtosis 6-12 vs 3)
        `
      },
      {
        id: "baum-welch",
        title: "Baum-Welch Algorithm",
        tag: "advanced",
        content: `
### El algoritmo EM para HMM

Baum-Welch es un caso especial del algoritmo EM (Expectation-Maximization).

### E-step

Calcular las expectativas de los estados ocultos dado el modelo actual.

### M-step

Actualizar los parámetros maximizando la log-likelihood esperada.

### Código

\`\`\`python
def baum_welch(observations, n_states, n_iter=100):
    # Inicialización de parámetros
    A = np.random.rand(n_states, n_states)  # Matriz de transición
    A = A / A.sum(axis=1, keepdims=True)
    
    B = np.random.randn(n_states, 2)  # Medias
    pi = np.random.rand(n_states)  # Probabilidades iniciales
    
    for _ in range(n_iter):
        # E-step: forward-backward
        alpha, beta = forward_backward(observations, A, B, pi)
        
        # M-step: actualizar parámetros
        A, B, pi = update_parameters(alpha, beta, observations)
    
    return A, B, pi
\`\`\`
        `
      }
    ]
  },
  vol: {
    title: "Volatility Regimes",
    phase: "Estructura",
    description: "HAR-RV captura la dependencia heterogénea de la volatilidad. VIX term structure como indicador de régimen.",
    topics: [
      {
        id: "har-rv",
        title: "HAR-RV (Corsi 2009)",
        tag: "core",
        content: `
### Heterogeneous Autoregressive Model

σₜ = a₀ + a₁σₜ₋₁ + a₂σₜ₋₅ᵂ + a₃σₜ₋₂₂ᴹ + εₜ

Donde:
- σₜ = volatilidad realizada diaria
- σₜ₋₅ᵂ = promedio de los últimos 5 días (semanal)
- σₜ₋₂₂ᴹ = promedio de los últimos 22 días (mensual)

### Código

\`\`\`python
import pandas as pd
import numpy as np
from statsmodels.regression.linear_model import OLS

def har_model(returns, window_d=1, window_w=5, window_m=22):
    rv = returns.rolling(window_d).apply(lambda x: np.sqrt(np.sum(x**2)))
    
    rv_w = rv.rolling(window_w).mean()
    rv_m = rv.rolling(window_m).mean()
    
    df = pd.DataFrame({'RV': rv, 'RV_W': rv_w, 'RV_M': rv_m}).dropna()
    
    model = OLS(df['RV'], df[['RV_W', 'RV_M']].assign(const=1)).fit()
    return model
\`\`\`
        `
      },
      {
        id: "vix-term",
        title: "VIX Term Structure",
        tag: "advanced",
        content: `
### Contango vs Backwardation

- **Contango**: precios de opciones más altos para vencimientos lejanos
- **Backwardation**: precios de opciones más altos para vencimientos cercanos

### Interpretación

- Contango = demanda de hedging baja, mercado normal
- Backwardation = demanda de hedging alta, anticipación de stress

### Variaciones del VIX

- VIX (30 días)
- VXV (93 días)
- VVIX (volatilidad de la volatilidad)
        `
      }
    ]
  },
  mm: {
    title: "Market Microstructure",
    phase: "Advanced",
    description: "PIN mide la probabilidad de trading informado. VPIN es la versión sincronizada por volumen.",
    topics: [
      {
        id: "pin-vpin",
        title: "PIN / VPIN",
        tag: "core",
        content: `
### PIN (Probability of Informed Trading)

PIN = α·δ / [α·δ + 2(1-α)ε]

Donde:
- α = probabilidad de evento de información
- δ = probabilidad de trading direccional informado
- ε = tasa de llegada de ordenes no informadas

### VPIN (Volume-Synchronized PIN)

VPIN = |Volume_buy - Volume_sell| / Total_Volume

Dividido en buckets de volumen igual.

### Código

\`\`\`python
def calculate_vpin(volume_data, n_buckets=50):
    bucket_size = len(volume_data) // n_buckets
    vpins = []
    
    for i in range(n_buckets):
        start = i * bucket_size
        end = (i + 1) * bucket_size
        bucket = volume_data[start:end]
        
        vpin = np.abs(bucket['buy'].sum() - bucket['sell'].sum()) / bucket['total'].sum()
        vpins.append(vpin)
    
    return np.mean(vpins)
\`\`\`
        `
      },
      {
        id: "dom-footprint",
        title: "DOM & Footprint Charts",
        tag: "practice",
        content: `
### DOM (Depth of Market)

El libro de órdenes muestra los niveles de precio donde hay órdenes de compra y venta pendientes.

### Order Flow Imbalance

OFI = Σ(Bid_ask_change) · volume

### Footprint Charts

Muestran el volumen a cada nivel de precio desglosado por lado (compra/venta).

### Técnicas

- **Absorption**: detectar cuándo el precio no puede atravesar un nivel
- **Exhaustion**: señales de agotamiento direccional
- **Delta Divergence**: acumulación/distribución oculta
        `
      }
    ]
  },
  cr: {
    title: "Correlation Regimes",
    phase: "Advanced",
    description: "DCC-GARCH para matrices de correlación dinámicas. Copulas para dependencia no-lineal.",
    topics: [
      {
        id: "dcc-garch",
        title: "DCC-GARCH (Engle 2002)",
        tag: "core",
        content: `
### Dynamic Conditional Correlation

Paso 1: Estimar GARCH univariados para cada serie
Paso 2: Calcular residuos estandarizados
Paso 3: Estimar la dinámica de correlación

### Ecuación

Qₜ = (1-a-b)·S + a·uₜ₋₁uₜ₋₁' + b·Qₜ₋₁

Rₜ = diag(Qₜ)^(-1/2) · Qₜ · diag(Qₜ)^(-1/2)

### Código

\`\`\`python
from arch import arch_model
from statsmodels.tsa.stattools import acf

# Paso 1: GARCH univariados
garch_1 = arch_model(returns_1, vol='Garch', p=1, q=1).fit()
garch_2 = arch_model(returns_2, vol='Garch', p=1, q=1).fit()

# Residuos estandarizados
std_resid_1 = garch_1.std_resid
std_resid_2 = garch_2.std_resid

# Paso 2: Correlación condicional dinámica
\`\`\`
        `
      },
      {
        id: "copulas",
        title: "Copulas",
        tag: "advanced",
        content: `
### Tipos de Copulas

- **Gaussian**: captura correlación lineal
- **Student-t**: captura tail dependence
- **Clayton**: captura dependencia asimétrica
- **Gumbel**: captura dependencia en extremos superiores

### Aplicación

La correlación Gaussiana subestima la probabilidad de crashes conjuntos. Las copulas capturan la dependencia no-lineal.

### Variance Risk Premium

VP = IV² - RV²

Señal de régimen de stress vs. régimen normal.
        `
      }
    ]
  },
  ml: {
    title: "Machine Learning for Regimes",
    phase: "Advanced",
    description: "GMM clustering, BOCPD, LSTM para clasificación de regímenes.",
    topics: [
      {
        id: "clustering",
        title: "GMM Clustering",
        tag: "core",
        content: `
### Gaussian Mixture Models

Alternativa a HMM sin dependencia temporal.

\`\`\`python
from sklearn.mixture import GaussianMixture

gmm = GaussianMixture(n_components=3, covariance_type='full')
gmm.fit(features)

labels = gmm.predict(features)
probs = gmm.predict_proba(features)
\`\`\`

### Selección de K

Usar BIC o cross-validation.
        `
      },
      {
        id: "deep-learning",
        title: "Deep Learning",
        tag: "advanced",
        content: `
### LSTM para Regímenes

\`\`\`python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential([
    LSTM(64, input_shape=(timesteps, features)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(n_states, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy')
\`\`\`

### Peligros

- Overfitting catastrophic sin validación adecuada
- Walk-forward validation obligatorio
- Caution con backtesting sobre datos limitados
        `
      }
    ]
  },
  ta: {
    title: "Trading Applications",
    phase: "Applications",
    description: "Kelly fraction por régimen, volatility targeting, regime-strategy mapping.",
    topics: [
      {
        id: "position-sizing",
        title: "Position Sizing",
        tag: "core",
        content: `
### Kelly Fraction

f*(Sₜ) = μ(Sₜ) / σ²(Sₜ) · P(Sₜ|datos)

### Volatility Targeting

size = σ_target / σ_forecast(Sₜ)

### Código

\`\`\`python
def kelly_sizing(mu, sigma, p_regime):
    """Kelly fraction adaptativo por régimen"""
    kelly = mu / (sigma ** 2)
    adjusted_kelly = kelly * p_regime
    return min(adjusted_kelly, 0.25)  # Cap en 25%

def vol_targeting(vol_forecast, vol_target=0.15):
    """Volatility targeting"""
    target_size = vol_target / vol_forecast
    return target_size
\`\`\`
        `
      },
      {
        id: "strategy-selection",
        title: "Regime-Strategy Mapping",
        tag: "practice",
        content: `
### Mapping

| Régimen | Estrategia |
|---------|-----------|
| Alta Vol, Baja Persistencia | Mean Reversion |
| Baja Vol, Alta Persistencia | Trend Following |
| Transición | Stat Arb |
| Crisis | Protection / Exit |

### Timing de transición

Ejecutar cambios cuando P(nuevo_régimen) ∈ [0.3, 0.4], antes de que el mercado lo descuente.
        `
      }
    ]
  }
};

export const modulesList = [
  { id: "cpd", title: "Change Point Detection", icon: "01", phase: "Foundation" },
  { id: "sb", title: "Structural Breaks", icon: "02", phase: "Foundation" },
  { id: "ic", title: "Information Criteria", icon: "03", phase: "Foundation" },
  { id: "hms", title: "Hamilton MS Model", icon: "04", phase: "Structure" },
  { id: "hmm", title: "Hidden Markov Models", icon: "05", phase: "Structure" },
  { id: "vol", title: "Volatility Regimes", icon: "06", phase: "Structure" },
  { id: "mm", title: "Market Microstructure", icon: "07", phase: "Advanced" },
  { id: "cr", title: "Correlation Regimes", icon: "08", phase: "Advanced" },
  { id: "ml", title: "Machine Learning", icon: "09", phase: "Advanced" },
  { id: "ta", title: "Trading Applications", icon: "10", phase: "Applications" },
];