"use client";

import { useState, useEffect } from 'react';
import { ResumeData } from '@/lib/types';
import { defaultResumeData } from '@/lib/defaults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { HeaderForm } from '@/components/forms/HeaderForm';
// import { EducationForm } from '@/components/forms/EducationForm';
// import { ExperienceForm } from '@/components/forms/ExperienceForm';
// import { ProjectsForm } from '@/components/forms/ProjectsForm';
// import { SkillsForm } from '@/components/forms/SkillsForm';
import { RefreshCw, FileText, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PopOutSectionWrapper } from '@/components/PopOutSectionWrapper';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from '@/components/SortableSection';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

// Template Imports
import { HeaderForm } from '@/components/templates/HeaderForm';
import { LongTextForm } from '@/components/templates/LongTextForm';
import { StandardListForm } from '@/components/templates/StandardListForm';
import { DetailedListForm } from '@/components/templates/DetailedListForm';
import { GroupedListForm } from '@/components/templates/GroupedListForm';

import { Section, SectionType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'saved' | 'error'>('idle');

  // Load resume on mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        setResumeData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-save effect
  useEffect(() => {
    // Only set pending if we are currently idle or saved
    if (resumeData !== defaultResumeData) {
      setSaveStatus((prev) => (prev === 'saving' ? prev : 'pending'));
    }
  }, [resumeData]);

  // Debounce the actual save call
  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveStatus === 'pending') {
        saveData(false, true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [saveStatus, resumeData]);

  const updateHeader = (newHeader: any) => {
    setResumeData(prev => ({ ...prev, header: newHeader }));
  };

  const updateSection = (id: string, newSectionPartial: Partial<Section>) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...newSectionPartial } : s)
    }));
  };

  const addSection = (type: SectionType, title: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      type,
      title,
      isVisible: true,
      content: getEmptyContent(type)
    };
    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const getEmptyContent = (type: SectionType) => {
    switch (type) {
      case 'header': return { name: '', phone: '', email: '', linkedin: '', github: '', links: [] };
      case 'long-text': return { text: '' };
      case 'standard-list': return { items: [] };
      case 'detailed-list': return { items: [] };
      case 'grouped-list': return { groups: [] };
    }
  };

  const deleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== id)
      }));
    }
  };

  const saveData = async (shouldGenerate: boolean = false, isAutoSave: boolean = false) => {
    if (!isAutoSave) setIsSaving(true);
    if (isAutoSave) setSaveStatus('saving');

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });

      if (!res.ok) throw new Error("Failed to save draft");

      if (isAutoSave) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }

      if (shouldGenerate) {
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData),
        });
        if (!genRes.ok) throw new Error("Failed to generate LaTeX");
        alert('Saved & Synced to LaTeX successfully!');
      } else {
        if (!isAutoSave) alert('Draft saved manually!');
      }

    } catch (error) {
      console.error(error);
      if (isAutoSave) setSaveStatus('error');
      else alert('Error saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and Drop Logic
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = resumeData.sections.findIndex(s => s.id === active.id);
      const newIndex = resumeData.sections.findIndex(s => s.id === over.id);

      setResumeData(prev => ({
        ...prev,
        sections: arrayMove(prev.sections, oldIndex, newIndex)
      }));
    }
  };

  const renderSectionContent = (section: Section) => {
    const updateContent = (content: any) => updateSection(section.id, { content });
    const updateTitle = (title: string) => updateSection(section.id, { title });

    switch (section.type) {
      case 'header':
        return <HeaderForm title={section.title} onTitleChange={updateTitle} content={section.content as any} updateContent={updateContent} />;
      case 'long-text':
        return <LongTextForm title={section.title} onTitleChange={updateTitle} content={section.content as any} updateContent={updateContent} />;
      case 'standard-list':
        return <StandardListForm title={section.title} onTitleChange={updateTitle} content={section.content as any} updateContent={updateContent} />;
      case 'detailed-list':
        return <DetailedListForm title={section.title} onTitleChange={updateTitle} content={section.content as any} updateContent={updateContent} />;
      case 'grouped-list':
        return <GroupedListForm title={section.title} onTitleChange={updateTitle} content={section.content as any} updateContent={updateContent} />;
      default:
        return null;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-emerald-950 text-white flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">paws<span className="text-emerald-500">.</span></span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-8 min-h-screen max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FORMS SECTION (Left) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Dynamic sections handle Header now */}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={resumeData.sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {resumeData.sections.map((section, index) => {
                  const commonProps = {
                    title: section.title,
                    sectionKey: section.id,
                    isVisible: section.isVisible,
                    isFirst: index === 0,
                    isLast: index === resumeData.sections.length - 1,
                    onToggle: () => updateSection(section.id, { isVisible: !section.isVisible }),
                  };

                  const ContentComponent = renderSectionContent(section);

                  if (!ContentComponent) return null;

                  return (
                    <SortableSection key={section.id} id={section.id} {...commonProps} onDelete={() => deleteSection(section.id)}>
                      {ContentComponent}
                    </SortableSection>
                  );
                })}
              </SortableContext>

              <DragOverlay>
                {activeId ? (() => {
                  const section = resumeData.sections.find(s => s.id === activeId);
                  if (!section) return null;

                  const commonProps = {
                    title: section.title,
                    sectionKey: section.id,
                    isVisible: section.isVisible,
                    isFirst: false,
                    isLast: false,
                    isMoving: true,
                    onToggle: () => { }, // No-op in overlay
                    onDelete: () => { }, // No-op in overlay
                  };

                  return (
                    <PopOutSectionWrapper {...commonProps} dragStyle={{ cursor: 'grabbing' }}>
                      {renderSectionContent(section)}
                    </PopOutSectionWrapper>
                  );
                })() : null}
              </DragOverlay>
            </DndContext>

            {/* ADD SECTION BUTTON */}
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-colors cursor-pointer">
              <CardContent className="p-6 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-full w-full py-4 text-emerald-600 hover:text-emerald-700 hover:bg-transparent">
                      <Plus className="mr-2 h-5 w-5" /> Add New Section
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => addSection('header', 'Header')}>
                      Header (Personal Info)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection('detailed-list', 'Experience')}>
                      Detailed List (e.g. Work)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection('standard-list', 'Education')}>
                      Standard List (e.g. Education)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection('long-text', 'Summary')}>
                      Long Text (e.g. Summary)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection('grouped-list', 'Skills')}>
                      Grouped List (e.g. Skills)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </div>

          {/* ACTIONS PANEL (Right, Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-50">
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <Save className="h-5 w-5 text-emerald-600" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">

                <div className="space-y-3">
                  <Button
                    onClick={() => saveData(true)}
                    disabled={isSaving}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                  >
                    <RefreshCw className={cn("mr-2 h-4 w-4", isSaving && "animate-spin")} />
                    {isSaving ? 'Exporting...' : 'Export to LaTeX'}
                  </Button>

                  <Button
                    onClick={() => saveData(false)}
                    disabled={isSaving}
                    variant="outline"
                    className={cn(
                      "w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-300",
                      saveStatus === 'saved' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                      saveStatus === 'saving' && "opacity-80"
                    )}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Save Draft
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                  {saveStatus === 'saving' ? 'Saving changes...' : 'Edits are auto-saved to draft.'}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
