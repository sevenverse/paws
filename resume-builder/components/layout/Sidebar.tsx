import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, X, PanelLeftClose } from "lucide-react";
import { Template } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
    templates: Template[];
    currentTemplateId: string | null;
    isOpen: boolean;
    onSelectTemplate: (template: Template) => void;
    onNewTemplate: () => void;
    onDeleteTemplate: (id: string, e: React.MouseEvent) => void;
    onClose: () => void;
}

export function Sidebar({
    templates,
    currentTemplateId,
    isOpen,
    onSelectTemplate,
    onNewTemplate,
    onDeleteTemplate,
    onClose
}: SidebarProps) {
    return (
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
                {/* Sidebar Logo */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-slate-800 tracking-tight">paws<span className="text-emerald-500">.</span></span>
                </div>
                {/* Close Button - Always visible now to allow closing if Header button is covered */}
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 -mr-2">
                    <PanelLeftClose className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6">
                <Button onClick={onNewTemplate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200">
                    <Plus className="mr-2 h-4 w-4" /> New Resume
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">My Resumes</h3>
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className={cn(
                            "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                            currentTemplateId === template.id
                                ? "bg-emerald-50 text-emerald-900 border border-emerald-100"
                                : "hover:bg-slate-50 text-slate-600 border border-transparent"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className={cn("h-4 w-4 flex-shrink-0", currentTemplateId === template.id ? "text-emerald-500" : "text-slate-400")} />
                            <div className="truncate font-medium text-sm">{template.name}</div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id, e); }}
                            className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 p-1.5 rounded-md transition-all"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="text-center py-10 px-4 text-slate-400 text-sm">
                        No templates found.
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center flex-shrink-0">
                v2.1.1
            </div>
        </div>
    );
}
