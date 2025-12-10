"use client";

import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DraggableSyntheticListeners, DraggableAttributes } from '@dnd-kit/core';

interface SectionWrapperProps {
    title: string;
    sectionKey: string;
    isVisible: boolean;
    isFirst: boolean;
    isLast: boolean;
    isMoving?: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    dragListeners?: DraggableSyntheticListeners;
    dragAttributes?: DraggableAttributes;
    dragStyle?: React.CSSProperties;
    setNodeRef?: (node: HTMLElement | null) => void;
}

export function PopOutSectionWrapper({
    title,
    sectionKey,
    isVisible,
    isFirst,
    isLast,
    isMoving,
    onToggle,
    onDelete,
    children,
    dragListeners,
    dragAttributes,
    dragStyle,
    setNodeRef
}: SectionWrapperProps & { onDelete?: () => void }) {

    return (
        <div
            ref={setNodeRef}
            style={dragStyle}
            id={`section-${sectionKey}`}
            className={cn("relative group mb-6 transition-transform", !isVisible && "opacity-75")}
        >

            {/* Main Content Area - z-20 to sit ON TOP of the gutter */}
            <div className={cn(
                "relative z-20 bg-white transition-all duration-300 rounded-lg",
                !isVisible && "grayscale pointer-events-none select-none"
            )}>
                {children}
            </div>

            {/* Gutter Strip - z-10 to sit BEHIND the card initially */}
            <div className={cn(
                "absolute top-0 bottom-0 left-0 w-12 bg-emerald-600 rounded-l-lg flex flex-col items-center justify-center gap-4 shadow-sm",
                "z-10 transition-all duration-200 ease-out",
                // Hover: Slide out to the left
                "transform translate-x-0 group-hover:-translate-x-12",
                // Force open if currently moving (fixes focus loss on reorder)
                isMoving && "-translate-x-12"
            )}>

                {/* Drag Handle */}
                <button
                    {...dragListeners}
                    {...dragAttributes}
                    className={cn(
                        "p-1.5 rounded-md text-white/90 hover:bg-emerald-500 hover:text-white transition-all cursor-grab active:cursor-grabbing"
                    )}
                    title="Drag to Reorder"
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                {/* Visibility Toggle */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "p-1.5 rounded-md text-white hover:bg-emerald-500 transition-colors",
                        !isVisible && "bg-emerald-800 text-emerald-200"
                    )}
                    title={isVisible ? "Hide Section" : "Show Section"}
                >
                    {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>

                <div className="h-px w-8 bg-emerald-500/50 my-1" />

                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-md text-white/90 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Section"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}

            </div>

            {/* Hidden Overlay Message */}
            {!isVisible && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/5 backdrop-blur-[1px] absolute inset-0 rounded-lg" />
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-500 z-40 flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        {title} Hidden
                    </div>
                </div>
            )}
        </div>
    );
}
