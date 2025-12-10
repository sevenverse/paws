import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have standard cn util

interface EditableSectionTitleProps {
    value: string;
    onChange: (newValue: string) => void;
}

export function EditableSectionTitle({ value, onChange }: EditableSectionTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue.trim()) {
            onChange(tempValue);
        } else {
            setTempValue(value); // Revert if empty
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setTempValue(value);
        }
    };

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="font-bold text-xl h-auto py-1 px-2 -ml-2"
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 cursor-pointer hover:bg-slate-100/50 p-1 -ml-1 rounded transition-colors"
        >
            <span className="font-bold text-xl">{value}</span>
            <Pencil className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
