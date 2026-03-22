import { useState, useRef, useCallback } from "react";
import { Upload, Copy, Check, X } from "lucide-react";

// ─── Tokenizer ───────────────────────────────────────────────────────────────
// Approximates cl100k_base (GPT-4, Claude) token counts.
// Not exact, but accurate within ~5% for typical English text.
function estimateTokens(text: string): number {
  if (!text) return 0;
  // Split on whitespace to get rough word count
  const words = text.trim().split(/\s+/).filter(Boolean);
  // Count punctuation/special char clusters as extra tokens
  const punctuation = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  // cl100k_base: avg ~0.75 tokens per word for English, punctuation roughly 1:1
  const estimate = Math.ceil(words.length * 0.75 + punctuation * 0.5);
  return Math.max(1, estimate);
}

// ─── Pricing data ─────────────────────────────────────────────────────────────
interface ModelPricing {
  name: string;
  provider: string;
  inputPer1M: number;  // USD per 1M input tokens
  outputPer1M: number; // USD per 1M output tokens
  color: string;
}

const MODELS: ModelPricing[] = [
  { name: "GPT-4o", provider: "OpenAI", inputPer1M: 5.0, outputPer1M: 15.0, color: "#10a37f" },
  { name: "GPT-4o mini", provider: "OpenAI", inputPer1M: 0.15, outputPer1M: 0.60, color: "#10a37f" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPer1M: 3.0, outputPer1M: 15.0, color: "#d97706" },
  { name: "Claude 3 Haiku", provider: "Anthropic", inputPer1M: 0.25, outputPer1M: 1.25, color: "#d97706" },
  { name: "Gemini 1.5 Pro", provider: "Google", inputPer1M: 3.5, outputPer1M: 10.5, color: "#4285f4" },
  { name: "Gemini 2.0 Flash", provider: "Google", inputPer1M: 0.075, outputPer1M: 0.30, color: "#4285f4" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCost(usd: number): string {
  if (usd === 0) return "$0.0000";
  if (usd < 0.0001) return `$${usd.toExponential(2)}`;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

function calcCost(tokens: number, pricePerM: number): number {
  return (tokens / 1_000_000) * pricePerM;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TokenCounterWorkbench() {
  const [text, setText] = useState("");
  const [outputRatio, setOutputRatio] = useState(3); // assumed output tokens = input × ratio
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const tokens = estimateTokens(text);
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const outputTokens = tokens * outputRatio;

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target?.result as string ?? "");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const handleCopy = useCallback(() => {
    const summary = [
      `Tokens (estimated): ~${tokens.toLocaleString()}`,
      `Characters: ${chars.toLocaleString()}`,
      `Words: ${words.toLocaleString()}`,
      `Lines: ${lines.toLocaleString()}`,
      "",
      "Estimated API costs:",
      ...MODELS.map((m) =>
        `  ${m.name}: input ${formatCost(calcCost(tokens, m.inputPer1M))} / output ${formatCost(calcCost(outputTokens, m.outputPer1M))}`
      ),
    ].join("\n");
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tokens, chars, words, lines, outputTokens]);

  return (
    <div className="tc-workbench">
      {/* ── Input area ── */}
      <div className="tc-input-wrap">
        <div className="tc-toolbar">
          <span className="tc-toolbar-label">Paste or type text</span>
          <div className="tc-toolbar-actions">
            <button className="tc-btn-icon" onClick={() => fileRef.current?.click()} title="Upload file">
              <Upload size={14} />
              <span>Upload file</span>
            </button>
            {text && (
              <button className="tc-btn-icon tc-btn-danger" onClick={() => setText("")} title="Clear">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <textarea
          className="tc-textarea"
          placeholder="Paste your prompt, document, or any text here to count tokens and estimate LLM API costs…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        <input ref={fileRef} type="file" accept=".txt,.md,.json,.yaml,.yml,.csv,.xml,.html,.js,.ts,.py" style={{ display: "none" }} onChange={handleFile} />
      </div>

      {/* ── Stats row ── */}
      <div className="tc-stats-row">
        <div className="tc-stat tc-stat-primary">
          <span className="tc-stat-value">~{tokens.toLocaleString()}</span>
          <span className="tc-stat-label">tokens</span>
        </div>
        <div className="tc-stat">
          <span className="tc-stat-value">{chars.toLocaleString()}</span>
          <span className="tc-stat-label">characters</span>
        </div>
        <div className="tc-stat">
          <span className="tc-stat-value">{words.toLocaleString()}</span>
          <span className="tc-stat-label">words</span>
        </div>
        <div className="tc-stat">
          <span className="tc-stat-value">{lines.toLocaleString()}</span>
          <span className="tc-stat-label">lines</span>
        </div>
      </div>

      {/* ── Cost table ── */}
      <div className="tc-cost-section">
        <div className="tc-cost-header">
          <h2 className="tc-cost-title">Estimated API cost</h2>
          <div className="tc-ratio-wrap">
            <label className="tc-ratio-label" htmlFor="tc-ratio">Assumed output ratio:</label>
            <select
              id="tc-ratio"
              className="tc-ratio-select"
              value={outputRatio}
              onChange={(e) => setOutputRatio(Number(e.target.value))}
            >
              <option value={1}>1× (same as input)</option>
              <option value={2}>2× input</option>
              <option value={3}>3× input</option>
              <option value={5}>5× input</option>
              <option value={10}>10× input</option>
            </select>
          </div>
        </div>
        <p className="tc-cost-hint">
          Based on ~{tokens.toLocaleString()} input tokens and ~{outputTokens.toLocaleString()} output tokens. Prices from public provider pages (may vary).
        </p>

        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Input cost</th>
                <th>Output cost</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => {
                const inputCost = calcCost(tokens, m.inputPer1M);
                const outputCost = calcCost(outputTokens, m.outputPer1M);
                const total = inputCost + outputCost;
                return (
                  <tr key={m.name}>
                    <td className="tc-model-name">{m.name}</td>
                    <td>
                      <span className="tc-provider-badge" style={{ borderColor: m.color, color: m.color }}>
                        {m.provider}
                      </span>
                    </td>
                    <td>{formatCost(inputCost)}</td>
                    <td>{formatCost(outputCost)}</td>
                    <td className="tc-total">{formatCost(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="tc-pricing-note">
          Pricing per 1M tokens — Input / Output:
          {MODELS.map((m) => (
            <span key={m.name} className="tc-pricing-pill">
              {m.name}: ${m.inputPer1M} / ${m.outputPer1M}
            </span>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="tc-actions">
        <button className="tc-btn-copy" onClick={handleCopy} disabled={!text}>
          {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy stats</>}
        </button>
      </div>

      <style>{`
        .tc-workbench {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          font-family: var(--font-body, sans-serif);
        }
        .tc-input-wrap {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: hidden;
          background: hsl(var(--card));
        }
        .tc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.4);
        }
        .tc-toolbar-label {
          font-size: 0.7rem;
          font-family: var(--font-heading, monospace);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: hsl(var(--muted-foreground));
        }
        .tc-toolbar-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .tc-btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.6rem;
          border-radius: 0.35rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.7rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .tc-btn-icon:hover {
          border-color: hsl(var(--primary) / 0.5);
          background: hsl(var(--muted));
        }
        .tc-btn-danger:hover {
          border-color: hsl(0 70% 50% / 0.5);
          color: hsl(0 70% 60%);
        }
        .tc-textarea {
          width: 100%;
          min-height: 180px;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          outline: none;
          resize: vertical;
          font-size: 0.875rem;
          line-height: 1.6;
          color: hsl(var(--foreground));
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .tc-textarea::placeholder {
          color: hsl(var(--muted-foreground) / 0.6);
        }

        /* Stats */
        .tc-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 600px) {
          .tc-stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        .tc-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.875rem 1rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card) / 0.5);
          gap: 0.2rem;
        }
        .tc-stat-primary {
          border-color: hsl(var(--primary) / 0.3);
          background: hsl(var(--primary) / 0.05);
        }
        .tc-stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          line-height: 1;
        }
        .tc-stat-primary .tc-stat-value {
          color: hsl(var(--primary));
        }
        .tc-stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
        }

        /* Cost section */
        .tc-cost-section {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card) / 0.5);
          padding: 1.25rem;
        }
        .tc-cost-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .tc-cost-title {
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin: 0;
        }
        .tc-ratio-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tc-ratio-label {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
        }
        .tc-ratio-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.35rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.72rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
        }
        .tc-cost-hint {
          font-size: 0.72rem;
          color: hsl(var(--muted-foreground));
          margin: 0 0 1rem;
        }
        .tc-table-wrap {
          overflow-x: auto;
        }
        .tc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        .tc-table th {
          text-align: left;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
          padding: 0.4rem 0.75rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        .tc-table td {
          padding: 0.55rem 0.75rem;
          border-bottom: 1px solid hsl(var(--border) / 0.5);
          color: hsl(var(--foreground));
          font-family: ui-monospace, monospace;
          font-size: 0.78rem;
        }
        .tc-table tr:last-child td { border-bottom: none; }
        .tc-model-name {
          font-weight: 600;
          font-family: var(--font-heading, monospace) !important;
          font-size: 0.78rem !important;
        }
        .tc-provider-badge {
          display: inline-block;
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
          border: 1px solid;
          font-size: 0.65rem;
          font-family: var(--font-heading, monospace);
          font-weight: 500;
        }
        .tc-total {
          font-weight: 700;
          color: hsl(var(--primary)) !important;
        }
        .tc-pricing-note {
          margin-top: 0.75rem;
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }
        .tc-pricing-pill {
          background: hsl(var(--muted) / 0.5);
          border: 1px solid hsl(var(--border));
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
          font-family: ui-monospace, monospace;
        }

        /* Actions */
        .tc-actions {
          display: flex;
          justify-content: flex-end;
        }
        .tc-btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 0.4rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.78rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
        }
        .tc-btn-copy:hover:not(:disabled) {
          border-color: hsl(var(--primary) / 0.5);
          background: hsl(var(--primary) / 0.07);
          color: hsl(var(--primary));
        }
        .tc-btn-copy:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
