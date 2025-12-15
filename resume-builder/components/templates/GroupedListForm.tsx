import { useState } from 'react';
import { GroupedListContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';
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
                    <EditableSectionTitle value={title} onChange={onTitleChange} />
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
                            <div key={group.id} className="space-y-2">
                                <h4 className="font-bold text-sm text-emerald-700">{group.category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((item, idx) => (
                                        <span key={idx} className={cn(
                                            "px-2 py-1 rounded text-xs border",
                                            item.isVisible !== false
                                                ? "bg-slate-50 border-slate-200 text-slate-600"
                                                : "bg-slate-100 border-slate-100 text-slate-400 line-through opacity-70"
                                        )}>
                                            {item.name}
                                        </span>
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
