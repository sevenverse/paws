import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have standard cn util

interface EditableSectionTitleProps {
    value: string;
    onChange: (newValue: string) => void;
}

export function EditableSectionTitle({ value, onChange, isEditing: externalIsEditing }: EditableSectionTitleProps & { isEditing?: boolean }) {
    const [internalIsEditing, setInternalIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            // Only focus if we just switched to editing? Or always?
            // If it's "always editing", autofocus might be annoying on mount?
            // But usually we want focus. However, in the modal, there are many inputs. 
            // We shouldn't auto-focus the title unless clicked?
            // User says "Header should be by default in Edit mode". This implies Input field is visible.
            // If I auto-focus, it steals focus from the first field of the form.
            // I'll skip autofocus if externalIsEditing is true on mount?
            // Actually, simply rendering Input is enough.
        }
    }, [isEditing]);

    const handleBlur = () => {
        if (externalIsEditing === undefined) {
            setInternalIsEditing(false);
        }
        if (tempValue.trim()) {
            onChange(tempValue);
        } else {
            setTempValue(value); // Revert if empty
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
            // If external, we just save, but stay in edit mode (Input remains).
            // Ideally we might want to blur the input?
            if (externalIsEditing) {
                (e.target as HTMLInputElement).blur();
            }
        }
        if (e.key === 'Escape') {
            if (externalIsEditing === undefined) {
                setInternalIsEditing(false);
            }
            setTempValue(value);
            if (externalIsEditing) {
                (e.target as HTMLInputElement).blur();
            }
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
                className="font-bold text-xl h-auto py-1 px-2 -ml-2 w-full"
            />
        );
    }

    return (
        <div
            onClick={() => setInternalIsEditing(true)}
            className="group flex items-center gap-2 cursor-pointer hover:bg-slate-100/50 p-1 -ml-1 rounded transition-colors"
        >
            <span className="font-bold text-xl">{value}</span>
            <Pencil className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
