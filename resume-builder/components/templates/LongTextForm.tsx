import { useState } from 'react';
import { LongTextContent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';
import { AddSectionDialog } from '@/components/AddSectionDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
// import { EditSectionDialog } from '@/components/EditSectionDialog';
// import { LongTextEditor } from '@/components/editors/LongTextEditor';

interface LongTextFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: LongTextContent;
    updateContent: (newContent: LongTextContent) => void;
}

export function LongTextForm({ title, onTitleChange, content, updateContent }: LongTextFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                    <EditableSectionTitle value={title} onChange={onTitleChange} />
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
                {/* Preview View */}
                <div className="prose prose-sm max-w-none text-slate-600 line-clamp-3">
                    {content.text || <span className="italic text-slate-400">No content added yet.</span>}
                </div>

                {/* Edit Modal */}
                <AddSectionDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode="edit"
                    initialType="long-text"
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
