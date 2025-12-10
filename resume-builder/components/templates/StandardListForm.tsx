import { useState } from 'react';
import { StandardListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';

interface StandardListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: StandardListContent;
    updateContent: (newContent: StandardListContent) => void;
}

export function StandardListForm({ title, onTitleChange, content, updateContent }: StandardListFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    const updateItems = (newItems: StandardListContent['items']) => {
        updateContent({ ...content, items: newItems });
    };

    const handleChange = (index: number, field: keyof StandardListContent['items'][0], value: any) => {
        const newItems = [...content.items];
        newItems[index] = { ...newItems[index], [field]: value };
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
                description: '',
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
                                        <Label>Title (e.g. School, Exam)</Label>
                                        <Input value={item.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Subtitle (e.g. Degree)</Label>
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
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <Label>Description (Optional)</Label>
                                        <Input value={item.description || ''} onChange={(e) => handleChange(index, 'description', e.target.value)} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={cn(item.isVisible === false && "opacity-50 grayscale transition-all duration-300")}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-lg text-emerald-950 flex items-center gap-2">
                                            <span>{item.title}</span>
                                        </div>
                                        {item.subtitle && <div className="font-medium text-slate-700">{item.subtitle}</div>}
                                        <div className="flex justify-between text-slate-600 text-sm italic pt-1">
                                            <span>{item.location}</span>
                                            <span>{item.date}</span>
                                        </div>
                                        {item.description && <div className="text-sm text-slate-600 mt-2">{item.description}</div>}
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
