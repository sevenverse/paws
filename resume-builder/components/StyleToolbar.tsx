import React from 'react';
import { ResumeData } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Type, FileText, Ruler, Hash, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleToolbarProps {
    data: ResumeData;
    onUpdate: (newSettings: any) => void;
}

// Reusable styled trigger component for consistency
const StyledSelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <SelectTrigger
        className={cn(
            "h-9 bg-emerald-900/40 border-emerald-800/50 text-emerald-50 focus:ring-emerald-500/50 transition-all hover:bg-emerald-900/60 hover:border-emerald-700",
            className
        )}
    >
        {children}
    </SelectTrigger>
);

const ToolbarLabel = ({ icon: Icon, label }: { icon: any, label?: string }) => (
    <div className="flex items-center gap-1.5 text-emerald-200/80 mr-1">
        <Icon className="h-3.5 w-3.5" />
        {label && <span className="text-xs font-medium uppercase tracking-wider">{label}</span>}
    </div>
);

const dropdownClass = "bg-emerald-950 border-emerald-800 text-emerald-50 shadow-xl";

export function StyleToolbar({ data, onUpdate }: StyleToolbarProps) {
    const settings = data.settings || { font: 'serif', fontSize: '10pt', margin: 0.75, paperSize: 'a4paper' };

    const updateSetting = (key: string, value: any) => {
        onUpdate({ ...settings, [key]: value });
    };

    const margins = typeof settings.margin === 'object'
        ? settings.margin
        : { top: 0.6, bottom: 0.6, left: settings.margin || 0.75, right: settings.margin || 0.75 };

    const handleMarginChange = (side: keyof typeof margins, value: string) => {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) return;

        updateSetting('margin', { ...margins, [side]: numVal });
    };

    const resetMargins = () => {
        updateSetting('margin', { top: 0.75, bottom: 0.75, left: 0.75, right: 0.75 });
    };

    return (
        <div className="flex items-center gap-4 text-sm bg-emerald-900/20 p-1 pr-4 rounded-lg border border-emerald-900/10 backdrop-blur-sm">
            {/* Paper Size */}
            <div className="flex items-center">
                <Select value={settings.paperSize} onValueChange={(v) => updateSetting('paperSize', v)}>
                    <StyledSelectTrigger className="w-[160px] pl-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 opacity-70" />
                            <SelectValue placeholder="Paper" />
                        </div>
                    </StyledSelectTrigger>
                    <SelectContent className={dropdownClass}>
                        <SelectItem value="a4paper">
                            <span className="font-medium">A4 Paper</span>
                        </SelectItem>
                        <SelectItem value="letterpaper">
                            <span className="font-medium">Letter Paper</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-5 w-px bg-emerald-800/50" />

            {/* Font Group */}
            <div className="flex items-center gap-2">
                <Select value={settings.font} onValueChange={(v) => updateSetting('font', v)}>
                    <StyledSelectTrigger className="w-[200px]">
                        <div className="flex items-center gap-2">
                            <Type className="h-3.5 w-3.5 opacity-70" />
                            <SelectValue placeholder="Font" />
                        </div>
                    </StyledSelectTrigger>
                    <SelectContent className={dropdownClass}>
                        <SelectGroup>
                            <SelectLabel className="text-emerald-400/80 text-xs uppercase tracking-wider pl-2">Serif</SelectLabel>
                            <SelectItem value="serif"><span className="font-serif">Computer Modern (Default)</span></SelectItem>
                            <SelectItem value="cormorant"><span className="font-serif">Cormorant Garamond</span></SelectItem>
                            <SelectItem value="charter"><span className="font-serif">Charter</span></SelectItem>
                        </SelectGroup>
                        <SelectSeparator className="bg-emerald-800/50" />
                        <SelectGroup>
                            <SelectLabel className="text-emerald-400/80 text-xs uppercase tracking-wider pl-2">Sans Serif</SelectLabel>
                            <SelectItem value="sans"><span className="font-sans">Helvet (Default)</span></SelectItem>
                            <SelectItem value="fira"><span className="font-sans">Fira Sans</span></SelectItem>
                            <SelectItem value="roboto"><span className="font-sans">Roboto</span></SelectItem>
                            <SelectItem value="noto"><span className="font-sans">Noto Sans</span></SelectItem>
                            <SelectItem value="source"><span className="font-sans">Source Sans Pro</span></SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={settings.fontSize} onValueChange={(v) => updateSetting('fontSize', v)}>
                    <StyledSelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Size" />
                    </StyledSelectTrigger>
                    <SelectContent className={dropdownClass}>
                        <SelectItem value="10pt">Size: 10pt</SelectItem>
                        <SelectItem value="11pt">Size: 11pt</SelectItem>
                        <SelectItem value="12pt">Size: 12pt</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-5 w-px bg-emerald-800/50" />

            {/* Margins Popover */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 w-[170px] justify-start bg-emerald-900/40 border-emerald-800/50 text-emerald-50 hover:bg-emerald-900/60 hover:border-emerald-700 hover:text-white"
                    >
                        <Ruler className="mr-2 h-3.5 w-3.5 opacity-70" />
                        Margins
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white border-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium leading-none text-slate-900">Page Margins (in)</h4>
                            <Button variant="ghost" size="sm" onClick={resetMargins} className="h-6 text-xs text-slate-500 hover:text-emerald-600">
                                <RefreshCcw className="mr-1 h-3 w-3" /> Reset
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="top">Top</Label>
                                <Input
                                    id="top"
                                    type="number"
                                    step="0.1"
                                    value={margins.top}
                                    onChange={(e) => handleMarginChange('top', e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bottom">Bottom</Label>
                                <Input
                                    id="bottom"
                                    type="number"
                                    step="0.1"
                                    value={margins.bottom}
                                    onChange={(e) => handleMarginChange('bottom', e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="left">Left</Label>
                                <Input
                                    id="left"
                                    type="number"
                                    step="0.1"
                                    value={margins.left}
                                    onChange={(e) => handleMarginChange('left', e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="right">Right</Label>
                                <Input
                                    id="right"
                                    type="number"
                                    step="0.1"
                                    value={margins.right}
                                    onChange={(e) => handleMarginChange('right', e.target.value)}
                                    className="h-8"
                                />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
