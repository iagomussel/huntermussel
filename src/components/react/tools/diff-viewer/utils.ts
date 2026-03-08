import { createTwoFilesPatch, diffLines } from "diff";

export const DIFF_SAMPLE = {
  original: `{
  "name": "api-gateway",
  "version": "1.4.2",
  "port": 3000,
  "timeout": 5000,
  "retries": 2,
  "auth": {
    "provider": "jwt",
    "secret": "changeme"
  },
  "rateLimit": {
    "enabled": false,
    "max": 100,
    "window": "1m"
  },
  "logging": {
    "level": "info",
    "format": "text"
  },
  "upstreams": [
    { "name": "users",  "url": "http://users-svc:8080" },
    { "name": "orders", "url": "http://orders-svc:8080" }
  ]
}`,
  modified: `{
  "name": "api-gateway",
  "version": "1.5.0",
  "port": 8080,
  "timeout": 8000,
  "retries": 3,
  "auth": {
    "provider": "oauth2",
    "secret": "changeme",
    "issuer": "https://auth.example.com"
  },
  "rateLimit": {
    "enabled": true,
    "max": 200,
    "window": "1m"
  },
  "logging": {
    "level": "warn",
    "format": "json",
    "destination": "stdout"
  },
  "upstreams": [
    { "name": "users",    "url": "http://users-svc:8080" },
    { "name": "orders",   "url": "http://orders-svc:8080" },
    { "name": "payments", "url": "http://payments-svc:8080" }
  ],
  "healthCheck": {
    "enabled": true,
    "path": "/health",
    "interval": "30s"
  }
}`,
};

export type DiffLanguageMode =
  | "auto"
  | "plaintext"
  | "json"
  | "javascript"
  | "typescript"
  | "html"
  | "css"
  | "markdown"
  | "yaml"
  | "xml"
  | "sql";

export type DiffViewMode = "split" | "unified";

export type DiffStats = {
  added: number;
  removed: number;
  unchanged: number;
  changed: boolean;
  truncated: boolean;
};

export type DiffShareState = {
  collapseUnchanged?: boolean;
  contextLines?: number;
  ignoreWhitespace?: boolean;
  languageMode?: DiffLanguageMode;
  modified?: string;
  modifiedName?: string;
  original?: string;
  originalName?: string;
  viewMode?: DiffViewMode;
  wrapLines?: boolean;
};

export const SHAREABLE_TEXT_LIMIT = 4000;
export const LARGE_DIFF_CHARACTER_LIMIT = 300000;
export const LARGE_DIFF_LINE_LIMIT = 20000;

export const LANGUAGE_OPTIONS: Array<{ value: DiffLanguageMode; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "plaintext", label: "Plain text" },
  { value: "json", label: "JSON" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
];

const EXTENSION_LANGUAGE_MAP: Record<string, DiffLanguageMode> = {
  cjs: "javascript",
  css: "css",
  htm: "html",
  html: "html",
  js: "javascript",
  json: "json",
  jsx: "javascript",
  md: "markdown",
  markdown: "markdown",
  mjs: "javascript",
  sql: "sql",
  svg: "xml",
  ts: "typescript",
  tsx: "typescript",
  txt: "plaintext",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
};

export function countLines(text: string) {
  if (!text) {
    return 0;
  }

  return text.split(/\r\n|\r|\n/).length;
}

export function detectLanguage(
  mode: DiffLanguageMode,
  original: string,
  modified: string,
  originalName: string,
  modifiedName: string,
): DiffLanguageMode {
  if (mode !== "auto") {
    return mode;
  }

  const inferredFromName = inferLanguageFromName(modifiedName) ?? inferLanguageFromName(originalName);
  if (inferredFromName) {
    return inferredFromName;
  }

  const sample = (modified || original).trim();
  if (!sample) {
    return "plaintext";
  }

  if ((sample.startsWith("{") && sample.endsWith("}")) || (sample.startsWith("[") && sample.endsWith("]"))) {
    return "json";
  }

  if (sample.startsWith("---") || sample.includes(":") && /\n[A-Za-z0-9_-]+:\s/.test(sample)) {
    return "yaml";
  }

  if (sample.startsWith("<!DOCTYPE html") || sample.startsWith("<html") || sample.startsWith("<div")) {
    return "html";
  }

  if (sample.startsWith("<") && sample.endsWith(">")) {
    return "xml";
  }

  if (sample.startsWith("# ") || sample.includes("\n## ")) {
    return "markdown";
  }

  if (/\binterface\b|\btype\b|\bimplements\b/.test(sample)) {
    return "typescript";
  }

  if (/\bfunction\b|\bconst\b|\blet\b|\bexport\b/.test(sample)) {
    return "javascript";
  }

  if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(sample)) {
    return "sql";
  }

  return "plaintext";
}

