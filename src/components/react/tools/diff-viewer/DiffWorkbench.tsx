import { startTransition, useEffect, useRef, useState } from "react";
import ReactDiffViewer, { DiffMethod } from "@alexbruf/react-diff-viewer";
import "@alexbruf/react-diff-viewer/index.css";
import {
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  Eraser,
  FileUp,
  FlaskConical,
  Rows3,
  SplitSquareVertical,
} from "lucide-react";

import "@/styles/diff-workbench.css";

import {
  DIFF_SAMPLE,
  LARGE_DIFF_CHARACTER_LIMIT,
  LARGE_DIFF_LINE_LIMIT,
  SHAREABLE_TEXT_LIMIT,
  buildStats,
  countLines,
  createPatchText,
  createShareUrl,
  readShareState,
  type DiffViewMode,
} from "./utils";

type FlashState = {
  tone: "default" | "success" | "warning";
  text: string;
};

type DiffGranularity = "lines" | "words" | "chars";

type StoredPreferences = {
  contextLines?: number;
  granularity?: DiffGranularity;
  ignoreWhitespace?: boolean;
  showDiffOnly?: boolean;
  viewMode?: DiffViewMode;
};

const PREFERENCES_KEY = "hm.diff-viewer.preferences.v4";

const GRANULARITY_OPTIONS: Array<{ label: string; value: DiffGranularity }> = [
  { label: "Line", value: "lines" },
  { label: "Word", value: "words" },
  { label: "Char", value: "chars" },
];

function readPreferences(): StoredPreferences {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    return raw ? (JSON.parse(raw) as StoredPreferences) : {};
  } catch {
    return {};
  }
}

function getCompareMethod(granularity: DiffGranularity, ignoreWhitespace: boolean) {
  if (granularity === "lines") {
    return ignoreWhitespace ? DiffMethod.TRIMMED_LINES : DiffMethod.LINES;
  }

  if (granularity === "chars") {
    return DiffMethod.CHARS;
  }

  return ignoreWhitespace ? DiffMethod.WORDS : DiffMethod.WORDS_WITH_SPACE;
}

