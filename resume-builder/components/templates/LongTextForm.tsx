import { LongTextContent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableSectionTitle } from '@/components/EditableSectionTitle';

interface LongTextFormProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    content: LongTextContent;
    updateContent: (newContent: LongTextContent) => void;
}

export function LongTextForm({ title, onTitleChange, content, updateContent }: LongTextFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateContent({ ...content, text: e.target.value });
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>
                    <EditableSectionTitle value={title} onChange={onTitleChange} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor={`textarea-${title}`} className="sr-only">Content</Label>
                    <Textarea
                        id={`textarea-${title}`}
                        value={content.text}
                        onChange={handleChange}
                        placeholder="Write your content here..."
                        className="min-h-[150px] border-slate-200 focus:border-emerald-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