function inferLanguageFromName(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename.trim());
  if (!match) {
    return null;
  }

  return EXTENSION_LANGUAGE_MAP[match[1].toLowerCase()] ?? null;
}

export function buildStats(original: string, modified: string, ignoreWhitespace: boolean): DiffStats {
  const changes = diffLines(original, modified, {
    ignoreWhitespace,
    maxEditLength: 50000,
    oneChangePerToken: true,
    stripTrailingCr: true,
  });

  if (!changes) {
    return {
      added: 0,
      removed: 0,
      unchanged: 0,
      changed: original !== modified,
      truncated: true,
    };
  }

  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const change of changes) {
    const count = change.count ?? countLines(change.value);
    if (change.added) {
      added += count;
      continue;
    }

    if (change.removed) {
      removed += count;
      continue;
    }

    unchanged += count;
  }

  return {
    added,
    removed,
    unchanged,
    changed: added > 0 || removed > 0,
    truncated: false,
  };
}

export function createPatchText(options: {
  contextLines: number;
  ignoreWhitespace: boolean;
  modified: string;
  modifiedName: string;
  original: string;
  originalName: string;
}) {
  return createTwoFilesPatch(
    options.originalName || "original.txt",
    options.modifiedName || "modified.txt",
    options.original,
    options.modified,
    undefined,
    undefined,
    {
      context: options.contextLines,
      ignoreWhitespace: options.ignoreWhitespace,
      stripTrailingCr: true,
    },
  );
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function readShareState(): DiffShareState {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "");

  return {
    collapseUnchanged: params.get("collapse") === "1" ? true : params.get("collapse") === "0" ? false : undefined,
    contextLines: params.get("ctx") ? Number(params.get("ctx")) || 3 : undefined,
    ignoreWhitespace: params.get("ws") === "1" ? true : params.get("ws") === "0" ? false : undefined,
    languageMode: params.get("lang") as DiffLanguageMode | null ?? undefined,
    modified: decodeHashText(hash.get("modified")),
    modifiedName: params.get("modifiedName") ?? undefined,
    original: decodeHashText(hash.get("original")),
    originalName: params.get("originalName") ?? undefined,
    viewMode: params.get("view") as DiffViewMode | null ?? undefined,
    wrapLines: params.get("wrap") === "1" ? true : params.get("wrap") === "0" ? false : undefined,
  };
}

export function createShareUrl(state: DiffShareState) {
  if (typeof window === "undefined") {
    return { copiedText: false, url: "" };
  }

  const url = new URL(window.location.href);
  url.searchParams.set("view", state.viewMode ?? "split");
  url.searchParams.set("lang", state.languageMode ?? "auto");
  url.searchParams.set("ws", state.ignoreWhitespace ? "1" : "0");
  url.searchParams.set("wrap", state.wrapLines ? "1" : "0");
  url.searchParams.set("collapse", state.collapseUnchanged ? "1" : "0");
  url.searchParams.set("ctx", String(state.contextLines ?? 3));

  if (state.originalName) {
    url.searchParams.set("originalName", state.originalName);
  } else {
    url.searchParams.delete("originalName");
  }

  if (state.modifiedName) {
    url.searchParams.set("modifiedName", state.modifiedName);
  } else {
    url.searchParams.delete("modifiedName");
  }

  const combinedLength = (state.original?.length ?? 0) + (state.modified?.length ?? 0);
  if (combinedLength > SHAREABLE_TEXT_LIMIT) {
    url.hash = "";
    return { copiedText: false, url: url.toString() };
  }

  const hash = new URLSearchParams();
  if (state.original) {
    hash.set("original", encodeHashText(state.original));
  }
  if (state.modified) {
    hash.set("modified", encodeHashText(state.modified));
  }

  url.hash = hash.toString();
  return { copiedText: true, url: url.toString() };
}

function encodeHashText(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function decodeHashText(value: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return undefined;
  }
}
