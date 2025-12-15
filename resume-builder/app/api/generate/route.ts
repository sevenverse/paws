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
    const returnSource = (data as any).returnSource; // Check for flag

    // Define the output directory (root of the resume folder)
    const sectionsDir = path.join(process.cwd(), '../sections');
    const rootDir = path.join(sectionsDir, '..');

    // --- GENERATE structure content (In-Memory) ---
    const settings = data.settings || { font: 'serif', fontSize: '10pt', margin: 0.75, paperSize: 'a4paper' };

    let fontSetup = '';
    switch (settings.font) {
      case 'sans':
        fontSetup = `
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[scaled]{helvet}`;
        break;
      case 'cormorant':
        fontSetup = `\\usepackage{CormorantGaramond}`;
        break;
      case 'charter':
        fontSetup = `\\usepackage{charter}`;
        break;
      case 'fira':
        fontSetup = `\\usepackage[sfdefault]{FiraSans}`;
        break;
      case 'roboto':
        fontSetup = `\\usepackage[sfdefault]{roboto}`;
        break;
      case 'noto':
        fontSetup = `\\usepackage[sfdefault]{noto-sans}`;
        break;
      case 'source':
        fontSetup = `\\usepackage[default]{sourcesanspro}`;
        break;
      default:
        // Default is Computer Modern (Serif)
        break;
    }
    // Default is serif (Computer Modern usually, or Times if specified, but sticking to basic LaTeX)

    const marginSetting = settings.margin !== undefined ? settings.margin : 0.75;
    const m = typeof marginSetting === 'object'
      ? marginSetting
      : { top: 0.6, bottom: 0.6, left: marginSetting, right: marginSetting };

    const structureContent = `% structure.tex - Generated
\\usepackage[utf8]{inputenc}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{marvosym}
\\usepackage{titlesec}
\\usepackage{verbatim}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[left=${m.left}in,top=${m.top}in,right=${m.right}in,bottom=${m.bottom}in]{geometry}

${fontSetup}

% Adjusting styles
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\renewcommand{\\labelitemi}{$\\bullet$}
\\renewcommand{\\labelitemii}{$\\circ$}
`;

    // --- GENERATE SECTIONS CONTENT (In-Memory) ---
    const sectionContents: string[] = [];

    data.sections.forEach((section) => {
      if (!section.isVisible) return;
      const content = generateSection(section, settings as any); // Cast as any if ResumeSettings mismatch, or better: ensure settings match logic
      if (content.trim()) {
        sectionContents.push(content);
      }
    });

    // --- ASSEMBLE FINAL RESUME ---
    const finalResumeContent = `\\documentclass[${settings.paperSize},${settings.fontSize}]{article}

% --- STRUCTURE START ---
${structureContent}
% --- STRUCTURE END ---

\\begin{document}

${sectionContents.join('\n\n')}

\\end{document}`;

    if (returnSource) {
      return NextResponse.json({
        success: true,
        latex: finalResumeContent
      });
    }

    // --- PDF GENERATION (Stateless) ---
    // Try to locate pdflatex. In Docker, it's there. Locally, it might not be.
    // We will attempt to generate PDF. If it fails (command not found), we fallback to returning LaTeX.

    try {
      const { exec } = await import('node:child_process');
      const util = await import('node:util');
      const execAsync = util.promisify(exec);
      const os = await import('node:os');

      // Create a unique temporary directory
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-build-'));
      const texFilePath = path.join(tmpDir, 'resume.tex');

      // Write .tex file
      fs.writeFileSync(texFilePath, finalResumeContent);

      try {
        // Run pdflatex (twice for references if needed, but once is usually fine for this simple structure)
        // -interaction=nonstopmode ensures it doesn't hang on errors
        // -output-directory ensures PDF goes to temp folder
        await execAsync(`pdflatex -interaction=nonstopmode -output-directory=${tmpDir} ${texFilePath}`);

        const pdfPath = path.join(tmpDir, 'resume.pdf');

        if (fs.existsSync(pdfPath)) {
          const pdfBuffer = fs.readFileSync(pdfPath);

          // Clean up
          fs.rmSync(tmpDir, { recursive: true, force: true });

          // Return PDF
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="resume.pdf"',
            },
          });
        }
      } catch (execError) {
        console.warn('PDF Compilation failed (likely no pdflatex installed), returning LaTeX instead.', execError);
        // Fallthrough to return LaTeX
        // Cleanup even on fail
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }

    } catch (e) {
      console.error("Critical error in PDF generation logic", e);
    }

    // Default Fallback: Return LaTeX JSON (if PDF generation failed)
    return NextResponse.json({
      success: true,
      message: 'Generated LaTeX (PDF compilation failed or skipped)',
      latex: finalResumeContent
    });

  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume sections' },
      { status: 500 }
    );
  }
}
