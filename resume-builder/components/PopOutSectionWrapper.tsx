"use client";

import { useState } from 'react';

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
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        // Wait for animation to finish before actual delete
        setTimeout(() => {
            onDelete?.();
        }, 400);
    };

    return (
        <div
            ref={setNodeRef}
            style={dragStyle}
            id={`section-${sectionKey}`}
            className={cn(
                "relative group mb-6 transition-all duration-500 ease-in-out max-h-[1000px] overflow-visible", // Default: visible overflow for popouts, large max-height
                !isVisible && "opacity-75",
                isDeleting && "pointer-events-none opacity-0 scale-95 max-h-0 mb-0 overflow-hidden" // Collapse: hide overflow, zero height/margin
            )}
        >

            {/* Main Content Area - z-20 to sit ON TOP of the gutter */}
            <div className={cn(
                "relative z-20 bg-white transition-all duration-300 rounded-lg overflow-hidden", // Added overflow-hidden
                !isVisible && "grayscale pointer-events-none select-none",
            )}>
                {children}
            </div>

            {/* Gutter Strip - z-10 to sit BEHIND the card initially, z-30 when confirming to pop OVER */}
            <div className={cn(
                "absolute top-0 bottom-0 left-0 w-12 bg-emerald-600 rounded-l-lg flex flex-col items-center justify-center gap-4 shadow-sm",
                "transition-all duration-200 ease-out",
                // Hover: Slide out to the left
                "transform translate-x-0 group-hover:-translate-x-12",
                // Force open if currently moving (fixes focus loss on reorder)
                isMoving && "-translate-x-12",
                // Pop over content when confirming delete OR deleting
                (isConfirming || isDeleting) ? "z-30" : "z-10"
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

                {/* Delete Button with seamless right extension */}
                {onDelete && (
                    <div
                        className={cn(
                            "relative w-full flex justify-center py-2 transition-colors duration-300",
                            isConfirming ? "bg-red-500" : "bg-transparent",
                            // Removed isDeleting && "bg-red-500" to stop red persistence during fade
                        )}
                        onMouseLeave={() => !isDeleting && setIsConfirming(false)}
                    >
                        <button
                            onClick={() => setIsConfirming(true)}
                            className={cn(
                                "p-1.5 rounded-md text-white/90 transition-all z-[60] relative",
                                // Remove button bg color when confirming since container is red
                                (isConfirming || isDeleting) ? "text-white" : "hover:bg-red-500 hover:text-white"
                            )}
                            title="Delete Section"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>

                        {/* Extended Confirmation Panel */}
                        <div className={cn(
                            "absolute left-[calc(100%-1px)] top-0 bottom-0 flex items-center gap-1 pl-4 pr-2 bg-red-500 shadow-sm z-50 transition-all duration-300 ease-out origin-left overflow-hidden rounded-r-md",
                            (isConfirming && !isDeleting) ? "w-[140px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                        )}>
                            <span className="text-xs font-bold text-white whitespace-nowrap mr-1 pl-1">Sure?</span>
                            <button
                                onClick={handleConfirmDelete}
                                className="h-7 px-2.5 bg-white text-red-600 text-xs font-bold rounded-sm hover:bg-red-50 transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirming(false);
                                }}
                                className="h-7 px-2 text-white/90 hover:text-white text-xs font-medium transition-colors"
                            >
                                No
                            </button>
                        </div>
                    </div>
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
