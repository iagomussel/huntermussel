import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorTopBar from "@/components/editor/EditorTopBar";
import EditorMain from "@/components/editor/EditorMain";
import SettingsPanel from "@/components/editor/SettingsPanel";
import AIAssistant from "@/components/editor/AIAssistant";
import ConfigModal, { AIConfig } from "@/components/editor/ConfigModal";
import SelectionToolbar from "@/components/editor/SelectionToolbar";

interface ArticleSummary {
    slug: string;
    title: string;
    date: string;
}

interface Article {
    slug: string;
    frontmatter: {
        title: string;
        subtitle: string;
        date: string;
        status: string;
        description: string;
        tags: string;
        image: string;
    };
    body: string;
}

const API_BASE = "/api";

const defaultAiConfig: AIConfig = {
    active: "anthropic/claude-3-haiku-20240307",
    key: "",
    list: [
        { n: "Claude 3 Haiku", m: "anthropic/claude-3-haiku-20240307" },
        { n: "Claude 3.5 Sonnet", m: "anthropic/claude-3-5-sonnet-20240620" },
        { n: "GPT-4o", m: "openai/gpt-4o" }
    ]
};

const EditorPage: React.FC = () => {
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [curSlug, setCurSlug] = useState<string | null>(null);
    const [status, setStatus] = useState<"ready" | "saving" | "saved" | "error" | "offline">("ready");

    // UI State
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);
    const [aiConfig, setAiConfig] = useState<AIConfig>(defaultAiConfig);
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    // Initial Load
    useEffect(() => {
        loadArticles();
        const saved = localStorage.getItem("blog_ai_config");
        if (saved) setAiConfig(JSON.parse(saved));
    }, []);

    const hasSelection = selection.start !== selection.end;

    const loadArticles = async () => {
        try {
            const res = await fetch(`${API_BASE}/articles`);
            if (res.ok) setArticles(await res.json());
        } catch (e) {
            toast.error("Failed to load articles");
        }
    };

    const loadArticle = async (slug: string) => {
        try {
            const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`);
            if (res.ok) {
                const data = await res.json();
                setCurrentArticle(data);
                setCurSlug(slug);
                setStatus("ready");
                setSelection({ start: 0, end: 0 });
            }
        } catch (e) {
            toast.error("Failed to load article");
        }
    };

    const handleSave = async (auto = false) => {
        if (!currentArticle || !curSlug) return;
        setStatus("saving");
        try {
            const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(curSlug)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentArticle)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("saved");
                if (!auto) toast.success("Article saved successfully");
                if (data.slug && data.slug !== curSlug) {
                    setCurSlug(data.slug);
                    setCurrentArticle({ ...currentArticle, slug: data.slug });
                }
                loadArticles();
            } else {
                setStatus("error");
                toast.error(data.error || "Failed to save");
            }
        } catch (e) {
            setStatus("offline");
            toast.error("Backend unreachable");
        }
    };

    const handleCreate = async () => {
        const title = prompt("Enter article title:");
        if (!title) return;
        try {
            const res = await fetch(`${API_BASE}/articles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title })
            });
            const data = await res.json();
            if (data.slug) {
                loadArticles();
                loadArticle(data.slug);
            }
        } catch (e) {
            toast.error("Failed to create article");
        }
    };

    const handleUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
            const data = await res.json();
            if (data.url && currentArticle) {
                updateMeta({ image: data.url });
                toast.success("Image uploaded");
            }
        } catch (e) {
            toast.error("Upload failed");
        }
    };

    const updateContent = (fields: { title?: string; subtitle?: string; body?: string }) => {
        if (!currentArticle) return;
        const next = { ...currentArticle };
        if (fields.title !== undefined) next.frontmatter.title = fields.title;
        if (fields.subtitle !== undefined) next.frontmatter.subtitle = fields.subtitle;
        if (fields.body !== undefined) next.body = fields.body;
        setCurrentArticle(next);
        setStatus("ready");
    };

    const updateMeta = (meta: any) => {
        if (!currentArticle) return;
        setCurrentArticle({
            ...currentArticle,
            frontmatter: { ...currentArticle.frontmatter, ...meta },
            slug: meta.slug || currentArticle.slug
        });
        setStatus("ready");
    };

    const handleRunAI = async (action: string, instruction: string) => {
        if (!currentArticle) return;

        const isSelected = selection.start !== selection.end;
        const textToProcess = isSelected
            ? currentArticle.body.substring(selection.start, selection.end)
            : currentArticle.body;

        setStatus("saving");
        try {
            const res = await fetch(`${API_BASE}/ai/improve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: textToProcess,
                    context: currentArticle.body,
                    instruction: `${action} ${instruction}`,
                    model: aiConfig.active,
                    api_key: aiConfig.key
                })
            });
            const data = await res.json();
            if (data.text) {
                if (isSelected) {
                    const newBody =
                        currentArticle.body.substring(0, selection.start) +
                        data.text +
                        currentArticle.body.substring(selection.end);
                    updateContent({ body: newBody });
                } else if (action === 'continue') {
                    updateContent({ body: currentArticle.body + "\n\n" + data.text });
                } else {
                    updateContent({ body: data.text });
                }
                setAiOpen(false);
                toast.success("AI updated content");
            } else {
                toast.error(data.error || "AI failed");
            }
        } catch (e) {
            toast.error("AI Error");
        }
    };

    const saveAIConfig = (cfg: AIConfig) => {
        setAiConfig(cfg);
        localStorage.setItem("blog_ai_config", JSON.stringify(cfg));
        setConfigOpen(false);
        toast.success("AI config saved");
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "j") {
                e.preventDefault();
                setAiOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <EditorSidebar
                articles={articles}
                currentSlug={curSlug}
                onSelect={loadArticle}
                onCreate={handleCreate}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <EditorTopBar
                    status={status}
                    onOpenConfig={() => setConfigOpen(true)}
                    onToggleSettings={() => setSettingsOpen(!settingsOpen)}
                    onOpenAI={() => setAiOpen(true)}
                    onSave={() => handleSave()}
                    collapsed={sidebarCollapsed}
                    onToggleSidebar={() => setSidebarCollapsed(false)}
                />

                <div className="flex flex-1 overflow-hidden">
                    <EditorMain
                        title={currentArticle?.frontmatter.title || ""}
                        subtitle={currentArticle?.frontmatter.subtitle || ""}
                        body={currentArticle?.body || ""}
                        onChange={updateContent}
                        onSelectionChange={(start, end) => setSelection({ start, end })}
                    />

                    <SettingsPanel
                        open={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        meta={{
                            slug: currentArticle?.slug || "",
                            date: currentArticle?.frontmatter.date || "",
                            status: currentArticle?.frontmatter.status || "draft",
                            description: currentArticle?.frontmatter.description || "",
                            tags: currentArticle?.frontmatter.tags || "",
                            image: currentArticle?.frontmatter.image || ""
                        }}
                        onChange={updateMeta}
                        onUpload={handleUpload}
                    />
                </div>
            </div>

            <AIAssistant
                open={aiOpen}
                onClose={() => setAiOpen(false)}
                onRun={handleRunAI}
                hasSelection={hasSelection}
            />

            <ConfigModal
                open={configOpen}
                onClose={() => setConfigOpen(false)}
                config={aiConfig}
                onSave={saveAIConfig}
            />

            <SelectionToolbar onAskAI={() => setAiOpen(true)} />
        </div>
    );
};

export default EditorPage;
