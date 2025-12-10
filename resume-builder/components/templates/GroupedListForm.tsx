import { useState } from 'react';
import { GroupedListContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';

interface GroupedListFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: GroupedListContent;
    updateContent: (newContent: GroupedListContent) => void;
}

export function GroupedListForm({ title, onTitleChange, content, updateContent }: GroupedListFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    const updateGroups = (newGroups: GroupedListContent['groups']) => {
        updateContent({ ...content, groups: newGroups });
    };

    const addGroup = () => {
        updateGroups([
            ...content.groups,
            { id: crypto.randomUUID(), category: 'New Category', items: [], isVisible: true }
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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    <EditableSectionTitle value={title} onChange={onTitleChange} />
                </CardTitle>
                <div className="flex gap-2">
                    {isEditing && (
                        <Button variant="outline" size="sm" onClick={addGroup}>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
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
                {content.groups.map((group, groupIndex) => (
                    <div key={group.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        value={group.category}
                                        onChange={(e) => updateCategory(groupIndex, e.target.value)}
                                        className="font-bold w-1/3"
                                        placeholder="Category Name"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeGroup(groupIndex)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ) : (
                                <h4 className="font-bold text-md text-emerald-950 w-32 shrink-0">{group.category}</h4>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-slate-100">
                            {group.items.map((item, itemIndex) => (
                                isEditing ? (
                                    <div key={itemIndex} className="flex gap-1 items-center bg-slate-50 rounded-md border border-slate-200">
                                        <Input
                                            value={item.name}
                                            onChange={(e) => updateItem(groupIndex, itemIndex, e.target.value)}
                                            className="h-8 w-32 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => removeItem(groupIndex, itemIndex)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    item.isVisible && (
                                        <span key={itemIndex} className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">
                                            {item.name}
                                        </span>
                                    )
                                )
                            ))}
                            {isEditing && (
                                <Button variant="outline" size="sm" className="h-8 border-dashed" onClick={() => addItem(groupIndex)}>
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
