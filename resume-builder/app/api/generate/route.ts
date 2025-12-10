import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ResumeData } from '@/lib/types';
import { defaultResumeData } from '@/lib/defaults';
// ... imports
import {
    generateSection
} from '@/lib/latex-generator';

export async function POST(request: Request) {
    try {
        const data: ResumeData = await request.json();

        // Define the output directory
        const sectionsDir = path.join(process.cwd(), '../sections');

        // Ensure directory exists
        if (!fs.existsSync(sectionsDir)) {
            fs.mkdirSync(sectionsDir, { recursive: true });
        }

        const writeSection = (filename: string, content: string) => {
            fs.writeFileSync(path.join(sectionsDir, filename), content);
        };

        // Generate Dynamic Sections
        const sectionFiles: string[] = [];

        data.sections.forEach((section, index) => {
            if (!section.isVisible) return;

            const content = generateSection(section);
            if (content.trim()) {
                const filename = `section_${index}.tex`;
                writeSection(filename, content);
                sectionFiles.push(`sections/${filename.replace('.tex', '')}`);
            }
        });

        // Generate resume.tex
        const resumeContent = `\\documentclass[a4paper,10pt]{article}
\\input{structure.tex}

\\begin{document}

${sectionFiles.map(file => `\\input{${file}}`).join('\n')}

\\end{document}`;
        // ...

        // Write resume.tex to the root folder (../../resume.tex relative to sectionsDir)
        const rootDir = path.join(sectionsDir, '..');
        fs.writeFileSync(path.join(rootDir, 'resume.tex'), resumeContent);

        return NextResponse.json({ success: true, message: 'Resume sections updated successfully' });

    } catch (error) {
        console.error('Error generating resume:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume sections' },
            { status: 500 }
        );
    }
}
