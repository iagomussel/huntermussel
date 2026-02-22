import React, { useState } from "react";
import { Brain, Trash2, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AIProvider {
    n: string;
    m: string;
}

export interface AIConfig {
    active: string;
    key: string;
    list: AIProvider[];
}

interface ConfigModalProps {
    open: boolean;
    onClose: () => void;
    config: AIConfig;
    onSave: (config: AIConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ open, onClose, config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<AIConfig>(config);
    const [newName, setNewName] = useState("");
    const [newModel, setNewModel] = useState("");

    const handleAdd = () => {
        if (newName && newModel) {
            setLocalConfig({
                ...localConfig,
                list: [...localConfig.list, { n: newName, m: newModel }]
            });
            setNewName("");
            setNewModel("");
        }
    };

    const handleRemove = (index: number) => {
        const newList = [...localConfig.list];
        newList.splice(index, 1);
        setLocalConfig({ ...localConfig, list: newList });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[500px] border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-heading">
                        <Brain className="text-primary" size={20} />
                        AI Configuration
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Model</Label>
                            <Select
                                value={localConfig.active}
                                onValueChange={(val) => setLocalConfig({ ...localConfig, active: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {localConfig.list.map(p => (
                                        <SelectItem key={p.m} value={p.m}>{p.n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">API Key</Label>
                            <Input
                                type="password"
                                value={localConfig.key}
                                onChange={(e) => setLocalConfig({ ...localConfig, key: e.target.value })}
                                placeholder="sk-..."
                                className="bg-muted/30"
                            />
                        </div>

                        <Button
                            className="w-full rounded-full"
                            onClick={() => onSave(localConfig)}
                        >
                            Save & Use
                        </Button>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Manage Providers</Label>

                        <div className="rounded-md border border-border bg-muted/20 overflow-hidden divide-y divide-border">
                            {localConfig.list.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{p.n}</span>
                                        <span className="text-[10px] text-muted-foreground">{p.m}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(i)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="h-9 text-xs"
                            />
                            <Input
                                placeholder="Model ID"
                                value={newModel}
                                onChange={(e) => setNewModel(e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full gap-2 text-xs"
                            onClick={handleAdd}
                        >
                            <Plus size={14} /> Add Provider
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfigModal;
