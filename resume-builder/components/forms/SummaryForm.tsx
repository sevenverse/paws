import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Check } from 'lucide-react';

interface SummaryFormProps {
    data: string;
    updateData: (section: 'summary', newData: string) => void;
}

export function SummaryForm({ data, updateData }: SummaryFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Professional Summary</CardTitle>
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
                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                            id="summary"
                            value={data}
                            onChange={(e) => updateData('summary', e.target.value)}
                            placeholder="Write a brief summary about yourself..."
                            className="min-h-[150px] resize-y"
                        />
                    </div>
                ) : (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {data || "No summary added."}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
