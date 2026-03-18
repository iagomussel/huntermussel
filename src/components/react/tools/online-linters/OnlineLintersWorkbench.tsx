import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import yaml from "js-yaml";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eraser,
  FileUp,
  Info,
  Wand2,
} from "lucide-react";

type Language = "json" | "yaml" | "javascript" | "markdown";

interface LintMarker {
  severity: number;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  source: string;
}

export default function OnlineLintersWorkbench() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<Language>("json");
  const [markers, setMarkers] = useState<LintMarker[]>([]);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");

  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync theme with document class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "vs-dark" : "light");

    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      setTheme(isDarkNow ? "vs-dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Linting Logic
  const runCustomLint = useCallback(
    (currentCode: string, lang: Language) => {
      if (!monaco || !editorRef.current) return;

      const model = editorRef.current.getModel();
      if (!model) return;

      let newMarkers: any[] = [];

      if (lang === "yaml") {
        try {
          yaml.load(currentCode);
        } catch (e: any) {
          if (e.mark) {
            newMarkers.push({
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: e.mark.line + 1,
              startColumn: e.mark.column + 1,
              endLineNumber: e.mark.line + 1,
              endColumn: e.mark.column + 2,
              message: e.reason || e.message,
              source: "YAML Linter",
            });
          } else {
            newMarkers.push({
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 1,
              message: String(e),
              source: "YAML Linter",
            });
          }
        }
      } else if (lang === "markdown") {
        const lines = currentCode.split(/\r?\n/);
        if (lines.length > 0 && currentCode.trim().length > 0) {
          if (!/^#\s+/.test(lines[0])) {
            newMarkers.push({
              severity: monaco.MarkerSeverity.Warning,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: lines[0].length || 2,
              message: "Missing top-level H1 heading.",
              source: "Markdown Linter",
            });
          }

          let hasLinks = false;
          lines.forEach((line, i) => {
            if (line.length > 140) {
              newMarkers.push({
                severity: monaco.MarkerSeverity.Warning,
                startLineNumber: i + 1,
                startColumn: 141,
                endLineNumber: i + 1,
                endColumn: line.length + 1,
                message: "Line exceeds 140 characters.",
                source: "Markdown Linter",
              });
            }
            if (/\t/.test(line)) {
              const tabIdx = line.indexOf("\t");
              newMarkers.push({
                severity: monaco.MarkerSeverity.Info,
                startLineNumber: i + 1,
                startColumn: tabIdx + 1,
                endLineNumber: i + 1,
                endColumn: tabIdx + 2,
                message: "Tab character found; prefer spaces.",
                source: "Markdown Linter",
              });
            }
            if (/\[.+\]\(.+\)/.test(line)) {
              hasLinks = true;
            }
          });

          if (!hasLinks) {
            newMarkers.push({
              severity: monaco.MarkerSeverity.Info,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 2,
              message: "No markdown links detected in the document.",
              source: "Markdown Linter",
            });
          }
        }
      }

      // Apply custom markers for YAML and Markdown
      if (lang === "yaml" || lang === "markdown") {
        monaco.editor.setModelMarkers(model, "custom-linter", newMarkers);
      }
    },
    [monaco]
  );

  // Re-run linting when code or language changes
  useEffect(() => {
    const timer = setTimeout(() => {
      runCustomLint(code, language);
    }, 500); // debounce
    return () => clearTimeout(timer);
  }, [code, language, runCustomLint]);

  // Hook into Monaco's marker system to read out all errors (including native JSON/JS)
  useEffect(() => {
    if (!monaco) return;

    const disposable = monaco.editor.onDidChangeMarkers(() => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          const currentMarkers = monaco.editor.getModelMarkers({
            resource: model.uri,
          });
          setMarkers(currentMarkers as LintMarker[]);
        }
      }
    });

    return () => disposable.dispose();
  }, [monaco]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    // Initial lint
    runCustomLint(code, language);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setCode(evt.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = ""; // reset
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linted-output.${language === "javascript" ? "js" : language === "markdown" ? "md" : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const focusEditorAt = (line: number, col: number) => {
    if (editorRef.current) {
      editorRef.current.setPosition({ lineNumber: line, column: col });
      editorRef.current.revealPositionInCenter({
        lineNumber: line,
        column: col,
      });
      editorRef.current.focus();
    }
  };

  // Stats
  const errors = markers.filter((m) => m.severity === 8); // Monaco Error Severity
  const warnings = markers.filter((m) => m.severity === 4); // Monaco Warning Severity
  const infos = markers.filter((m) => m.severity === 2 || m.severity === 1); // Info or Hint

  return (
    <div className="linter-workbench flex flex-col w-full border border-[hsl(var(--border))] rounded-lg overflow-hidden bg-[hsl(var(--card))]">
      {/* Toolbar */}
      <div className="toolbar flex flex-wrap items-center justify-between p-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] gap-3">
        <div className="flex items-center gap-3">
          <select
            className="lang-select px-3 py-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-medium cursor-pointer outline-none focus:border-[hsl(var(--primary))]"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="javascript">JavaScript</option>
            <option value="markdown">Markdown</option>
          </select>

          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1"></div>

          <button
            onClick={handleFormat}
            className="tool-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted)/0.8)]"
            title="Format Code"
          >
            <Wand2 size={16} />
            <span className="hidden sm:inline">Format</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="icon-btn p-2 rounded-md hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            title="Upload File"
          >
            <FileUp size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json,.yaml,.yml,.js,.md,.txt"
            onChange={handleFileUpload}
          />

          <button
            onClick={handleDownload}
            disabled={!code}
            className="icon-btn p-2 rounded-md hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Output"
          >
            <Download size={18} />
          </button>

          <button
            onClick={handleCopy}
            disabled={!code}
            className="icon-btn p-2 rounded-md hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>

          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1"></div>

          <button
            onClick={handleClear}
            disabled={!code}
            className="icon-btn p-2 rounded-md hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear Editor"
          >
            <Eraser size={18} />
          </button>
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="editor-container h-[500px] w-full relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme={theme}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-mono, monospace)",
            wordWrap: "on",
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            formatOnPaste: true,
          }}
        />
        {!code && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[hsl(var(--muted-foreground))] font-mono text-sm opacity-60">
            Paste or type {language.toUpperCase()} here to lint...
          </div>
        )}
      </div>

      {/* Status & Problems Panel */}
      <div className="problems-panel flex flex-col border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="panel-header px-4 py-2 border-b border-[hsl(var(--border))] flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.1)]">
          <span>Problems ({markers.length})</span>
          {errors.length > 0 && (
            <span className="flex items-center gap-1 text-red-500">
               <AlertCircle size={14} /> {errors.length}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="flex items-center gap-1 text-yellow-500">
              <AlertTriangle size={14} /> {warnings.length}
            </span>
          )}
          {infos.length > 0 && (
            <span className="flex items-center gap-1 text-blue-500">
              <Info size={14} /> {infos.length}
            </span>
          )}
          {markers.length === 0 && code.trim().length > 0 && (
            <span className="flex items-center gap-1 text-green-500 ml-auto">
              <CheckCircle2 size={14} /> All good
            </span>
          )}
        </div>

        <div className="panel-content overflow-y-auto max-h-[250px] min-h-[100px] bg-[hsl(var(--background)/0.5)]">
          {markers.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[100px] text-[hsl(var(--muted-foreground))] text-sm font-mono">
              {code.trim().length === 0 ? "Waiting for input..." : "No issues found."}
            </div>
          ) : (
            <ul className="flex flex-col m-0 p-0 list-none">
              {markers.map((m, idx) => {
                const isError = m.severity === 8;
                const isWarn = m.severity === 4;
                const icon = isError ? (
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                ) : isWarn ? (
                  <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                ) : (
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                );

                return (
                  <li
                    key={idx}
                    className="group flex gap-3 px-4 py-2.5 border-b border-[hsl(var(--border)/0.5)] last:border-0 hover:bg-[hsl(var(--muted)/0.5)] cursor-pointer transition-colors text-sm"
                    onClick={() => focusEditorAt(m.startLineNumber, m.startColumn)}
                  >
                    {icon}
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="text-[hsl(var(--foreground))] font-medium truncate">
                        {m.message}
                      </span>
                      <span className="text-[hsl(var(--muted-foreground))] text-xs font-mono">
                        [{m.source}] Line {m.startLineNumber}, Col {m.startColumn}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
