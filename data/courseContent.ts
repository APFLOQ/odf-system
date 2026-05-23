import type { Course } from "@/types/course";

export const courseContent: Record<string, Course> = {
  "market-regimes": {
    id: "market-regimes",
    title: "Market Regimes — Guía Completa",
    subtitle: "Guía de estudio avanzada · AP",
    description: "Desde la detección estadística de cambios estructurales hasta la aplicación de HMMs, modelos de Markov switching, microestructura de mercado, opciones y deep learning.",
    stats: "10 Módulos · 30+ Temas · 80+ Subtópicos",
    modules: [
      {
        id: "00",
        title: "Plan de estudio recomendado",
        subtitle: "Secuencia óptima de aprendizaje",
        topics: [
          {
            id: "00-01",
            title: "Semana 1-2 — Bases estadísticas y change point detection",
            content: "Stationarity bajo regímenes, tests de Chow y Bai-Perron, CUSUM clásico, criterios de información (AIC/BIC/HQ) para selección del número de regímenes. Sin esto, todo lo demás es caja negra.",
            callouts: [
              { type: "warning", title: "Fundamental", text: "Antes de aplicar cualquier modelo de régimen, debes dominar los fundamentos estadísticos. Sin esto, todo lo demás es caja negra." }
            ],
            resources: [
              { name: "ruptures (Python)", type: "library" },
              { name: "changepoint (R)", type: "library" },
              { name: "Fryzlewicz 2014", type: "paper" }
            ]
          },
          {
            id: "00-02",
            title: "Semana 3-4 — Hamilton Markov Switching",
            content: "El modelo original de Hamilton (1989), estimación por EM, filtro de Hamilton, MS-VAR, MS-GARCH. Implementar desde cero en Python (statsmodels + manual).",
            resources: [
              { name: "statsmodels.tsa.regime_switching", type: "library" },
              { name: "MSwM (R)", type: "library" },
              { name: "Hamilton 1989 JoE", type: "paper" }
            ]
          },
          {
            id: "00-03",
            title: "Semana 5-6 — Hidden Markov Models",
            content: "Baum-Welch (EM para HMM), Viterbi, forward-backward. Gaussian HMM vs. GMM-HMM. hmmlearn en Python. HMM multivariado aplicado a ES/NQ.",
            resources: [
              { name: "hmmlearn (Python)", type: "library" },
              { name: "pomegranate (Python)", type: "library" }
            ]
          },
          {
            id: "00-04",
            title: "Semana 7-8 — Volatility y Correlation Regimes",
            content: "RS-GARCH, HAR-RV, VIX term structure, DCC-GARCH, copulas, contagion vs. interdependence. Distinguir regímenes de vol de regímenes de dirección."
          },
          {
            id: "00-05",
            title: "Semana 9-10 — Microestructura y Order Flow",
            content: "PIN/VPIN, toxicidad de orden flow, regímenes AMT, DOM absorption/exhaustion, footprint regimes, delta divergence. Aplicación directa a NQ/ES."
          },
          {
            id: "00-06",
            title: "Semana 11-12 — Machine Learning avanzado",
            content: "GMM clustering de retornos, BOCPD (Bayesian Online Changepoint Detection), autoencoders para anomaly-based shifts, LSTM regime classification.",
            exercise: {
              question: "¿Cuál es la principal ventaja de usar GMM sobre K-means para clustering de regímenes?",
              options: [
                "GMM permite clusters no esféricos",
                "GMM es más rápido computacionalmente",
                "GMM no requiere especificar K",
                "GMM funciona mejor con datos categóricos"
              ],
              correctAnswer: 0,
              explanation: "GMM (Gaussian Mixture Models) permite modelar clusters con diferentes formas (covarianza), mientras que K-means asume clusters esféricos con igual varianza."
            }
          },
          {
            id: "00-07",
            title: "Semana 13-14 — Options regimes y Real-time detection",
            content: "GEX/DEX regimes, vol surface regime classification, 0DTE flow, SPRT, particle filters, Kalman extensions para detección en tiempo real."
          },
          {
            id: "00-08",
            title: "Semana 15-16 — Trading applications",
            content: "Regime-conditional position sizing, strategy switching, factor exposure management, portfolio construction bajo incertidumbre de régimen, regime transition edge."
          }
        ]
      },
      {
        id: "01",
        title: "Bases estadísticas de regímenes",
        subtitle: "El lenguaje matemático detrás de todo",
        topics: [
          {
            id: "01-01",
            title: "Change Point Detection — más allá del CUSUM básico",
            tag: "core",
            content: `El problema central: dado un proceso {Xₜ}, detectar si los parámetros del proceso generador de datos cambian en algún punto τ desconocido. Existen tres familias principales de métodos con filosofías radicalmente distintas.

**PELT — Pruned Exact Linear Time**

Algoritmo de programación dinámica que encuentra el número óptimo de change points minimizando un criterio penalizado. Complejidad O(n) en promedio (vs O(n²) del binary segmentation). Minimiza C(y_{s:t}) + β para cada segmento. La penalización β controla el trade-off entre fit y parsimonia.

**Binary Segmentation y Wild Binary Segmentation**

BS aplica recursivamente un test de hipótesis sobre el segmento completo, dividiendo en el punto con mayor estadístico. Wild BS (WBS) mejora la consistencia usando segmentos aleatorios para evitar que cambios tardíos sean enmascarados por cambios tempranos.

**Bayesian Online Changepoint Detection (BOCPD)**

Adams & MacKay (2007). En vez de buscar change points en batch, calcula en tiempo real P(rₜ | x₁:t) donde rₜ es el "run length" (tiempo desde el último change point). Crítico para trading en tiempo real.`,
            formulas: [
              {
                label: "CUSUM generalizado (bilateral)",
                content: "S^{+}_t = \\max(0, S^{+}_{t-1} + x_t - \\mu_0 - k)"
              },
              {
                label: "Criterio penalizado (PELT)",
                content: "Q(\\tau_1...\\tau_k) = \\sum_i [C(y_{\\tau_{i-1}:\\tau_i}) + \\beta]"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "PELT con ruptures",
                code: `import ruptures as rpt

# Detectar change points en señal
signal = your_data  # array de numpy

# PELT con penalización BIC
algo = rpt.Pelt(model="rbf").fit(signal)
change_points = algo.predict(pen=1)

# Binary Segmentation
algo = rpt.Binseg().fit(signal)
change_points = algo.predict(n_bkps=5)`,
                annotations: [
                  "PELT es O(n) vs O(n²) de otros métodos",
                  "El parámetro 'pen' controla el número de cambios detectados",
                  "Ajusta 'pen' según la complejidad de tus datos"
                ]
              }
            ],
            callouts: [
              { type: "info", title: "PELT vs Binary Segmentation", text: "PELT es más rápido pero puede perder cambios cercanos. Binary segmentation es más preciso para series cortas." }
            ],
            resources: [
              { name: "ruptures (Python)", type: "library" },
              { name: "changepoint (R)", type: "library" },
              { name: "Fryzlewicz 2014 WBS", type: "paper" }
            ]
          },
          {
            id: "01-02",
            title: "Structural Breaks — Tests formales y selección de regímenes",
            tag: "core",
            content: `Los structural break tests distinguen cambios en los parámetros del modelo de la variabilidad normal del proceso. La diferencia filosófica con change point detection: aquí asumimos un modelo paramétrico específico y testamos si sus parámetros cambian.

**Test de Chow (1960)**

El clásico para un break point conocido τ: H₀: β₁ = β₂ (los coeficientes son iguales antes y después de τ). Estadístico F = [(RSS_R - RSS_U)/k] / [RSS_U/(n-2k)].

**Bai-Perron (1998, 2003) — el estándar dorado**

Permite múltiples breaks desconocidos simultáneos. Usa la teoría de supF statistics para determinar el número de breaks secuencialmente. Algoritmo de programación dinámica O(n²).

**Criterios de información para selección de K regímenes**

AIC = 2k - 2ln(L̂), BIC = k·ln(n) - 2ln(L̂). En la práctica para mercados financieros: 2-4 regímenes suelen ser suficientes.`,
            formulas: [
              {
                label: "Estadístico F de Chow",
                content: "F = \\frac{(RSS_R - RSS_U)/k}{RSS_U/(n-2k)}"
              },
              {
                label: "BIC para selección de K",
                content: "BIC = k \\cdot \\ln(n) - 2\\ln(\\hat{L})"
              }
            ],
            callouts: [
              { type: "warning", title: "Look-ahead bias", text: "El look-ahead bias en structural break detection es devastador. Siempre evaluar out-of-sample y medir el average detection lag (ADL)." }
            ],
            exercise: {
              question: "¿Cuál es la principal limitación del Test de Chow?",
              options: [
                "Solo funciona con series temporales",
                "Requiere conocer el break point a priori",
                "No funciona con más de 2 regímenes",
                "Solo aplica a modelos lineales"
              ],
              correctAnswer: 1,
              explanation: "El Test de Chow requiere conocer el break point τ a priori. En trading, NUNCA lo conocemos, lo que genera data snooping si se elige τ mirando los datos."
            }
          }
        ]
      },
      {
        id: "02",
        title: "Modelos Clásicos de Regime Switching",
        subtitle: "Hamilton (1989) y su familia extendida",
        topics: [
          {
            id: "02-01",
            title: "Hamilton Markov-Switching Model — arquitectura completa",
            tag: "advanced",
            content: `El paper de Hamilton (1989) sobre business cycles es el modelo fundacional. La idea: los parámetros del proceso AR cambian dependiendo de un estado de Markov latente Sₜ que no es directamente observable.

**Especificación completa del MS-AR(p)**

yₜ = μ(Sₜ) + φ₁(Sₜ)(yₜ₋₁ - μ(Sₜ₋₁)) + ... + σ(Sₜ)εₜ. Los parámetros que cambian pueden ser: solo la media (MSM), solo la varianza (MSV), o ambos (MSMV).

**Filtro de Hamilton — inferencia sobre Sₜ**

Es un filtro análogo al filtro de Kalman pero para estados discretos. El update usa Bayes: ξₜ|ₜ ∝ ηₜ ⊙ (P'ξₜ₋₁|ₜ₋₁).

**Kim Smoother — probabilidades suavizadas**

El smoother de Kim (1994) da P(Sₜ = j | yₜ,...,y_T) usando toda la muestra. Para trading en tiempo real, solo filtered probabilities son válidas.`,
            formulas: [
              {
                label: "Matriz de transición (K=2)",
                content: "P = \\begin{pmatrix} p_{11} & p_{12} \\\\ p_{21} & p_{22} \\end{pmatrix}"
              },
              {
                label: "Duración esperada en régimen j",
                content: "E[duración] = \\frac{1}{1 - p_{jj}}"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "MS-AR(1) con statsmodels",
                code: `import numpy as np
from statsmodels.tsa.regime_switching.markov_autoregression import MarkovAutoregression

# Datos de retornos
y = returns_array  # array de numpy

# Modelo MS-AR(1) con 2 regímenes
model = MarkovAutoregression(
    y, k_regimes=2, order=1,
    switching_variance=True
)

# Estimar por máxima verosimilitud
result = model.fit()

# Probabilidades filtradas
filtered_probs = result.filtered_marginal_probabilities

# Probabilidades suavizadas (usa datos futuros)
smoothed_probs = result.smoothed_marginal_probabilities`,
                annotations: [
                  "switching_variance=True permite que σ cambie por régimen",
                  "filtered_marginal_probabilities: solo datos hasta t",
                  "smoothed_marginal_probabilities: usa toda la muestra"
                ]
              }
            ],
            callouts: [
              { type: "info", title: "Configuración para NQ/ES", text: "Un MS-AR(1) con K=2 típicamente captura bien el régimen de tendencia vs. corrección. El parámetro p₁₁ suele ser 0.95-0.98." }
            ],
            resources: [
              { name: "statsmodels.tsa.regime_switching", type: "library" },
              { name: "MSM (Python)", type: "library" },
              { name: "Hamilton 1989 JoE", type: "paper" }
            ],
            exercise: {
              question: "¿Cuál es la diferencia entre probabilidades filtradas y suavizadas en un MS model?",
              options: [
                "Las filtradas usan más datos que las suavizadas",
                "Las filtradas no usan datos futuros, las suavizadas sí",
                "Las suavizadas son más útiles para trading en tiempo real",
                "No hay diferencia práctica"
              ],
              correctAnswer: 1,
              explanation: "Las probabilidades filtradas P(Sₜ|y₁:t) no usan datos futuros, por lo que son válidas para trading en tiempo real. Las suavizadas P(Sₜ|y₁:T) usan toda la muestra y son más precisas para análisis histórico."
            }
          },
          {
            id: "02-02",
            title: "Threshold Models — TAR, SETAR, LSTAR, MTAR",
            tag: "advanced",
            content: `Los threshold models son una alternativa a los Markov-switching: el régimen no está oculto, sino determinado por una variable observable cruzando un umbral.

**TAR — Threshold Autoregressive**

yₜ = (φ₁₀ + φ₁₁yₜ₋₁ + εₜ)·I(qₜ₋d ≤ γ) + (φ₂₀ + φ₂₁yₜ₋₁ + εₜ)·I(qₜ₋d > γ). La variable de threshold puede ser el propio yₜ₋d (SETAR) u otra variable.

**LSTAR — Logistic Smooth Transition AR**

Usa G(qₜ₋d; γ, c) = [1 + exp(-γ(qₜ₋d - c))]⁻¹ para transicionesgraduales entre regímenes.

**MTAR — Momentum Threshold AR**

El threshold no es el nivel sino la diferencia Δqₜ (momentum). Especialmente relevante para cointegración asimétrica.`,
            callouts: [
              { type: "warning", title: "Diferencia filosófica", text: "MS models = régimen latente, transición estocástica. Threshold models = régimen determinístico dado qₜ, transición predecible." }
            ]
          },
          {
            id: "02-03",
            title: "MS-GARCH, MS-VAR y cointegración con regímenes",
            tag: "advanced",
            content: `Las extensiones multivariadas del MS son donde el análisis se vuelve realmente potente — y computacionalmente desafiante.

**MS-GARCH — Haas, Mittnik, Paolella (2004)**

Cada régimen k tiene su propio proceso GARCH independiente: hₖ,ₜ = ωₖ + αₖε²ₜ₋₁ + βₖhₖ,ₜ₋₁. Esto evita el path dependence problem del MS-GARCH puro.

**MS-VAR — Vector Autoregression con switching**

Yₜ = μ(Sₜ) + A₁(Sₜ)Yₜ₋₁ + ... + Σ(Sₜ)^(1/2)εₜ. Todos los parámetros pueden cambiar con el régimen.

**Régime-switching cointegration**

La relación de cointegración puede existir solo en ciertos regímenes. Para pairs trading ES-NQ: el spread puede ser cointegrado en régimen normal pero divergir en risk-off.`,
            resources: [
              { name: "MSwM (R)", type: "library" },
              { name: "MSGARCH (R)", type: "library" },
              { name: "Kim & Nelson 1999", type: "paper" }
            ]
          }
        ]
      },
      {
        id: "03",
        title: "Hidden Markov Models",
        subtitle: "El framework probabilístico para regímenes latentes",
        topics: [
          {
            id: "03-01",
            title: "Arquitectura HMM — los tres problemas de Rabiner",
            tag: "core",
            content: `Un HMM se define por λ = (A, B, π) donde A es la matriz de transición, B son las distribuciones de emisión, y π son las probabilidades iniciales. Rabiner (1989) definió los tres problemas fundamentales:

**Problema 1: Evaluation — P(O | λ)**

¿Cuál es la probabilidad de la secuencia observada dado el modelo? Resuelto con el algoritmo forward. En escala log para estabilidad numérica.

**Problema 2: Decoding — Viterbi**

¿Cuál es la secuencia más probable de estados latentes? Usa programación dinámica. El backtracking recover la secuencia óptima.

**Problema 3: Learning — Baum-Welch**

EM para HMM. E-step calcula γₜ(i) y ξₜ(i,j). M-step actualiza A, B, π. Convergencia garantizada a máximo local.`,
            formulas: [
              {
                label: "Algoritmo forward",
                content: "\\alpha_t(j) = b_j(o_t) \\cdot \\sum_i \\alpha_{t-1}(i) \\cdot a_{ij}"
              },
              {
                label: "Algoritmo backward",
                content: "\\beta_t(i) = \\sum_j a_{ij} \\cdot b_j(o_{t+1}) \\cdot \\beta_{t+1}(j)"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "HMM con hmmlearn",
                code: `from hmmlearn import hmm
import numpy as np

# Features: retornos, vol, skew
X = np.column_stack([returns, realized_vol, skew])

# Gaussian HMM con K=3 estados
model = hmm.GaussianHMM(
    n_components=3,
    covariance_type="full",
    n_iter=100,
    random_state=42
)

# Ajustar modelo
model.fit(X)

# Secuencia de estados más probable (Viterbi)
states = model.predict(X)

# Probabilidades por estado
probs = model.predict_proba(X)

# Log-verosimilitud
log_likelihood = model.score(X)`,
                annotations: [
                  "covariance_type='full' permite diferentes covarianzas por estado",
                  "Ejecuta con múltiples seeds para evitar máximos locales",
                  "predict_proba da las probabilidades de cada estado"
                ]
              }
            ],
            resources: [
              { name: "hmmlearn (Python)", type: "library" },
              { name: "pomegranate (Python)", type: "library" },
              { name: "Zucchini et al. 2016", type: "paper" }
            ]
          },
          {
            id: "03-02",
            title: "HMM en mercados — emisiones avanzadas y selección de K",
            tag: "advanced",
            content: `**Gaussian HMM vs GMM-HMM**

Gaussian HMM: cada estado emite oₜ ~ N(μᵢ, Σᵢ). Limitación: una sola Gaussiana por estado no puede capturar distribuciones bimodales o fat tails. GMM-HMM: bᵢ(o) = Σₖ wᵢₖ·N(o; μᵢₖ, Σᵢₖ).

**Student-t HMM para fat tails**

Los retornos de NQ tienen kurtosis empírica de 6-12 (vs 3 Gaussiana). El Student-t HMM es más apropiado.

**Selección del número de estados K**

Métodos: BIC sobre HMM, Akaike HQ, cross-validated log-likelihood, interpretabilidad económica. Para trading práctico: K=2 o K=3 suelen ser suficientes y más estables OOS.`,
            codeExamples: [
              {
                language: "python",
                title: "Seleccionar K con BIC",
                code: `import numpy as np
from hmmlearn import hmm

X = your_features  # array (n_samples, n_features)

# Probar K = 2, 3, 4, 5
results = []
for k in range(2, 6):
    model = hmm.GaussianHMM(n_components=k, n_iter=100)
    model.fit(X)
    
    # BIC = -2 * log_likelihood + k * log(n)
    n_params = k * (k - 1) + k * X.shape[1] + k * X.shape[1]**2
    bic = -2 * model.score(X) + n_params * np.log(X.shape[0])
    
    results.append({"k": k, "bic": bic, "model": model})

# Mejor K = el que minimiza BIC
best = min(results, key=lambda x: x["bic"])
print(f"Mejor K: {best['k']}")`,
                annotations: [
                  "BIC penaliza modelos complejos",
                  "K=3 da bear/neutral/bull, K=4 añade crash",
                  "Valida siempre out-of-sample"
                ]
              }
            ]
          },
          {
            id: "03-03",
            title: "HMM Multivariado — aplicaciones a portafolio",
            tag: "quant",
            content: `**Multivariate Gaussian HMM**

Para un portfolio de m activos: oₜ ∈ ℝᵐ, bᵢ(o) = N(o; μᵢ, Σᵢ). El número de parámetros crece como m²/2. Opciones: (1) Diagonal Σᵢ, (2) Factor structure, (3) Shrinkage Ledoit-Wolf.

**Input-Output HMM (IOHMM)**

La matriz de transición A(uₜ) depende de una variable de entrada observable uₜ (ej. VIX, GEX, news sentiment). P(Sₜ=j | Sₜ₋₁=i, uₜ) = softmax(Wᵢⱼ · uₜ).`,
diagram: {
              type: "mermaid",
              title: "Arquitectura IOHMM",
              content: `flowchart TD
    A["VIX/GEX"] --> B["Input Layer"]
    B --> C{"HMM States"}
    C -->|Bull| D["μ_alta, σ_baja"]
    C -->|Bear| E["μ_baja, σ_alta"]
    C -->|Neutral| F["μ_0, σ_0"]
    D --> G["Portfolio Weights"]
    E --> G
    F --> G`
            }
          }
        ]
      },
      {
        id: "04",
        title: "Volatility Regimes",
        subtitle: "La dimensión más crítica para trading",
        topics: [
          {
            id: "04-01",
            title: "RS-GARCH, MRS-GARCH y familia GARCH con switching",
            tag: "advanced",
            content: `Los modelos GARCH capturan clustering de volatilidad, pero asumen dinámicas estacionarias. Los RS-GARCH permiten que los parámetros cambien entre regímenes.

**Haas-Mittnik-Paolella (2004)**

Cada régimen k tiene su propio proceso GARCH: hₖ,ₜ = ωₖ + αₖε²ₜ₋₁ + βₖhₖ,ₜ₋₁. La varianza total es la mezcla: E[ε²ₜ | Fₜ₋₁] = Σₖ P(Sₜ=k)·(hₖ,ₜ + μ²ₖ).

**HAR-RV (Corsi 2009)**

RVₜ = c + β_D·RVₜ₋₁ + β_W·RV^(w)ₜ₋₁ + β_M·RV^(m)ₜ₋₁ + εₜ. La versión MS-HAR-RV permite que los coeficientes cambien por régimen.`,
            regimeMatrixData: [
              { label: "Bull + Low Vol", title: "Tendencia alcista tranquila", description: "Mejor para momentum", color: "#22c55e" },
              { label: "Bull + High Vol", title: "Rally caótico", description: "Short squeeze activo", color: "#f59e0b" },
              { label: "Bear + Low Vol", title: "Slow bleed", description: "Acumulación passive", color: "#a78bfa" },
              { label: "Bear + High Vol", title: "Crash", description: "Evitar posiciones largas", color: "#ef4444" }
            ],
            formulas: [
              {
                label: "Volatility Ratio",
                content: "VR(t) = \\frac{RV_{short}(t)}{RV_{long}(t)}"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "HAR-RV con statsmodels",
                code: `import numpy as np
import pandas as pd
from statsmodels.regression.linear_model import OLS

def har_rv(rv_series):
    """Heterogeneous Autoregressive RV"""
    df = pd.DataFrame({'rv': rv_series})
    
    # Calcular promedios semanales y mensuales
    df['rv_w'] = df['rv'].rolling(5).mean()
    df['rv_m'] = df['rv'].rolling(22).mean()
    
    # Shift para evitar look-ahead
    df['rv_next'] = df['rv'].shift(-1)
    df = df.dropna()
    
    # Regresión HAR
    X = df[['rv', 'rv_w', 'rv_m']]
    X = sm.add_constant(X)
    y = df['rv_next']
    
    model = OLS(y, X).fit()
    return model`,
                annotations: [
                  "RV debe ser realized volatility (ej. Parkinson, Garman-Klass)",
                  "Usa rv.shift(-1) para predecir el siguiente día sin look-ahead",
                  "β_D > β_M indica regímenes de alta reacción al shock inmediato"
                ]
              }
            ]
          },
          {
            id: "04-02",
            title: "VIX Term Structure Regimes — contango, backwardation, kink",
            tag: "advanced",
            content: `La curva de futuros VIX (VX1, VX2,...,VX8) define 3 regímenes estructurales:

**Contango normal**: VX1 < VX2 < ... < VX8. Mercado en calma, sellers de vol se benefician del roll yield negativo.

**Backwardation severa**: VX1 >> VX2. Crisis activa, spot VIX extremo pero mercado espera normalización.

**Kink structure**: VX2 > VX1 pero VX3 < VX2. Incertidumbre concentrada en el corto plazo.

**VVIX — volatility of volatility regime**

VVIX > 130 típicamente precede spikes de VIX. El ratio VIX/VVIX tiene propiedades de mean reversion más robustas.`,
            comparisonData: {
              headers: ["Régimen", "VX1 vs VX2", "Roll Yield", "Estrategia"],
              rows: [
                ["Contango", "VX1 < VX2", "-5% a -15% mensual", "Short vol"],
                ["Backwardation", "VX1 > VX2", "+5% a +20% mensual", "Long vol"],
                ["Kink", "VX2 > VX1 > VX3", "Variable", "Espera evento"]
              ]
            },
            callouts: [
              { type: "info", title: "Leading indicator", text: "Un shift de contango a backwardation (VX1 cruzando VX2) precede episodios de high-vol de 5-15 días." }
            ]
          },
          {
            id: "04-03",
            title: "Vol Surface Regimes — skew, kurtosis, ATM/OTM dynamics",
            tag: "quant",
            content: `**Parametrización SVI de la superficie**

El modelo SVI (Gatheral 2004): w(k) = a + b[ρ(k-m) + √((k-m)² + σ²)]. Parámetros: a = vol ATM, b = slope, ρ = skew, m = desplazamiento, σ = curvature.

**Regímenes de skew — put premium vs. call premium**

El put skew (25Δ put IV - ATM IV) es el driver de regímenes en equity vol. Skew normal (put > call): protección costosa. Skew invertido (call > put): short squeeze en curso.

**Volatility surface PCA**

PC1 ≈ nivel general (~80% varianza), PC2 ≈ slope/skew (~10%), PC3 ≈ curvature (~5%). Un movimiento de 2σ en PC2 sin movimiento en PC1 indica cambio de régimen de opciones sin crack en el underlying.`,
            codeExamples: [
              {
                language: "python",
                title: "Calcular skew de opciones",
                code: `def calculate_25_delta_skew(iv_surface):
    """
    Calcula el skew como 25D Put IV - ATM IV
    iv_surface: dict con strikes e IVs
    """
    # ATM IV (strike más cercano al spot)
    atm_strike = min(iv_surface.keys(), 
                    key=lambda k: abs(k - spot))
    atm_iv = iv_surface[atm_strike]
    
    # 25 Delta Put
    put_25_strike = find_delta_strike(iv_surface, delta=0.25, put=True)
    put_25_iv = iv_surface[put_25_strike]
    
    # Skew
    skew = put_25_iv - atm_iv
    
    return skew

# Interpretación
if skew > 5:
    print("Skew normal: mercado defensivo, protección costosa")
elif skew < -2:
    print("Skew invertido: short squeeze, demanda calls")
else:
    print("Skew plano: transición o incertidumbre bidireccional")`,
                annotations: [
                  "Un skew positivo alto indica fear premium",
                  "Skew invertido puede preceder rallies",
                  "Trackea el 25Δ risk reversal para cambios de régimen"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "05",
        title: "Microestructura & Order Flow Regimes",
        subtitle: "Regímenes a nivel de trades y DOM",
        topics: [
          {
            id: "05-01",
            title: "PIN y VPIN — Probability of Informed Trading",
            tag: "quant",
            content: `El modelo EKOP (Easley et al. 1996) define PIN como la fracción del order flow que proviene de traders informados.

**Modelo EKOP**

Con prob α hay un evento de información (bueno con prob 1-δ, malo con prob δ). PIN = αμ/(αμ+2ε). Estimación por MLE es difícil — usar la factorización de Yan & Zhang (2012).

**VPIN — Volume-Synchronized PIN**

VPIN usa volumen como reloj: divide en buckets de τ unidades. VPIN_n = (Σᵢ |Vᵢ^B - Vᵢ^S|) / (n·τ). VPIN > 0.5 precede episodios de alta volatilidad como el Flash Crash de 2010.`,
            formulas: [
              {
                label: "VPIN con L buckets",
                content: "VPIN_n = \\frac{1}{L} \\sum_{i=n-L+1}^{n} \\frac{|V_i^B - V_i^S|}{V_{bucket}}"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "Calcular VPIN en NQ",
                code: `import numpy as np

def calculate_vpin(trades_df, bucket_size=50):
    """
    trades_df: DataFrame con columnas ['volume', 'buy_sell']
               buy_sell = 1 para compras, -1 para ventas
    bucket_size: número de contratos por bucket
    """
    # Clasificar trades por bulk volume classification
    n_buckets = int(trades_df['volume'].sum() / bucket_size)
    
    vpin_history = []
    for i in range(n_buckets - 50, n_buckets):
        start = i * bucket_size
        end = (i + 1) * bucket_size
        
        bucket = trades_df.iloc[start:end]
        
        # Volume iniciado por compradores
        v_b = bucket[bucket['buy_sell'] == 1]['volume'].sum()
        v_s = bucket[bucket['buy_sell'] == -1]['volume'].sum()
        
        # VPIN del bucket
        vpin = abs(v_b - v_s) / bucket_size
        vpin_history.append(vpin)
    
    # VPIN promedio de los últimos 50 buckets
    return np.mean(vpin_history[-50:])

# Interpretación
vpin = calculate_vpin(nq_trades)
if vpin > 0.5:
    print("Order flow tóxico: mayor momentum, menor reversión")
    print("Riesgo de moves rápidos y unidireccionales")`,
                annotations: [
                  "Bucket size de 50 contratos es estándar para NQ",
                  "Usa bulk volume classification para clasificar trades",
                  "VPIN alto indica régimen unfavorable para market-making"
                ]
              }
            ]
          },
          {
            id: "05-02",
            title: "Regímenes AMT y DOM — absorción, agotamiento, POC shifting",
            tag: "advanced",
            content: `Desde Auction Market Theory, los regímenes se definen por el estado de la subasta: ¿está el mercado facilitando o rechazando precios?

**Balance vs. Desequilibrio**

Balance: delta ≈ 0, DOM equilibrado, precio en VPOC ± 1σ. Desequilibrio: presión compradora/vendedora sostenida, delta acumulativo con bias. La transición balance→desequilibrio es el setup más potente.

**DOM Absorption vs. Exhaustion**

Absorción: ratio volumen ejecutado/tamaño inicial del bid/ask > 2. Agotamiento: correlación entre Δprecio y Δdelta cae de 0.8 a 0.3.

**POC shifting regimes**

POC migra consistentemente = régimen de rotación de valor. POC migra en contra del precio = divergencia, rotación inminente.`,
diagram: {
              type: "mermaid",
              title: "Regímenes de Auction",
              content: `stateDiagram-v2
    [*] --> Balance
    Balance --> DesequilibrioAlcista : Absorption confirmada
    Balance --> DesequilibrioBajista : Selling pressure
    DesequilibrioAlcista --> Balance : Reversión
    DesequilibrioAlcista --> Breakout : Exhaustion
    DesequilibrioBajista --> Balance : Covering
    DesequilibrioBajista --> Breakdown : Exhaustion
    Breakout --> [*] : Nuevo rango
    Breakdown --> [*] : Nuevo rango`
            }
          },
          {
            id: "05-03",
            title: "Footprint Regimes — delta divergence, trapped traders, stacked imbalances",
            tag: "advanced",
            content: `**Delta Divergence como señal de régimen**

Si el precio hace HH pero el delta acumulado hace LH: régimen de distribución activa — hay selling oculto absorbiendo la demanda. Correlación < 0.3 con tendencia activa = señal.

**Stacked Imbalances — zonas de régimen**

3+ celdas consecutivas con imbalance ≥ 300%. Estas zonas actúan como magnets. Probabilidad de fill en 5 sesiones: 60-75%.

**Trapped Traders — régimen de squeeze**

Barras con delta > +X seguidas de precio cayendo debajo del low. Squeeze activo cuando hay trapped traders en múltiples timeframes simultáneamente.`,
            callouts: [
              { type: "info", title: "Regime Dashboard", text: "Combina VPIN, POC migration velocity, delta divergence score, y stacked imbalance fill probability. Más accionable que cualquier HMM estadístico." }
            ],
            exercise: {
              question: "¿Cuál NO es un indicador de régimen de distribution activa (selling oculto)?",
              options: [
                "Precio hace Higher High, delta hace Lower High",
                "VPIN > 60th percentile histórico",
                "POC migrando consistentemente hacia arriba con precio",
                "Stacked imbalance de venta en resistencia"
              ],
              correctAnswer: 2,
              explanation: "POC migrando hacia arriba con precio indica acumulación (buying oculto), no distribution. Distribution implica precio subiendo pero delta divergiendo negativamente."
            }
          }
        ]
      },
      {
        id: "06",
        title: "Correlation & Cross-Asset Regimes",
        subtitle: "Cuando todo se mueve junto (o no)",
        topics: [
          {
            id: "06-01",
            title: "DCC-GARCH — Dynamic Conditional Correlation",
            tag: "advanced",
            content: `Engle (2002): el DCC-GARCH modela correlaciones que cambian en el tiempo sin la explosión de parámetros del BEKK.

**Especificación DCC en dos etapas**

Etapa 1: GARCH univariado para cada activo. Etapa 2: modelar la correlación dinámica: Qₜ = (1-α-β)Q̄ + α·ẑₜ₋₁ẑ'ₜ₋₁ + β·Qₜ₋₁.

**Correlation regimes desde DCC**

Una vez estimado DCC, aplicar HMM sobre la serie de correlaciones dinámicas ρₜ. Régimen 1 (baja correlación): diversificación funciona. Régimen 2 (alta correlación): risk-off, todo cae junto.

**Asymmetric DCC (ADCC)**

Las correlaciones suben más rápido en downturns. Qₜ = (1-α-β-γ/2)Q̄ + α·ẑₜ₋₁ẑ'ₜ₋₁ + γ·ñₜ₋₁ñ'ₜ₋₁ + β·Qₜ₋₁.`,
            comparisonData: {
              headers: ["Modelo", "Parámetros", "Ventaja", "Desventaja"],
              rows: [
                ["DCC-GARCH", "O(m)", "Escalable", "Asume simetría"],
                ["BEKK", "O(m²)", "Completo", "Muchos parámetros"],
                ["ADCC", "O(m)", "Asimétrico", "Más complejo"]
              ]
            },
            resources: [
              { name: "rmgarch (R)", type: "library" },
              { name: "arch (Python)", type: "library" },
              { name: "Engle 2002 JBES", type: "paper" }
            ]
          },
          {
            id: "06-02",
            title: "Copulas para regímenes de dependencia extrema",
            tag: "quant",
            content: `**Teorema de Sklar**

F(x,y) = C(F_X(x), F_Y(y)) donde C es una cópula. Las cópulas separan la dependencia de las marginales. Para NQ-ES: cópula de Gumbel (cola superior) para rallies; cópula de Clayton (cola inferior) para crashes.

**Mixture copulas para regímenes**

C(u,v) = p·C₁(u,v) + (1-p)·C₂(u,v). C₁ = Clayton (crash), C₂ = Gumbel (rally), C₃ = Gaussian (normal). El peso p depende de condiciones de mercado.

**Contagion vs. Interdependence**

Forbes & Rigobon (2002): si la correlación ajustada por vol no cambia, es interdependence normal; si cambia significativamente, es contagion verdadera.`,
            codeExamples: [
              {
                language: "python",
                title: "Copula mixture con scipy",
                code: `from scipy import stats
import numpy as np

def mixture_copula(u, v, weights, copulas):
    """
    Mixture de cópulas
    u, v: uniforms (transformadas de marginales)
    weights: [w1, w2, ...] sum=1
    copulas: [copula1, copula2, ...]
    """
    c = 0
    for w, cop in zip(weights, copulas):
        c += w * cop.cdf(u, v)
    return c

# Cópulas Archimedianas
clayton = stats.archimedean.copula('clayton', theta=2)
gumbel = stats.archimedean.copula('gumbel', theta=2)
gaussian = stats.multivariate_normal(cov=[[1, 0.5], [0.5, 1]])

# Mixture: 40% Clayton (crash), 30% Gumbel (rally), 30% Gaussian
mixture = lambda u, v: (
    0.4 * clayton.cdf(u, v) +
    0.3 * gumbel.cdf(u, v) +
    0.3 * gaussian.cdf(u, v)
)`,
                annotations: [
                  "Clayton captura dependencia en colas inferiores (crashes)",
                  "Gumbel captura dependencia en colas superiores (rallies)",
                  "La mixture permite que la dependencia cambie con el régimen"
                ]
              }
            ]
          },
          {
            id: "06-03",
            title: "Risk-On / Risk-Off — cuantificación y leading indicators",
            tag: "core",
            content: `**PCA-based RORO scoring**

Construir RORO score: (1) Seleccionar pares riesgo/refugio: NQ/treasuries, HY/IG spreads, Cu/Au, AUD/JPY, EM/DM. (2) Normalizar a z-score con ventana rolling de 252 días. (3) PCA: PC1 ≈ factor RORO (>60% varianza). (4) PC1 > +1σ: risk-on; < -1σ: risk-off.

**Cross-asset regime confirmation**

Para validar un régimen en equities, buscar confirmación en: credit spreads, vol curve, currency carry, commodity-equity relation. Cuando 3+ dimensiones concuerdan: señal fuerte.`,
            formulas: [{
              label: "RORO Score compuesto (5 factores)",
              content: "RORO_t = \\frac{1}{5} \\sum_i z\\_score(factor_i, t, window=252)"
            }],
            callouts: [
              { type: "info", title: "Factores del RORO", text: "Cu/Au, AUD/JPY, HY spread, VIX term slope, NQ/TLT. Trackear PC1 diariamente como indicador de régimen." }
            ]
          }
        ]
      },
      {
        id: "07",
        title: "Machine Learning para Regímenes",
        subtitle: "Más allá de los modelos paramétricos",
        topics: [
          {
            id: "07-01",
            title: "Unsupervised clustering — GMM, K-means, DBSCAN en retornos",
            tag: "advanced",
            content: `**GMM — Gaussian Mixture Models**

Caso especial de HMM donde la secuencia de estados es independiente. K=3-4 GMM sobre features (r, |r|, vol, skew) da regímenes diferenciados. Después: estimar matriz de transición empírica — si es más ordenada que aleatoria, tiene estructura de Markov.

**K-means — limitaciones**

Asume clusters esféricos (covarianzas iguales). El problema: puede asignar puntos temporalmente discontinuos al mismo "régimen". Solución: incluir features de momentum temporal.

**DBSCAN para anomalías**

Identifica outliers (puntos no asignados a ningún cluster) = barras anómalas = potenciales indicadores de cambio de régimen. ε = percentil 90 de distancias.`,
            codeExamples: [
              {
                language: "python",
                title: "GMM clustering para regímenes",
                code: `from sklearn.mixture import GaussianMixture
import numpy as np

def cluster_regimes(features, k_range=range(2, 6)):
    """
    Clustering de features para regímenes
    features: (n_samples, n_features)
    """
    bic_scores = []
    models = {}
    
    for k in k_range:
        gmm = GaussianMixture(
            n_components=k,
            covariance_type='full',
            n_init=20,
            random_state=42
        )
        gmm.fit(features)
        
        # BIC para selección de K
        bic = gmm.bic(features)
        bic_scores.append(bic)
        models[k] = gmm
    
    best_k = k_range[np.argmin(bic_scores)]
    
    # Asignar regímenes
    regime_probs = models[best_k].predict_proba(features)
    regimes = models[best_k].predict(features)
    
    return regimes, regime_probs, best_k

# Features para NQ
features = np.column_stack([
    returns,
    abs(returns),
    realized_vol,
    rolling_skew(returns, 20)
])

regimes, probs, k = cluster_regimes(features)`,
                annotations: [
                  "Ejecuta con n_init=20 para evitar máximos locales",
                  "BIC minimizado = mejor trade-off complejidad/fit",
                  "predict_proba da probabilidades de pertenecer a cada régimen"
                ]
              }
            ]
          },
          {
            id: "07-02",
            title: "BOCPD — Bayesian Online Changepoint Detection en tiempo real",
            tag: "quant",
            content: `Adams & MacKay (2007): el framework más elegante para detección de regímenes en tiempo real. rₜ = "run length" = tiempo desde el último changepoint.

**Arquitectura BOCPD**

En cada nuevo dato xₜ, mantiene P(rₜ | x₁:ₜ). Hazard function: h(r) = 1/λ donde λ = duración esperada del régimen. Usar λ = 63 (trimestre) para regímenes diarios.

**BOCPD con modelos conjugados**

Gaussiano con varianza desconocida → Normal-Inverse-Gamma prior. El posterior se actualiza recursivamente. Predictive probability es Student-t. Esto hace BOCPD O(n) por barras — implementable en tiempo real.

**Truncated BOCPD**

Truncar a los L más probables (ej. L=50). Pruning cuando P(rₜ = r) < 10⁻⁶.`,
            formulas: [
              {
                label: "Hazard function",
                content: "h(r_t) = P(changepoint | r_{t-1}) = \\frac{1}{\\lambda}"
              },
              {
                label: "Update equations",
                content: "P(r_t=0 | x_{1:t}) \\propto \\sum_r P(x_t|r_{t-1}=r) \\cdot \\frac{1}{\\lambda} \\cdot P(r_{t-1}=r|x_{1:t-1})"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "BOCPD con bayesian_changepoint_detection",
                code: `from bayesian_changepoint_detection.online_changepoint_detection import OnlineChangepointDetection
from bayesian_changepoint_detection.priors import const_prior
import numpy as np

# Modelo conjugado: Normal-Inverse-Gamma
hazard = lambda r: 1/63  # λ = 63 días
prior = const_prior(lambda t: t)

ocd = OnlineChangepointDetection(hazard, prior)

# Run length distribution en cada nuevo dato
def update_bocpd(new_observation):
    global ocd
    ocd.add_observation(new_observation)
    return ocd.run_length_probabilities[-1]

# Detectar cambio de régimen
run_length = update_bocpd(new_data_point)
max_run_length = np.argmax(run_length)  # run length más probable
prob_changepoint = run_length[0]  # P(r_t = 0)

if prob_changepoint > 0.5:
    print("Cambio de régimen detectado!")
    print(f"Run length más probable: {max_run_length} barras")`,
                annotations: [
                  "λ = 63 significa duración esperada de 63 días por régimen",
                  "run_length[0] es la probabilidad de que el cambio sea AHORA",
                  "Cuando run_length[0] > 0.5, el régimen probablemente cambió"
                ]
              }
            ]
          },
          {
            id: "07-03",
            title: "Deep Learning — LSTM regimes, autoencoders, attention",
            tag: "advanced",
            content: `**LSTM para clasificación de regímenes**

Arquitectura: LSTM(128) → Dropout(0.3) → LSTM(64) → Dense(K, softmax). Input: ventana de T barras de features. Output: probabilidades de régimen. El problema es la label generation — usar GMM o HMM para pseudo-labels.

**Variational Autoencoder para regímenes latentes**

VAE comprime xₜ en espacio latente z de dimensión 2-4. El espacio latente se organiza en clusters = regímenes empíricos. Ventaja: no asume distribución de emisión específica.

**Transformer-based regime detection**

Self-attention captura dependencias largas. Temporal Fusion Transformer (TFT) con static covariates (VIX, time-of-year) y time-varying inputs (returns, order flow). El attention map revela períodos históricos similares al presente.`,
            callouts: [
              { type: "warning", title: "Data regime drift", text: "Los regímenes del pasado (2008-2015) son cualitativamente diferentes a los actuales (2020-2025). Un LSTM entrenado en 2010-2018 puede ser inútil para 2024. Usar expanding window cross-validation." }
            ],
            exercise: {
              question: "¿Cuál es el principal problema del deep learning para detección de regímenes en trading?",
              options: [
                "Overfitting",
                "Data regime drift",
                "Computational cost",
                "Lack of labels"
              ],
              correctAnswer: 1,
              explanation: "Los regímenes del pasado son cualitativamente diferentes a los actuales. Un modelo entrenado en datos históricos puede no generalizar al régimen actual. Expanding window CV y monitoreo OOS constante son esenciales."
            }
          }
        ]
      },
      {
        id: "08",
        title: "Options Market Regimes",
        subtitle: "El mercado de opciones como regime indicator",
        topics: [
          {
            id: "08-01",
            title: "GEX y DEX Regimes — la física del mercado de opciones",
            tag: "advanced",
            content: `Gamma Exposure (GEX) captura cuánto delta hedging los dealers de opciones necesitan hacer — esto afecta directamente la dinámica de precios del underlying.

**GEX Regimes**

GEX positivo (dealer long gamma): compradores en caídas, vendedores en rallies — actúan como amortiguadores. GEX negativo (dealer short gamma): vendedores en caídas, compradores en rallies — amplifican movimientos. La transición GEX+ → GEX- es uno de los cambios de régimen más actionable.

**Cuantificación del GEX**

GEX = Σ_options [Open_Interest × Gamma × 100 × Spot²]. GEX > +$1B: vol suprimida, mean-reversion. GEX < -$1B: vol elevada, momentum. GEX ≈ 0: zona inestable.

**Charm, Vanna, Volga — second-order effects**

Charm = dDelta/dt: decaimiento del delta con el tiempo. Vanna = dDelta/dVol: cuando VIX spike, puts OTM se vuelven más ITM, forzando a dealers a vender.`,
diagram: {
              type: "mermaid",
              title: "Flujo de Gamma en dealers",
              content: `flowchart LR
    A["Precio sube"] --> B["Dealers long calls venden"]
    A --> C["Dealers short puts compran"]
    B --> D["presión vendedora"]
    C --> E["presión compradora"]
    D --> F{"GEX positivo?"}
    E --> F
    F -->|Sí| G["Amortiguador - vol baja"]
    F -->|No| H["Amplificador - vol alta"]`
            }
          }
        ]
      },
      {
        id: "09",
        title: "Real-Time Regime Detection",
        subtitle: "Detección online sin look-ahead bias",
        topics: [
          {
            id: "09-01",
            title: "SPRT y CUSUM modernos — detección secuencial",
            tag: "quant",
            content: `**Sequential Probability Ratio Test (SPRT)**

Wald (1945): test secuencial óptimo (minimax Average Sample Number). Calcula Λₙ = Σᵢ log[f₁(xᵢ)/f₀(xᵢ)]. Si Λₙ ≥ log(B): rechazar H₀. Si Λₙ ≤ log(A): aceptar H₀. Si en medio: continuar observando.

**CUSUM generalizado — GLRT online**

CUSUM de Page modernizado: Gₙ = max_{0≤k≤n} [Sₙ - Sₖ] donde Sₙ = Σᵢ log[f₁(xᵢ)/f₀(xᵢ)]. El GLRT version desconhece θ₁ y estima: Gₙ = max_{0≤k≤n} max_{θ} Σᵢ₌ₖ₊₁^n log[f(xᵢ;θ)/f(xᵢ;θ₀)].

**Average Run Length (ARL)**

ARL₀ = E[tiempo de alarma | no hay cambio]. ARL₁ = E[tiempo de detección | hay cambio]. Trade-off fundamental: no puedes mejorar ambos simultáneamente.`,
            formulas: [
              {
                label: "CUSUM bilateral",
                content: "S^{+}_n = \\max(0, S^{+}_{n-1} + \\Lambda_n - k)"
              },
              {
                label: "ARL control",
                content: "k = \\frac{\\sigma}{2}, \\quad h = ARL_0 \\text{ control}"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "CUSUM para detección de régimen",
                code: `import numpy as np

def cusum_detector(data, threshold=5, drift=0.5):
    """
    CUSUM para detección de cambio de régimen
    data: array de retornos
    threshold: h (genera alarma)
    drift: k (slack para absorver ruido)
    """
    s_pos = 0  # CUSUM positivo
    s_neg = 0  # CUSUM negativo
    alarms = []
    
    for i, x in enumerate(data):
        # Update CUSUM
        s_pos = max(0, s_pos + x - drift)
        s_neg = min(0, s_neg + x + drift)
        
        # Detectar cambio
        if s_pos > threshold:
            alarms.append(('bull', i))
            s_pos = 0  # Reset
        elif s_neg < -threshold:
            alarms.append(('bear', i))
            s_neg = 0  # Reset
    
    return alarms

# Usar con retornos de NQ
alarms = cusum_detector(nq_returns, threshold=5, drift=0.5)
for regime, idx in alarms:
    print(f"{regime.upper()} régimen detectado en barra {idx}")`,
                annotations: [
                  "threshold controla ARL₀ (falsas alarmas)",
                  "drift absorbe ruido normal del mercado",
                  "Ajusta según la volatilidad del activo"
                ]
              }
            ]
          },
          {
            id: "09-02",
            title: "Particle Filters — estimación Bayesiana no-lineal en tiempo real",
            tag: "quant",
            content: `**Sequential Monte Carlo (SMC) / Particle Filter**

El particle filter aproxima P(Sₜ | y₁:ₜ) usando N partículas {s^(i)_t, w^(i)_t}. Algoritmo: (1) Predict: propagar cada partícula según la dinámica del régimen. (2) Update: actualizar pesos según verosimilitud. (3) Resample: eliminar partículas de bajo peso.

**Particle filter para MS-GARCH**

El MS-GARCH no tiene filtro analítico exacto — el particle filter es la solución. Cada partícula representa (Sₜ, hₜ): el régimen Y la varianza condicional. N = 500-2000 partículas suele ser suficiente.

**SMC con Parameter Learning — Liu & West (2001)**

Cada partícula lleva {s^(i)_t, θ^(i)_t}. El prior sobre θ se perturba en cada paso (jittering) para evitar colapso. Esto permite que el modelo "aprenda" nuevos regímenes en tiempo real.`,
diagram: {
              type: "mermaid",
              title: "Particle Filter para regímenes",
              content: `flowchart TD
    A["N partículas"] --> B{"Predict"}
    B --> C["Propagar según dinámica"]
    C --> D["Actualizar pesos"]
    D --> E{"Peso bajo?"}
    E -->|Sí| F["Resample"]
    E -->|No| G["Conservar"]
    F --> H["Duplicar partículas de alto peso"]
    H --> I["Estimar P(régimen)"]
    G --> I
    I --> A`
            }
          },
          {
            id: "09-03",
            title: "Kalman Extensions — Regime-Switching Kalman Filter",
            tag: "advanced",
            content: `**Switching State Space Models (Kim 1994)**

El modelo de Kim combina Kalman filter (estado continuo) con Hamilton filter (estado discreto). Estado: xₜ ~ lineal Gaussiano dado Sₜ; Sₜ ~ Markov chain. La aproximación de Kim colapsa la mezcla en cada paso para mantener O(K) componentes.

**Interacting Multiple Model (IMM)**

IMM (Blom & Bar-Shalom 1988): en cada paso, mezcla K modelos de Kalman con pesos que evolucionan según la likelihood. Más eficiente que particle filter pero menos flexible. Útil para tracking de tendencia con tres modelos: "trend alcista", "trend bajista", "lateral".`,
            exercise: {
              question: "¿Cuál es la ventaja principal del IMM sobre el particle filter?",
              options: [
                "Más preciso para no-linealidades",
                "Más computacionalmente eficiente",
                "Menos parámetros a ajustar",
                "Mejor para regímenes asimétricos"
              ],
              correctAnswer: 1,
              explanation: "IMM es más computacionalmente eficiente que particle filter y converge más rápido. Sin embargo, es menos flexible para no-linealidades."
            }
          }
        ]
      },
      {
        id: "10",
        title: "Regime-Conditional Trading",
        subtitle: "De la teoría a la aplicación real",
        topics: [
          {
            id: "10-01",
            title: "Position Sizing bajo incertidumbre de régimen",
            tag: "advanced",
            content: `**Kelly fraction condicionado al régimen**

Kelly con regímenes: f*(t) = Σₖ P(Sₜ=k) · f*_k donde f*_k = μₖ/σ²ₖ es el Kelly del régimen k. Esto da automáticamente mayor sizing en regímenes con mejor Sharpe y menor sizing cuando hay incertidumbre.

**Regime-aware stop sizing**

El ATR cambia radicalmente entre regímenes. En alta vol: ATR puede ser 3-5× el de baja vol. Stop = k × ATR_régimen. Para NQ en alta vol: k=2-3 ATR; en baja vol: k=1-1.5 ATR.

**Regime transition costs**

Si el detection lag es L barras y el nuevo régimen tiene Sharpe diferente: E[gain] vs. cost = bid-ask × (2 × posición). Breakeven detection lag debe ser calculado para cada setup.`,
            formulas: [
              {
                label: "Kelly condicionado",
                content: "f^*(t) = \\sum_k P(S_t=k) \\cdot f^*_k = \\sum_k P(S_t=k) \\cdot \\frac{\\mu_k}{\\sigma_k^2}"
              },
              {
                label: "Sizing basado en entropía",
                content: "w(t) = w_{max} \\times \\left[1 - \\frac{H(t)}{\\log_2(K)}\\right]"
              }
            ],
            codeExamples: [
              {
                language: "python",
                title: "Kelly condicionado al régimen",
                code: `def regime_kelly_fractions(returns_by_regime, probabilities):
    """
    Calcula Kelly fractions condicionado a probabilidades de régimen
    returns_by_regime: dict {regime: returns_array}
    probabilities: array de P(S_t=k)
    """
    kelly_fractions = {}
    
    for regime, returns in returns_by_regime.items():
        # Kelly del régimen
        mu = np.mean(returns)
        sigma = np.std(returns)
        kelly_fractions[regime] = mu / (sigma ** 2)
    
    # Kelly ponderado por probabilidad de régimen
    weighted_kelly = sum(
        p * kelly_fractions[r]
        for r, p in enumerate(probabilities)
    )
    
    return weighted_kelly, kelly_fractions

# Ejemplo
probs = filtered_probabilities_from_hmm  # [0.3, 0.5, 0.2]
kelly, fracs = regime_kelly_fractions(
    {0: bull_returns, 1: neutral_returns, 2: bear_returns},
    probs
)
print(f"Kelly recomendado: {kelly:.2%}")`,
                annotations: [
                  "Usa filtered probabilities del HMM/BOCPD para ponderar",
                  "Cuando probs están difusas, kelly_ponderado → 0",
                  "Ajusta por factor de Kelly (usar half-Kelly)"
                ]
              }
            ]
          },
          {
            id: "10-02",
            title: "Strategy Switching — mean reversion vs momentum por régimen",
            tag: "advanced",
            content: `**Autocorrelación como clasificador de régimen**

ρ₁ > 0 = régimen de momentum. ρ₁ < 0 = régimen de mean-reversion. ρ₁ ≈ 0 = random walk. Calcular rolling en ventana de 20 barras. Threshold: ρ₁ > +0.15 → momentum, ρ₁ < -0.15 → reversal.

**Hurst exponent por régimen**

H > 0.5: trending (favorable para momentum). H < 0.5: antipersistencia (favorable para fade). H ≈ 0.5: random walk.

**Meta-strategy: regime-weighted ensemble**

Signal = Σₖ P(Sₜ=k) × Signal_k. Esto suaviza transiciones y evita over-trading en regímenes de transición.`,
            regimeMatrixData: [
              { label: "ρ₁ > 0.15", title: "Momentum", description: "Seguir tendencia", color: "#22c55e" },
              { label: "ρ₁ < -0.15", title: "Mean Reversion", description: "Fade movimientos", color: "#ef4444" },
              { label: "H > 0.6", title: "Trending fuerte", description: "Agresivo", color: "#f59e0b" },
              { label: "H < 0.4", title: "Antipersistente", description: "Reversal", color: "#a78bfa" }
            ],
            callouts: [
              { type: "info", title: "Observación empírica", text: "El régimen de mayor edge no es el de máxima tendencia, sino el de expansión de rango (vol expansion desde compresión). Sharpe histórico superior al promedio." }
            ]
          },
          {
            id: "10-03",
            title: "Factor Exposure Management y Regime Portfolio Construction",
            tag: "quant",
            content: `**Factor loadings condicionados al régimen**

rₜ = α(Sₜ) + β(Sₜ)'Fₜ + εₜ. En risk-on: beta alto, size y momentum positivos. En risk-off: beta defensivo, quality positivo, momentum negativo.

**Regime-conditional portfolio optimization**

max_{w} Σₖ P(Sₜ=k) [w'μₖ - (λ/2)w'Σₖw]. Cuando incertidumbre es alta, se aproxima al portafolio mínima varianza. Cuando hay certeza de régimen, converge al óptimo del régimen específico.

**Tail risk en regime transitions**

El mayor riesgo no está dentro de un régimen sino en las transiciones. Mitigación: (1) opciones para cubrir riesgo de transición, (2) reducir exposición cuando filtered probabilities muestran incertidumbre creciente, (3) track "regime entropy" H = -Σₖ P(Sₜ=k)·log(P(Sₜ=k)).`,
            formulas: [
              {
                label: "Regime Entropy",
                content: "H(t) = -\\sum_k P(S_t=k | y_{1:t}) \\cdot \\log_2[P(S_t=k)]"
              },
              {
                label: "Sizing rule",
                content: "w(t) = w_{max} \\times [1 - H(t)/\\log_2(K)]"
              }
            ],
            callouts: [
              { type: "warning", title: "El error más costoso", text: "Cambiar de estrategia demasiado rápido (over-fitting) o demasiado lento (lag excesivo). El ARL₁ del detector debe ser menor que la duración media de los regímenes." }
            ],
            exercise: {
              question: "¿Qué indica una alta regime entropy (H cercano a log₂(K))?",
              options: [
                "El mercado está en un régimen definido",
                "El mercado está en transición",
                "Los dealers tienen mucho gamma",
                "El VIX está muy alto"
              ],
              correctAnswer: 1,
              explanation: "H = 0 significa certeza total (un régimen domina). H = log₂(K) significa máxima incertidumbre (todos los regímenes igual de probables) = transición de régimen. Cuando H crece, reducir sizing."
            }
          }
        ]
      }
    ]
  }
};

export const moduleList = [
  { id: "00", title: "Plan de estudio" },
  { id: "01", title: "Bases estadísticas" },
  { id: "02", title: "Markov Switching" },
  { id: "03", title: "Hidden Markov Models" },
  { id: "04", title: "Volatility Regimes" },
  { id: "05", title: "Microestructura" },
  { id: "06", title: "Correlaciones" },
  { id: "07", title: "Machine Learning" },
  { id: "08", title: "Options Regimes" },
  { id: "09", title: "Real-Time Detection" },
  { id: "10", title: "Trading Applications" },
];
