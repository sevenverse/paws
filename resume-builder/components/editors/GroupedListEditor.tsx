import { GroupedListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupedListEditorProps {
    content: GroupedListContent;
    onChange: (newContent: GroupedListContent) => void;
}

export function GroupedListEditor({ content, onChange }: GroupedListEditorProps) {

    const updateGroups = (newGroups: GroupedListContent['groups']) => {
        onChange({ ...content, groups: newGroups });
    };

    const addGroup = () => {
        updateGroups([
            ...content.groups,
            { id: crypto.randomUUID(), category: '', items: [{ name: '', isVisible: true }], isVisible: true }
        ]);
    };

    const removeGroup = (index: number) => {
        updateGroups(content.groups.filter((_, i) => i !== index));
    };

    const updateCategory = (index: number, name: string) => {
        const newGroups = [...content.groups];
        newGroups[index].category = name;
        updateGroups(newGroups);
    };

    const addItem = (groupIndex: number) => {
        const newGroups = [...content.groups];
        newGroups[groupIndex].items.push({ name: '', isVisible: true });
        updateGroups(newGroups);
    };

    const updateItem = (groupIndex: number, itemIndex: number, name: string) => {
        const newGroups = [...content.groups];
        newGroups[groupIndex].items[itemIndex].name = name;
        updateGroups(newGroups);
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newGroups = [...content.groups];
        newGroups[groupIndex].items = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
        updateGroups(newGroups);
    };



    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button onClick={addGroup} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            {content.groups.map((group, groupIndex) => (
                <div key={group.id} className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">*</span>
                        <Input
                            value={group.category}
                            onChange={(e) => updateCategory(groupIndex, e.target.value)}
                            className="font-bold text-lg bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto text-emerald-800 placeholder:text-emerald-300 w-full"
                            placeholder="e.g. Languages"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeGroup(groupIndex)}>
                            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                        </Button>
                    </div>
                    <div className="bg-white rounded-md border border-slate-200 p-3 flex flex-wrap gap-3">
                        {group.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md pl-2 pr-1 py-1">
                                <Input
                                    value={item.name}
                                    onChange={(e) => updateItem(groupIndex, itemIndex, e.target.value)}
                                    className="h-6 w-32 border-none shadow-none focus-visible:ring-0 bg-transparent px-0 text-sm"
                                    placeholder="e.g. Python"
                                    id={`input-${groupIndex}-${itemIndex}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addItem(groupIndex);
                                            setTimeout(() => {
                                                const nextInput = document.getElementById(`input-${groupIndex}-${itemIndex + 1}`);
                                                if (nextInput) nextInput.focus();
                                            }, 0);
                                        }
                                    }}
                                />
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeItem(groupIndex, itemIndex)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="h-auto py-1 border-dashed text-slate-400 hover:text-emerald-600" onClick={() => addItem(groupIndex)}>
                            <Plus className="h-3 w-3 mr-1" /> Add Item
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
