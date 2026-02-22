import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorMainProps {
    title: string;
    subtitle: string;
    body: string;
    onChange: (fields: { title?: string; subtitle?: string; body?: string }) => void;
    onSelectionChange?: (start: number, end: number) => void;
}

const EditorMain: React.FC<EditorMainProps> = ({ title, subtitle, body, onChange, onSelectionChange }) => {
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const subtitleRef = useRef<HTMLTextAreaElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
        if (ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        autoResize(titleRef);
        autoResize(subtitleRef);
        autoResize(bodyRef);
    }, [title, subtitle, body]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-12 hide-scrollbar">
            <div className="mx-auto max-w-3xl space-y-8">
                <textarea
                    ref={titleRef}
                    value={title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Post Title"
                    className="w-full resize-none overflow-hidden bg-transparent font-heading text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/30 md:text-5xl"
                    rows={1}
                />

                <textarea
                    ref={subtitleRef}
                    value={subtitle}
                    onChange={(e) => onChange({ subtitle: e.target.value })}
                    placeholder="Subtitle or summary..."
                    className="w-full resize-none overflow-hidden bg-transparent font-body text-xl text-muted-foreground outline-none placeholder:text-muted-foreground/30"
                    rows={1}
                />

                <div className="relative pt-4">
                    <textarea
                        ref={bodyRef}
                        value={body}
                        onSelect={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            onSelectionChange?.(target.selectionStart, target.selectionEnd);
                        }}
                        onKeyUp={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            onSelectionChange?.(target.selectionStart, target.selectionEnd);
                        }}
                        onMouseDown={(e) => {
                            // Delayed selection check for mouse up/down
                            setTimeout(() => {
                                const target = bodyRef.current;
                                if (target) onSelectionChange?.(target.selectionStart, target.selectionEnd);
                            }, 0);
                        }}
                        onChange={(e) => {
                            const val = e.target.value;
                            const pos = e.target.selectionStart;
                            if (val.slice(pos - 1, pos) === "/") {
                                console.log("Slash menu triggered");
                            }
                            onChange({ body: val });
                            onSelectionChange?.(e.target.selectionStart, e.target.selectionEnd);
                        }}
                        placeholder="Write something... Use '/' for blocks"
                        className="min-h-[60vh] w-full resize-none overflow-hidden bg-transparent font-body text-lg leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground/30"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditorMain;
