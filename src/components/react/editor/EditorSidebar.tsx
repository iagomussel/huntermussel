import React from "react";
import { Plus, ChevronsLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleSummary {
    slug: string;
    title: string;
    date: string;
}

interface EditorSidebarProps {
    articles: ArticleSummary[];
    currentSlug: string | null;
    onSelect: (slug: string) => void;
    onCreate: () => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    articles,
    currentSlug,
    onSelect,
    onCreate,
    collapsed,
    setCollapsed,
}) => {
    return (
        <aside
            className={cn(
                "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
                collapsed ? "w-0 overflow-hidden" : "w-72"
            )}
        >
            <div className="flex items-center justify-between border-b border-border p-5">
                <span className="font-heading text-lg font-bold">HunterEditor</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(true)}
                    className="h-8 w-8"
                >
                    <ChevronsLeft size={16} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 hide-scrollbar">
                <div className="space-y-1">
                    {articles.map((art) => (
                        <button
                            key={art.slug}
                            onClick={() => onSelect(art.slug)}
                            className={cn(
                                "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                                art.slug === currentSlug
                                    ? "bg-primary/10 font-medium text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <div className="truncate font-medium">{art.title}</div>
                            <div className="mt-0.5 text-[10px] opacity-60">
                                {art.date || "No date"}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4">
                <Button
                    onClick={onCreate}
                    className="w-full justify-start gap-2 rounded-full font-heading"
                >
                    <Plus size={16} />
                    New Article
                </Button>
            </div>
        </aside>
    );
};

export default EditorSidebar;
