import { useEffect, useRef, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";

const API_BASE = "/api";

type ArticleSummary = {
  slug: string;
  title: string;
  date: string;
};

type Frontmatter = {
  title: string;
  subtitle: string;
  date: string;
  status: "published" | "draft";
  description: string;
  tags: string;
  image: string;
};

type StatusState = "ready" | "saving" | "saved" | "error";

type AiConfig = {
  active: string;
  key: string;
  list: { n: string; m: string }[];
};

const defaultFrontmatter: Frontmatter = {
  title: "",
  subtitle: "",
  date: "",
  status: "published",
  description: "",
  tags: "",
  image: "",
};

function slugify(value: string) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function App() {
  const editor = useCreateBlockNote();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [slugInput, setSlugInput] = useState("");
  const [frontmatter, setFrontmatter] = useState<Frontmatter>(defaultFrontmatter);
  const [status, setStatus] = useState<StatusState>("ready");
  const [statusText, setStatusText] = useState("Ready");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const [manualSlug, setManualSlug] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiConfig>(() => {
    const stored = localStorage.getItem("blog_ai_v3");
    if (stored) {
      try {
        return JSON.parse(stored) as AiConfig;
      } catch {
        return {
          active: "anthropic/claude-3-haiku-20240307",
          key: "",
          list: [
            { n: "Claude 3 Haiku", m: "anthropic/claude-3-haiku-20240307" },
            { n: "Claude 3.5 Sonnet", m: "anthropic/claude-3-5-sonnet-20240620" },
            { n: "GPT-4o", m: "openai/gpt-4o" },
          ],
        };
      }
    }
    return {
      active: "anthropic/claude-3-haiku-20240307",
      key: "",
      list: [
        { n: "Claude 3 Haiku", m: "anthropic/claude-3-haiku-20240307" },
        { n: "Claude 3.5 Sonnet", m: "anthropic/claude-3-5-sonnet-20240620" },
        { n: "GPT-4o", m: "openai/gpt-4o" },
      ],
    };
  });

  const isHydrating = useRef(false);
  const saveTimer = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("blog_ai_v3");
    if (stored) {
      try {
        setAiConfig(JSON.parse(stored));
      } catch {
        // ignore invalid stored config
      }
    }
  }, []);

  const persistAiConfig = (next: AiConfig) => {
    setAiConfig(next);
    localStorage.setItem("blog_ai_v3", JSON.stringify(next));
  };

  const setStatusState = (state: StatusState, text: string) => {
    setStatus(state);
    setStatusText(text);
  };

  const loadList = async (preferredSlug?: string | null) => {
    const res = await fetch(`${API_BASE}/articles`);
    const data = (await res.json()) as ArticleSummary[];
    setArticles(data);
    if (!currentSlug && data.length > 0) {
      openArticle(preferredSlug ?? data[0].slug);
    }
  };

  const loadMarkdownToEditor = (markdown: string) => {
    isHydrating.current = true;
    // Markdown import can be lossy depending on block support; keep storage format intact.
    const blocks = editor.tryParseMarkdownToBlocks(markdown || "");
    editor.replaceBlocks(editor.document, blocks);
    window.setTimeout(() => {
      isHydrating.current = false;
    }, 0);
  };

  const openArticle = async (slug: string) => {
    const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      setStatusState("error", "Erro ao abrir artigo");
      return;
    }
    const data = await res.json();
    const fm = data.frontmatter || {};
    setCurrentSlug(data.slug);
    setSlugInput(data.slug);
    setFrontmatter({
      title: fm.title || "",
      subtitle: fm.subtitle || "",
      date: fm.date || "",
      status: fm.status || "published",
      description: fm.description || "",
      tags: fm.tags || "",
      image: fm.image || "",
    });
    setManualSlug(false);
    loadMarkdownToEditor(data.body || "");
    setStatusState("saved", "Ready");
    loadList(data.slug);
  };

  const buildPayload = () => {
    // Export to Markdown for existing file storage (lossy for unsupported blocks).
    const body = editor.blocksToMarkdownLossy(editor.document);
    return {
      slug: slugInput,
      frontmatter: {
        title: frontmatter.title,
        subtitle: frontmatter.subtitle,
        date: frontmatter.date,
        status: frontmatter.status,
        description: frontmatter.description,
        tags: frontmatter.tags,
        image: frontmatter.image,
      },
      body,
    };
  };

  const saveArticle = async (showToast = false) => {
    if (!currentSlug) return;
    setStatusState("saving", "Salvando...");
    const payload = buildPayload();
    const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(currentSlug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusState("error", data?.error || "Erro ao salvar");
      return;
    }
    setStatusState("saved", "Salvo");
    if (showToast) {
      alert("Salvo!");
    }
    if (data.slug && data.slug !== currentSlug) {
      setCurrentSlug(data.slug);
      setSlugInput(data.slug);
      setManualSlug(true);
    }
    loadList(data.slug ?? currentSlug);
  };

  const scheduleSave = () => {
    if (isHydrating.current) return;
    setStatusState("saving", "Alterações pendentes");
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      saveArticle(false);
    }, 2000);
  };

  const handleCreate = async () => {
    const title = window.prompt("Title:");
    if (!title) return;
    const res = await fetch(`${API_BASE}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (data.slug) {
      openArticle(data.slug);
    }
  };

  const handleCoverUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok && data.url) {
      setFrontmatter((prev) => ({ ...prev, image: data.url }));
      scheduleSave();
    } else {
      alert(data?.error || "Erro no upload");
    }
  };

  const handleEditorChange = () => {
    if (isHydrating.current) return;
    scheduleSave();
  };

  const updateSelectionStatus = () => {
    try {
      const selection = editor.getSelectionCutBlocks();
      setHasSelection(selection._meta.startPos !== selection._meta.endPos);
    } catch {
      setHasSelection(false);
    }
  };

  const runAi = async (action: string) => {
    const selection = editor.getSelectionCutBlocks();
    const selectionActive = selection._meta.startPos !== selection._meta.endPos;
    const selectionMarkdown = selectionActive
      ? editor.blocksToMarkdownLossy(selection.blocks)
      : "";
    const contextMarkdown = editor.blocksToMarkdownLossy(editor.document);
    const payload = {
      text: selectionActive ? selectionMarkdown : contextMarkdown,
      context: contextMarkdown,
      instruction: `${action} ${aiPrompt}`.trim(),
      model: aiConfig.active,
      api_key: aiConfig.key,
    };

    setStatusState("saving", "IA pensando...");
    const res = await fetch(`${API_BASE}/ai/improve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.text) {
      setStatusState("error", data?.error || "Erro na IA");
      return;
    }

    if (selectionActive) {
      editor.pasteMarkdown(data.text);
    } else if (action === "continue") {
      const blocks = editor.tryParseMarkdownToBlocks(data.text);
      const doc = editor.document;
      const last = doc[doc.length - 1];
      if (last) {
        editor.insertBlocks(blocks, last, "after");
      } else {
        editor.replaceBlocks(doc, blocks);
      }
    } else {
      const blocks = editor.tryParseMarkdownToBlocks(data.text);
      editor.replaceBlocks(editor.document, blocks);
    }

    setStatusState("saved", "IA aplicada");
    setAiOpen(false);
    scheduleSave();
  };

  useEffect(() => {
    loadList(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <div>
            <strong>HunterMussel</strong>
            <span>Editor</span>
          </div>
          <button className="icon-button" onClick={() => setSidebarOpen(false)}>
            ◀
          </button>
        </div>
        <div className="article-list">
          {articles.map((article) => (
            <button
              key={article.slug}
              className={`article-item ${article.slug === currentSlug ? "active" : ""}`}
              onClick={() => openArticle(article.slug)}
            >
              <div className="article-title">{article.title}</div>
              <div className="article-date">{article.date}</div>
            </button>
          ))}
        </div>
        <button className="primary-button" onClick={handleCreate}>
          + Novo artigo
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="status">
            {!sidebarOpen && (
              <button className="icon-button" onClick={() => setSidebarOpen(true)}>
                ☰
              </button>
            )}
            <span className={`status-dot ${status}`} />
            <span>{statusText}</span>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" onClick={() => setAiOpen(true)}>
              IA
            </button>
            <button className="ghost-button" onClick={() => setPanelOpen((prev) => !prev)}>
              Config
            </button>
            <button className="primary-button" onClick={() => saveArticle(true)}>
              Salvar
            </button>
          </div>
        </header>

        <section className="editor-shell">
          <div className="editor-header">
            <input
              className="title-input"
              placeholder="Post Title"
              value={frontmatter.title}
              onChange={(event) => {
                const value = event.target.value;
                setFrontmatter((prev) => ({ ...prev, title: value }));
                if (!manualSlug) {
                  setSlugInput(slugify(value));
                }
                scheduleSave();
              }}
            />
            <input
              className="subtitle-input"
              placeholder="Subtitle or summary..."
              value={frontmatter.subtitle}
              onChange={(event) => {
                setFrontmatter((prev) => ({ ...prev, subtitle: event.target.value }));
                scheduleSave();
              }}
            />
          </div>

          <div className="blocknote-wrapper">
            <BlockNoteView
              editor={editor}
              onChange={handleEditorChange}
              onSelectionChange={updateSelectionStatus}
              theme="light"
            />
          </div>
        </section>
      </main>

      <aside className={`panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-header">
          <strong>Settings</strong>
          <button className="icon-button" onClick={() => setPanelOpen(false)}>
            ✕
          </button>
        </div>
        <div className="panel-body">
          <label className="field">
            <span>Cover Image</span>
            <div
              className="cover-box"
              onClick={() => fileInputRef.current?.click()}
            >
              {frontmatter.image ? (
                <img src={frontmatter.image} alt="cover" />
              ) : (
                <span>Click to upload</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
              hidden
            />
            <input
              className="text-input"
              value={frontmatter.image}
              placeholder="/images/blog/..."
              onChange={(event) => {
                setFrontmatter((prev) => ({ ...prev, image: event.target.value }));
                scheduleSave();
              }}
            />
          </label>
          <label className="field">
            <span>URL Slug</span>
            <input
              className="text-input"
              value={slugInput}
              onChange={(event) => {
                setManualSlug(true);
                setSlugInput(event.target.value);
                scheduleSave();
              }}
            />
          </label>
          <label className="field">
            <span>Date</span>
            <input
              className="text-input"
              type="date"
              value={frontmatter.date}
              onChange={(event) => {
                setFrontmatter((prev) => ({ ...prev, date: event.target.value }));
                scheduleSave();
              }}
            />
          </label>
          <label className="field">
            <span>SEO Description</span>
            <textarea
              className="text-area"
              value={frontmatter.description}
              onChange={(event) => {
                setFrontmatter((prev) => ({ ...prev, description: event.target.value }));
                scheduleSave();
              }}
            />
          </label>
          <label className="field">
            <span>Tags</span>
            <input
              className="text-input"
              value={frontmatter.tags}
              onChange={(event) => {
                setFrontmatter((prev) => ({ ...prev, tags: event.target.value }));
                scheduleSave();
              }}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              className="text-input"
              value={frontmatter.status}
              onChange={(event) => {
                setFrontmatter((prev) => ({
                  ...prev,
                  status: event.target.value === "draft" ? "draft" : "published",
                }));
                scheduleSave();
              }}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>
      </aside>

      {aiOpen && (
        <div className="modal-backdrop" onClick={() => setAiOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>AI Assistant</h3>
              {hasSelection && <span className="pill">Selection active</span>}
            </div>
            <textarea
              className="text-area"
              placeholder="Prompt..."
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
            />
            <div className="ai-grid">
              <button onClick={() => runAi("improve")}>Improve</button>
              <button onClick={() => runAi("extend")}>Extend</button>
              <button onClick={() => runAi("simplify")}>Simplify</button>
              <button onClick={() => runAi("tone")}>Tone</button>
              <button onClick={() => runAi("facts")}>Facts</button>
              <button onClick={() => runAi("continue")}>Continue</button>
            </div>
            <div className="field">
              <span>Active Model</span>
              <select
                className="text-input"
                value={aiConfig.active}
                onChange={(event) =>
                  persistAiConfig({ ...aiConfig, active: event.target.value })
                }
              >
                {aiConfig.list.map((provider) => (
                  <option key={provider.m} value={provider.m}>
                    {provider.n}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <span>API Key</span>
              <input
                className="text-input"
                type="password"
                value={aiConfig.key}
                onChange={(event) =>
                  persistAiConfig({ ...aiConfig, key: event.target.value })
                }
              />
            </div>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setAiOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={() => runAi("custom")}>
                Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
