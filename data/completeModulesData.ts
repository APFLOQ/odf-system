export const fullModulesContent = {
  // ==================== INTRODUCCIÓN ====================
  "intro": {
    title: "Mapa y Plan de Estudio",
    phase: "Introducción",
    topics: [
      {
        title: "Mapa del Curso",
        tag: "intro",
        content: `
Esta guía cubre el espectro completo del análisis de regímenes de mercado: desde la detección estadística de cambios estructurales (Chow, Bai-Perron, CUSUM) hasta la implementación de Hidden Markov Models, modelos de volatilidad (GARCH, HAR-RV), microestructura de mercado (PIN/VPIN, order flow), y aplicaciones prácticas de trading con position sizing adaptativo y selección de estrategias por régimen.

**Estadísticas del curso:**
- 10 Módulos
- 30+ Temas
- 150+ Subtópicos
- Profundidad infinita
        `
      },
      {
        title: "Plan de Estudio Recomendado",
        tag: "intro",
        content: `
**Semanas 1-2: Bases estadísticas y change point detection**
Conceptos: Stationarity (ADF, KPSS), structural breaks (Chow, Bai-Perron), change point detection (PELT, WBS, BOCPD). 14-16 horas.

**Semanas 3-4: Hamilton Markov Switching y familia MS**
Conceptos: El paper de Hamilton (1989), filtro de Hamilton, smoother de Kim, algoritmo EM. 16-18 horas.

**Semanas 5-6: Hidden Markov Models**
Conceptos: Los tres problemas de Rabiner (Forward, Viterbi, Baum-Welch), Gaussian HMM, Student-t HMM. 16-20 horas.

**Semanas 7-8: Volatility y Correlation Regimes**
Conceptos: HAR-RV, VIX term structure, DCC-GARCH, Copulas, Variance Risk Premium. 14-18 horas.

**Semanas 9-10: Microestructura y Order Flow**
Conceptos: PIN, VPIN, Order Flow Imbalance, DOM absorption/exhaustion. 16-20 horas.

**Semanas 11-12: Machine Learning para Regímenes**
Conceptos: GMM clustering, BOCPD, LSTM, autoencoders. 18-22 horas.

**Semanas 13-14: Options Regimes y Detección Real-Time**
Conceptos: GEX/DEX, Charm, vanna flows, Vol surface, SPRT, CUSUM. 16-20 horas.

**Semanas 15-16: Trading Applications**
Conceptos: Kelly fraction por régimen, Volatility targeting, Regime-strategy mapping. 14-18 horas.
        `
      }
    ]
  },

  // ==================== MÓDULO 1: FUNDAMENTOS ====================
  "m1": {
    title: "Change Point Detection — Más Allá del CUSUM Básico",
    phase: "Módulo 1 — Fundamentos",
    topics: [
      {
        title: "PELT — Pruned Exact Linear Time (Killick, Fearnhead, Eckley 2012)",
        tag: "core",
        content: `
PELT es el algoritmo de referencia para detección de múltiples change points cuando se necesita exactitud. La innovación central es usar programación dinámica con podas (pruning) que reducen la complejidad de O(n²) a O(n) en promedio, haciéndolo viable para series de millones de puntos mientras se mantiene la optimalidad exacta.

**1.1 La mecánica de la poda — por qué funciona**

El algoritmo minimiza una función de costo penalizada:
Q(τ₁...τₖ) = Σᵢ C(y_{τᵢ₋₁:τᵢ}) + β·K

donde C(y_{s:t}) mide la "inconsistencia" del segmento [s,t] y β es el factor de penalización.

La poda funciona así: para cada punto t, se mantiene una lista de "candidatos". Si el costo de llegar a t pasando por un candidato es mayor que el costo de saltarlo, ese candidato se poda permanentemente. En la práctica, esto elimina ~90% de los candidatos en datos financieros.

**1.2 La penalización óptima — el problema de β**

- **BIC**: pen = log(n) · 2 · σ²_returns
- **AIC**: pen = 2 · 2 · σ²_returns  
- **HQC**: pen = 2 · log(log(n)) · σ²_returns

Para returns diarios típicos: pen ≈ 0.03-0.08
Para 5-min bars: pen ≈ 0.5-2.0
        `
      },
      {
        title: "BOCPD — Bayesian Online Changepoint Detection",
        tag: "advanced",
        content: `
Adams & MacKay (2007) desarrollaron BOCPD, que calcula recursivamente P(rₜ | x₁:t) donde rₜ es el "run length" — el tiempo transcurrido desde el último change point. Este es fundamentalmente diferente de los métodos de batch (PELT, WBS): BOCPD es online, entrega una distribución de probabilidad sobre el timing del cambio en cada timestep.

**2.1 El concepto de run length**

rₜ ∈ {0, 1, 2, ...} donde rₜ = k significa "el último cambio ocurrió hace exactamente k barras".

**2.2 La hazard function — controlando la tasa de cambios**

| Hazard Function | Fórmula | Comportamiento |
|-----------------|---------|----------------|
| Constante | H(r) = 1/λ | Tasa uniforme de cambio |
| Geométrica | H(r) = 1 - pᵒˡᵈ | Decae con el run length |
| Uniforme | H(r) = 1 si r ≥ L | Cambio obligatorio tras L barras |

Para datos de mercado intradiario, p_old = 0.999 (media de duración ≈ 1000 barras) es un buen punto de partida.
        `
      },
      {
        title: "Structural Breaks — Tests Formales (Chow, Andrews, Bai-Perron)",
        tag: "core",
        content: `
Los tests de structural break responden a una pregunta diferente: dado que sabes (o sospechas) que hay un cambio, ¿cuál es la evidencia estadística para rechazarlo? Mientras PELT busca dónde están los cambios, los tests prueban si hay evidencia suficiente.

**Chow Test (1960)**

Gregory Chow desarrolló el test para cuando el break point τ es conocido a priori. La hipótesis nula es que los coeficientes son iguales antes y después de τ.

F = [(RSS_pooled - (RSS₁ + RSS₂)) / k] / [(RSS₁ + RSS₂) / (n - 2k)]

**Limitación severa**: si estimas τ de los datos, la distribución del estadístico cambia y el test se invalida.

**Andrews SupF y Bai-Perron**

Andrews (1993) propuso buscar el break point sobre todo el rango posible. Bai & Perron (1998, 2003) desarrollaron el framework completo para múltiples cambios unknowns. Este es el estándar dorado para análisis de regímenes en datos financieros.
        `
      },
      {
        title: "Criterios de información y selección del número de regímenes K",
        tag: "core",
        content: `
La selección de K (número de regímenes) es uno de los problemas más delicados en la práctica. K=2 es casi siempre demasiado simple para mercados financieros; K>5 introduce sobreparametrización.

**AIC (Akaike Information Criterion)**
AIC = 2k - 2ln(L̂). Tiende a sobreestimar K en muestras finitas. Usar cuando el objetivo es forecasting puro.

**BIC (Bayesian Information Criterion)**
BIC = k·ln(n) - 2ln(L̂). Penaliza más agresivamente. Teóricamente consistente: selecciona el K correcto con probabilidad 1 conforme n→∞.

**HQIC (Hannan-Quinn Information Criterion)**
HQ = 2k·ln(ln(n)) - 2ln(L̂). Compromiso entre AIC y BIC. Particularmente útil cuando hay dependencia temporal fuerte.

| Criterio | Penalización | Tendencia | Uso óptimo |
|----------|--------------|-----------|------------|
| AIC | 2k | Sobrestima K | Forecasting puro, muestras grandes |
| BIC | k·ln(n) | Subrestima K | Identificación de regímenes |
| HQIC | 2k·ln(ln(n)) | Intermedio | Dependencia temporal fuerte |

**Regla práctica**: Para ES/NQ con datos diarios, K=3-4 captura "bull trending", "bear trending", y "range/mean-reversion". K=4 añade "crisis/crash" como estado separado.
        `
      }
    ]
  },

  // ==================== MÓDULO 2: MS MODELS ====================
  "m2": {
    title: "Hamilton Markov-Switching Model — Arquitectura Completa",
    phase: "Módulo 2 — MS Models",
    topics: [
      {
        title: "Especificación del MS-AR(p) y las tres variantes",
        tag: "advanced",
        content: `
El modelo MS-AR(p) toma la forma:
yₜ = μ(Sₜ) + Σᵢ φᵢ(Sₜ)(yₜ₋ᵢ - μ(Sₜ₋ᵢ)) + σ(Sₜ)εₜ

donde Sₜ es el estado de Markov no observado. Dependiendo de qué parámetros cambien con el régimen, tenemos tres variantes:

**MSM (Markov Switching in Mean)**
Solo la media μ(Sₜ) cambia. Útil para modelar cambios en el drift sin cambios en la volatilidad.

**MSV (Markov Switching in Variance)**
Solo la varianza σ²(Sₜ) cambia. Especialmente útil para modelar regímenes de volatilidad.

**MSMV (Markov Switching in Mean and Variance)**
Ambos parámetros cambian. La especificación más general y más apropiada para datos financieros reales.

| Variante | Parámetros por estado | Aplicación |
|----------|------------|------------|
| MSM | μ₁, μ₂, σ², φ₁...φₚ | Cambios en drift |
| MSV | μ, σ₁², σ₂², φ₁...φₚ | Regímenes de volatilidad |
| MSMV | μ₁, μ₂, σ₁², σ₂², φ₁...φₚ | Regímenes completos |

**La matriz de transición P**

E[duración | régimen i] = 1 / (1 - pᵢᵢ)

Si p₁₁ = 0.97 (bull market), la duración esperada es 33 días. Si p₂₂ = 0.90 (bear market), la duración esperada es 10 días.
        `
      },
      {
        title: "Filtro de Hamilton y Smoother de Kim",
        tag: "advanced",
        content: `
El filtro de Hamilton es el corazón computacional del MS model. Es análogo al filtro de Kalman pero para estados discretos: calcula recursivamente las probabilidades de estar en cada régimen.

**El algoritmo de filtrado — paso a paso**

El filtro opera en dos etapas por timestep:

**Prediction step:**
ξₜ₊₁|t = P' · ξₜ|t

**Update step:**
ηₜ₊₁(i) = p(yₜ₊₁ | Sₜ₊₁=i, y₁:ₜ)
ξₜ₊₁|t₊₁ = (ηₜ₊₁ ⊙ ξₜ₊₁|t) / Σⱼ ηₜ₊₁(j)·ξₜ₊₁|j

**Smoother de Kim (backward pass)**

Usa toda la muestra T para calcular P(Sₜ | y₁:T). Funciona recursivamente hacia atrás.

| Método | Datos usados | Uso |
|--------|-------------|-----|
| Filtrada: ξₜ|t | datos hasta t | Online, para trading |
| Suavizada: ξₜ|T | datos hasta T | Offline, para análisis |
        `
      }
    ]
  },

  // ==================== MÓDULO 3: HMM ====================
  "m3": {
    title: "Hidden Markov Models — Arquitectura y los Tres Problemas de Rabiner",
    phase: "Módulo 3 — HMM",
    topics: [
      {
        title: "Problema 1 — Evaluation: Algoritmo Forward",
        tag: "core",
        content: `
Lawrence Rabiner (1989) formalizó la teoría de HMMs con tres problemas fundamentales.

**Problema 1: Evaluation**
Dada una secuencia de observaciones O = (o₁, o₂, ..., oT) y un modelo λ = (A, B, π), ¿cuál es la probabilidad P(O|λ)?

**Algoritmo Forward**

α₁(i) = πᵢ · bᵢ(o₁)

αₜ(j) = bⱼ(oₜ) · Σᵢ [αₜ₋₁(i) · aᵢⱼ]

P(O|λ) = Σᵢ αT(i)

**Importante**: Usar log-space para evitar underflow.

log αₜ(j) = log bⱼ(oₜ) + logsumexp( log αₜ₋₁(i) + log aᵢⱼ )
        `
      },
      {
        title: "Problema 2 — Decoding: Algoritmo de Viterbi",
        tag: "core",
        content: `
**Problema 2: Decoding**
¿Cuál es la secuencia de estados más probable que generó la secuencia de observaciones?

**Viterbi vs. decoding marginal**

La diferencia es sutil pero crítica: Viterbi encuentra Q* = argmax_Q P(Q, O|λ), donde Q = (q₁, q₂, ..., qT) es la secuencia completa. El decoding marginal encuentra argmax_i P(Sₜ=i | O) para cada t independientemente.

Para trading, el Viterbi es más apropiado porque queremos la secuencia completa de regímenes. Sin embargo, las probabilidades filtradas son mejores para decisiones en tiempo real.

**Implementación:**

1. Inicialización: δ₁(i) = πᵢ · bᵢ(o₁)
2. Recursión: δₜ(j) = max_i [δₜ₋₁(i) · aᵢⱼ] · bⱼ(oₜ)
3. Backtrack: reconstruir la secuencia óptima
        `
      },
      {
        title: "Problema 3 — Learning: Baum-Welch (EM para HMM)",
        tag: "advanced",
        content: `
**Problema 3: Learning**
Baum-Welch es el algoritmo EM para estimar los parámetros de un HMM cuando no conoces las secuencias de estado.

**E-step: forward-backward para obtener γ y ξ**

γₜ(i) = P(Sₜ=i | O, λ) — probabilidad marginal
ξₜ(i,j) = P(Sₜ=i, Sₜ₊₁=j | O, λ) — probabilidad conjunta

γₜ(i) = αₜ(i)βₜ(i) / Σⱼ αₜ(j)βₜ(j)

**M-step: actualización de parámetros**

π̂ᵢ = γ₁(i)
âᵢⱼ = Σₜ ξₜ(i,j) / Σₜ Σₖ ξₜ(i,k)
μ̂ᵢ = Σₜ γₜ(i)·oₜ / Σₜ γₜ(i)
Σ̂ᵢ = Σₜ γₜ(i)·(oₜ-μ̂ᵢ)(oₜ-μ̂ᵢ)' / Σₜ γₜ(i)
        `
      },
      {
        title: "HMM Multivariado y Factor Reduction",
        tag: "advanced",
        content: `
**HMM para múltiples activos**

Para carteras de múltiples activos, usar HMM multivariado donde cada estado tiene una matriz de covarianza completa.

**Factor Reduction**

Cuando el número de activos es grande, usar factor models para reducir dimensionalidad:
- Extraer factores (PCA, FA)
- Aplicar HMM a los factores
- Reconstruir probabilidades para activos originales

**Gaussian vs Student-t HMM**

Student-t HMM captura fat tails (kurtosis 6-12 vs. 3 de la Gaussiana). Recomendado para retornos financieros.
        `
      }
    ]
  },

  // ==================== MÓDULO 4: VOLATILIDAD ====================
  "m4": {
    title: "Volatility Regimes — RS-GARCH, HAR-RV, VIX Term Structure",
    phase: "Módulo 4 — Volatilidad",
    topics: [
      {
        title: "HAR-RV — Heterogeneous Autoregressive Realized Volatility (Corsi 2009)",
        tag: "quant",
        content: `
HAR-RV modela la volatilidad realizada como una combinación de componentes de diferentes horizontes temporales: diario (RV_D), semanal (RV_W), y mensual (RV_M).

**La mecánica del HAR**

RV_{t+1} = c + β_D·RV_t + β_W·RV^(W)_t + β_M·RV^(M)_t + εₜ

donde:
RV^(W)_t = (1/5)·Σᵢ₌₀⁴ RV_{t-i}  // media móvil 5 días
RV^(M)_t = (1/22)·Σᵢ₌₀²¹ RV_{t-i} // media móvil 22 días

**Interpretación de coeficientes típicos:**
- β_D ≈ 0.4-0.6 (alta persistencia diaria)
- β_W ≈ 0.1-0.2 (contribución semanal)
- β_M ≈ 0.05-0.15 (contribución mensual)
- β_D + β_W + β_M ≈ 0.6-0.8 (R² típico)

**HAR-RV con Jumps (HAR-RV-J)**

RV_{t+1} = c + β_D·C_t + β_W·C^(W)_t + β_M·C^(M)_t + β_J·J_t + εₜ

donde C_t = continuous component y J_t = jump component.
        `
      },
      {
        title: "VIX Term Structure — Contango vs Backwardation como regime indicators",
        tag: "core",
        content: `
El VIX no es solo un número — su estructura temporal revela cómo el mercado pricea el riesgo de volatilidad en diferentes horizontes.

**Contango — régimen normal de mercado**

Contango: la curva de futuros del VIX tiene pendiente positiva. Los vendedores de opciones reciben prima por esperar.

El ratio VIX3M/VIX6M > 1 indica contango menos profundo. Un contango muy profundo es señal de complacencia extrema.

**Backwardation — régimen de stress**

Backwardation: VIX spot > VIX3M > VIX6M. El mercado está en modo de hedging urgente.

Históricamente, backwardation >15% implica sharpe ratio negativo para estrategias que short vol.

**VVIX — la volatilidad del VVIX**

VVIX alto + VIX bajo = mercado pagando por protección contra un spike súbito = régimen de complacencia frágil.

El ratio VVIX/VIX es particularmente informativo: niveles >5 sugieren fragilidad sistémica.
        `
      },
      {
        title: "RS-GARCH — Regime-Switching GARCH",
        tag: "quant",
        content: `
GARCH conmutado por régimen: los parámetros de la ecuación de varianza cambian según el régimen de Markov.

**Especificación:**

r_t = μ(S_t) + ε_t
σ²_t = ω + α·ε²_{t-1} + β·σ²_{t-1}

donde S_t ∈ {1, 2, ..., K} es el régimen.

**Aplicaciones:**
- Volatilidad forecast más precisa por régimen
- Detección de regímenes de persistencia de vol
- Volatility targeting automático
        `
      }
    ]
  },

  // ==================== MÓDULO 5: MICROESTRUCTURA ====================
  "m5": {
    title: "Microestructura y Order Flow — PIN, VPIN, OFI",
    phase: "Módulo 5 — Microestructura",
    topics: [
      {
        title: "PIN — Probability of Informed Trading (Easley & O'Hara 1987, 1992)",
        tag: "advanced",
        content: `
PIN cuantifica la probabilidad de que una orden provenga de un trader informado.

**El modelo de microestructura de PIN**

El modelo asume que los trades llegan según un proceso de Poisson con tasas diferenciadas:
- λᵢ (informados)
- λᵤ (no informados)
- λₑ (arrival de noticias)

**PIN estimado por MLE:**

PIN = λᵢ / (λᵢ + λᵤ)

Cuando PIN es alto, el flujo de órdenes está distorsionado hacia una dirección. Un PIN > 0.5 indica mercado muy adversarial.

**VPIN — Volume-synchronized PIN**

Easley, López de Prado & O'Hara (2012) propuso VPIN como versión sincronizada por volumen:

VPIN = |V_buy - V_sell| / V_total

**Thresholds históricos:**
- VPIN > 0.5 → percentil 90 → régimen de alta toxicidad
- VPIN > 0.7 → percentil 99 → crash inminente (ej. Flash Crash 2010)
        `
      },
      {
        title: "OFI — Order Flow Imbalance y DOM Regimes",
        tag: "advanced",
        content: `
OFI (Order Flow Imbalance) captura el desequilibrio entre presión compradora y vendedora a nivel de libro de órdenes.

**OFI = ΔAsk_size - ΔBid_size**

**OFI persistente — accumulation/distribution**

- OFI persistentemente positivo + precio subiendo = acumulación institucional
- OFI persistentemente positivo + precio plano = distribución oculta
- OFI mean-reverting = régimen equilibrado

**DOM Absorption y Exhaustion**

- **Absorption**: un nivel del DOM donde hay un bid/ask grande que no desaparece = límite defensivo institucional. El precio toca este nivel repetidamente pero no lo atraviesa.
- **Exhaustion**: precio se mueve agresivamente pero el volumen no aumenta (divergencia).

En footprint: barras con delta positivo pero closes en mínimos = buying exhaustion.
        `
      }
    ]
  },

  // ==================== MÓDULO 6: CORRELACIONES ====================
  "m6": {
    title: "Correlation Regimes — DCC-GARCH, Copulas, Risk-On/Off",
    phase: "Módulo 6 — Correlaciones",
    topics: [
      {
        title: "DCC-GARCH (Engle 2002)",
        tag: "core",
        content: `
DCC-GARCH para matrices de correlación dinámicas.

**Paso 1**: Estimar GARCH univariados para cada serie
**Paso 2**: Calcular residuos estandarizados
**Paso 3**: Estimar la dinámica de correlación

**Ecuación:**

Qₜ = (1-a-b)·S + a·uₜ₋₁uₜ₋₁' + b·Qₜ₋₁

donde S es la matriz de correlación incondicional.

Los parámetros a y b 控制an la persistencia de los cambios en correlación:
- a + b ≈ 1 → alta persistencia (correlaciones cambian lentamente)
- a + b < 1 → mean-reverting
        `
      },
      {
        title: "Copulas — Dependencia No-Lineal y Tail Dependence",
        tag: "advanced",
        content: `
Las copulas capturan dependencia no-lineal y tail dependence que la correlación lineal pierde.

**Tipos de Copulas:**

- **Gaussian**: correlación lineal, no tiene tail dependence
- **Student-t**: tiene tail dependence simétrica
- **Clayton**: dependencia asimétrica (más dependencia en left tail)
- **Gumbel**: dependencia asimétrica (más dependencia en right tail)

**Aplicación en mercados:**

La correlación Gaussiana subestima drásticamente la probabilidad de crashes conjuntos. En crisis, las correlaciones aumentan pero no de manera lineal — las copulas capturan esto.

**Selección de copula:**
- Usar log-likelihood, AIC, BIC
- Validar con backtesting de VaR y CVaR
        `
      },
      {
        title: "Risk-On/Risk-Off y el Régimen de Correlación",
        tag: "core",
        content: `
El régimen de "Risk-On/Risk-Off" describe el estado donde todos los activos se mueven juntos según el sentimiento de riesgo.

**Risk-On:**
- Alta disposición a tomar riesgo
- Comprar activos risky ( equities, commodities)
- Vender activos safe (bonds, gold, JPY, CHF)
- Correlaciones entre risky assets aumentan

**Risk-Off:**
- Baja disposición a tomar riesgo
- Vender activos risky
- Comprar activos safe
- Correlaciones entre todos los activos aumentan (co-movement)

**Indicadores de régimen:**
- VIX alto + acciones cayendo = Risk-Off
- VIX bajo + acciones subiendo = Risk-On
- Credit spreads widen = Risk-Off
        `
      }
    ]
  },

  // ==================== MÓDULO 7: ML ====================
  "m7": {
    title: "Machine Learning para Clasificación de Regímenes",
    phase: "Módulo 7 — ML",
    topics: [
      {
        title: "GMM — Gaussian Mixture Model y clustering para regímenes",
        tag: "core",
        content: `
GMM es un HMM sin dependencia temporal: cada observación se asigna independientemente a uno de K clusters gaussianos.

**Feature space debe incluir:**
- return_rolling (5 días)
- vol_rolling (20 días)
- skew_rolling
- vol_ratio = RV/IV
- vix_level, vix_slope
- ofi_rolling
- correlation_rolling

**Número óptimo de clusters K:**

Por: (1) silhouette score, (2) BIC/GIC, (3) interpretabilidad económica.

**GMM vs HMM:**

GMM no modela transiciones entre estados — útil cuando solo quieres caracterizar los "tipos" de regímenes sin preocuparte por la dinámica de transición.
        `
      },
      {
        title: "LSTM para clasificación de regímenes",
        tag: "advanced",
        content: `
LSTM captura dependencias de largo plazo que HMM y GMM pierden.

**Arquitectura recomendada:**

LSTM(64) → Dropout(0.3) → LSTM(32) → Dropout(0.3) → Dense(K, softmax)

Input: secuencia de T barras con features [return, vol, vol_ratio, ofi, vix_pct]
Labels: obtenidos de HMM suavizado

**Critical para evitar overfitting:**

Usar walk-forward validation estricta — nunca usar random split para series temporales.

El entrenamiento debe ser:
- datos hasta t_train: fit(t_train)
- predecir t_train+1:test
- mover la ventana hacia adelante
        `
      },
      {
        title: "Deep Learning para Regímenes — Autoencoders y Transformers",
        tag: "advanced",
        content: `
**Autoencoders para anomaly detection**

- Entrenar autoencoder en "régimen normal"
- Reconstrucción error alto → régimen anormal
- No requiere labels

**Transformers para régimen classification**

- Attention mechanisms capturan dependencias no-locales
- Embeddings de features de mercado
- Position encoding para capturar temporalidad
        `
      }
    ]
  },

  // ==================== MÓDULO 8: OPCIONES ====================
  "m8": {
    title: "Options Regimes — GEX/DEX, Vol Surface, 0DTE",
    phase: "Módulo 8 — Opciones",
    topics: [
      {
        title: "GEX / DEX — Gamma Exposure (Patton & Sandmann 2020)",
        tag: "core",
        content: `
GEX (Gamma Exposure) = Σ Γ · ΔS · OpenInterest

DEX = dealers' gamma net exposure

**Concepción:**
- Dealers long gamma = estabilizadores (hedge direction)
- Dealers short gamma = desestabilizadores

**GEX positivo**: dealers son long gamma, tienden a comprar cuando el precio sube y vender cuando baja — estabiliza el mercado.

**GEX negativo**: dealers son short gamma, tienden a exacerbar movimientos — puede causar deleveraging cascades.

**Charm y vanna flows**

Son los mecanismos por los cuales el hedging de opciones distorsiona el subyacente:
- Charm: delta hedging de gamma produce flujo temporal
- Vanna: sensibilidad de delta a volatilidad afecta hedging
        `
      },
      {
        title: "Vol Surface — Skew, Term Structure, Butterfly",
        tag: "advanced",
        content: `
La superficie de volatilidad revela el precio del riesgo por strike y vencimiento.

**Skew**
At-the-money vs out-of-the-money vol diferencia. Skew pronunciado = mercado priceando eventos de cola.

**Term Structure**
Contango vs backwardation en la curva de vols.

**Butterfly**
Relación entre strikes extremos y el centro.

**Regime classification por vol surface:**
- High vol + high skew = crisis regime
- Low vol + flat skew = complacency regime
- Steep term structure = normal contango
        `
      },
      {
        title: "0DTE — Zero Days to Expiration",
        tag: "advanced",
        content: `
0DTE: opciones con menos de 1 día de vida.

**Características:**
- Gamma extremamente alta
- Theta decay acelerado
- Volumen de opciones supera al subyacente

**Estrategias:**
- Directional con gestión de riesgo estricta
- Iron condors para captura de prima
- SPX 0DTE como hedge de portfolio

**Riesgos:**
- Gamma risk extremo cerca del close
- Pin risk en strikes significativos
- Liquidez puede disappear rápidamente
        `
      }
    ]
  },

  // ==================== MÓDULO 9: REAL-TIME ====================
  "m9": {
    title: "Real-Time Detection — SPRT, CUSUM, Particle Filters",
    phase: "Módulo 9 — Real-Time",
    topics: [
      {
        title: "SPRT & CUSUM — Sequential Probability Ratio Test",
        tag: "core",
        content: `
SPRT (Wald 1945) minimiza el expected sample size para detectar cambios.

**SPRT:**

H₀: μ = μ₀
H₁: μ = μ₁

Log-likelihood ratio: Sₙ = Σ log(Λᵢ)

Decision:
- Sₙ > a → aceptar H₁
- Sₙ < b → aceptar H₀  
- a ≤ Sₙ ≤ b → continuar muestreando

**CUSUM:**

CUSUM = Σ (xₜ - μ₀)

Alertas cuando CUSUM sale de los bands ±k.

**Aplicación:**
- Detectar cambios de régimen en tiempo real
- Minimize detection lag
- Control false alarm rate
        `
      },
      {
        title: "Particle Filters — Sequential Monte Carlo",
        tag: "advanced",
        content: `
Particle filters usan simulaciones para tracking de estados cuando los modelos analíticos no funcionan.

**Algoritmo:**

1. **Prediction**: propagate particles según modelo
2. **Update**: reweight según likelihood
3. **Resampling**: eliminar partículas de baja weight

**Ventajas:**
- Maneja no-linealidad
- No requiere distribuciones conjugadas
- Flexible para múltiples hipótesis

**Aplicaciones en trading:**
- Tracking de regímenes con múltiples modelos
- Estimación de estados latentes complejos
- Filtering de ruido en datos de alta frecuencia
        `
      }
    ]
  },

  // ==================== MÓDULO 10: TRADING ====================
  "m10": {
    title: "Trading Applications — Position Sizing, Strategy Selection y Portfolio Management",
    phase: "Módulo 10 — Trading",
    topics: [
      {
        title: "Kelly Fraction por Régimen y Volatility Targeting",
        tag: "core",
        content: `
Kelly criterion es la apuesta óptima para maximizar el logarithm del capital a largo plazo.

**Kelly clásico:**
f* = μ / σ²

**Kelly regime-conditional:**
f*(Sₜ=k) = μₜ / σₖ²

El sizing total se pondera por la incertidumbre de régimen:
f_total = Σₖ P(Sₜ=k | datos) · f*(k)

**Volatility Targeting**

size = σ_target / σ_forecast(Sₜ)

- Normal (σ=15%): size = 1x
- Crisis (σ=45%): size = 0.33x

Esto automatiza la reducción de exposición cuando el mercado se vuelve más volátil.

**Fractional Kelly**
Usar ¼ Kelly para robustez porque la estimación de μ y σ tiene error.
        `
      },
      {
        title: "Strategy Selection por Régimen y el Edge de la Transición",
        tag: "advanced",
        content: `
No existe una estrategia universal que funcione en todos los regímenes.

**Regime-Strategy Matrix:**

| Régimen | Estrategia |
|---------|------------|
| Bull low-vol (trending) | Trend following, momentum, breakout |
| Bull high-vol | Breakout + volatility selling |
| Bear trending | Short, fade rallies |
| Range (neutral/low-vol) | Mean-reversion, stat arb |
| Crisis/crash | Defensive, reduced exposure, tail hedges |

**El edge de la transición**

El mayor edge no está en el régimen estable sino en la transición. Cuando P(nuevo_régimen) cruza 0.3-0.4, existe una ventana de 1-5 barras donde el precio aún refleja el régimen anterior.

**Threshold de transición:**
threshold = 0.3 + ADL_estimate / 100

Con ADL=5: threshold = 0.35
        `
      },
      {
        title: "Portfolio Construction y Risk Budgeting",
        tag: "practice",
        content: `
**Asignación por régimen:**

strategy_allocation = Σₖ P(Sₜ=k) · W(k)

donde W(k) = pesos por estrategia en régimen k

**Risk Budgeting:**

1. Definir riesgo objetivo por estrategia
2. Ajustar por régimen
3. Rebalancear con regime probabilities

**Ejemplo:**
W(bull) = [momentum:0.5, breakout:0.3, mean_rev:0.2]
W(bear) = [short:0.4, fade_rally:0.3, defensive:0.3]
W(range) = [mean_rev:0.5, stat_arb:0.3, scalping:0.2]
        `
      }
    ]
  }
};

