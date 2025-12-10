
import { ResumeData, Section, SectionType } from './types';
import { defaultResumeData } from './defaults';

export function migrateResumeData(data: any): ResumeData {
    // If sections array exists, we assume it's migrated
    if (data.sections && Array.isArray(data.sections)) {
        return data as ResumeData;
    }

    // Start with default structure to get empty sections
    const newData: ResumeData = {
        ...defaultResumeData,
        sections: []
    };

    // Helper to map old items to new sections
    const addSection = (id: string, type: SectionType, title: string, contentMapper: (oldContent: any) => any, oldKey?: string) => {
        const key = oldKey || id;
        if (data[key]) {
            // Check if data[key] is an array (lists) or object (summary)
            // Old schema context:
            // summary: { text: ... } or string? In old types it was likely an object or just missing.
            // education: { items: [...] } or array? Likely { items: [...] } based on previous context.

            // We'll iterate the old data if it's present.

            let content = null;
            try {
                content = contentMapper(data[key]);
            } catch (e) {
                console.warn(`Failed to migrate section ${key}`, e);
            }

            if (content) {
                newData.sections.push({
                    id,
                    type,
                    title,
                    isVisible: true,
                    content
                });
            }
        }
    };

    // Migrate Header (Top Level)
    if (data.header) {
        newData.sections.push({
            id: 'header',
            type: 'header',
            title: 'Header',
            isVisible: true,
            content: data.header
        });
    }

    // Migrate Summary
    if (data.summary) {
        newData.sections.push({
            id: 'summary',
            type: 'long-text',
            title: 'Professional Summary',
            isVisible: true,
            content: { text: data.summary.text || '' }
        });
    }

    // Migrate Education
    if (data.education && data.education.items) {
        newData.sections.push({
            id: 'education',
            type: 'standard-list',
            title: 'Education',
            isVisible: true,
            content: { items: data.education.items.map((item: any) => ({ ...item, subtitle: item.degree, title: item.school })) }
        });
    }

    // Migrate Experience
    if (data.experience && data.experience.items) {
        newData.sections.push({
            id: 'experience',
            type: 'detailed-list',
            title: 'Experience',
            isVisible: true,
            content: { items: data.experience.items.map((item: any) => ({ ...item, subtitle: item.role, title: item.company })) }
        });
    }

    // Migrate Projects
    if (data.projects && data.projects.items) {
        newData.sections.push({
            id: 'projects',
            type: 'detailed-list',
            title: 'Projects',
            isVisible: true,
            content: { items: data.projects.items.map((item: any) => ({ ...item, subtitle: item.technologies, title: item.name })) }
        });
    }

    // Migrate Skills
    if (data.skills && data.skills.groups) {
        newData.sections.push({
            id: 'skills',
            type: 'grouped-list',
            title: 'Technical Skills',
            isVisible: true,
            content: { groups: data.skills.groups }
        });
    }

    // Migrate Achievements
    if (data.achievements && data.achievements.items) {
        newData.sections.push({
            id: 'achievements',
            type: 'standard-list',
            title: 'Achievements',
            isVisible: true,
            content: { items: data.achievements.items }
        });
    }

    // Migrate Certifications
    if (data.certifications && data.certifications.items) {
        newData.sections.push({
            id: 'certifications',
            type: 'standard-list',
            title: 'Certifications',
            isVisible: true,
            content: { items: data.certifications.items.map((item: any) => ({ ...item, title: item.name, subtitle: item.issuer })) }
        });
    }

    // Fallback: If no sections were migrated (e.g. empty old data), render defaults?
    // Actually, better to merge defaults if empty? 
    // For now, let's just return what we have. If they had data, it's there.

    return newData;
}
