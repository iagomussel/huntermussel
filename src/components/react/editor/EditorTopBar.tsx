import React from "react";
import { Brain, Settings, Sparkles, Menu, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorTopBarProps {
    status: "ready" | "saving" | "saved" | "error" | "offline";
    onOpenConfig: () => void;
    onToggleSettings: () => void;
    onOpenAI: () => void;
    onSave: () => void;
    collapsed: boolean;
    onToggleSidebar: () => void;
}

const EditorTopBar: React.FC<EditorTopBarProps> = ({
    status,
    onOpenConfig,
    onToggleSettings,
    onOpenAI,
    onSave,
    collapsed,
    onToggleSidebar,
}) => {
    const statusConfig = {
        ready: { icon: null, text: "Ready", color: "bg-muted" },
        saving: { icon: <Loader2 className="animate-spin" size={12} />, text: "Saving...", color: "bg-amber-500" },
        saved: { icon: <Check size={12} />, text: "Saved", color: "bg-primary" },
        error: { icon: <AlertCircle size={12} />, text: "Error", color: "bg-destructive" },
        offline: { icon: <AlertCircle size={12} />, text: "Offline", color: "bg-muted-foreground" },
    };

    const curStatus = statusConfig[status];

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
                {collapsed && (
                    <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
                        <Menu size={20} />
                    </Button>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={cn("h-2 w-2 rounded-full", curStatus.color)} />
                    <span className="flex items-center gap-1.5">
                        {curStatus.icon}
                        {curStatus.text}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onOpenConfig} title="AI Config">
                    <Brain size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={onToggleSettings} title="Article Settings">
                    <Settings size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={onOpenAI} title="AI Assistant">
                    <Sparkles size={18} />
                </Button>
                <div className="ml-2 h-4 w-px bg-border" />
                <Button onClick={onSave} className="rounded-full px-6 font-heading text-xs uppercase tracking-wider">
                    Save
                </Button>
            </div>
        </header>
    );
};

export default EditorTopBar;
