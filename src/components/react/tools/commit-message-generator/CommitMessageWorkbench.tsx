import { useState, useCallback } from "react";
import { Copy, Check, RotateCcw, GitBranch, GitCommitHorizontal } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CommitState {
  type: string;
  scope: string;
  description: string;
  breaking: boolean;
  breakingDesc: string;
  body: string;
  footer: string;
}

const EMPTY: CommitState = {
  type: "",
  scope: "",
  description: "",
  breaking: false,
  breakingDesc: "",
  body: "",
  footer: "",
};

// ─── Commit types ─────────────────────────────────────────────────────────────
const TYPES = [
  { value: "feat", label: "feat", description: "A new feature" },
  { value: "fix", label: "fix", description: "A bug fix" },
  { value: "docs", label: "docs", description: "Documentation only" },
  { value: "style", label: "style", description: "Code style (formatting, whitespace)" },
  { value: "refactor", label: "refactor", description: "Code refactor, no feature/fix" },
  { value: "perf", label: "perf", description: "Performance improvement" },
  { value: "test", label: "test", description: "Adding or fixing tests" },
  { value: "chore", label: "chore", description: "Build process or tooling" },
  { value: "ci", label: "ci", description: "CI/CD configuration changes" },
  { value: "build", label: "build", description: "Build system or dependencies" },
  { value: "revert", label: "revert", description: "Revert a previous commit" },
];

// ─── Generators ───────────────────────────────────────────────────────────────
function buildCommitMessage(s: CommitState): string {
  if (!s.type || !s.description) return "";

  const bang = s.breaking ? "!" : "";
  const scope = s.scope.trim() ? `(${s.scope.trim()})` : "";
  const header = `${s.type}${scope}${bang}: ${s.description.trim()}`;

  const parts: string[] = [header];

  if (s.body.trim()) {
    parts.push("", s.body.trim());
  }

  const footerLines: string[] = [];
  if (s.breaking && s.breakingDesc.trim()) {
    footerLines.push(`BREAKING CHANGE: ${s.breakingDesc.trim()}`);
  }
  if (s.footer.trim()) {
    footerLines.push(s.footer.trim());
  }
  if (footerLines.length) {
    parts.push("", ...footerLines);
  }

  return parts.join("\n");
}

