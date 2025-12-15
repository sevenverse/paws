import { useState } from 'react';
import { HeaderContent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { AddSectionDialog } from '@/components/AddSectionDialog';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { HeaderEditor } from '@/components/editors/HeaderEditor';

interface HeaderFormProps {
    title: string;
    onTitleChange?: (newTitle: string) => void;
    content: HeaderContent;
    updateContent: (newContent: HeaderContent) => void;
    variant?: 'full' | 'name' | 'contact';
}

export function HeaderForm({ title, onTitleChange, content, updateContent, variant = 'full' }: HeaderFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                    <h3 className="text-2xl font-bold text-emerald-600">{content.name}</h3>
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

                {/* Edit Modal */}
                <AddSectionDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
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
