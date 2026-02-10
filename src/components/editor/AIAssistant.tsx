import React, { useState } from "react";
import { Sparkles, Zap, Maximize2, MinusCircle, MessageSquare, Search, ChevronsRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIAssistantProps {
    open: boolean;
    onClose: () => void;
    onRun: (action: string, prompt: string) => void;
    hasSelection: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ open, onClose, onRun, hasSelection }) => {
    const [prompt, setPrompt] = useState("");

    const actions = [
        { id: "improve", label: "Improve", icon: <Zap size={14} /> },
        { id: "extend", label: "Extend", icon: <Maximize2 size={14} /> },
        { id: "simplify", label: "Simplify", icon: <MinusCircle size={14} /> },
        { id: "tone", label: "Tone", icon: <MessageSquare size={14} /> },
        { id: "facts", label: "Facts", icon: <Search size={14} /> },
        { id: "continue", label: "Continue", icon: <ChevronsRight size={14} /> },
    ];

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[600px] border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-heading">
                        <Sparkles className="text-primary" size={20} />
                        AI Assistant
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {hasSelection && (
                        <div className="rounded-md bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            Working with selected text
                        </div>
                    )}

                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Custom instruction or context..."
                        className="min-h-[120px] resize-none bg-muted/30"
                    />

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {actions.map((act) => (
                            <Button
                                key={act.id}
                                variant="outline"
                                onClick={() => onRun(act.id, prompt)}
                                className="justify-start gap-2 h-10 text-xs hover:border-primary/50 hover:bg-primary/5 shadow-none"
                            >
                                {act.icon}
                                {act.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={onClose} className="rounded-full">
                            Cancel
                        </Button>
                        <Button onClick={() => onRun("custom", prompt)} className="rounded-full px-8 font-heading">
                            Run
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AIAssistant;
