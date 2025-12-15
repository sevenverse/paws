import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Briefcase, GraduationCap, User, Code, FileText, ArrowLeft, Check } from 'lucide-react';
import { SectionType, ResumeData } from '@/lib/types';
import { SectionPreview } from './SectionPreviews';
import { cn } from '@/lib/utils';
import { getEmptyContent } from '@/lib/helpers';

// Editors
import { DetailedListEditor } from '@/components/editors/DetailedListEditor';
import { StandardListEditor } from '@/components/editors/StandardListEditor';
import { GroupedListEditor } from '@/components/editors/GroupedListEditor';
import { LongTextEditor } from '@/components/editors/LongTextEditor';
import { HeaderEditor } from '@/components/editors/HeaderEditor';

interface AddSectionDialogProps {
    onAdd: (type: SectionType, title: string, content: any) => void;
    settings?: ResumeData['settings'];
    children?: React.ReactNode;
    mode?: 'add' | 'edit';
    initialType?: SectionType;
    initialContent?: any;
    initialTitle?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

type SectionPreset = {
    id: string;
    type: SectionType;
    title: string;
    label: string;
    description: string;
    icon: React.ReactNode;
};

const PRESETS: SectionPreset[] = [
    {
        id: 'header',
        type: 'header',
        title: 'Personal Details',
        label: 'Personal Details',
        description: 'Name, contact info, and social links.',
        icon: <User className="h-5 w-5" />
    },
    {
        id: 'standard-list',
        type: 'standard-list',
        title: 'Education',
        label: 'Standard List',
        description: 'For Education, Achievements, Certifications, etc.',
        icon: <GraduationCap className="h-5 w-5" />
    },
    {
        id: 'detailed-list',
        type: 'detailed-list',
        title: 'Experience',
        label: 'Detailed List',
        description: 'For Work Experience, Projects, etc.',
        icon: <Briefcase className="h-5 w-5" />
    },
    {
        id: 'grouped-list',
        type: 'grouped-list',
        title: 'Skills',
        label: 'Grouped List',
        description: 'For structured items like Skills or Languages.',
        icon: <Code className="h-5 w-5" />
    },
    {
        id: 'long-text',
        type: 'long-text',
        title: 'Summary',
        label: 'Text Section',
        description: 'For Professional Summary, Objectives, etc.',
        icon: <FileText className="h-5 w-5" />
    },
];

export function AddSectionDialog({
    onAdd,
    settings,
    children,
    mode = 'add',
    initialType,
    initialContent,
    initialTitle,
    open: controlledOpen,
    onOpenChange: setControlledOpen
}: AddSectionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Determine which open state to use
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;

    const [step, setStep] = useState<'select' | 'edit'>('select');
    const [selectedPreset, setSelectedPreset] = useState<SectionPreset>(PRESETS[1]);
    const [customTitle, setCustomTitle] = useState(PRESETS[1].title);
    const [draftContent, setDraftContent] = useState<any>(null);

    // Initial State Logic
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialType && initialContent) {
                // Determine preset from type
                let preset = PRESETS.find(p => p.type === initialType);
                if (!preset && (initialType === 'header-name' || initialType === 'header-contact')) {
                    preset = PRESETS.find(p => p.type === 'header');
                }

                if (preset) {
                    setSelectedPreset(preset);
                    setCustomTitle(initialTitle || preset.title);
                    setDraftContent(initialContent);
                    setStep('edit');
                }
            } else {
                // Add Mode Reset
                // Small timeout to allow transition to finish before resetting state (avoids flicker)
                const timer = setTimeout(() => {
                    setStep('select');
                    setSelectedPreset(PRESETS[1]);
                    setCustomTitle(PRESETS[1].title);
                    setDraftContent(null);
                }, 100); // reduced timeout slightly
                return () => clearTimeout(timer);
            }
        } else {
            // Reset state when dialog closes in add mode
            if (mode === 'add') {
                const timer = setTimeout(() => {
                    setStep('select');
                    setSelectedPreset(PRESETS[1]);
                    setCustomTitle(PRESETS[1].title);
                    setDraftContent(null);
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [open, mode, initialType, initialContent, initialTitle]);

    const handlePresetSelect = (preset: SectionPreset) => {
        setSelectedPreset(preset);
        setCustomTitle(preset.title);
        setDraftContent(getEmptyContent(preset.type));
        setStep('edit');
    };

    const handleAdd = () => {
        onAdd(selectedPreset.type, customTitle, draftContent);
        if (setOpen) setOpen(false);
    };

    const renderEditor = () => {
        if (!draftContent) return null;

        switch (selectedPreset.type) {
            case 'detailed-list':
                return <DetailedListEditor content={draftContent} onChange={setDraftContent} />;
            case 'standard-list':
                return <StandardListEditor content={draftContent} onChange={setDraftContent} />;
            case 'grouped-list':
                return <GroupedListEditor content={draftContent} onChange={setDraftContent} />;
            case 'long-text':
                return <LongTextEditor content={draftContent} onChange={setDraftContent} title={customTitle} />;
            case 'header':
            case 'header-name':
            case 'header-contact':
                // Handle variant passing correctly or defaulting to full
                return <HeaderEditor content={draftContent} onChange={setDraftContent} variant={selectedPreset.type === 'header' ? 'full' : selectedPreset.type === 'header-name' ? 'name' : 'contact'} />;
            default:
                return <div>No editor available for this type.</div>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        {step === 'edit' && mode === 'add' && (
                            <Button variant="ghost" size="icon" onClick={() => setStep('select')}>
                                <ArrowLeft className="h-5 w-5 text-slate-500" />
                            </Button>
                        )}
                        <DialogTitle className="text-xl font-bold text-slate-800">
                            {mode === 'edit' ? 'Edit Section' : (step === 'select' ? 'Select Section Type' : '')}
                        </DialogTitle>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden bg-slate-50">
                    {step === 'select' && mode === 'add' ? (
                        /* STEP 1: SELECT */
                        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetSelect(preset)}
                                        className="flex flex-col text-left bg-white rounded-xl border-2 border-slate-100 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition-all duration-200 group h-[260px]"
                                    >
                                        {/* Mini Preview Area - Increased ratio */}
                                        <div className="h-[170px] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:bg-emerald-50/30 transition-colors">
                                            <div className="scale-[0.45] origin-top pt-8 w-[200%] select-none pointer-events-none absolute inset-0 flex justify-center">
                                                <div className="w-[800px] bg-white shadow-sm p-8">
                                                    <SectionPreview
                                                        type={preset.type}
                                                        title={preset.title}
                                                        settings={settings}
                                                    // Use a non-live preview for the selection card
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-transparent" /> {/* Click overlay */}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-4 flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                                    {preset.icon}
                                                </div>
                                                <h3 className="font-bold text-base text-slate-800 group-hover:text-emerald-700">
                                                    {preset.label}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                {preset.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* STEP 2: EDIT */
                        <div className="flex w-full h-full">
                            {/* Editor Area */}
                            <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
                                {/* Header (Title Input - Conditional) */}
                                {selectedPreset.type !== 'header' && (
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block">Section Title</label>
                                        <Input
                                            value={customTitle}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTitle(e.target.value)}
                                            className="text-lg font-semibold bg-white"
                                            placeholder="e.g. Work Experience"
                                        />
                                    </div>
                                )}

                                {/* Scrollable Editor Content */}
                                <div className="p-6 flex-1 overflow-y-auto">
                                    {renderEditor()}
                                </div>

                                {/* Footer (Buttons) */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => {
                                        if (mode === 'add') setStep('select');
                                        else if (setOpen) setOpen(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAdd}
                                        disabled={(() => {
                                            if (!draftContent) return true;
                                            if (selectedPreset.type === 'header') {
                                                if (!draftContent.name?.trim()) return true;
                                                if (!draftContent.email?.trim()) return true;
                                                if (!draftContent.phone?.trim()) return true;
                                                if (draftContent.links && draftContent.links.some((l: any) => !l.text?.trim() || !l.url?.trim())) return true;
                                            }
                                            if (selectedPreset.type === 'standard-list') {
                                                if (!draftContent.items || draftContent.items.length === 0) return true;
                                                // Validate that at least one item has a title
                                                if (draftContent.items.some((item: any) => !item.title?.trim())) return true;
                                            }
                                            return false;
                                        })()}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Check className="mr-2 h-4 w-4" /> {mode === 'edit' ? 'Save Changes' : 'Add to Resume'}
                                    </Button>
                                </div>
                            </div>

                            {/* Live Preview Area */}
                            <div className="w-1/2 bg-slate-100 flex flex-col overflow-hidden">
                                <div className="p-3 bg-slate-200 border-b border-slate-300 text-xs font-mono text-center text-slate-600 uppercase tracking-widest">
                                    Live Preview
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                                    <div className="w-full max-w-2xl bg-white shadow-xl min-h-[500px] p-8 origin-top">
                                        <SectionPreview
                                            type={selectedPreset.type}
                                            title={customTitle}
                                            settings={settings}
                                            content={draftContent}
                                            isLivePreview={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
