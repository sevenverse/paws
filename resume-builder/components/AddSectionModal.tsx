import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, List, AlignLeft, Layers, Type } from "lucide-react";
import { SectionType } from "@/lib/types";

interface AddSectionModalProps {
    onAdd: (type: SectionType, title: string) => void;
}

export function AddSectionModal({ onAdd }: AddSectionModalProps) {
    const sections = [
        {
            type: 'detailed-list' as SectionType,
            title: 'Detailed List',
            description: 'Best for Work Experience, Projects, or Volunteer work. Includes title, subtitle, dates, location, and bullet points.',
            icon: List,
            defaultTitle: 'Experience'
        },
        {
            type: 'standard-list' as SectionType,
            title: 'Standard List',
            description: 'Ideal for Education, Certifications, or Awards. Simple Items with title, subtitle, and date.',
            icon: AlignLeft,
            defaultTitle: 'Education'
        },
        {
            type: 'grouped-list' as SectionType,
            title: 'Grouped List',
            description: 'Perfect for Skills (e.g. Languages, Frameworks). Group items under categories.',
            icon: Layers,
            defaultTitle: 'Skills'
        },
        {
            type: 'long-text' as SectionType,
            title: 'Long Text',
            description: 'For free-form text like a Summary, Objective, or Cover Letter segment.',
            icon: Type,
            defaultTitle: 'Summary'
        }
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center pb-4 text-emerald-950">
                        Add New Section
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {sections.map((section) => (
                        <div
                            key={section.type}
                            className="group relative flex flex-col gap-2 rounded-xl border-2 border-slate-100 bg-white p-6 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-md cursor-pointer transition-all duration-200"
                            onClick={() => onAdd(section.type, section.defaultTitle)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <section.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700">
                                    {section.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed pl-[3.25rem]">
                                {section.description}
                            </p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
