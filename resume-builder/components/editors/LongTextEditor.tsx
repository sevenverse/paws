import { LongTextContent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LongTextEditorProps {
    content: LongTextContent;
    onChange: (newContent: LongTextContent) => void;
    title?: string;
}

export function LongTextEditor({ content, onChange, title }: LongTextEditorProps) {

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ ...content, text: e.target.value });
    };

    return (
        <div className="space-y-4">
            <Label htmlFor={`textarea-${title}`} className="sr-only">Content</Label>
            <Textarea
                id={`textarea-${title}`}
                value={content.text}
                onChange={handleChange}
                placeholder="Write your content here..."
                className="min-h-[300px] border-slate-200 focus:border-emerald-500 font-mono text-sm leading-relaxed"
            />
        </div>
    );
}
