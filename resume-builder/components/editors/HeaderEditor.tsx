import { useState, useEffect } from 'react';
import { HeaderContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Eye, EyeOff, GripVertical, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface HeaderEditorProps {
    content: HeaderContent;
    onChange: (newContent: HeaderContent) => void;
    variant?: 'full' | 'name' | 'contact';
}

// Sortable Item Component
function SortableLink({ link, updateLink, toggleLinkVisibility, removeLink, checkAndAdd }: any) {
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

    const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus the URL input for this link
            const urlInput = document.getElementById(`link-url-${link.id}`);
            if (urlInput) {
                (urlInput as HTMLInputElement).focus();
            }
        }
    };

    const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAndAdd(link.id);
        }
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
                    id={`link-text-${link.id}`}
                    placeholder="Display Text (e.g. GitHub)"
                    value={link.text}
                    onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                    onKeyDown={handleTextKeyDown}
                    className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto placeholder:text-slate-400 font-medium"
                />
                <Input
                    id={`link-url-${link.id}`}
                    placeholder="URL (e.g. github.com/user)"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    onKeyDown={handleUrlKeyDown}
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

export function HeaderEditor({ content, onChange, variant = 'full' }: HeaderEditorProps) {
    const showName = variant === 'full' || variant === 'name';
    const showContact = variant === 'full' || variant === 'contact';
    const [focusNewLink, setFocusNewLink] = useState<string | null>(null);

    // Migration Logic: One-time run on mount/edit if links are missing
    useEffect(() => {
        if (!content.links) {
            const newLinks = [];
            if (content.linkedin) {
                newLinks.push({
                    id: crypto.randomUUID(),
                    text: content.linkedin,
                    url: `linkedin.com/in/${content.linkedin.split('/').pop() || ''}`,
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
            onChange({ ...content, links: newLinks });
        }
    }, [content.linkedin, content.github, onChange]); // Added dependencies

    // Handle auto-focusing new link
    useEffect(() => {
        if (focusNewLink) {
            const element = document.getElementById(`link-text-${focusNewLink}`);
            if (element) {
                (element as HTMLInputElement).focus();
                setFocusNewLink(null);
            }
        }
    }, [content.links, focusNewLink]);

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
            onChange({ ...content, links: newLinks });
        }
    };

    const addLink = () => {
        const newId = crypto.randomUUID();
        const newLink = {
            id: newId,
            text: '',
            url: '',
            isVisible: true
        };
        onChange({ ...content, links: [...(content.links || []), newLink] });
        setFocusNewLink(newId); // Set ID to focus
    };

    const checkAndAdd = (currentId: string) => {
        const currentLink = (content.links || []).find(l => l.id === currentId);
        if (currentLink && currentLink.text && currentLink.url) {
            // Check if this is the last link
            const links = content.links || [];
            const currentIndex = links.findIndex(l => l.id === currentId);
            if (currentIndex === links.length - 1) {
                addLink();
            }
        }
    };

    const updateLink = (id: string, field: 'text' | 'url', value: string) => {
        const newLinks = (content.links || []).map(link =>
            link.id === id ? { ...link, [field]: value } : link
        );
        onChange({ ...content, links: newLinks });
    };

    const toggleLinkVisibility = (id: string) => {
        const newLinks = (content.links || []).map(link =>
            link.id === id ? { ...link, isVisible: !link.isVisible } : link
        );
        onChange({ ...content, links: newLinks });
    };

    const removeLink = (id: string) => {
        const newLinks = (content.links || []).filter(link => link.id !== id);
        onChange({ ...content, links: newLinks });
    };

    return (
        <div className="space-y-6">
            {/* Main Info */}
            {showName && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-600 font-medium">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            value={content.name}
                            onChange={(e) => onChange({ ...content, name: e.target.value })}
                            placeholder="e.g. Jane Doe"
                            className={`bg-slate-50 border-slate-200 focus:border-emerald-500 transition-colors ${!content.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                    </div>
                </div>
            )}

            {showContact && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-600 font-medium">Email <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    value={content.email}
                                    onChange={(e) => onChange({ ...content, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className={`pl-9 bg-slate-50 border-slate-200 focus:border-emerald-500 transition-colors ${!content.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-slate-600 font-medium">Phone <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="phone"
                                    value={content.phone}
                                    onChange={(e) => onChange({ ...content, phone: e.target.value })}
                                    placeholder="(555) 123-4567"
                                    className={`pl-9 bg-slate-50 border-slate-200 focus:border-emerald-500 transition-colors ${!content.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin" className="text-slate-600 font-medium">LinkedIn</Label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="linkedin"
                                    value={content.linkedin}
                                    onChange={(e) => onChange({ ...content, linkedin: e.target.value })}
                                    placeholder="linkedin.com/in/jane"
                                    className="pl-9 bg-slate-50 border-slate-200 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="github" className="text-slate-600 font-medium">GitHub</Label>
                            <div className="relative">
                                <Github className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="github"
                                    value={content.github}
                                    onChange={(e) => onChange({ ...content, github: e.target.value })}
                                    placeholder="github.com/jane"
                                    className="pl-9 bg-slate-50 border-slate-200 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-600 font-medium">Additional Links</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addLink}
                                disabled={content.links?.some(l => !l.text || !l.url)}
                                className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add Link
                            </Button>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={(content.links || []).map(l => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {content.links?.map((link) => (
                                        <SortableLink
                                            key={link.id}
                                            link={link}
                                            updateLink={updateLink}
                                            toggleLinkVisibility={toggleLinkVisibility}
                                            removeLink={removeLink}
                                            checkAndAdd={checkAndAdd}
                                        />
                                    ))}
                                    {(!content.links || content.links.length === 0) && (
                                        <div className="text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm italic">
                                            No additional links added
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </>
            )}
        </div>
    );
}
