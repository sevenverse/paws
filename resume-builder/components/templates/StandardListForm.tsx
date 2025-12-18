import { useState } from 'react';
import { StandardListContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';
import { AddSectionDialog } from '@/components/AddSectionDialog';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { StandardListEditor } from '@/components/editors/StandardListEditor';

interface StandardListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: StandardListContent;
    updateContent: (newContent: StandardListContent) => void;
}

export function StandardListForm({ title, onTitleChange, content, updateContent }: StandardListFormProps) {
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
                {/* Summary View - Show just a list of titles/subtitles */}
                {content.items.length === 0 ? (
                    <p className="text-slate-400 italic text-sm">No items added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {content.items.map((item) => (
                            <div key={item.id} className={cn(
                                "p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex justify-between items-center group/item",
                                item.isVisible === false && "opacity-50 grayscale"
                            )}>
                                <div>
                                    <div className="font-medium text-emerald-900">{item.title || "Untitled"}</div>
                                    <div className="text-xs text-slate-500">{item.subtitle}</div>
                                </div>
                                <div className="text-xs text-slate-400 italic">
                                    {item.dateFrom} - {item.dateTo}
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
                    initialType="standard-list"
                    initialTitle={title}
                    initialContent={content}
                    onAdd={(_, __, c) => updateContent(c)}
                >
                    <div />
                </AddSectionDialog>
            </CardContent>
        </Card>
    );
}
