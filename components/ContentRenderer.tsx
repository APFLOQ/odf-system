"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { FormulaBlock } from "./FormulaBlock";
import { Callout } from "./Callout";
import { ResourcePills, SimpleResourcePills } from "./ResourcePills";
import { Exercise } from "./Exercise";
import { Timeline } from "./Visual/Timeline";
import { ComparisonTable } from "./Visual/ComparisonTable";
import { RegimeMatrix } from "./Visual/RegimeMatrix";
import { FlowDiagram } from "./Visual/FlowDiagram";
import type {
  Formula,
  Callout as CalloutType,
  Resource,
  CodeExample,
  Exercise as ExerciseType,
  DiagramConfig,
} from "@/types/course";

interface ContentRendererProps {
  content: string;
  formulas?: Formula[];
  callouts?: CalloutType[];
  resources?: Resource[];
  codeExamples?: CodeExample[];
  diagram?: DiagramConfig;
  exercise?: ExerciseType;
  timelineItems?: Array<{
    period: string;
    title: string;
    description: string;
    color?: string;
  }>;
  comparisonData?: {
    headers: string[];
    rows: string[][];
  };
  regimeMatrixData?: Array<{
    label: string;
    title: string;
    description: string;
    color?: string;
  }>;
}

export function ContentRenderer({
  content,
  formulas,
  callouts,
  resources,
  codeExamples,
  diagram,
  exercise,
  timelineItems,
  comparisonData,
  regimeMatrixData,
}: ContentRendererProps) {
  return (
    <div className="content-renderer">
      {/* Main markdown content */}
      <div className="prose-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Timeline */}
      {timelineItems && timelineItems.length > 0 && (
        <Timeline items={timelineItems} />
      )}

      {/* Comparison table */}
      {comparisonData && (
        <ComparisonTable
          headers={comparisonData.headers}
          rows={comparisonData.rows}
        />
      )}

      {/* Regime matrix */}
      {regimeMatrixData && regimeMatrixData.length > 0 && (
        <RegimeMatrix cells={regimeMatrixData} />
      )}

      {/* Diagram */}
      {diagram && (
        <>
          {diagram.type === "mermaid" && (
            <FlowDiagram code={diagram.content} title={diagram.title} />
          )}
        </>
      )}

      {/* Formulas */}
      {formulas && formulas.length > 0 && (
        <>
          {formulas.map((formula, index) => (
            <FormulaBlock key={index} label={formula.label} content={formula.content} />
          ))}
        </>
      )}

      {/* Callouts */}
      {callouts && callouts.length > 0 && (
        <>
          {callouts.map((callout, index) => (
            <Callout key={index} type={callout.type} title={callout.title}>
              {callout.text}
            </Callout>
          ))}
        </>
      )}

      {/* Code examples */}
      {codeExamples && codeExamples.length > 0 && (
        <>
          {codeExamples.map((example, index) => (
            <CodeBlock
              key={index}
              language={example.language}
              title={example.title}
              code={example.code}
              annotations={example.annotations}
            />
          ))}
        </>
      )}

      {/* Exercise */}
      {exercise && (
        <Exercise
          question={exercise.question}
          options={exercise.options || []}
          correctAnswer={
            typeof exercise.correctAnswer === "number"
              ? exercise.correctAnswer
              : 0
          }
          explanation={exercise.explanation}
          code={exercise.code}
        />
      )}

      {/* Resources */}
      {resources && resources.length > 0 && <ResourcePills items={resources} />}
    </div>
  );
}

interface SimpleContentRendererProps {
  content: string;
}

export function SimpleContentRenderer({ content }: SimpleContentRendererProps) {
  return (
    <div className="prose-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}