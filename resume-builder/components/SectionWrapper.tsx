"use client";

import { ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface SectionWrapperProps {
    title: string;
    sectionKey: string;
    isVisible: boolean;
    isFirst: boolean;
    isLast: boolean;
    onToggle: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    children: React.ReactNode;
}

export function SectionWrapper({
    title,
    sectionKey,
    isVisible,
    isFirst,
    isLast,
    onToggle,
    onMoveUp,
    onMoveDown,
    children
}: SectionWrapperProps) {

    return (
        <div className={cn("relative group transition-all duration-300", !isVisible && "opacity-75")}>

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300",
                !isVisible && "grayscale pointer-events-none select-none"
            )}>
                {children}
            </div>

            {/* Controls Overlay - Visible on Hover or when hidden */}
            <div className={cn(
                "absolute -left-12 top-0 bottom-0 w-12 flex flex-col items-center gap-2 py-4 transition-opacity duration-200",
                "opacity-0 group-hover:opacity-100",
                !isVisible && "opacity-100" // Always show controls if hidden
            )}>

                {/* Visibility Toggle "Drop" */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-10 h-10 rounded-l-xl flex items-center justify-center shadow-sm border border-r-0 transition-all duration-200 relative -right-2",
                        isVisible
                            ? "bg-emerald-100/80 text-emerald-700 border-emerald-200 hover:bg-emerald-200 hover:w-11"
                            : "bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300 hover:w-11"
                    )}
                    title={isVisible ? "Hide Section" : "Show Section"}
                >
                    {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>

                {/* Reorder Controls */}
                <div className="flex flex-col gap-1 mt-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className={cn(
                            "h-8 w-8 rounded-full bg-white/80 shadow-sm border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600",
                            isFirst && "opacity-0 pointer-events-none"
                        )}
                        title="Move Up"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMoveDown}
                        disabled={isLast}
                        className={cn(
                            "h-8 w-8 rounded-full bg-white/80 shadow-sm border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600",
                            isLast && "opacity-0 pointer-events-none"
                        )}
                        title="Move Down"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Hidden Overlay Message */}
            {!isVisible && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/5 backdrop-blur-[1px] absolute inset-0 rounded-lg" />
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-500 z-10 flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        {title} Hidden
                    </div>
                </div>
            )}
        </div>
    );
}
