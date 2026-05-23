export interface Formula {
  label: string;
  content: string;
}

export interface Callout {
  type: "info" | "warning" | "success";
  title?: string;
  text: string;
}

export interface Resource {
  name: string;
  url?: string;
  type?: "library" | "paper" | "documentation";
}

export interface CodeExample {
  language: "python" | "r" | "javascript";
  title: string;
  code: string;
  annotations?: string[];
}

export interface DiagramConfig {
  type: "mermaid" | "svg" | "timeline" | "comparison" | "matrix";
  content: string;
  title?: string;
}

export interface Exercise {
  question: string;
  options?: string[];
  correctAnswer: number | string;
  explanation?: string;
  code?: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
  color?: string;
}

export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface ComparisonData {
  headers: string[];
  rows: (string[] | ComparisonRow)[];
}

export interface RegimeMatrixItem {
  label: string;
  title: string;
  description: string;
  color?: string;
  characteristics?: string[];
}

export interface Topic {
  id: string;
  title: string;
  tag?: "core" | "advanced" | "quant";
  content: string;
  formulas?: Formula[];
  callouts?: Callout[];
  resources?: Resource[];
  codeExamples?: CodeExample[];
  diagram?: DiagramConfig;
  exercise?: Exercise;
  timelineItems?: TimelineItem[];
  comparisonData?: ComparisonData;
  regimeMatrixData?: RegimeMatrixItem[];
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: string;
  modules: Module[];
}

export interface ProgressState {
  completedModules: string[];
  currentModule: string;
  startedAt: string;
  lastUpdated: string;
}

export interface ModuleNavigation {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}