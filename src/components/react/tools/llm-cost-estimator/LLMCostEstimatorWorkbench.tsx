import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, RefreshCw, ExternalLink, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";

// ─── OpenRouter types ─────────────────────────────────────────────────────────
interface ORModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;   // USD per token (e.g. "0.000005" = $5/1M)
    completion: string;
  };
}

interface ModelRow {
  id: string;
  name: string;
  provider: string;
  contextK: string;
  inputPerM: number;
  outputPerM: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

type SortKey = "name" | "inputPerM" | "outputPerM" | "totalCost" | "contextK";
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n === 0) return "$0.000000";
  if (n < 0.000001) return `$${n.toExponential(2)}`;
  if (n < 0.001) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function fmtPerM(n: number): string {
  if (n === 0) return "free";
  if (n < 0.01) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function ctxLabel(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

function pricePerM(tokenPrice: string): number {
  const p = parseFloat(tokenPrice);
  if (!isFinite(p) || p <= 0) return 0;
  return p * 1_000_000;
}

function providerFromId(id: string): string {
  const parts = id.split("/");
  if (parts.length > 1) return parts[0];
  return id;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LLMCostEstimatorWorkbench() {
  const [models, setModels] = useState<ORModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalCost");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setModels(json.data ?? []);
      setLastFetched(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch model list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  const rows: ModelRow[] = useMemo(() => {
    return models.map((m) => {
      const inputPerM = pricePerM(m.pricing.prompt);
      const outputPerM = pricePerM(m.pricing.completion);
      const inputCost = (inputTokens / 1_000_000) * inputPerM;
      const outputCost = (outputTokens / 1_000_000) * outputPerM;
      return {
        id: m.id,
        name: m.name || m.id,
        provider: providerFromId(m.id),
        contextK: ctxLabel(m.context_length),
        inputPerM,
        outputPerM,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
      };
    });
  }, [models, inputTokens, outputTokens]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) => !q || r.name.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "contextK") {
        // parse number from label for proper sort
        const na = parseFloat(a.contextK) * (a.contextK.includes("M") ? 1000 : 1);
        const nb = parseFloat(b.contextK) * (b.contextK.includes("M") ? 1000 : 1);
        cmp = na - nb;
      } else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const paged = useMemo(() => sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [sorted, page]);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(0);
  }, [sortKey]);

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    ) : null;

  return (
    <div className="lce-workbench">
      {/* ── Token inputs ── */}
      <div className="lce-inputs-row">
        <label className="lce-input-group">
          <span className="lce-input-label">Input tokens</span>
          <input
            type="number"
            className="lce-num-input"
            value={inputTokens}
            min={0}
            max={10_000_000}
            onChange={(e) => { setInputTokens(Math.max(0, parseInt(e.target.value) || 0)); setPage(0); }}
          />
        </label>
        <label className="lce-input-group">
          <span className="lce-input-label">Output tokens</span>
          <input
            type="number"
            className="lce-num-input"
            value={outputTokens}
            min={0}
            max={10_000_000}
            onChange={(e) => { setOutputTokens(Math.max(0, parseInt(e.target.value) || 0)); setPage(0); }}
          />
        </label>
        <div className="lce-input-group lce-search-group">
          <span className="lce-input-label">Filter models</span>
          <div className="lce-search-wrap">
            <Search size={13} className="lce-search-icon" />
            <input
              type="text"
              className="lce-search-input"
              placeholder="gpt, claude, mistral…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="lce-status-bar">
        {loading ? (
          <span className="lce-status-loading">
            <RefreshCw size={12} className="lce-spin" /> Fetching models from OpenRouter…
          </span>
        ) : error ? (
          <span className="lce-status-error">
            <AlertCircle size={12} /> {error}
            <button className="lce-btn-retry" onClick={fetchModels}>Retry</button>
          </span>
        ) : (
          <span className="lce-status-ok">
            {sorted.length} of {models.length} models
            {lastFetched && ` · fetched ${lastFetched.toLocaleTimeString()}`}
            <button className="lce-btn-icon" onClick={fetchModels} title="Refresh">
              <RefreshCw size={12} />
            </button>
            <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="lce-or-link">
              OpenRouter <ExternalLink size={10} />
            </a>
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="lce-table-wrap">
        <table className="lce-table">
          <thead>
            <tr>
              <th className="lce-th-sortable" onClick={() => handleSort("name")}>
                Model <SortIcon k="name" />
              </th>
              <th className="lce-th-right lce-th-sortable" onClick={() => handleSort("contextK")}>
                Context <SortIcon k="contextK" />
              </th>
              <th className="lce-th-right lce-th-sortable" onClick={() => handleSort("inputPerM")}>
                Input/1M <SortIcon k="inputPerM" />
              </th>
              <th className="lce-th-right lce-th-sortable" onClick={() => handleSort("outputPerM")}>
                Output/1M <SortIcon k="outputPerM" />
              </th>
              <th className="lce-th-right">Input cost</th>
              <th className="lce-th-right">Output cost</th>
              <th className="lce-th-right lce-th-sortable" onClick={() => handleSort("totalCost")}>
                Total <SortIcon k="totalCost" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="lce-td-center">Loading…</td></tr>
            )}
            {!loading && paged.length === 0 && (
              <tr><td colSpan={7} className="lce-td-center">No models match your filter.</td></tr>
            )}
            {paged.map((r) => (
              <tr key={r.id} className="lce-row">
                <td>
                  <div className="lce-model-name">{r.name}</div>
                  <div className="lce-model-id">{r.id}</div>
                </td>
                <td className="lce-td-right">{r.contextK}</td>
                <td className="lce-td-right">{fmtPerM(r.inputPerM)}</td>
                <td className="lce-td-right">{fmtPerM(r.outputPerM)}</td>
                <td className="lce-td-right">{fmt(r.inputCost)}</td>
                <td className="lce-td-right">{fmt(r.outputCost)}</td>
                <td className="lce-td-right lce-td-total">{fmt(r.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="lce-pagination">
          <button className="lce-page-btn" disabled={page === 0} onClick={() => setPage(0)}>«</button>
          <button className="lce-page-btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span className="lce-page-info">Page {page + 1} of {totalPages}</span>
          <button className="lce-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>›</button>
          <button className="lce-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</button>
        </div>
      )}

      <style>{`
        .lce-workbench {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: var(--font-body, sans-serif);
        }

        /* Inputs */
        .lce-inputs-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: flex-end;
        }
        .lce-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .lce-search-group {
          flex: 1;
          min-width: 180px;
        }
        .lce-input-label {
          font-size: 0.67rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--muted-foreground));
        }
        .lce-num-input {
          width: 120px;
          padding: 0.45rem 0.65rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.85rem;
          font-family: ui-monospace, monospace;
          outline: none;
          transition: border-color 0.15s;
        }
        .lce-num-input:focus { border-color: hsl(var(--primary) / 0.5); }
        .lce-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .lce-search-icon {
          position: absolute;
          left: 0.6rem;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .lce-search-input {
          width: 100%;
          padding: 0.45rem 0.65rem 0.45rem 2rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .lce-search-input:focus { border-color: hsl(var(--primary) / 0.5); }

        /* Status bar */
        .lce-status-bar {
          font-size: 0.72rem;
          font-family: var(--font-heading, monospace);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(var(--muted-foreground));
        }
        .lce-status-loading, .lce-status-error, .lce-status-ok {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .lce-status-error { color: hsl(0 60% 55%); }
        .lce-spin { animation: lce-spin 1s linear infinite; }
        @keyframes lce-spin { to { transform: rotate(360deg); } }
        .lce-btn-retry {
          padding: 0.15rem 0.5rem;
          border: 1px solid hsl(0 60% 55% / 0.4);
          border-radius: 0.3rem;
          background: transparent;
          color: hsl(0 60% 55%);
          font-size: 0.68rem;
          cursor: pointer;
        }
        .lce-btn-icon {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.35rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.3rem;
          background: hsl(var(--card));
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: all 0.15s;
        }
        .lce-btn-icon:hover { color: hsl(var(--foreground)); border-color: hsl(var(--primary) / 0.4); }
        .lce-or-link {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          color: hsl(var(--primary));
          text-decoration: none;
          font-size: 0.68rem;
        }
        .lce-or-link:hover { text-decoration: underline; }

        /* Table */
        .lce-table-wrap {
          overflow-x: auto;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
        }
        .lce-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
        }
        .lce-table thead {
          position: sticky;
          top: 0;
          z-index: 1;
          background: hsl(var(--muted) / 0.5);
          backdrop-filter: blur(4px);
        }
        .lce-table th {
          padding: 0.5rem 0.75rem;
          text-align: left;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
          border-bottom: 1px solid hsl(var(--border));
          white-space: nowrap;
          user-select: none;
        }
        .lce-th-right { text-align: right; }
        .lce-th-sortable {
          cursor: pointer;
        }
        .lce-th-sortable:hover { color: hsl(var(--foreground)); }
        .lce-th-sortable { display: table-cell; }
        .lce-table th svg { display: inline; vertical-align: middle; }
        .lce-table td {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid hsl(var(--border) / 0.4);
          color: hsl(var(--foreground));
          vertical-align: middle;
        }
        .lce-table tr:last-child td { border-bottom: none; }
        .lce-row:hover td { background: hsl(var(--muted) / 0.3); }
        .lce-model-name {
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          font-size: 0.78rem;
          white-space: nowrap;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lce-model-id {
          font-size: 0.63rem;
          color: hsl(var(--muted-foreground));
          font-family: ui-monospace, monospace;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lce-td-right { text-align: right; font-family: ui-monospace, monospace; }
        .lce-td-total { font-weight: 700; color: hsl(var(--primary)); }
        .lce-td-center { text-align: center; color: hsl(var(--muted-foreground)); padding: 2rem; }

        /* Pagination */
        .lce-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .lce-page-btn {
          padding: 0.3rem 0.65rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.35rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .lce-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .lce-page-btn:not(:disabled):hover { border-color: hsl(var(--primary) / 0.4); }
        .lce-page-info { font-size: 0.72rem; font-family: var(--font-heading, monospace); color: hsl(var(--muted-foreground)); padding: 0 0.5rem; }
      `}</style>
    </div>
  );
}
