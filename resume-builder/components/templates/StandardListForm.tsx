import { useState } from 'react';
import { StandardListContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
                {/* Summary View - Show just a list of titles/subtitles */}
                {content.items.length === 0 ? (
                    <p className="text-slate-400 italic text-sm">No items added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {content.items.map((item, idx) => (
                            <div key={item.id} className={cn(

                                "p-3 rounded-lg border flex flex-col gap-2 group/item transition-all",
                                item.isVisible !== false ? "bg-white border-emerald-200" : "bg-slate-50 border-slate-200 opacity-75 grayscale"
                            )}>
                                <div className="flex justify-between items-start">
                                    <div className={cn(item.isVisible === false && "line-through text-slate-400")}>
                                        <div className={cn("font-medium", item.isVisible !== false ? "text-emerald-900" : "text-slate-500")}>
                                            {item.title || "Untitled"}
                                        </div>
                                        <div className="text-xs text-slate-500">{item.subtitle}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("text-xs italic", item.isVisible !== false ? "text-slate-500" : "text-slate-400")}>
                                            {item.dateFrom} - {item.dateTo}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newItems = [...content.items];
                                                newItems[idx] = { ...item, isVisible: item.isVisible === false ? true : false };
                                                updateContent({ ...content, items: newItems });
                                            }}
                                            className={cn(
                                                "focus:outline-none transition-colors",
                                                item.isVisible !== false ? "text-slate-400 hover:text-emerald-600" : "text-slate-400"
                                            )}
                                            title={item.isVisible !== false ? "Hide Item" : "Show Item"}
                                        >
                                            {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {item.description && (
                                    <div className="flex items-start gap-2 pt-1 border-t border-slate-100/50 mt-1">
                                        {/* No specific toggle for description in standard list for now, usually it's part of the item */}
                                        {/* But user asked for hiding "sections/descriptions/sub-items" */}
                                        {/* Let's treat description as part of the item, but if they strictly want to hide description only? */}
                                        {/* StandardListContent Item doesn't have isDescriptionVisible flag. I'll just show it. If item is hidden, descriptions is hidden. */}
                                        <p className={cn("text-xs leading-relaxed", item.isVisible !== false ? "text-slate-600" : "text-slate-400")}>
                                            {item.description}
                                        </p>
                                    </div>
                                )}
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