// Lista completa de módulos para el dashboard
export const modulesList = [
  { id: "intro", title: "Mapa y Plan", phase: "Introducción", icon: "00", color: "var(--color-cosmic-violet)" },
  { id: "m1", title: "Change Point Detection", phase: "Módulo 1 — Fundamentos", icon: "01", color: "var(--amber)" },
  { id: "m2", title: "Hamilton MS Model", phase: "Módulo 2 — MS Models", icon: "02", color: "var(--purple)" },
  { id: "m3", title: "HMM y los Tres Problemas", phase: "Módulo 3 — HMM", icon: "03", color: "var(--teal)" },
  { id: "m4", title: "Volatility Regimes", phase: "Módulo 4 — Volatilidad", icon: "04", color: "var(--red)" },
  { id: "m5", title: "Microestructura", phase: "Módulo 5 — Microestructura", icon: "05", color: "var(--green)" },
  { id: "m6", title: "Correlation Regimes", phase: "Módulo 6 — Correlaciones", icon: "06", color: "var(--orange)" },
  { id: "m7", title: "ML para Regímenes", phase: "Módulo 7 — ML", icon: "07", color: "var(--pink)" },
  { id: "m8", title: "Options Regimes", phase: "Módulo 8 — Opciones", icon: "08", color: "var(--indigo)" },
  { id: "m9", title: "Real-Time Detection", phase: "Módulo 9 — Real-Time", icon: "09", color: "var(--accent)" },
  { id: "m10", title: "Trading Applications", phase: "Módulo 10 — Trading", icon: "10", color: "var(--green)" },
];

// Helper para obtener módulos por fase
export const modulesByPhase = {
  "Introducción": ["intro"],
  "Módulo 1 — Fundamentos": ["m1"],
  "Módulo 2 — MS Models": ["m2"],
  "Módulo 3 — HMM": ["m3"],
  "Módulo 4 — Volatilidad": ["m4"],
  "Módulo 5 — Microestructura": ["m5"],
  "Módulo 6 — Correlaciones": ["m6"],
  "Módulo 7 — ML": ["m7"],
  "Módulo 8 — Opciones": ["m8"],
  "Módulo 9 — Real-Time": ["m9"],
  "Módulo 10 — Trading": ["m10"],
};