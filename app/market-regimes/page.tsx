"use client";

import {
  HeroSection,
  ModuleSection,
  TopicCard,
  Subtopic,
  FormulaBox,
  Callout,
  ResourcePills,
  Timeline,
} from "@/components/MarketRegimesVisualComponents";

const timelineItems = [
  { period: "Semana 1-2", title: "Bases estadisticas y change point detection", description: "Stationarity bajo regimes, tests de Chow y Bai-Perron, CUSUM clasico, criterios de informacion (AIC/BIC/HQ). Sin esto, todo lo demas es caja negra.", color: "#f59e0b" },
  { period: "Semana 3-4", title: "Hamilton Markov Switching y familia MS", description: "El modelo original de Hamilton (1989), estimacion por EM, filtro de Hamilton, MS-VAR, MS-GARCH. Implementar desde cero en Python.", color: "#a78bfa" },
  { period: "Semana 5-6", title: "Hidden Markov Models", description: "Baum-Welch (EM para HMM), Viterbi, forward-backward. Gaussian HMM vs. GMM-HMM. hmmlearn en Python. HMM multivariado aplicado a ES/NQ.", color: "#22d3ee" },
  { period: "Semana 7-8", title: "Volatility y Correlation Regimes", description: "RS-GARCH, HAR-RV, VIX term structure, DCC-GARCH, copulas, contagion vs. interdependence. Distinguir regimes de vol de regimes de direccion.", color: "#ef4444" },
  { period: "Semana 9-10", title: "Microestructura y Order Flow", description: "PIN/VPIN, toxicidad de orden flow, regimes AMT, DOM absorption/exhaustion, footprint regimes, delta divergence. Aplicacion directa a NQ/ES.", color: "#22c55e" },
  { period: "Semana 11-12", title: "Machine Learning avanzado", description: "GMM clustering de retornos, BOCPD (Bayesian Online Changepoint Detection), autoencoders para anomaly-based shifts, LSTM regime classification.", color: "#f472b6" },
  { period: "Semana 13-14", title: "Options regimes y Real-time detection", description: "GEX/DEX regimes, vol surface regime classification, 0DTE flow, SPRT, particle filters, Kalman extensions para deteccion en tiempo real.", color: "#fb923c" },
  { period: "Semana 15-16", title: "Trading applications", description: "Regime-conditional position sizing, strategy switching, factor exposure management, portfolio construction bajo incertidumbre de regimen.", color: "#34d399" },
];

