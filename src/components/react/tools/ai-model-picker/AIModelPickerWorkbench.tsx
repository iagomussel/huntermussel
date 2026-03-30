import { useState, useCallback, useEffect } from "react";
import { RotateCcw, ExternalLink, ChevronRight } from "lucide-react";

// ─── Model database ───────────────────────────────────────────────────────────
interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: string; // human-readable
  contextK: number;      // in thousands for comparison
  inputPriceLabel: string;
  tier: "budget" | "balanced" | "premium";
  local: boolean;
  vision: boolean;
  functionCalling: boolean;
  speed: "fast" | "medium" | "slow";
  strengths: string[];
  weaknesses: string[];
  docsUrl: string;
  providerColor: string;
  tasks: string[]; // best for: "code" | "chat" | "docs" | "vision" | "embeddings" | "realtime" | "functions" | "longdocs"
}

const MODELS: AIModel[] = [
  {
    id: "claude-35-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: "200K tokens",
    contextK: 200,
    inputPriceLabel: "$3 / 1M tokens",
    tier: "balanced",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "medium",
    strengths: ["Excellent reasoning", "Long context", "Vision", "Function calling", "Coding"],
    weaknesses: ["Slower than Flash/mini", "Higher cost than Haiku"],
    docsUrl: "https://docs.anthropic.com/en/docs/models-overview",
    providerColor: "#d97706",
    tasks: ["code", "chat", "docs", "vision", "functions", "longdocs"],
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextWindow: "200K tokens",
    contextK: 200,
    inputPriceLabel: "$0.25 / 1M tokens",
    tier: "budget",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "fast",
    strengths: ["Very fast", "Cheapest Anthropic model", "Long context", "Good for routing"],
    weaknesses: ["Less capable than Sonnet on complex tasks"],
    docsUrl: "https://docs.anthropic.com/en/docs/models-overview",
    providerColor: "#d97706",
    tasks: ["chat", "realtime", "functions", "longdocs"],
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: "128K tokens",
    contextK: 128,
    inputPriceLabel: "$5 / 1M tokens",
    tier: "premium",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "medium",
    strengths: ["Strong reasoning", "Vision", "Broad ecosystem", "Function calling"],
    weaknesses: ["Context smaller than Claude/Gemini 1.5", "Higher cost"],
    docsUrl: "https://platform.openai.com/docs/models/gpt-4o",
    providerColor: "#10a37f",
    tasks: ["code", "chat", "docs", "vision", "functions"],
  },
  {
    id: "gpt4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    contextWindow: "128K tokens",
    contextK: 128,
    inputPriceLabel: "$0.15 / 1M tokens",
    tier: "budget",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "fast",
    strengths: ["Very cheap", "Fast", "Good for classification/extraction", "Vision"],
    weaknesses: ["Less capable for complex reasoning"],
    docsUrl: "https://platform.openai.com/docs/models/gpt-4o-mini",
    providerColor: "#10a37f",
    tasks: ["chat", "realtime", "functions", "embeddings"],
  },
  {
    id: "gemini-15-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: "2M tokens",
    contextK: 2000,
    inputPriceLabel: "$3.50 / 1M tokens",
    tier: "balanced",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "medium",
    strengths: ["Largest context window (2M)", "Vision", "Multimodal", "Long docs"],
    weaknesses: ["Variable latency on very long contexts"],
    docsUrl: "https://ai.google.dev/gemini-api/docs/models/gemini",
    providerColor: "#4285f4",
    tasks: ["code", "chat", "docs", "vision", "functions", "longdocs"],
  },
  {
    id: "gemini-20-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextWindow: "1M tokens",
    contextK: 1000,
    inputPriceLabel: "$0.075 / 1M tokens",
    tier: "budget",
    local: false,
    vision: true,
    functionCalling: true,
    speed: "fast",
    strengths: ["Extremely fast", "Very cheap", "Large context", "Real-time use cases"],
    weaknesses: ["Less reasoning depth than Pro models"],
    docsUrl: "https://ai.google.dev/gemini-api/docs/models/gemini",
    providerColor: "#4285f4",
    tasks: ["chat", "realtime", "functions", "longdocs"],
  },
  {
    id: "llama-31-70b",
    name: "Llama 3.1 70B",
    provider: "Meta (via Groq/Together/Ollama)",
    contextWindow: "128K tokens",
    contextK: 128,
    inputPriceLabel: "Free (self-hosted) / ~$0.88/1M (cloud)",
    tier: "balanced",
    local: true,
    vision: false,
    functionCalling: true,
    speed: "medium",
    strengths: ["Open weights", "Self-hostable", "Strong coding", "Function calling"],
    weaknesses: ["Requires GPU for self-hosting", "No vision", "Community support only"],
    docsUrl: "https://llama.meta.com/",
    providerColor: "#0064e0",
    tasks: ["code", "chat", "functions"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    contextWindow: "128K tokens",
    contextK: 128,
    inputPriceLabel: "$3 / 1M tokens",
    tier: "balanced",
    local: false,
    vision: false,
    functionCalling: true,
    speed: "medium",
    strengths: ["Strong reasoning", "European provider (GDPR)", "Function calling", "Multilingual"],
    weaknesses: ["No vision", "Smaller ecosystem than OpenAI/Anthropic"],
    docsUrl: "https://docs.mistral.ai/getting-started/models/",
    providerColor: "#ff7000",
    tasks: ["code", "chat", "docs", "functions"],
  },
  {
    id: "phi3-mini",
    name: "Phi-3 Mini",
    provider: "Microsoft",
    contextWindow: "128K tokens",
    contextK: 128,
    inputPriceLabel: "Free (self-hosted)",
    tier: "budget",
    local: true,
    vision: false,
    functionCalling: false,
    speed: "fast",
    strengths: ["Runs on CPU/edge devices", "Very small model (3.8B)", "Free", "Offline use"],
    weaknesses: ["Limited capability", "No function calling", "No vision"],
    docsUrl: "https://azure.microsoft.com/en-us/blog/phi-3-small-language-models-for-your-ai-journey/",
    providerColor: "#0078d4",
    tasks: ["chat", "realtime"],
  },
];

// ─── Questions ────────────────────────────────────────────────────────────────
interface Answer {
  task: string;
  budget: string;
  context: string;
  speed: string;
  deployment: string;
}

const EMPTY_ANSWER: Answer = {
  task: "",
  budget: "",
  context: "",
  speed: "",
  deployment: "",
};

// ─── Scoring ──────────────────────────────────────────────────────────────────
function scoreModel(model: AIModel, answers: Answer): number {
  let score = 0;

  // Task fit
  if (answers.task && model.tasks.includes(answers.task)) score += 30;
  if (answers.task === "vision" && !model.vision) score -= 50;
  if (answers.task === "functions" && !model.functionCalling) score -= 50;
  if (answers.task === "embeddings") score += model.tier === "budget" ? 10 : 0;

  // Budget
  if (answers.budget === "cost") {
    if (model.tier === "budget") score += 25;
    else if (model.tier === "premium") score -= 10;
  } else if (answers.budget === "performance") {
    if (model.tier === "premium") score += 15;
    else if (model.tier === "balanced") score += 10;
  } else if (answers.budget === "balanced") {
    if (model.tier === "balanced") score += 20;
    if (model.tier === "budget") score += 10;
  }

  // Context window
  if (answers.context === "small") score += 5; // all models qualify
  else if (answers.context === "medium") {
    if (model.contextK >= 32) score += 15;
    else score -= 10;
  } else if (answers.context === "large") {
    if (model.contextK >= 200) score += 25;
    else if (model.contextK >= 128) score += 10;
    else score -= 20;
  }

  // Speed
  if (answers.speed === "realtime" && model.speed === "fast") score += 20;
  if (answers.speed === "realtime" && model.speed === "slow") score -= 15;
  if (answers.speed === "batch") score += 0; // all are fine for batch

  // Deployment
  if (answers.deployment === "local") {
    if (model.local) score += 30;
    else score -= 30;
  } else if (answers.deployment === "cloud") {
    if (!model.local) score += 5;
  }

  return score;
}

function getRecommendations(answers: Answer): AIModel[] {
  if (!answers.task) return [];
  const scored = MODELS.map((m) => ({ model: m, score: scoreModel(m, answers) }))
    .filter((x) => x.score > -20)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => x.model);
}

