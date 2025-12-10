import { useState } from 'react';
import { DetailedListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, PlusCircle, Pencil, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';

interface DetailedListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: DetailedListContent;
    updateContent: (newContent: DetailedListContent) => void;
}

export function DetailedListForm({ title, onTitleChange, content, updateContent }: DetailedListFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    const updateItems = (newItems: DetailedListContent['items']) => {
        updateContent({ ...content, items: newItems });
    };

    const handleChange = (index: number, field: keyof DetailedListContent['items'][0], value: any) => {
        const newItems = [...content.items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateItems(newItems);
    };

    const handlePointChange = (itemIndex: number, pointIndex: number, value: string) => {
        const newItems = [...content.items];
        newItems[itemIndex].points[pointIndex].text = value;
        updateItems(newItems);
    };

    const togglePointVisibility = (itemIndex: number, pointIndex: number) => {
        const newItems = [...content.items];
        newItems[itemIndex].points[pointIndex].isVisible = !newItems[itemIndex].points[pointIndex].isVisible;
        updateItems(newItems);
    };

    const addPoint = (itemIndex: number) => {
        const newItems = [...content.items];
        newItems[itemIndex].points.push({ text: '', isVisible: true });
        updateItems(newItems);
    };

    const removePoint = (itemIndex: number, pointIndex: number) => {
        const newItems = [...content.items];
        newItems[itemIndex].points = newItems[itemIndex].points.filter((_, i) => i !== pointIndex);
        updateItems(newItems);
    };

    const addItem = () => {
        updateItems([
            ...content.items,
            {
                id: crypto.randomUUID(),
                title: '',
                subtitle: '',
                location: '',
                date: '',
                points: [{ text: '', isVisible: true }],
                isVisible: true
            },
        ]);
    };

    const removeItem = (index: number) => {
        updateItems(content.items.filter((_, i) => i !== index));
    };

    const toggleItemVisibility = (index: number) => {
        const newItems = [...content.items];
        newItems[index].isVisible = !newItems[index].isVisible;
        updateItems(newItems);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    <EditableSectionTitle value={title} onChange={onTitleChange} />
                </CardTitle>
                <div className="flex gap-2">
                    {isEditing && (
                        <Button variant="outline" size="sm" onClick={addItem}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-slate-400 hover:text-emerald-600"
                    >
                        {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {content.items.map((item, index) => (
                    <div
                        key={item.id}
                        className={cn(
                            "transition-all duration-200 ease-in-out",
                            isEditing
                                ? "relative space-y-4 rounded-lg border p-4 bg-white"
                                : cn(
                                    "rounded-xl border-2 p-5 mb-4 last:mb-0 relative group/item",
                                    item.isVisible !== false
                                        ? "border-emerald-500 bg-white shadow-sm"
                                        : "border-slate-200 bg-slate-50/50"
                                )
                        )}
                    >
                        {isEditing ? (
                            <>
                                <div className="absolute right-2 top-2 flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-red-100 hover:text-red-600"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 pr-16">
                                    <div className="space-y-1">
                                        <Label>Title (e.g. Company, Project)</Label>
                                        <Input value={item.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Subtitle (e.g. Role, Tech)</Label>
                                        <Input value={item.subtitle} onChange={(e) => handleChange(index, 'subtitle', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Location</Label>
                                        <Input value={item.location} onChange={(e) => handleChange(index, 'location', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Dates</Label>
                                        <Input value={item.date} onChange={(e) => handleChange(index, 'date', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wide text-slate-500">Points</Label>
                                    {item.points.map((point, pIndex) => (
                                        <div key={pIndex} className="flex gap-2 items-center">
                                            <Input
                                                value={point.text}
                                                onChange={(e) => handlePointChange(index, pIndex, e.target.value)}
                                                className={cn(point.isVisible === false && "text-slate-400 bg-slate-100")}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => removePoint(index, pIndex)}>
                                                <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="secondary" size="sm" onClick={() => addPoint(index)} className="w-full mt-2 border border-slate-200">
                                        <PlusCircle className="mr-2 h-3 w-3" /> Add Point
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className={cn(item.isVisible === false && "opacity-50 grayscale transition-all duration-300")}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                        <h4 className={cn("font-bold text-lg", item.isVisible !== false ? "text-emerald-950" : "text-slate-700")}>
                                            {item.title}
                                        </h4>
                                        <div className="text-sm font-medium text-slate-600 flex gap-2">
                                            <span>{item.subtitle}</span>
                                            {item.date && (
                                                <>
                                                    <span className="text-slate-300">|</span>
                                                    <span>{item.date}</span>
                                                </>
                                            )}
                                        </div>
                                        {item.location && <div className="text-xs text-slate-500 italic">{item.location}</div>}
                                    </div>

                                    <button
                                        onClick={() => toggleItemVisibility(index)}
                                        className="flex flex-col items-center gap-1 group/toggle ml-4 shrink-0 cursor-pointer"
                                    >
                                        <div className={cn(
                                            "w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                                            item.isVisible !== false ? "bg-emerald-500" : "bg-slate-300"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out",
                                                item.isVisible !== false ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            item.isVisible !== false ? "text-emerald-600" : "text-slate-400"
                                        )}>
                                            {item.isVisible !== false ? "Include" : "Skip"}
                                        </span>
                                    </button>
                                </div>

                                <ul className="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm mt-4">
                                    {item.points.map((p, i) => (
                                        <li key={i} className={cn("group/point relative pl-1", p.isVisible === false && "opacity-60")}>
                                            <span className={cn(p.isVisible === false && "line-through decoration-slate-300 text-slate-400")}>{p.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
                {content.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic border-2 border-dashed rounded-lg">
                        No items added.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