function buildBranchName(s: CommitState): string {
  if (!s.type || !s.description) return "";
  const slug = s.description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50)
    .replace(/-+$/, "");
  const scope = s.scope.trim() ? `${s.scope.trim()}-` : "";
  return `${s.type}/${scope}${slug}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CommitMessageWorkbench() {
  const [state, setState] = useState<CommitState>(EMPTY);
  const [copiedCommit, setCopiedCommit] = useState(false);
  const [copiedBranch, setCopiedBranch] = useState(false);

  const update = useCallback(
    <K extends keyof CommitState>(key: K, value: CommitState[K]) =>
      setState((prev) => ({ ...prev, [key]: value })),
    []
  );

  const commitMsg = buildCommitMessage(state);
  const branchName = buildBranchName(state);
  const descLen = state.description.length;
  const descWarning = descLen > 72;

  const copyCommit = useCallback(() => {
    if (!commitMsg) return;
    navigator.clipboard.writeText(commitMsg).then(() => {
      setCopiedCommit(true);
      setTimeout(() => setCopiedCommit(false), 2000);
    });
  }, [commitMsg]);

  const copyBranch = useCallback(() => {
    if (!branchName) return;
    navigator.clipboard.writeText(branchName).then(() => {
      setCopiedBranch(true);
      setTimeout(() => setCopiedBranch(false), 2000);
    });
  }, [branchName]);

  const reset = useCallback(() => setState(EMPTY), []);

  return (
    <div className="cm-workbench">
      {/* ── Step 1: Type ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">1</span>
          Commit type
        </h2>
        <div className="cm-chips">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`cm-chip${state.type === t.value ? " cm-chip-active" : ""}`}
              onClick={() => update("type", state.type === t.value ? "" : t.value)}
              title={t.description}
            >
              <code className="cm-chip-code">{t.label}</code>
              <span className="cm-chip-desc">{t.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Step 2: Scope ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">2</span>
          Scope <span className="cm-optional">(optional)</span>
        </h2>
        <input
          className="cm-input"
          type="text"
          placeholder="e.g. auth, api, ui, payment"
          value={state.scope}
          onChange={(e) => update("scope", e.target.value)}
          maxLength={40}
        />
        <p className="cm-hint">The area of the codebase this commit affects.</p>
      </section>

      {/* ── Step 3: Description ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">3</span>
          Short description
        </h2>
        <div className="cm-input-wrap">
          <input
            className={`cm-input${descWarning ? " cm-input-warn" : ""}`}
            type="text"
            placeholder="add OAuth2 support for Google login"
            value={state.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={120}
          />
          <span className={`cm-char-count${descWarning ? " cm-char-warn" : ""}`}>
            {descLen}/72
          </span>
        </div>
        <p className="cm-hint">Use imperative mood: "add", "fix", "remove" — not "added" or "adds".</p>
      </section>

      {/* ── Step 4: Breaking change ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">4</span>
          Breaking change?
        </h2>
        <label className="cm-toggle-wrap">
          <div
            className={`cm-toggle${state.breaking ? " cm-toggle-on" : ""}`}
            onClick={() => update("breaking", !state.breaking)}
            role="switch"
            aria-checked={state.breaking}
            tabIndex={0}
            onKeyDown={(e) => e.key === " " && update("breaking", !state.breaking)}
          >
            <div className="cm-toggle-thumb" />
          </div>
          <span className="cm-toggle-label">
            {state.breaking ? "Yes — this is a breaking change" : "No breaking changes"}
          </span>
        </label>
        {state.breaking && (
          <textarea
            className="cm-textarea"
            placeholder="Describe what breaks and how to migrate…"
            value={state.breakingDesc}
            onChange={(e) => update("breakingDesc", e.target.value)}
            rows={3}
          />
        )}
      </section>

      {/* ── Step 5: Body ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">5</span>
          Body <span className="cm-optional">(optional)</span>
        </h2>
        <textarea
          className="cm-textarea"
          placeholder="Explain the motivation behind this change. What problem does it solve?"
          value={state.body}
          onChange={(e) => update("body", e.target.value)}
          rows={3}
        />
      </section>

      {/* ── Step 6: Footer ── */}
      <section className="cm-section">
        <h2 className="cm-section-title">
          <span className="cm-step-num">6</span>
          Issue references <span className="cm-optional">(optional)</span>
        </h2>
        <input
          className="cm-input"
          type="text"
          placeholder="Closes #123, Refs #456"
          value={state.footer}
          onChange={(e) => update("footer", e.target.value)}
        />
        <p className="cm-hint">Reference issues or pull requests related to this commit.</p>
      </section>

      {/* ── Output ── */}
      <section className="cm-output-section">
        <div className="cm-output-header">
          <div className="cm-output-icon">
            <GitCommitHorizontal size={16} />
            Commit message
          </div>
          <button className="cm-btn-copy" onClick={copyCommit} disabled={!commitMsg}>
            {copiedCommit ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
        <pre className={`cm-pre${!commitMsg ? " cm-pre-empty" : ""}`}>
          {commitMsg || "Fill in steps above to generate your commit message…"}
        </pre>

        {branchName && (
          <div className="cm-branch-row">
            <div className="cm-output-icon">
              <GitBranch size={15} />
              Suggested branch
            </div>
            <code className="cm-branch-name">{branchName}</code>
            <button className="cm-btn-copy cm-btn-copy-sm" onClick={copyBranch}>
              {copiedBranch ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
        )}
      </section>

      {/* ── Actions ── */}
      <div className="cm-actions">
        <button className="cm-btn-reset" onClick={reset}>
          <RotateCcw size={13} /> Start over
        </button>
      </div>

      <style>{`
        .cm-workbench {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: var(--font-body, sans-serif);
        }

        /* Sections */
        .cm-section {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .cm-section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin: 0;
        }
        .cm-step-num {
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
        .cm-optional {
          font-weight: 400;
          font-size: 0.72rem;
          color: hsl(var(--muted-foreground));
        }
        .cm-hint {
          font-size: 0.72rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        /* Chips */
        .cm-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .cm-chip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.5rem 0.75rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card) / 0.5);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          min-width: 7rem;
        }
        .cm-chip:hover {
          border-color: hsl(var(--primary) / 0.4);
          background: hsl(var(--primary) / 0.05);
        }
        .cm-chip-active {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
        }
        .cm-chip-code {
          font-size: 0.82rem;
          font-weight: 700;
          font-family: ui-monospace, monospace;
          color: hsl(var(--primary));
          background: none;
          padding: 0;
        }
        .cm-chip-desc {
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          margin-top: 0.15rem;
        }

        /* Inputs */
        .cm-input-wrap {
          position: relative;
        }
        .cm-input {
          width: 100%;
          padding: 0.55rem 0.85rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.85rem;
          font-family: ui-monospace, monospace;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .cm-input:focus {
          border-color: hsl(var(--primary) / 0.5);
        }
        .cm-input-warn {
          border-color: hsl(38 90% 50% / 0.6) !important;
        }
        .cm-char-count {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
          pointer-events: none;
        }
        .cm-char-warn {
          color: hsl(38 90% 50%);
        }
        .cm-textarea {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.82rem;
          font-family: ui-monospace, monospace;
          outline: none;
          resize: vertical;
          line-height: 1.5;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .cm-textarea:focus {
          border-color: hsl(var(--primary) / 0.5);
        }

        /* Toggle */
        .cm-toggle-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }
        .cm-toggle {
          width: 2.5rem;
          height: 1.35rem;
          border-radius: 999px;
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          position: relative;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .cm-toggle-on {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
        }
        .cm-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 0.95rem;
          height: 0.95rem;
          border-radius: 50%;
          background: #fff;
          transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .cm-toggle-on .cm-toggle-thumb {
          left: calc(100% - 1rem);
        }
        .cm-toggle-label {
          font-size: 0.8rem;
          color: hsl(var(--foreground));
        }

        /* Output */
        .cm-output-section {
          border: 1px solid hsl(var(--primary) / 0.25);
          border-radius: 0.5rem;
          background: hsl(var(--primary) / 0.04);
          overflow: hidden;
        }
        .cm-output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.875rem;
          border-bottom: 1px solid hsl(var(--primary) / 0.15);
          background: hsl(var(--primary) / 0.06);
        }
        .cm-output-icon {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: hsl(var(--primary));
        }
        .cm-pre {
          padding: 1rem;
          margin: 0;
          font-size: 0.82rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: pre-wrap;
          word-break: break-word;
          color: hsl(var(--foreground));
          line-height: 1.6;
        }
        .cm-pre-empty {
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
        .cm-branch-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.6rem 0.875rem;
          border-top: 1px solid hsl(var(--primary) / 0.15);
          background: hsl(var(--primary) / 0.03);
        }
        .cm-branch-name {
          font-size: 0.8rem;
          font-family: ui-monospace, monospace;
          color: hsl(var(--foreground));
          background: hsl(var(--muted) / 0.5);
          padding: 0.2rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid hsl(var(--border));
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Buttons */
        .cm-btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: 0.35rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.72rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .cm-btn-copy:hover:not(:disabled) {
          border-color: hsl(var(--primary) / 0.5);
          color: hsl(var(--primary));
        }
        .cm-btn-copy:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .cm-btn-copy-sm {
          padding: 0.25rem 0.6rem;
          font-size: 0.68rem;
          flex-shrink: 0;
        }

        /* Actions */
        .cm-actions {
          display: flex;
          justify-content: flex-start;
        }
        .cm-btn-reset {
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
        .cm-btn-reset:hover {
          color: hsl(var(--foreground));
          border-color: hsl(var(--foreground) / 0.3);
        }
      `}</style>
    </div>
  );
}