// ─── Component ────────────────────────────────────────────────────────────────
interface OptionBtn {
  value: string;
  label: string;
  sub?: string;
}

function QuestionRow({
  step,
  title,
  options,
  value,
  onChange,
}: {
  step: number;
  title: string;
  options: OptionBtn[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section className="amp-section">
      <h2 className="amp-section-title">
        <span className="amp-step-num">{step}</span>
        {title}
      </h2>
      <div className="amp-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`amp-option${value === opt.value ? " amp-option-active" : ""}`}
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
          >
            <span className="amp-option-label">{opt.label}</span>
            {opt.sub && <span className="amp-option-sub">{opt.sub}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function AIModelPickerWorkbench() {
  const [answers, setAnswers] = useState<Answer>(EMPTY_ANSWER);
  const [showResults, setShowResults] = useState(false);

  const update = useCallback(
    (key: keyof Answer, value: string) =>
      setAnswers((prev) => ({ ...prev, [key]: value })),
    []
  );

  const allAnswered = Object.values(answers).every(Boolean);
  const recommendations = showResults ? getRecommendations(answers) : [];

  const handleFind = useCallback(() => {
    if (allAnswered) setShowResults(true);
  }, [allAnswered]);

  const handleReset = useCallback(() => {
    setAnswers(EMPTY_ANSWER);
    setShowResults(false);
  }, []);

  // Auto-show when all answered
  useEffect(() => {
    if (allAnswered) setShowResults(true);
  }, [allAnswered]);

  return (
    <div className="amp-workbench">
      <QuestionRow
        step={1}
        title="What's your primary use case?"
        value={answers.task}
        onChange={(v) => update("task", v)}
        options={[
          { value: "code", label: "Code generation", sub: "Generate, review, or explain code" },
          { value: "chat", label: "Chat / Q&A", sub: "Conversational assistant or chatbot" },
          { value: "docs", label: "Document analysis", sub: "Summarize or extract from docs" },
          { value: "vision", label: "Vision / multimodal", sub: "Process images or screenshots" },
          { value: "functions", label: "Function calling", sub: "Structured tool use / agents" },
          { value: "realtime", label: "Real-time streaming", sub: "Low latency, live responses" },
          { value: "longdocs", label: "Very long documents", sub: "Books, codebases, large PDFs" },
          { value: "embeddings", label: "Embeddings / RAG", sub: "Semantic search and retrieval" },
        ]}
      />

      <QuestionRow
        step={2}
        title="What's your budget priority?"
        value={answers.budget}
        onChange={(v) => update("budget", v)}
        options={[
          { value: "cost", label: "Cost-optimized", sub: "Minimize API spend above all" },
          { value: "balanced", label: "Balanced", sub: "Good quality at reasonable cost" },
          { value: "performance", label: "Performance-first", sub: "Best results, cost secondary" },
        ]}
      />

      <QuestionRow
        step={3}
        title="How much context window do you need?"
        value={answers.context}
        onChange={(v) => update("context", v)}
        options={[
          { value: "small", label: "Small (< 16K)", sub: "Short prompts and responses" },
          { value: "medium", label: "Medium (16K–128K)", sub: "Documents and long conversations" },
          { value: "large", label: "Large (128K+)", sub: "Entire codebases or books" },
        ]}
      />

      <QuestionRow
        step={4}
        title="What speed do you need?"
        value={answers.speed}
        onChange={(v) => update("speed", v)}
        options={[
          { value: "realtime", label: "Real-time interactive", sub: "Sub-second first token" },
          { value: "moderate", label: "Moderate", sub: "A few seconds is fine" },
          { value: "batch", label: "Batch / offline", sub: "Speed doesn't matter" },
        ]}
      />

      <QuestionRow
        step={5}
        title="Where will you deploy?"
        value={answers.deployment}
        onChange={(v) => update("deployment", v)}
        options={[
          { value: "cloud", label: "Cloud API", sub: "Managed, no infra to maintain" },
          { value: "local", label: "On-premise / local", sub: "Self-host for privacy or cost" },
        ]}
      />

      {/* ── Results ── */}
      {showResults && recommendations.length > 0 && (
        <section className="amp-results">
          <h2 className="amp-results-title">
            Top {recommendations.length} recommended models
          </h2>
          <div className="amp-cards">
            {recommendations.map((model, i) => (
              <div key={model.id} className={`amp-card${i === 0 ? " amp-card-top" : ""}`}>
                <div className="amp-card-header">
                  <div>
                    {i === 0 && <span className="amp-badge-top">Best match</span>}
                    <h3 className="amp-model-name">{model.name}</h3>
                    <span
                      className="amp-provider"
                      style={{ color: model.providerColor }}
                    >
                      {model.provider}
                    </span>
                  </div>
                  <a
                    href={model.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="amp-docs-link"
                  >
                    Docs <ExternalLink size={11} />
                  </a>
                </div>

                <div className="amp-meta-row">
                  <span className="amp-meta-pill">
                    Context: {model.contextWindow}
                  </span>
                  <span className="amp-meta-pill">
                    {model.inputPriceLabel}
                  </span>
                  <span className={`amp-meta-pill amp-tier-${model.tier}`}>
                    {model.tier}
                  </span>
                  {model.vision && <span className="amp-meta-pill">Vision ✓</span>}
                  {model.local && <span className="amp-meta-pill">Self-hostable ✓</span>}
                </div>

                <div className="amp-pros-cons">
                  <div className="amp-pros">
                    <span className="amp-pros-label">Strengths</span>
                    <ul>
                      {model.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="amp-cons">
                    <span className="amp-cons-label">Trade-offs</span>
                    <ul>
                      {model.weaknesses.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showResults && recommendations.length === 0 && (
        <div className="amp-no-results">
          No models matched your requirements. Try adjusting your answers — especially the deployment preference.
        </div>
      )}

      {/* ── Actions ── */}
      <div className="amp-actions">
        {!allAnswered && (
          <p className="amp-progress-hint">
            <ChevronRight size={13} />
            {5 - Object.values(answers).filter(Boolean).length} question(s) remaining…
          </p>
        )}
        <button className="amp-btn-reset" onClick={handleReset}>
          <RotateCcw size={13} /> Start over
        </button>
      </div>

      <style>{`
        .amp-workbench {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: var(--font-body, sans-serif);
        }

        /* Sections */
        .amp-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .amp-section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin: 0;
        }
        .amp-step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 999px;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-size: 0.68rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Options */
        .amp-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .amp-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.55rem 0.9rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card) / 0.5);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          min-width: 10rem;
          text-align: left;
        }
        .amp-option:hover {
          border-color: hsl(var(--primary) / 0.4);
          background: hsl(var(--primary) / 0.05);
        }
        .amp-option-active {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
        }
        .amp-option-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          font-family: var(--font-heading, monospace);
        }
        .amp-option-sub {
          font-size: 0.67rem;
          color: hsl(var(--muted-foreground));
          margin-top: 0.15rem;
        }

        /* Results */
        .amp-results {
          border-top: 1px solid hsl(var(--border));
          padding-top: 1.5rem;
        }
        .amp-results-title {
          font-size: 0.9rem;
          font-weight: 700;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin: 0 0 1rem;
        }
        .amp-cards {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .amp-card {
          padding: 1.125rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card) / 0.5);
        }
        .amp-card-top {
          border-color: hsl(var(--primary) / 0.4);
          background: hsl(var(--primary) / 0.04);
        }
        .amp-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .amp-badge-top {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-heading, monospace);
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          margin-bottom: 0.3rem;
        }
        .amp-model-name {
          font-size: 0.92rem;
          font-weight: 700;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin: 0 0 0.15rem;
        }
        .amp-provider {
          font-size: 0.7rem;
          font-weight: 500;
          font-family: var(--font-heading, monospace);
        }
        .amp-docs-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          border: 1px solid hsl(var(--border));
          padding: 0.25rem 0.6rem;
          border-radius: 0.3rem;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .amp-docs-link:hover {
          color: hsl(var(--primary));
          border-color: hsl(var(--primary) / 0.4);
        }

        /* Meta pills */
        .amp-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.875rem;
        }
        .amp-meta-pill {
          font-size: 0.65rem;
          font-family: var(--font-heading, monospace);
          background: hsl(var(--muted) / 0.5);
          border: 1px solid hsl(var(--border));
          border-radius: 999px;
          padding: 0.15rem 0.55rem;
          color: hsl(var(--foreground));
        }
        .amp-tier-budget { color: hsl(145 70% 45%); border-color: hsl(145 70% 45% / 0.3); background: hsl(145 70% 45% / 0.08); }
        .amp-tier-balanced { color: hsl(40 80% 45%); border-color: hsl(40 80% 45% / 0.3); background: hsl(40 80% 45% / 0.08); }
        .amp-tier-premium { color: hsl(270 70% 60%); border-color: hsl(270 70% 60% / 0.3); background: hsl(270 70% 60% / 0.08); }

        /* Pros/Cons */
        .amp-pros-cons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
        }
        @media (max-width: 520px) {
          .amp-pros-cons { grid-template-columns: 1fr; }
        }
        .amp-pros-label, .amp-cons-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-family: var(--font-heading, monospace);
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
        .amp-pros-label { color: hsl(145 70% 45%); }
        .amp-cons-label { color: hsl(0 60% 55%); }
        .amp-pros ul, .amp-cons ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .amp-pros li, .amp-cons li {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          padding-left: 1rem;
          position: relative;
          line-height: 1.4;
        }
        .amp-pros li::before {
          content: "+";
          position: absolute;
          left: 0;
          color: hsl(145 70% 45%);
          font-weight: 700;
        }
        .amp-cons li::before {
          content: "–";
          position: absolute;
          left: 0;
          color: hsl(0 60% 55%);
          font-weight: 700;
        }

        /* No results */
        .amp-no-results {
          padding: 1.5rem;
          border: 1px dashed hsl(var(--border));
          border-radius: 0.5rem;
          font-size: 0.82rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
        }

        /* Actions */
        .amp-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid hsl(var(--border));
        }
        .amp-progress-hint {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
          margin: 0;
        }
        .amp-btn-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: 0.4rem;
          border: 1px solid hsl(var(--border));
          background: transparent;
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
        }
        .amp-btn-reset:hover {
          color: hsl(var(--foreground));
          border-color: hsl(var(--foreground) / 0.3);
        }
      `}</style>
    </div>
  );
}
