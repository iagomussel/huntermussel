import React, { useRef } from "react";
import { X, Upload, Calendar, Link2, Tag, Info, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ArticleMeta {
    slug: string;
    date: string;
    status: string;
    description: string;
    tags: string;
    image: string;
}

interface SettingsPanelProps {
    open: boolean;
    onClose: () => void;
    meta: ArticleMeta;
    onChange: (meta: Partial<ArticleMeta>) => void;
    onUpload: (file: File) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose, meta, onChange, onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <aside
            className={cn(
                "fixed top-0 right-0 bottom-0 z-40 w-80 translate-x-full border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0",
                open ? "translate-x-0" : "translate-x-full md:hidden"
            )}
        >
            <div className="flex items-center justify-between border-b border-border p-5">
                <span className="font-heading text-sm font-bold uppercase tracking-widest">Settings</span>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X size={16} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
                {/* Cover Image */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cover Image</Label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50"
                    >
                        {meta.image ? (
                            <img src={meta.image} alt="Cover" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Upload size={20} />
                                <span className="text-xs">Upload Cover</span>
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <Upload size={24} className="text-primary" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            value={meta.image}
                            onChange={(e) => onChange({ image: e.target.value })}
                            placeholder="/images/blog/..."
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Link2 size={12} /> URL Slug
                    </Label>
                    <Input
                        value={meta.slug}
                        onChange={(e) => onChange({ slug: e.target.value })}
                        className="h-9 text-sm"
                    />
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Calendar size={12} /> Date
                    </Label>
                    <Input
                        type="date"
                        value={meta.date}
                        onChange={(e) => onChange({ date: e.target.value })}
                        className="h-9 text-sm"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Info size={12} /> SEO Description
                    </Label>
                    <Textarea
                        value={meta.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        className="min-h-[100px] resize-none text-sm"
                    />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Tag size={12} /> Tags
                    </Label>
                    <Input
                        value={meta.tags}
                        onChange={(e) => onChange({ tags: e.target.value })}
                        placeholder="tech, ai, devops"
                        className="h-9 text-sm"
                    />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Activity size={12} /> Status
                    </Label>
                    <Select value={meta.status} onValueChange={(val) => onChange({ status: val })}>
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </aside>
    );
};

export default SettingsPanel;
