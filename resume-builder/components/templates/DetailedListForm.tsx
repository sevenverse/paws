import { useState } from 'react';
import { DetailedListContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddSectionDialog } from '@/components/AddSectionDialog';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { DetailedListEditor } from '@/components/editors/DetailedListEditor';

interface DetailedListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: DetailedListContent;
    updateContent: (newContent: DetailedListContent) => void;
}

export function DetailedListForm({ title, onTitleChange, content, updateContent }: DetailedListFormProps) {
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
                {content.items.length === 0 ? (
                    <p className="text-slate-400 italic text-sm">No items added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {content.items.map((item, idx) => (
                            <div key={item.id} className={cn(

                                "p-3 rounded-lg border flex flex-col gap-3 group/item transition-all",
                                item.isVisible !== false ? "bg-white border-emerald-200" : "bg-slate-50 border-slate-200 opacity-75 grayscale"
                            )}>
                                <div className="flex justify-between items-start">
                                    <div className={cn(item.isVisible === false && "line-through text-slate-400")}>
                                        <div className={cn("font-medium", item.isVisible !== false ? "text-emerald-900" : "text-slate-500")}>
                                            {item.title || "Untitled"}
                                        </div>
                                        <div className="text-xs text-slate-500">{item.subtitle} | {item.dateFrom} -- {item.dateTo}</div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newItems = [...content.items];
                                            newItems[idx] = { ...item, isVisible: item.isVisible === false ? true : false };
                                            updateContent({ ...content, items: newItems });
                                        }}
                                        className="text-slate-400 hover:text-emerald-600 focus:outline-none transition-colors"
                                        title={item.isVisible !== false ? "Hide Item" : "Show Item"}
                                    >
                                        {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="space-y-1 pl-1">
                                    {item.points.map((point, pIdx) => (
                                        <button
                                            key={pIdx}
                                            onClick={() => {
                                                const newItems = [...content.items];
                                                const newPoints = [...item.points];
                                                newPoints[pIdx] = { ...point, isVisible: point.isVisible === false ? true : false };
                                                newItems[idx] = { ...item, points: newPoints };
                                                updateContent({ ...content, items: newItems });
                                            }}
                                            className={cn(
                                                "px-2 py-1.5 rounded text-xs border flex items-center gap-2 transition-all text-left w-full mb-1",
                                                point.isVisible !== false
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                    : "bg-slate-100 border-slate-200 text-slate-400 line-through opacity-75 hover:bg-slate-200 grayscale"
                                            )}
                                            title={point.isVisible !== false ? "Hide Point" : "Show Point"}
                                        >
                                            {point.isVisible !== false ? <Eye className="h-3 w-3 shrink-0" /> : <EyeOff className="h-3 w-3 shrink-0" />}
                                            <span className="leading-relaxed">{point.text}</span>
                                        </button>
                                    ))}
                                    {item.points.length === 0 && <span className="text-xs text-slate-300 italic">No points added</span>}
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
                    initialType="detailed-list"
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
