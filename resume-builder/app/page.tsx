"use client";

import { useState, useEffect } from 'react';
import { ResumeData, SectionType, Section, HeaderContent, LongTextContent, StandardListContent, DetailedListContent, GroupedListContent } from '@/lib/types';
import { defaultResumeData } from '@/lib/defaults';
import { getEmptyContent } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { HeaderForm } from '@/components/forms/HeaderForm';
// import { EducationForm } from '@/components/forms/EducationForm';
// import { ExperienceForm } from '@/components/forms/ExperienceForm';
// import { ProjectsForm } from '@/components/forms/ProjectsForm';
// import { SkillsForm } from '@/components/forms/SkillsForm';
import { RefreshCw, FileText, Save, Check, Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
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


// Template Imports
import { HeaderForm } from '@/components/templates/HeaderForm';
import { LongTextForm } from '@/components/templates/LongTextForm';
import { StandardListForm } from '@/components/templates/StandardListForm';
import { DetailedListForm } from '@/components/templates/DetailedListForm';
import { GroupedListForm } from '@/components/templates/GroupedListForm';

import { AddSectionDialog } from '@/components/AddSectionDialog';
import { StyleToolbar } from '@/components/StyleToolbar';
import React from 'react';
import { LiveResumePreview } from '@/components/LiveResumePreview';
import { Onboarding } from '@/components/Onboarding';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'saved' | 'error'>('idle');

  // Load resume on mount
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<string | null>(null);
  const [newlyAddedSectionId, setNewlyAddedSectionId] = useState<string | null>(null);

  // Ref to access latest resumeData in async callbacks
  const resumeDataRef = React.useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    setIsMounted(true);
    fetchResume();
  }, []);

  // Auto-scroll to newly added section
  useEffect(() => {
    if (newlyAddedSectionId) {
      // Small timeout to allow DOM to update
      setTimeout(() => {
        const element = document.getElementById(`section-${newlyAddedSectionId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Focus logic could go here if we had a specific input to focus
        }
        setNewlyAddedSectionId(null);
      }, 100);
    }
  }, [newlyAddedSectionId, resumeData.sections]);

  const fetchResume = async () => {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 1700));
    const fetchData = async () => {
      try {
        const res = await fetch('/api/resume');
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    };

    const [_, data] = await Promise.all([minLoadTime, fetchData()]);

    if (data) {
      setResumeData(data);
      // Check if it's a "new" resume (check for empty name in header section)
      const headerSection = data.sections?.find((s: any) => s.type === 'header');
      if (!headerSection || !headerSection.content.name) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    } else {
      setShowOnboarding(true);
    }
    setIsLoading(false);
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

  const handleOnboardingStart = () => {
    setShowOnboarding(false);
    const hasHeader = resumeData.sections.some(s => s.type === 'header');
    if (!hasHeader) {
      const newId = addSection('header', 'Personal Details');
      if (newId) setSectionToEdit(newId);
    } else {
      // Focus the first header found
      const headerId = resumeData.sections.find(s => s.type === 'header')?.id;
      if (headerId) {
        setNewlyAddedSectionId(headerId);
        setSectionToEdit(headerId);
      }
    }
  };

  const handleEditFinished = (sectionId: string) => {
    // Delay check to allow state updates to propagate
    setTimeout(() => {
      // Check if the section is still empty (specifically for Header)
      const section = resumeDataRef.current.sections.find(s => s.id === sectionId);
      if (!section) return;

      if (section.type === 'header' || section.type === 'header-name') {
        const content = section.content as HeaderContent;
        if (!content.name || content.name.trim() === '') {
          // If name is empty, delete it and show onboarding
          deleteSection(sectionId);
          setShowOnboarding(true);
        }
      }
    }, 100);
  };

  const updateHeader = (newHeader: any) => {
    setResumeData(prev => ({ ...prev, header: newHeader }));
  };

  const updateSection = (id: string, newSectionPartial: Partial<Section>) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...newSectionPartial } : s)
    }));
  };

  const addSection = (type: SectionType, title: string, content?: any) => {
    const newId = crypto.randomUUID();
    const newSection: Section = {
      id: newId,
      type,
      title,
      isVisible: true,
      content: content || getEmptyContent(type)
    };
    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setNewlyAddedSectionId(newId);
    return newId;
  };

  const deleteSection = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const updateSettings = (newSettings: any) => {
    setResumeData(prev => ({ ...prev, settings: newSettings }));
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
        return <HeaderForm title={section.title} onTitleChange={updateTitle} content={section.content as HeaderContent} updateContent={updateContent} variant="full" triggerEdit={sectionToEdit === section.id} onEditTriggered={() => setSectionToEdit(null)} onDialogClose={() => handleEditFinished(section.id)} />;
      case 'header-name':
        return <HeaderForm title={section.title} onTitleChange={updateTitle} content={section.content as HeaderContent} updateContent={updateContent} variant="name" triggerEdit={sectionToEdit === section.id} onEditTriggered={() => setSectionToEdit(null)} onDialogClose={() => handleEditFinished(section.id)} />;
      case 'header-contact':
        return <HeaderForm title={section.title} onTitleChange={updateTitle} content={section.content as HeaderContent} updateContent={updateContent} variant="contact" triggerEdit={sectionToEdit === section.id} onEditTriggered={() => setSectionToEdit(null)} onDialogClose={() => handleEditFinished(section.id)} />;
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

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-2xl font-medium text-slate-800 tracking-wide">
              Take a <span className="font-bold text-emerald-600">PAWS</span>. for your <span className="font-bold text-emerald-600">RESUME</span>.
            </h2>
            <p className="text-sm text-slate-500 italic">— Shyam Prasad V</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {showOnboarding && (
        <Onboarding
          onStart={handleOnboardingStart}
          onImport={() => alert("Resume upload import coming soon!")}
        />
      )}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-emerald-950 text-white flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">paws<span className="text-emerald-500">.</span></span>
        </div>

        {isMounted && (
          <div className="flex items-center">
            <StyleToolbar data={resumeData} onUpdate={updateSettings} />
          </div>
        )}
      </header>


      <main className="pt-24 pb-12 px-4 sm:px-8 min-h-screen max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FORMS SECTION (Left) */}
          <div className="lg:col-span-7 space-y-8">
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
            </DndContext >
          </div >
          {/* ACTIONS PANEL (Right, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">

            {/* FLOATING ACTION ICONS */}
            <div className="flex items-center gap-3 mb-4 justify-end sticky top-24 z-20">
              {/* ADD SECTION */}
              <AddSectionDialog onAdd={addSection} settings={resumeData.settings}>
                <Button
                  variant="default"
                  className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-20 relative bg-emerald-600 text-white"
                  title="Add Section"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </AddSectionDialog>

              {/* SAVE & EXPORT */}
              <Button
                onClick={() => saveData(true)}
                disabled={isSaving}
                variant="outline"
                className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-20 relative bg-white border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                title="Save & Export PDF"
              >
                {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              </Button>

              {/* COPY LATEX */}
              <Button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    // Save first
                    await saveData(false, true);
                    // Fetch Source
                    const res = await fetch('/api/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...resumeData, returnSource: true })
                    });
                    const data = await res.json();
                    if (data.latex) {
                      await navigator.clipboard.writeText(data.latex);
                      alert("LaTeX code copied to clipboard!");
                    } else {
                      throw new Error("No LaTeX returned");
                    }
                  } catch (e) {
                    console.error(e);
                    alert("Failed to copy LaTeX code.");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                variant="outline"
                className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-20 relative bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                title="Copy LaTeX Code"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            {/* LIVE PREVIEW */}
            <div className="mb-6">
              <LiveResumePreview data={resumeData} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
