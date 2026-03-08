import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import { DiffEditor, loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { Layout, PanelImperativeHandle } from "react-resizable-panels";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eraser,
  Eye,
  EyeOff,
  FileUp,
  FlaskConical,
  Focus,
  Rows3,
  Sidebar,
  SplitSquareVertical,
  WrapText,
} from "lucide-react";

import "@/styles/diff-workbench.css";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/react/ui/resizable";
import {
  DIFF_SAMPLE,
  LANGUAGE_OPTIONS,
  buildStats,
  countLines,
  createPatchText,
  detectLanguage,
  downloadTextFile,
  type DiffLanguageMode,
  type DiffViewMode,
} from "./utils";

type FlashState = {
  tone: "default" | "success" | "warning";
  text: string;
};

type StoredPreferences = {
  collapseUnchanged?: boolean;
  compactLayout?: Layout;
  contextLines?: number;
  desktopLayout?: Layout;
  ignoreWhitespace?: boolean;
  inspectorOpen?: boolean;
  languageMode?: DiffLanguageMode;
  viewMode?: DiffViewMode;
  wrapLines?: boolean;
};

const PREFERENCES_KEY = "hm.diff-viewer.preferences.v3";
const DESKTOP_LAYOUT: Layout = { editor: 74, inspector: 26 };
const COMPACT_LAYOUT: Layout = { editor: 72, inspector: 28 };

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export default function DiffWorkbench() {
  const preferences = readPreferences();
  const isCompact = useMediaQuery("(max-width: 960px)");

  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [originalName, setOriginalName] = useState("original.json");
  const [modifiedName, setModifiedName] = useState("modified.json");
  const [viewMode, setViewMode] = useState<DiffViewMode>(preferences.viewMode ?? "split");
  const [languageMode, setLanguageMode] = useState<DiffLanguageMode>(preferences.languageMode ?? "auto");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(preferences.ignoreWhitespace ?? false);
  const [collapseUnchanged, setCollapseUnchanged] = useState(preferences.collapseUnchanged ?? true);
  const [wrapLines, setWrapLines] = useState(preferences.wrapLines ?? false);
  const [contextLines, setContextLines] = useState(preferences.contextLines ?? 3);
  const [inspectorOpen, setInspectorOpen] = useState(preferences.inspectorOpen ?? true);
  const [desktopLayout, setDesktopLayout] = useState<Layout>(preferences.desktopLayout ?? DESKTOP_LAYOUT);
  const [compactLayout, setCompactLayout] = useState<Layout>(preferences.compactLayout ?? COMPACT_LAYOUT);
  const [monacoReady, setMonacoReady] = useState(false);
  const [flash, setFlash] = useState<FlashState | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [activeChange, setActiveChange] = useState(0);

  const deferredOriginal = useDeferredValue(original);
  const deferredModified = useDeferredValue(modified);

  const originalInputRef = useRef<HTMLInputElement | null>(null);
  const modifiedInputRef = useRef<HTMLInputElement | null>(null);
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const inspectorPanelRef = useRef<PanelImperativeHandle | null>(null);
  const originalSubscriptionRef = useRef<editor.IDisposable | null>(null);
  const modifiedSubscriptionRef = useRef<editor.IDisposable | null>(null);
  const diffSubscriptionRef = useRef<editor.IDisposable | null>(null);

  const resolvedLanguage = detectLanguage(
    languageMode,
    deferredOriginal,
    deferredModified,
    originalName,
    modifiedName,
  );
  const stats = buildStats(deferredOriginal, deferredModified, ignoreWhitespace);
  const originalLines = countLines(original);
  const modifiedLines = countLines(modified);
  const effectiveViewMode = isCompact ? "unified" : viewMode;
  const patchText = createPatchText({
    contextLines,
    ignoreWhitespace,
    modified,
    modifiedName,
    original,
    originalName,
  });
  const patchPreview = patchText.split("\n").slice(0, 18).join("\n");

  useEffect(() => {
    let cancelled = false;

    async function setupMonaco() {
      const monaco = await import("monaco-editor");
      loader.config({ monaco });

      if (!cancelled) {
        setMonacoReady(true);
      }
    }

    void setupMonaco();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: StoredPreferences = {
      collapseUnchanged,
      compactLayout,
      contextLines,
      desktopLayout,
      ignoreWhitespace,
      inspectorOpen,
      languageMode,
      viewMode,
      wrapLines,
    };

    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(payload));
  }, [
    collapseUnchanged,
    compactLayout,
    contextLines,
    desktopLayout,
    ignoreWhitespace,
    inspectorOpen,
    languageMode,
    viewMode,
    wrapLines,
  ]);

  useEffect(() => {
    if (!flash) {
      return;
    }

    const timer = window.setTimeout(() => setFlash(null), 1800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  useEffect(() => {
    return () => {
      originalSubscriptionRef.current?.dispose();
      modifiedSubscriptionRef.current?.dispose();
      diffSubscriptionRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const panel = inspectorPanelRef.current;
    if (!panel) {
      return;
    }

    if (inspectorOpen) {
      panel.expand();
      return;
    }

    panel.collapse();
  }, [inspectorOpen, isCompact]);

  function setNotice(text: string, tone: FlashState["tone"] = "default") {
    setFlash({ text, tone });
  }

  function syncDiffState(instance: editor.IStandaloneDiffEditor) {
    const changes = instance.getLineChanges() ?? [];
    setChangeCount(changes.length);
    setActiveChange((current) => {
      if (!changes.length) {
        return 0;
      }

      return current > 0 ? Math.min(current, changes.length) : 1;
    });
  }

  function handleBeforeMount(monaco: typeof import("monaco-editor")) {
    monaco.editor.defineTheme("huntermussel-diff", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "dce6f3", background: "0b1117" },
        { token: "string", foreground: "b9f6ca" },
        { token: "number", foreground: "7dd3fc" },
        { token: "keyword", foreground: "8cc8ff" },
      ],
      colors: {
        "diffEditor.insertedLineBackground": "#0f2f1d88",
        "diffEditor.insertedTextBackground": "#177f3f55",
        "diffEditor.removedLineBackground": "#3b141788",
        "diffEditor.removedTextBackground": "#a53b4355",
        "diffEditor.diagonalFill": "#111827",
        "diffEditor.border": "#243041",
        "editor.background": "#0b1117",
        "editor.foreground": "#dce6f3",
        "editor.lineHighlightBackground": "#101a24",
        "editorLineNumber.foreground": "#516173",
        "editorLineNumber.activeForeground": "#dce6f3",
        "editorGutter.background": "#0b1117",
        "editor.selectionBackground": "#155e754d",
        "editor.inactiveSelectionBackground": "#12324666",
      },
    });
  }

  function handleEditorMount(instance: editor.IStandaloneDiffEditor) {
    diffEditorRef.current = instance;

    originalSubscriptionRef.current?.dispose();
    modifiedSubscriptionRef.current?.dispose();
    diffSubscriptionRef.current?.dispose();

    const originalEditor = instance.getOriginalEditor();
    const modifiedEditor = instance.getModifiedEditor();

    originalSubscriptionRef.current = originalEditor.onDidChangeModelContent(() => {
      const next = originalEditor.getModel()?.getValue() ?? "";
      setOriginal((current) => (current === next ? current : next));
    });

    modifiedSubscriptionRef.current = modifiedEditor.onDidChangeModelContent(() => {
      const next = modifiedEditor.getModel()?.getValue() ?? "";
      setModified((current) => (current === next ? current : next));
    });

    diffSubscriptionRef.current = instance.onDidUpdateDiff(() => {
      syncDiffState(instance);
    });

    void instance.revealFirstDiff();
    syncDiffState(instance);
    modifiedEditor.focus();
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
    downloadTextFile("changes.diff", patchText);
    setNotice("Patch downloaded", "success");
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

  function handleFocusEditor(side: "original" | "modified") {
    const instance = diffEditorRef.current;
    if (!instance) {
      return;
    }

    if (side === "original") {
      instance.getOriginalEditor().focus();
      return;
    }

    instance.getModifiedEditor().focus();
  }

  function handleRevealFirstDiff() {
    const instance = diffEditorRef.current;
    if (!instance || !changeCount) {
      return;
    }

    void instance.revealFirstDiff();
    setActiveChange(1);
  }

  function handleGoToDiff(target: "previous" | "next") {
    const instance = diffEditorRef.current;
    if (!instance || !changeCount) {
      return;
    }

    instance.goToDiff(target);
    setActiveChange((current) => {
      if (!current) {
        return target === "next" ? 1 : changeCount;
      }

      if (target === "next") {
        return current >= changeCount ? 1 : current + 1;
      }

      return current <= 1 ? changeCount : current - 1;
    });
  }

  function toggleInspector() {
    setInspectorOpen((current) => !current);
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
      <div className="hm-diff-shell">
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
              <span>Language</span>
              <select
                value={languageMode}
                onChange={(event) => setLanguageMode(event.target.value as DiffLanguageMode)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
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
                checked={collapseUnchanged}
                onChange={(event) => setCollapseUnchanged(event.target.checked)}
              />
              Collapse unchanged
            </label>

            <label className="hm-diff-checkbox">
              <input
                type="checkbox"
                checked={wrapLines}
                onChange={(event) => setWrapLines(event.target.checked)}
              />
              <WrapText size={14} />
              Wrap lines
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
            <button type="button" className="hm-diff-action" onClick={toggleInspector}>
              <Sidebar size={14} />
              {inspectorOpen ? "Hide review" : "Show review"}
            </button>
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
            <span className="hm-diff-stat">Mode: {resolvedLanguage}</span>
            <span className="hm-diff-stat">Diffs: {changeCount}</span>
            {isCompact ? <span className="hm-diff-stat hm-diff-stat--warning">compact inline review</span> : null}
            {stats.truncated ? <span className="hm-diff-stat hm-diff-stat--warning">summary capped</span> : null}
          </div>
        </div>

        <div className="hm-diff-layout">
          <ResizablePanelGroup
            key={isCompact ? "compact" : "desktop"}
            direction={isCompact ? "vertical" : "horizontal"}
            autoSaveId={undefined}
            onLayout={(layout) => {
              if (isCompact) {
                setCompactLayout(layout);
                return;
              }

              setDesktopLayout(layout);
            }}
          >
            <ResizablePanel
              id="editor"
              defaultSize={(isCompact ? compactLayout : desktopLayout).editor}
              minSize={isCompact ? 48 : 56}
            >
              <div className="hm-diff-editorFrame">
                <div className="hm-diff-editorHeader">
                  <div>
                    <strong>Editor diff</strong>
                    <span>
                      Both panes are editable. Paste directly into either side or load files above.
                    </span>
                  </div>
                  <div className="hm-diff-headerTools">
                    <button type="button" className="hm-diff-miniAction" onClick={() => handleFocusEditor("original")}>
                      Focus original
                    </button>
                    <button type="button" className="hm-diff-miniAction" onClick={() => handleFocusEditor("modified")}>
                      Focus modified
                    </button>
                    {flash ? (
                      <span className={`hm-diff-flash hm-diff-flash--${flash.tone}`}>
                        {flash.text}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="hm-diff-editorBody">
                  {monacoReady ? (
                    <DiffEditor
                      original={original}
                      modified={modified}
                      language={resolvedLanguage}
                      theme="huntermussel-diff"
                      beforeMount={handleBeforeMount}
                      onMount={handleEditorMount}
                      loading={<div className="hm-diff-loading">Loading diff editor…</div>}
                      options={{
                        automaticLayout: true,
                        codeLens: false,
                        compactMode: true,
                        diffCodeLens: false,
                        diffWordWrap: wrapLines ? "on" : "off",
                        enableSplitViewResizing: true,
                        glyphMargin: false,
                        hideUnchangedRegions: {
                          contextLineCount: contextLines,
                          enabled: collapseUnchanged && effectiveViewMode === "unified",
                          minimumLineCount: 2,
                          revealLineCount: Math.max(1, contextLines),
                        },
                        ignoreTrimWhitespace: ignoreWhitespace,
                        lineDecorationsWidth: 8,
                        lineNumbers: "on",
                        maxComputationTime: 4000,
                        maxFileSize: 20,
                        minimap: { enabled: false },
                        originalEditable: true,
                        readOnly: false,
                        renderGutterMenu: false,
                        renderIndicators: true,
                        renderMarginRevertIcon: false,
                        renderOverviewRuler: true,
                        renderSideBySide: effectiveViewMode === "split",
                        renderSideBySideInlineBreakpoint: 960,
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        splitViewDefaultRatio: 0.5,
                        useInlineViewWhenSpaceIsLimited: true,
                        wordWrap: wrapLines ? "on" : "off",
                      }}
                    />
                  ) : (
                    <div className="hm-diff-loading">Preparing Monaco…</div>
                  )}
                </div>

                <div className="hm-diff-statusbar">
                  <span>{originalName}</span>
                  <span>{modifiedName}</span>
                  <span>{effectiveViewMode === "split" ? "side by side" : "inline review"}</span>
                  <span>{changeCount ? `change ${activeChange}/${changeCount}` : "no diff chunks"}</span>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="hm-diff-resizeHandle" />

            <ResizablePanel
              id="inspector"
              panelRef={inspectorPanelRef}
              collapsible
              collapsedSize={0}
              defaultSize={(isCompact ? compactLayout : desktopLayout).inspector}
              minSize={isCompact ? 20 : 18}
              maxSize={isCompact ? 52 : 40}
            >
              <aside className={`hm-diff-inspector ${inspectorOpen ? "" : "is-collapsed"}`}>
                <div className="hm-diff-inspectorSection">
                  <div className="hm-diff-inspectorSection__header">
                    <strong>Review</strong>
                    <button type="button" className="hm-diff-miniAction" onClick={toggleInspector}>
                      {inspectorOpen ? <EyeOff size={14} /> : <Eye size={14} />}
                      {inspectorOpen ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="hm-diff-nav">
                    <button type="button" className="hm-diff-miniAction" onClick={() => handleGoToDiff("previous")}>
                      <ChevronUp size={14} />
                      Previous
                    </button>
                    <button type="button" className="hm-diff-miniAction" onClick={() => handleGoToDiff("next")}>
                      <ChevronDown size={14} />
                      Next
                    </button>
                    <button type="button" className="hm-diff-miniAction" onClick={handleRevealFirstDiff}>
                      <Focus size={14} />
                      First diff
                    </button>
                  </div>

                  <div className="hm-diff-kpis">
                    <article>
                      <span>Focused</span>
                      <strong>{changeCount ? `${activeChange}/${changeCount}` : "0/0"}</strong>
                    </article>
                    <article>
                      <span>Lines</span>
                      <strong>{originalLines}/{modifiedLines}</strong>
                    </article>
                    <article>
                      <span>Patch</span>
                      <strong>{patchText.split("\n").length} lines</strong>
                    </article>
                    <article>
                      <span>View</span>
                      <strong>{effectiveViewMode}</strong>
                    </article>
                  </div>
                </div>

                <div className="hm-diff-inspectorSection">
                  <div className="hm-diff-inspectorSection__header">
                    <strong>Files</strong>
                    <span>{resolvedLanguage}</span>
                  </div>
                  <dl className="hm-diff-fileList">
                    <div>
                      <dt>Original</dt>
                      <dd>{originalName}</dd>
                    </div>
                    <div>
                      <dt>Modified</dt>
                      <dd>{modifiedName}</dd>
                    </div>
                    <div>
                      <dt>Whitespace</dt>
                      <dd>{ignoreWhitespace ? "ignored" : "strict"}</dd>
                    </div>
                    <div>
                      <dt>Unchanged</dt>
                      <dd>{collapseUnchanged ? `collapsed (${contextLines})` : "expanded"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="hm-diff-inspectorSection">
                  <div className="hm-diff-inspectorSection__header">
                    <strong>Patch preview</strong>
                    <span>{stats.changed ? "unified diff" : "no changes"}</span>
                  </div>
                  <pre className="hm-diff-patchPreview">{patchPreview}</pre>
                </div>
              </aside>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
