import { useState, useEffect } from 'react';
import { HeaderContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Check, Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HeaderFormProps {
    title: string;
    onTitleChange?: (newTitle: string) => void;
    content: HeaderContent;
    updateContent: (newContent: HeaderContent) => void;
}

// Sortable Item Component
function SortableLink({ link, updateLink, toggleLinkVisibility, removeLink }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50 group", !link.isVisible && "opacity-60")}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1">
                <Input
                    placeholder="Display Text (e.g. GitHub)"
                    value={link.text}
                    onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                    className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto placeholder:text-slate-400 font-medium"
                />
                <Input
                    placeholder="URL (e.g. github.com/user)"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto text-slate-500 placeholder:text-slate-300"
                />
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLinkVisibility(link.id)}
                className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                title={link.isVisible ? "Hide link" : "Show link"}
            >
                {link.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(link.id)}
                className="h-8 w-8 text-slate-400 hover:text-red-500"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function HeaderForm({ title, onTitleChange, content, updateContent }: HeaderFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Migration Logic: One-time run on mount/edit if links are missing
    useEffect(() => {
        if (!content.links) {
            const newLinks = [];
            if (content.linkedin) {
                newLinks.push({
                    id: crypto.randomUUID(),
                    text: content.linkedin,
                    url: `linkedin.com/in/${content.linkedin.split('/').pop() || ''}`, // Attempt to clean or keep as is
                    isVisible: true
                });
            }
            if (content.github) {
                newLinks.push({
                    id: crypto.randomUUID(),
                    text: content.github,
                    url: `github.com/${content.github.split('/').pop() || ''}`,
                    isVisible: true
                });
            }
            updateContent({ ...content, links: newLinks });
        }
    }, []); // Run once on mount to migrate if needed

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = (content.links || []).findIndex((item) => item.id === active.id);
            const newIndex = (content.links || []).findIndex((item) => item.id === over.id);

            const newLinks = arrayMove(content.links || [], oldIndex, newIndex);
            updateContent({ ...content, links: newLinks });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateContent({ ...content, [e.target.name]: e.target.value });
    };

    const addLink = () => {
        const newLink = {
            id: crypto.randomUUID(),
            text: '',
            url: '',
            isVisible: true
        };
        updateContent({ ...content, links: [...(content.links || []), newLink] });
    };

    const updateLink = (id: string, field: 'text' | 'url', value: string) => {
        const newLinks = (content.links || []).map(link =>
            link.id === id ? { ...link, [field]: value } : link
        );
        updateContent({ ...content, links: newLinks });
    };

    const toggleLinkVisibility = (id: string) => {
        const newLinks = (content.links || []).map(link =>
            link.id === id ? { ...link, isVisible: !link.isVisible } : link
        );
        updateContent({ ...content, links: newLinks });
    };

    const removeLink = (id: string) => {
        const newLinks = (content.links || []).filter(link => link.id !== id);
        updateContent({ ...content, links: newLinks });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <EditableSectionTitle value={title} onChange={onTitleChange || (() => { })} />
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-slate-400 hover:text-emerald-600"
                >
                    {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="pt-4">
                {isEditing ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={content.name} onChange={handleChange} placeholder="First Last" className="border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" value={content.email} onChange={handleChange} placeholder="email@example.com" className="border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" value={content.phone} onChange={handleChange} placeholder="123-456-7890" className="border-slate-200" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Links</Label>
                                <Button onClick={addLink} variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                    <Plus className="h-3 w-3 mr-1" /> Add Link
                                </Button>
                            </div>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={content.links || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {(content.links || []).map((link) => (
                                            <SortableLink
                                                key={link.id}
                                                link={link}
                                                updateLink={updateLink}
                                                toggleLinkVisibility={toggleLinkVisibility}
                                                removeLink={removeLink}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900">{content.name || "Your Name"}</h3>
                        <div className="text-slate-500 flex flex-wrap gap-x-4 gap-y-1 text-sm items-center">
                            {content.phone && <span>{content.phone}</span>}
                            {content.email && <span>{content.email}</span>}

                            {(content.links || []).filter(l => l.isVisible).map(link => (
                                <span key={link.id} className="text-emerald-600 flex items-center gap-1">
                                    {link.text}
                                </span>
                            ))}

                            {(!content.links || content.links.length === 0) && (
                                <>
                                    {content.linkedin && <span className="text-emerald-600">{content.linkedin}</span>}
                                    {content.github && <span className="text-emerald-600">{content.github}</span>}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
