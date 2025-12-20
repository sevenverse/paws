import { useState, useEffect } from 'react';
import { HeaderContent } from '@/lib/types';
import { formatUrl } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import { AddSectionDialog } from '@/components/AddSectionDialog';
import { cn } from '@/lib/utils';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { HeaderEditor } from '@/components/editors/HeaderEditor';

interface HeaderFormProps {
    title: string;
    onTitleChange?: (newTitle: string) => void;
    content: HeaderContent;
    updateContent: (newContent: HeaderContent) => void;
    variant?: 'full' | 'name' | 'contact';
    triggerEdit?: boolean;
    onEditTriggered?: () => void;
    onDialogClose?: () => void;
}

// --- Sub-Components ---

const HeaderTitle = ({ name }: { name: string }) => (
    <h3 className="text-2xl font-bold text-emerald-600">{name}</h3>
);

const ContactBadges = ({ email, phone }: { email: string, phone: string }) => (
    <>
        {phone && (
            <div className="px-2 py-1 bg-slate-100 rounded text-slate-700">
                {phone}
            </div>
        )}
        {email && (
            <div className="px-2 py-1 bg-slate-100 rounded text-slate-700">
                {email}
            </div>
        )}
    </>
);

const SocialBadges = ({
    linkedin,
    linkedinVisible,
    github,
    githubVisible,
    links,
    onToggle,
}: {
    linkedin: string;
    linkedinVisible?: boolean;
    github: string;
    githubVisible?: boolean;
    links?: HeaderContent['links'];
    onToggle: (field: string, id?: string) => void;
}) => (
    <>
        {linkedin && (
            <button
                onClick={() => onToggle('linkedin')}
                className={cn(
                    "px-2 py-1 rounded flex items-center gap-1.5 transition-all text-xs font-medium border",
                    linkedinVisible !== false
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through opacity-70"
                )}
                title={linkedinVisible !== false ? "Visible" : "Hidden"}
            >
                <Eye className="h-3 w-3" />
                LinkedIn
            </button>
        )}
        {github && (
            <button
                onClick={() => onToggle('github')}
                className={cn(
                    "px-2 py-1 rounded flex items-center gap-1.5 transition-all text-xs font-medium border",
                    githubVisible !== false
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through opacity-70"
                )}
                title={githubVisible !== false ? "Visible" : "Hidden"}
            >
                <Eye className="h-3 w-3" />
                GitHub
            </button>
        )}

        {(links || []).map(link => (
            <button
                key={link.id}
                onClick={() => onToggle('link', link.id)}
                className={cn(
                    "px-2 py-1 rounded flex items-center gap-1.5 transition-all text-xs font-medium border",
                    link.isVisible
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through opacity-70"
                )}
                title={link.isVisible ? "Visible" : "Hidden"}
            >
                <Eye className="h-3 w-3" />
                {link.text}
            </button>
        ))}
    </>
);

// --- Main Component ---

export function HeaderForm({ title, onTitleChange, content, updateContent, variant = 'full', triggerEdit, onEditTriggered, onDialogClose }: HeaderFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (triggerEdit) {
            setIsDialogOpen(true);
            onEditTriggered?.();
        }
    }, [triggerEdit, onEditTriggered]);

    const handleToggle = (field: string, id?: string) => {
        if (field === 'linkedin') {
            updateContent({ ...content, linkedinVisible: content.linkedinVisible === false ? true : false });
        } else if (field === 'github') {
            updateContent({ ...content, githubVisible: content.githubVisible === false ? true : false });
        } else if (field === 'link' && id) {
            const newLinks = (content.links || []).map(l => l.id === id ? { ...l, isVisible: !l.isVisible } : l);
            updateContent({ ...content, links: newLinks });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-bold text-xl flex items-center gap-2">
                    <span>Personal Details</span>
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="text-slate-400 hover:text-emerald-600"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Summary View */}
                <div className="space-y-1">
                    <HeaderTitle name={content.name} />
                    <div className="text-slate-500 flex flex-wrap gap-2 text-sm items-center mt-2">
                        <ContactBadges email={content.email} phone={content.phone} />
                        <SocialBadges
                            linkedin={content.linkedin}
                            linkedinVisible={content.linkedinVisible}
                            github={content.github}
                            githubVisible={content.githubVisible}
                            links={content.links}
                            onToggle={handleToggle}
                        />
                    </div>
                </div>

                {/* Edit Modal */}
                <AddSectionDialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            onDialogClose?.();
                        }
                    }}
                    mode="edit"
                    initialType="header"
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
