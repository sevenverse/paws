import { DetailedListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailedListEditorProps {
    content: DetailedListContent;
    onChange: (newContent: DetailedListContent) => void;
}

export function DetailedListEditor({ content, onChange }: DetailedListEditorProps) {

    const updateItems = (newItems: DetailedListContent['items']) => {
        onChange({ ...content, items: newItems });
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
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <div className="space-y-6">
                {content.items.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative space-y-4 rounded-lg border p-4 bg-white shadow-sm"
                    >
                        <div className="absolute right-2 top-2 flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleItemVisibility(index)}
                                className={cn(
                                    "h-8 w-8",
                                    item.isVisible !== false ? "text-emerald-600 hover:text-emerald-700" : "text-slate-400"
                                )}
                            >
                                {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => togglePointVisibility(index, pIndex)}
                                        className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                                        title={point.isVisible !== false ? "Hide point" : "Show point"}
                                    >
                                        {point.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => removePoint(index, pIndex)}>
                                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="secondary" size="sm" onClick={() => addPoint(index)} className="w-full mt-2 border border-slate-200">
                                <PlusCircle className="mr-2 h-3 w-3" /> Add Point
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {content.items.length === 0 && (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed rounded-lg">
                    No items added yet. Click "Add Item" to start.
                </div>
            )}
        </div>
    );
}
