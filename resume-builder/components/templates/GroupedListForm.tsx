import { useState } from 'react';
import { GroupedListContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddSectionDialog } from '@/components/AddSectionDialog';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { GroupedListEditor } from '@/components/editors/GroupedListEditor';

interface GroupedListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: GroupedListContent;
    updateContent: (newContent: GroupedListContent) => void;
}

export function GroupedListForm({ title, onTitleChange, content, updateContent }: GroupedListFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    {title}
                </CardTitle>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        className="text-slate-400 hover:text-emerald-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {/* Summary View */}
                {content.groups.length === 0 ? (
                    <p className="text-slate-400 italic text-sm">No categories added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {content.groups.map((group) => (
                            <div key={group.id} className={cn(
                                "p-3 rounded-lg border transition-all space-y-2",
                                group.isVisible !== false ? "bg-white border-emerald-200" : "bg-slate-50 border-slate-200 opacity-75 grayscale"
                            )}>
                                <div className="flex items-center justify-between group/header">
                                    <h4 className={cn(
                                        "font-bold text-sm transition-colors",
                                        group.isVisible !== false ? "text-emerald-700" : "text-slate-400 line-through"
                                    )}>
                                        {group.category}
                                    </h4>
                                    <button
                                        onClick={() => {
                                            const newGroups = content.groups.map(g =>
                                                g.id === group.id ? { ...g, isVisible: g.isVisible === false ? true : false } : g
                                            );
                                            updateContent({ ...content, groups: newGroups });
                                        }}
                                        className="text-slate-400 hover:text-emerald-600 focus:outline-none transition-colors"
                                        title={group.isVisible !== false ? "Hide Category" : "Show Category"}
                                    >
                                        {group.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const newGroups = content.groups.map(g => {
                                                    if (g.id === group.id) {
                                                        const newItems = [...g.items];
                                                        newItems[idx] = { ...item, isVisible: item.isVisible === false ? true : false };
                                                        return { ...g, items: newItems };
                                                    }
                                                    return g;
                                                });
                                                updateContent({ ...content, groups: newGroups });
                                            }}
                                            className={cn(
                                                "px-2 py-1 rounded text-xs border flex items-center gap-1.5 transition-all text-left",
                                                item.isVisible !== false
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                    : "bg-slate-100 border-slate-100 text-slate-400 line-through opacity-70 hover:bg-slate-200 grayscale"
                                            )}
                                            title={item.isVisible !== false ? "Visible" : "Hidden"}
                                        >
                                            <Eye className={cn("h-3 w-3", item.isVisible === false && "hidden")} />
                                            <EyeOff className={cn("h-3 w-3", item.isVisible !== false && "hidden")} />
                                            {item.name}
                                        </button>
                                    ))}
                                    {group.items.length === 0 && <span className="text-xs text-slate-300 italic">No items</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                <AddSectionDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode="edit"
                    initialType="grouped-list"
                    initialTitle={title}
                    initialContent={content}
                    onAdd={(_, __, c) => updateContent(c)}
                >
                    <div />
                </AddSectionDialog>
            </CardContent>
        </Card >
    );
}