export default function MarketRegimesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-midnight-void)]">
      <div className="max-w-5xl mx-auto px-8 pb-20">
        
        <HeroSection
          title="Master"
          subtitle="Desde la deteccion estadistica de cambios estructurales hasta la aplicacion de HMMs, modelos de Markov switching, microestructura de mercado, opciones y deep learning. Esta guia cubre todos los niveles con enfoque cuantitativo y practico."
          stats={[
            { num: "10", label: "Modulos", color: "var(--color-cosmic-violet)" },
            { num: "30+", label: "Temas", color: "var(--color-quantum-teal)" },
            { num: "80+", label: "Subtopicos", color: "var(--color-sunflare-yellow)" },
            { num: "Inf", label: "Profundidad", color: "var(--color-ghost-gray)" },
          ]}
        />

        {/* Plan de Estudio */}
        <ModuleSection num="00" title="Plan de estudio recomendado" subtitle="secuencia optima de aprendizaje">
          <Timeline items={timelineItems} />
        </ModuleSection>

        {/* Modulo 01 */}
        <ModuleSection num="01" title="Bases estadisticas de regimes" subtitle="el lenguaje matematico detras de todo">
          <TopicCard title="Change Point Detection" tag="core" tagColor="core">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              El problema central: dado un proceso, detectar si los parametros del proceso generador de datos cambian en algun punto desconocido. Existen tres familias principales de metodos con filosofias radicalmente distintas.
            </p>
            <Subtopic title="PELT - Pruned Exact Linear Time">
              Algoritmo de programacion dinamica que encuentra el numero optimo de change points minimizando un criterio penalizado. Complejidad O(n) en promedio. Minimiza C(y_s:t) + beta para cada segmento. La penalizacion beta controla el trade-off entre fit y parsimonia.
            </Subtopic>
            <Subtopic title="Binary Segmentation y Wild Binary Segmentation">
              BS aplica recursivamente un test de hipotesis sobre el segmento completo, dividiendo en el punto con mayor estadistico. Wild BS (WBS) mejora la consistencia usando segmentos aleatorios para evitar que cambios tardios sean enmascarados por cambios tempranos.
            </Subtopic>
            <Subtopic title="Bayesian Online Changepoint Detection (BOCPD)">
              Adams & MacKay (2007). En vez de buscar change points en batch, calcula en tiempo real P(r_t | x_1:t) donde r_t es el "run length" (tiempo desde el ultimo change point). Usa conjugate-exponential models para que el update sea analitico.
            </Subtopic>
            <FormulaBox>
{`// CUSUM generalizado (bilateral)
S+_t = max(0, S+_t-1 + x_t - mu_0 - k)
S-_t = min(0, S-_t-1 + x_t - mu_0 + k)
Alarma cuando S+_t > h  o  |S-_t| > h

// Criterio penalizado (PELT)
Q(tau_1...tau_k) = Sum_i [C(y_tau_i-1:tau_i) + beta]`}
            </FormulaBox>
            <ResourcePills items={["ruptures (Python)", "changepoint (R)", "bayesian_changepoint_detection"]} />
          </TopicCard>

          <TopicCard title="Structural Breaks - Tests formales" tag="core" tagColor="core">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Los structural break tests distinguen cambios en los parametros del modelo de la variabilidad normal del proceso. La diferencia filosofica con change point detection: aqui asumimos un modelo parametrico especifico y testamos si sus parametros cambian.
            </p>
            <Subtopic title="Test de Chow (1960)">
              El clasico para un break point conocido t: H0: beta1 = beta2 (los coeficientes son iguales antes y despues de t). Estadistico F = [(RSS_R - RSS_U)/k] / [RSS_U/(n-2k)]. Limitacion critica: requiere que t sea conocido a priori.
            </Subtopic>
            <Subtopic title="Bai-Perron (1998, 2003)">
              Permite multiples breaks desconocidos simultaneos. Usa la teoria de supF statistics (Andrews 1993) y supF(l+1|l) para determinar el numero de breaks secuencialmente.
            </Subtopic>
            <Subtopic title="Andrews supF y QLR Test">
              Para break point desconocido en un rango. supF = max F(t). El QLR (Quasi-LR) de Andrews usa una HAC variance estimator para robustez ante heteroscedasticidad.
            </Subtopic>
            <Callout type="warning">
              El look-ahead bias en structural break detection es devastador. Siempre evaluar tu detector out-of-sample y medir el average detection lag (ADL).
            </Callout>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 02 */}
        <ModuleSection num="02" title="Modelos Clasicos de Regime Switching" subtitle="Hamilton (1989) y su familia extendida">
          <TopicCard title="Hamilton Markov-Switching Model" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              El paper de Hamilton (1989) sobre business cycles es el modelo fundacional. La idea: los parametros del proceso AR cambian dependiendo de un estado de Markov latente que no es directamente observable.
            </p>
            <Subtopic title="Especificacion completa del MS-AR(p)">
              y_t = mu(S_t) + phi_1(S_t)(y_t-1 - mu(S_t-1)) + ... + phi_p(S_t)(y_t-p - mu(S_t-p)) + sigma(S_t)*epsilon_t. Los parametros que cambian pueden ser: solo la media (MSM), solo la varianza (MSV), o ambos (MSMV).
            </Subtopic>
            <Subtopic title="Filtro de Hamilton">
              Es un filtro analogo al filtro de Kalman pero para estados discretos. Define probabilidades predichas y filtradas. El update usa Bayes.
            </Subtopic>
            <Subtopic title="Kim Smoother">
              El filtro de Hamilton da probabilidades filtradas (usando datos hasta t). El smoother de Kim (1994) da probabilidades usando toda la muestra - mas preciso pero requiere un backward pass.
            </Subtopic>
            <FormulaBox>
{`// Matriz de transicion (K=2 regimes)
P = [[p_11  p_12],
     [p_21  p_22]]

// Duracion esperada en regimen j
E[duracion en regimen j] = 1 / (1 - p_jj)`}
            </FormulaBox>
            <ResourcePills items={["statsmodels.tsa.regime_switching", "MSM (Python)", "MSwM (R)"]} />
          </TopicCard>

          <TopicCard title="Threshold Models" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Los threshold models son una alternativa a los Markov-switching: el regimen no esta oculto, sino que es determinado por una variable observable cruzando un umbral.
            </p>
            <Subtopic title="TAR - Threshold Autoregressive">
              y_t = (phi_10 + phi_11*y_t-1 + epsilon_t)*I(q_t-d &lt;= gamma) + (phi_20 + phi_21*y_t-1 + epsilon_t)*I(q_t-d &gt; gamma). La variable de threshold puede ser el propio precio o otra variable.
            </Subtopic>
            <Subtopic title="LSTAR - Logistic Smooth Transition AR">
              En vez de la funcion indicadora discontinua, usa una transicion logistica. La transicion entre regimes es gradual - mas realista para mercados donde el regimen nunca cambia abruptamente.
            </Subtopic>
            <Subtopic title="MTAR - Momentum Threshold AR">
              Especialmente relevante para cointegracion asimetrica. El threshold no es el nivel sino la diferencia (momentum). Util para modelar ajustes asimetricos.
            </Subtopic>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 03 */}
        <ModuleSection num="03" title="Hidden Markov Models" subtitle="el framework probabilistico para regimes latentes">
          <TopicCard title="Arquitectura HMM" tag="core" tagColor="core">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Un HMM se define por lambda = (A, B, pi) donde A es la matriz de transicion, B son las distribuciones de emision, y pi son las probabilidades iniciales. Rabiner (1989) definio los tres problemas fundamentales.
            </p>
            <Subtopic title="Problema 1: Evaluation">
              Cual es la probabilidad de la secuencia observada dado el modelo? Resuelto con el algoritmo forward: alpha_t(i) = P(o_1,...,o_t, S_t=i | lambda).
            </Subtopic>
            <Subtopic title="Problema 2: Decoding - Viterbi">
              Cual es la secuencia mas probable de estados latentes? Viterbi usa programacion dinamica.
            </Subtopic>
            <Subtopic title="Problema 3: Learning - Baum-Welch">
              EM para HMM. E-step: calcula gamma_t(i) y xi_t(i,j) usando forward-backward. M-step: actualiza A, B, pi.
            </Subtopic>
            <FormulaBox>
{`// Algoritmo forward-backward
alpha_t(j) = b_j(o_t) * Sum_i alpha_t-1(i)*a_ij      [forward]
beta_t(i) = Sum_j a_ij * b_j(o_t+1) * beta_t+1(j)    [backward]
gamma_t(i) = alpha_t(i)*beta_t(i) / Sum_j alpha_t(j)*beta_t(j)`}
            </FormulaBox>
          </TopicCard>

          <TopicCard title="HMM en mercados" tag="avanzado" tagColor="advanced">
            <Subtopic title="Gaussian HMM vs GMM-HMM">
              Gaussian HMM: cada estado emite o_t ~ N(mu_i, Sigma_i). GMM-HMM: cada estado emite de una mezcla de Gaussianas - mas flexible pero mas parametros.
            </Subtopic>
            <Subtopic title="Student-t HMM para fat tails">
              Dado que los retornos de NQ tienen kurtosis empirica alta, el Student-t HMM es mas apropiado.
            </Subtopic>
            <Subtopic title="Features para HMM en mercados">
              La eleccion del vector de observacion es crucial. Opciones: solo retornos, retornos + volatilidad realizada, retornos + vol + skew + volumen.
            </Subtopic>
            <ResourcePills items={["hmmlearn (Python)", "pomegranate (Python)"]} />
          </TopicCard>
        </ModuleSection>

        {/* Modulo 04 */}
        <ModuleSection num="04" title="Volatility Regimes" subtitle="la dimension mas critica para trading">
          <TopicCard title="RS-GARCH y familia GARCH con switching" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Los modelos GARCH capturan clustering de volatilidad, pero asumen que las dinamicas son estacionarias. Los RS-GARCH permiten que los parametros cambien entre regimes.
            </p>
            <Subtopic title="Haas-Mittnik-Paolella (2004)">
              Cada regimen k tiene su propio proceso GARCH independiente: h_k,t = omega_k + alpha_k*epsilon^2_t-1 + beta_k*h_k,t-1. Esto evita el path dependence problem.
            </Subtopic>
            <Subtopic title="Realized Volatility Regimes - HAR-RV">
              El modelo HAR-RV captura la heterogeneous autoregressive structure de la vol realizada.
            </Subtopic>
            <Subtopic title="Separating vol regimes de price regimes">
              Error conceptual comun: asumir que regimen de alta vol = regimen bajista. Son dimensiones ortogonales.
            </Subtopic>
            <FormulaBox>
{`// Volatility Ratio
VR(t) = RV_short(t) / RV_long(t)
VR > 1.5  -->  vol expansion (breakout/crisis)
VR < 0.7  -->  vol compression (coiling)`}
            </FormulaBox>
          </TopicCard>

          <TopicCard title="VIX Term Structure Regimes" tag="avanzado" tagColor="advanced">
            <Subtopic title="La curva VIX y sus regimes">
              La curva de futuros VIX define 3 regimes estructurales: (1) Contango normal: mercado en calma. (2) Backwardation severa: crisis activa. (3) Kink structure: incertidumbre concentrada en el corto plazo.
            </Subtopic>
            <Subtopic title="Metricas cuantitativas de term structure">
              Roll yield: (VX2 - VX1) / VX1. Contango ratio: VX1/VX3 - si &lt; 0.85: backwardation severa.
            </Subtopic>
            <Subtopic title="VVIX">
              VVIX mide la volatilidad implicita de las opciones sobre VIX. VVIX &gt; 130 tipicamente precede o coincide con spikes de VIX.
            </Subtopic>
            <Callout type="info">
              Para NQ/ES: la term structure del VIX es uno de los mejores leading indicators de regimen.
            </Callout>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 05 */}
        <ModuleSection num="05" title="Microestructura y Order Flow" subtitle="regimes a nivel de trades y DOM">
          <TopicCard title="PIN y VPIN" tag="quant" tagColor="quant">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              El modelo EKOP (Easley, Kiefer, O'Hara, Paperman 1996) define PIN como la fraccion del order flow que proviene de traders informados.
            </p>
            <Subtopic title="VPIN - Volume-Synchronized PIN">
              PIN requiere clasificar trades. VPIN usa volumen como reloj: divide el volumen total en buckets. Un VPIN alto indica order flow toxico.
            </Subtopic>
            <Subtopic title="Order Flow Toxicity">
              La toxicidad del order flow = VPIN elevado + spread widening + depth reduction. En NQ: durante sesiones con VPIN alto, los moves intraday tienen mayor momentum.
            </Subtopic>
            <ResourcePills items={["VPIN calculation libraries"]} />
          </TopicCard>

          <TopicCard title="Regimenes AMT y DOM" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Desde la perspectiva de Auction Market Theory, los regimes se definen por el estado de la subasta: esta el mercado facilitando o rechazando precios?
            </p>
            <Subtopic title="Regimenes de balance vs desequilibrio">
              Balance: el mercado esta en distribucion simetrica alrededor del POC. Desequilibrio: presion compradora o vendedora sostenida.
            </Subtopic>
            <Subtopic title="DOM Absorption vs. Exhaustion">
              Absorcion: el precio avanza contra un bid/ask stack grande que se consume progresivamente.
            </Subtopic>
            <Subtopic title="POC shifting regimes">
              El POC del perfil de volumen migra durante el dia. Un POC que migra consistentemente en una direccion = regimen de rotacion de valor.
            </Subtopic>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 06 */}
        <ModuleSection num="06" title="Correlation y Cross-Asset Regimes" subtitle="cuando todo se mueve junto (o no)">
          <TopicCard title="DCC-GARCH" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Engle (2002): el DCC-GARCH modela correlaciones que cambian en el tiempo sin la explosion de parametros del BEKK.
            </p>
            <Subtopic title="Especificacion DCC">
              Etapa 1: estimar un GARCH univariado para cada activo. Etapa 2: modelar la correlacion dinamica con Q_t.
            </Subtopic>
            <Subtopic title="Correlation regimes desde DCC">
              Una vez estimado DCC, aplicar un HMM sobre la serie de correlaciones dinamicas para clasificar regimes.
            </Subtopic>
            <ResourcePills items={["rmgarch (R)", "arch (Python)"]} />
          </TopicCard>

          <TopicCard title="Copulas para regimes de dependencia extrema" tag="quant" tagColor="quant">
            <Subtopic title="Teorema de Sklar y copulas en trading">
              Sklar (1959): cualquier joint distribution F(x,y) = C(F_X(x), F_Y(y)) donde C es una copula.
            </Subtopic>
            <Subtopic title="Mixture copulas para regimes">
              Una mixture copula combina copulas de distintos regimes.
            </Subtopic>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 07 */}
        <ModuleSection num="07" title="Machine Learning para Regimes" subtitle="mas alla de los modelos parametricos">
          <TopicCard title="Unsupervised clustering" tag="avanzado" tagColor="advanced">
            <Subtopic title="GMM - Gaussian Mixture Models">
              Caso especial de HMM donde la secuencia temporal de estados es independiente. El GMM estima K distribuciones Gaussianas que mejor describen la distribucion de features.
            </Subtopic>
            <Subtopic title="K-means sobre retornos">
              K-means asume clusters esfericos y no maneja bien la estructura temporal.
            </Subtopic>
            <Subtopic title="DBSCAN para deteccion de anomalias">
              DBSCAN no requiere especificar K a priori y puede identificar puntos no asignados.
            </Subtopic>
          </TopicCard>

          <TopicCard title="BOCPD" tag="quant" tagColor="quant">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Adams & MacKay (2007) es el framework mas elegante para deteccion de regimes en tiempo real. La variable clave es r_t = "run length".
            </p>
            <Subtopic title="Arquitectura BOCPD">
              En cada nuevo dato x_t, el algoritmo mantiene la distribucion P(r_t | x_1:t). La hazard function es un hiperparametro.
            </Subtopic>
            <ResourcePills items={["BOCPD libraries"]} />
          </TopicCard>
        </ModuleSection>

        {/* Modulo 08 */}
        <ModuleSection num="08" title="Options Market Regimes" subtitle="el mercado de opciones como regime indicator">
          <TopicCard title="GEX y DEX Regimes" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Gamma Exposure (GEX) captura cuanto delta hedging los dealers de opciones necesitan hacer cuando el precio se mueve.
            </p>
            <Subtopic title="GEX Regimes">
              GEX positivo (dealer long gamma): los dealers actuan como amortiguadores del mercado. GEX negativo: los dealers amplifican los movimientos.
            </Subtopic>
            <Subtopic title="Cuantificacion del GEX">
              GEX = Sum_options [Open_Interest * Gamma * 100 * Spot^2]. GEX &gt; +$1B en SPX: regimen de vol suprimida. GEX &lt; -$1B: regimen de vol elevada.
            </Subtopic>
            <ResourcePills items={["SpotGamma methodology", "Squeezemetrics GEX"]} />
          </TopicCard>

          <TopicCard title="0DTE Regimes" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              Las opciones 0DTE en SPX han pasado a representar mas del 40% del volumen de opciones. Esto ha cambiado fundamentalmente los regimes intraday.
            </p>
            <Subtopic title="Regimenes intraday de 0DTE flow">
              Apertura: positions, flow bidireccional. Mediodia: precio gravitando hacia strike con mayor OI. Cierre: charm/delta decaimiento acelerado.
            </Subtopic>
            <Subtopic title="Charm flow regimes">
              En 0DTE, el charm es extremo: una call ATM pierde 0.02-0.05 de delta por hora.
            </Subtopic>
          </TopicCard>
        </ModuleSection>

        {/* Modulo 09 */}
        <ModuleSection num="09" title="Real-Time Regime Detection" subtitle="deteccion online sin look-ahead bias">
          <TopicCard title="SPRT y CUSUM modernos" tag="quant" tagColor="quant">
            <Subtopic title="Sequential Probability Ratio Test (SPRT)">
              Wald (1945): el SPRT es el test secuencial optimo. Calcula el log-likelihood ratio acumulado.
            </Subtopic>
            <Subtopic title="CUSUM generalizado">
              El CUSUM de Page (1954) modernizado usa la diferencia entre log-likelihood ratios.
            </Subtopic>
            <Subtopic title="Average Run Length (ARL)">
              ARL_0 = E[tiempo de alarma | no hay cambio] - queremos esto grande. ARL_1 = E[tiempo de deteccion | hay cambio] - queremos esto pequeno.
            </Subtopic>
          </TopicCard>

          <TopicCard title="Particle Filters" tag="quant" tagColor="quant">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              El particle filter aproxima la distribucion posterior P(S_t | y_1:t) usando N particulas.
            </p>
            <Subtopic title="Sequential Monte Carlo">
              Cada particula es una hipotesis sobre el estado latente con peso proporcional a la verosimilitud.
            </Subtopic>
            <ResourcePills items={["filterpy (Python)", "pyzmq SMC"]} />
          </TopicCard>
        </ModuleSection>

        {/* Modulo 10 */}
        <ModuleSection num="10" title="Regime-Conditional Trading" subtitle="de la teoria a la aplicacion real">
          <TopicCard title="Position Sizing bajo incertidumbre de regimen" tag="avanzado" tagColor="advanced">
            <Subtopic title="Kelly fraction condicionado al regimen">
              Kelly con regimes: f*(t) = Sum_k P(S_t=k) * f*_k donde f*_k = mu_k / sigma^2_k es el Kelly del regimen k.
            </Subtopic>
            <Subtopic title="Regime-aware stop sizing">
              El ATR cambia radicalmente entre regimes. Un stop fijo en ticks es demasiado estrecho en vol alta y demasiado ancho en vol baja.
            </Subtopic>
          </TopicCard>

          <TopicCard title="Strategy Switching" tag="avanzado" tagColor="advanced">
            <p className="text-[15px] text-[var(--color-stardust-gray)] leading-relaxed mb-6">
              En regímenes de alta autocorrelacion: estrategias momentum funcionan. En regímenes de baja autocorrelacion: estrategias mean-reversion funcionan.
            </p>
            <Subtopic title="Regimen-based strategy selection">
              La autocorrelacion de retornos a distintos lags es un buen clasificador de regimen.
            </Subtopic>
            <Callout type="info">
              Diseñar un "Regime Dashboard" que combina multiples indicadores para dar una lectura compuesta del regimen del dia.
            </Callout>
          </TopicCard>
        </ModuleSection>

      </div>
    </main>
  );
}