export default function DiffWorkbench() {
  const preferences = readPreferences();
  const sharedState = readShareState();

  const [original, setOriginal] = useState(sharedState.original ?? "");
  const [modified, setModified] = useState(sharedState.modified ?? "");
  const [originalName, setOriginalName] = useState(sharedState.originalName ?? "original.txt");
  const [modifiedName, setModifiedName] = useState(sharedState.modifiedName ?? "modified.txt");
  const [viewMode, setViewMode] = useState<DiffViewMode>(sharedState.viewMode ?? preferences.viewMode ?? "split");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(sharedState.ignoreWhitespace ?? preferences.ignoreWhitespace ?? false);
  const [showDiffOnly, setShowDiffOnly] = useState(sharedState.collapseUnchanged ?? preferences.showDiffOnly ?? true);
  const [contextLines, setContextLines] = useState(sharedState.contextLines ?? preferences.contextLines ?? 3);
  const [granularity, setGranularity] = useState<DiffGranularity>(preferences.granularity ?? "words");
  const [flash, setFlash] = useState<FlashState | null>(null);

  const originalInputRef = useRef<HTMLInputElement | null>(null);
  const modifiedInputRef = useRef<HTMLInputElement | null>(null);

  const originalLines = countLines(original);
  const modifiedLines = countLines(modified);
  const stats = buildStats(original, modified, ignoreWhitespace);
  const isLargeDiff =
    original.length + modified.length > LARGE_DIFF_CHARACTER_LIMIT ||
    originalLines + modifiedLines > LARGE_DIFF_LINE_LIMIT;
  const compareMethod = isLargeDiff ? DiffMethod.LINES : getCompareMethod(granularity, ignoreWhitespace);
  const effectiveShowDiffOnly = isLargeDiff ? true : showDiffOnly;
  const patchText = createPatchText({
    contextLines,
    ignoreWhitespace,
    modified,
    modifiedName,
    original,
    originalName,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: StoredPreferences = {
      contextLines,
      granularity,
      ignoreWhitespace,
      showDiffOnly,
      viewMode,
    };

    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(payload));
  }, [contextLines, granularity, ignoreWhitespace, showDiffOnly, viewMode]);

  useEffect(() => {
    if (!flash) {
      return;
    }

    const timer = window.setTimeout(() => setFlash(null), 1800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  function setNotice(text: string, tone: FlashState["tone"] = "default") {
    setFlash({ text, tone });
  }

  async function handleCopyPatch() {
    try {
      await navigator.clipboard.writeText(patchText);
      setNotice("Patch copied", "success");
    } catch {
      setNotice("Clipboard unavailable", "warning");
    }
  }

  function handleDownloadPatch() {
    const blob = new Blob([patchText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "changes.diff";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Patch downloaded", "success");
  }

  async function handleCopyShareLink() {
    const share = createShareUrl({
      collapseUnchanged: showDiffOnly,
      contextLines,
      ignoreWhitespace,
      modified,
      modifiedName,
      original,
      originalName,
      viewMode,
    });

    try {
      await navigator.clipboard.writeText(share.url);
      setNotice(
        share.copiedText ? "Share link copied" : `Settings link copied; text exceeds ${SHAREABLE_TEXT_LIMIT} chars`,
        share.copiedText ? "success" : "warning",
      );
    } catch {
      setNotice("Clipboard unavailable", "warning");
    }
  }

  function handleLoadSample() {
    startTransition(() => {
      setOriginalName("config/original.json");
      setModifiedName("config/modified.json");
      setOriginal(DIFF_SAMPLE.original);
      setModified(DIFF_SAMPLE.modified);
    });
  }

  function handleSwap() {
    startTransition(() => {
      setOriginal(modified);
      setModified(original);
      setOriginalName(modifiedName);
      setModifiedName(originalName);
    });
  }

  function handleClear() {
    startTransition(() => {
      setOriginal("");
      setModified("");
      setOriginalName("original.txt");
      setModifiedName("modified.txt");
    });
  }

  async function handleFilePicked(side: "original" | "modified", file?: File | null) {
    if (!file) {
      return;
    }

    const text = await file.text();

    startTransition(() => {
      if (side === "original") {
        setOriginal(text);
        setOriginalName(file.name);
        return;
      }

      setModified(text);
      setModifiedName(file.name);
    });
  }

  return (
    <div className="hm-diff-workbench">
      <div className="hm-diff-shell hm-library-diff">
        <div className="hm-diff-toolbar">
          <div className="hm-diff-toolbar__group">
            <div className="hm-diff-toggle" role="group" aria-label="Diff view mode">
              <button
                type="button"
                className={viewMode === "split" ? "is-active" : undefined}
                aria-pressed={viewMode === "split"}
                onClick={() => setViewMode("split")}
              >
                <SplitSquareVertical size={14} />
                Split
              </button>
              <button
                type="button"
                className={viewMode === "unified" ? "is-active" : undefined}
                aria-pressed={viewMode === "unified"}
                onClick={() => setViewMode("unified")}
              >
                <Rows3 size={14} />
                Unified
              </button>
            </div>

            <label className="hm-diff-control">
              <span>Granularity</span>
              <select
                value={granularity}
                onChange={(event) => setGranularity(event.target.value as DiffGranularity)}
                disabled={isLargeDiff}
              >
                {GRANULARITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="hm-diff-checkbox">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(event) => setIgnoreWhitespace(event.target.checked)}
              />
              Ignore whitespace
            </label>

            <label className="hm-diff-checkbox">
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(event) => setShowDiffOnly(event.target.checked)}
                disabled={isLargeDiff}
              />
              Show diff only
            </label>

            <label className="hm-diff-control hm-diff-control--compact">
              <span>Context</span>
              <input
                type="number"
                min="0"
                max="20"
                value={contextLines}
                onChange={(event) => setContextLines(Number(event.target.value) || 0)}
              />
            </label>
          </div>

          <div className="hm-diff-toolbar__group hm-diff-toolbar__group--actions">
            <button type="button" className="hm-diff-action" onClick={() => originalInputRef.current?.click()}>
              <FileUp size={14} />
              Load original
            </button>
            <button type="button" className="hm-diff-action" onClick={() => modifiedInputRef.current?.click()}>
              <FileUp size={14} />
              Load modified
            </button>
            <button type="button" className="hm-diff-action" onClick={handleLoadSample}>
              <FlaskConical size={14} />
              Sample
            </button>
            <button type="button" className="hm-diff-action" onClick={handleSwap}>
              <ArrowLeftRight size={14} />
              Swap
            </button>
            <button type="button" className="hm-diff-action" onClick={handleClear}>
              <Eraser size={14} />
              Clear
            </button>
            <button type="button" className="hm-diff-action hm-diff-action--primary" onClick={handleCopyPatch}>
              {flash?.text === "Patch copied" ? <Check size={14} /> : <Copy size={14} />}
              Copy patch
            </button>
            <button type="button" className="hm-diff-action hm-diff-action--primary" onClick={handleDownloadPatch}>
              <Download size={14} />
              Download
            </button>
            <button type="button" className="hm-diff-action hm-diff-action--primary" onClick={handleCopyShareLink}>
              <Copy size={14} />
              Share link
            </button>
          </div>
        </div>

        <input
          ref={originalInputRef}
          type="file"
          hidden
          onChange={(event) => {
            void handleFilePicked("original", event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <input
          ref={modifiedInputRef}
          type="file"
          hidden
          onChange={(event) => {
            void handleFilePicked("modified", event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <div className="hm-diff-meta">
          <label className="hm-diff-file">
            <span className="hm-diff-file__label">Original</span>
            <input value={originalName} onChange={(event) => setOriginalName(event.target.value)} />
            <span className="hm-diff-file__meta">{originalLines} lines</span>
          </label>

          <label className="hm-diff-file">
            <span className="hm-diff-file__label hm-diff-file__label--modified">Modified</span>
            <input value={modifiedName} onChange={(event) => setModifiedName(event.target.value)} />
            <span className="hm-diff-file__meta">{modifiedLines} lines</span>
          </label>

          <div className="hm-diff-summary">
            <span className={`hm-diff-badge ${stats.changed ? "is-changed" : "is-clean"}`}>
              {stats.changed ? "Changes detected" : "Identical"}
            </span>
            <span className="hm-diff-stat hm-diff-stat--add">+{stats.added}</span>
            <span className="hm-diff-stat hm-diff-stat--remove">-{stats.removed}</span>
            <span className="hm-diff-stat">{stats.unchanged} unchanged</span>
            <span className="hm-diff-stat">Mode: {granularity}</span>
            {sharedState.original || sharedState.modified ? <span className="hm-diff-stat">URL restored</span> : null}
            {isLargeDiff ? <span className="hm-diff-stat hm-diff-stat--warning">large diff safeguards on</span> : null}
            {stats.truncated ? <span className="hm-diff-stat hm-diff-stat--warning">summary capped</span> : null}
          </div>
        </div>

        <div className="hm-diff-editorFrame">
          <div className="hm-diff-editorHeader">
            <div>
              <strong>Library Diff Viewer</strong>
              <span>
                Using a maintained diff component with split or unified review, folded unchanged lines, and word or line diff modes.
              </span>
            </div>
            {flash ? (
              <span className={`hm-diff-flash hm-diff-flash--${flash.tone}`}>
                {flash.text}
              </span>
            ) : null}
          </div>

          <div className="hm-diff-viewerSurface">
            {original || modified ? (
              <ReactDiffViewer
                oldValue={original}
                newValue={modified}
                splitView={viewMode === "split"}
                compareMethod={compareMethod}
                disableWordDiff={isLargeDiff || granularity === "lines"}
                showDiffOnly={effectiveShowDiffOnly}
                extraLinesSurroundingDiff={contextLines}
                hideLineNumbers={false}
                useDarkTheme
                leftTitle={originalName}
                rightTitle={modifiedName}
              />
            ) : (
              <div className="hm-diff-empty">
                Paste text or load files above to compare them.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
