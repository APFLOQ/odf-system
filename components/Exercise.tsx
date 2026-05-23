"use client";

import { useState } from "react";

interface ExerciseProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  code?: string;
}

const letters = ["A", "B", "C", "D", "E", "F"];

export function Exercise({ question, options, correctAnswer, explanation, code }: ExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div className="exercise">
      <div className="exercise-header">
        <span className="exercise-badge">Ejercicio</span>
      </div>

      {code && (
        <pre
          style={{
            background: "#07090e",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            overflow: "auto",
          }}
        >
          <code>{code}</code>
        </pre>
      )}

      <div className="exercise-question">{question}</div>

      <div className="exercise-options">
        {options.map((option, index) => {
          let className = "exercise-option";
          if (submitted) {
            if (index === correctAnswer) {
              className += " correct";
            } else if (index === selected) {
              className += " incorrect";
            }
          } else if (selected === index) {
            className += " selected";
          }

          return (
            <div
              key={index}
              className={className}
              onClick={() => !submitted && setSelected(index)}
            >
              <span className="exercise-letter">{letters[index]}</span>
              <span className="exercise-text">{option}</span>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          className="exercise-submit"
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Verificar respuesta
        </button>
      ) : (
        <div style={{ marginTop: "16px" }}>
          {isCorrect ? (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "8px",
                color: "#34d399",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              ✓ ¡Correcto!
            </div>
          ) : (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                color: "#ef4444",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              ✗ Incorrecto. La respuesta correcta es {letters[correctAnswer]}.
            </div>
          )}

          {explanation && (
            <div className="exercise-explanation">
              <strong>Explicación:</strong> {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}