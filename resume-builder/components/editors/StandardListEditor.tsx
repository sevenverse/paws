import { StandardListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StandardListEditorProps {
    content: StandardListContent;
    onChange: (newContent: StandardListContent) => void;
}

export function StandardListEditor({ content, onChange }: StandardListEditorProps) {

    const updateItems = (newItems: StandardListContent['items']) => {
        onChange({ ...content, items: newItems });
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
                dateFrom: '',
                dateTo: '',
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
                                <Label>Title (e.g. School, Exam)</Label>
                                <Input value={item.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label>Subtitle (e.g. Degree)</Label>
                                <Input value={item.subtitle} onChange={(e) => handleChange(index, 'subtitle', e.target.value)} />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <Label>Location</Label>
                                <Input value={item.location} onChange={(e) => handleChange(index, 'location', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label>From Date</Label>
                                <Input value={item.dateFrom} onChange={(e) => handleChange(index, 'dateFrom', e.target.value)} placeholder="e.g. 2020" />
                            </div>
                            <div className="space-y-1">
                                <Label>To Date</Label>
                                <Input value={item.dateTo} onChange={(e) => handleChange(index, 'dateTo', e.target.value)} placeholder="e.g. Present" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <Label>Description (Optional)</Label>
                                <Input value={item.description || ''} onChange={(e) => handleChange(index, 'description', e.target.value)} />
                            </div>
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
