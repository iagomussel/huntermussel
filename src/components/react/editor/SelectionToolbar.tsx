import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionToolbarProps {
    onAskAI: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ onAskAI }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Show toolbar above selection
                setPosition({
                    top: rect.top + window.scrollY - 45,
                    left: rect.left + window.scrollX + rect.width / 2
                });
            } else {
                setPosition(null);
            }
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        return () => document.removeEventListener("selectionchange", handleSelectionChange);
    }, []);

    if (!position) return null;

    return (
        <div
            className="fixed z-50 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-xl animate-in fade-in zoom-in duration-200"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-2 px-3 text-xs font-heading text-primary hover:bg-primary/10"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAskAI();
                }}
            >
                <Sparkles size={14} />
                Ask AI
            </Button>
        </div>
    );
};

export default SelectionToolbar;
