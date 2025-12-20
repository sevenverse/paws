import {
  formatUrl
} from './helpers';
import {
  ResumeData,
  Section,
  HeaderContent,
  LongTextContent,
  StandardListContent,
  DetailedListContent,
  GroupedListContent,
  ResumeSettings
} from './types';

// Helper to generate ONLY the Name (Huge, Bold)
function generateHeaderName(content: HeaderContent, settings: ResumeSettings): string {
  const { name } = content;
  // The 'font' setting is not directly used here for the name style,
  // but it's passed in case it's needed for other header parts or future extensions.
  // const font = settings.font || 'serif'; // Keeping this commented as it's not used in the provided snippet

  // Name Style
  const nameStyle = `\\Huge\\bfseries\\scshape`;

  // Using minipage to ensure full width block
  return `
% Header Name Section
\\begin{minipage}[c]{1\\textwidth}
    \\centering
    {${nameStyle} ${name}} \\\\[0.5em]
\\end{minipage}
`;
}

// Helper to generate ONLY the Contact Info (Ribbon)
function generateHeaderContact(content: HeaderContent): string {
  const { phone, email, linkedin, github, links } = content;

  // Collecting contact items
  const contactItems: string[] = [];
  if (phone) contactItems.push(phone);
  if (email) contactItems.push(`\\href{mailto:${email}}{${email}}`);
  if (email) contactItems.push(`\\href{mailto:${email}}{${email}}`);

  // Standardized Social Links
  if (linkedin) contactItems.push(`\\href{${formatUrl(linkedin)}}{LinkedIn}`);
  if (github) contactItems.push(`\\href{${formatUrl(github)}}{GitHub}`);

  if (links) {
    links.forEach(link => {
      if (link.isVisible) {
        contactItems.push(`\\href{${formatUrl(link.url)}}{${link.text}}`);
      }
    });
  }

  if (contactItems.length === 0) return '';

  return `
% Header Contact Section
\\begin{center}
    \\small 
    ${contactItems.join(' $\\cdot$ ')}
\\end{center}
`;
}

export function generateHeader(content: HeaderContent): string {
  const explicitLinks = content.links ? content.links.filter(l => l.isVisible) : [];

  const socialLinks = [
    (content.linkedin && content.linkedinVisible !== false) ? { text: 'LinkedIn', url: formatUrl(content.linkedin), isVisible: true } : null,
    (content.github && content.githubVisible !== false) ? { text: 'GitHub', url: formatUrl(content.github), isVisible: true } : null
  ].filter(l => l !== null);

  const links = [...socialLinks, ...explicitLinks];

  const linkStrings = links.map(link =>
    `\\href{${formatUrl(link?.url || '')}}{\\underline{${link?.text}}}`
  ).join(' $|$ ');

  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${content.name}} \\\\ \\vspace{1pt}
    \\small ${content.phone} $|$ \\href{mailto:${content.email}}{\\underline{${content.email}}} 
    ${linkStrings ? '$|$ ' + linkStrings : ''}
\\end{center}`;
}

function generateLongText(title: string, content: LongTextContent): string {
  if (!content.text) return '';
  return `\\section{${title}}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${content.text}
    }}
  \\end{itemize}`;
}

function generateStandardList(title: string, content: StandardListContent): string {
  const items = content.items
    .filter(item => item.isVisible !== false)
    .map(item => `
    \\resumeSubheading
      {${item.title}}{${item.location}}
      {${item.subtitle}}{${item.dateFrom}${item.dateTo ? ` -- ${item.dateTo}` : ''}}
      ${item.description ? `\\resumeItem{${item.description}}` : ''}
  `).join('');

  if (!items) return '';

  return `\\section{${title}}
  \\begin{itemize}[leftmargin=0.15in, label={}]
${items}
  \\end{itemize}`;
}

function generateDetailedList(title: string, content: DetailedListContent): string {
  const items = content.items
    .filter(item => item.isVisible !== false)
    .map(item => {
      const points = item.points
        .filter(p => p.isVisible !== false)
        .map(p => `        \\resumeItem{${p.text}}`).join('\n');
      return `
    \\resumeSubheading
      {${item.title}}{${item.location}}
      {${item.subtitle}}{${item.dateFrom} -- ${item.dateTo}}
      \\begin{itemize}
${points}
      \\end{itemize}`;
    }).join('\n');

  if (!items) return '';

  return `\\section{${title}}
  \\begin{itemize}[leftmargin=0.15in, label={}]
${items}
  \\end{itemize}`;
}

function generateGroupedList(title: string, content: GroupedListContent): string {
  const items = content.groups
    .filter(g => g.isVisible !== false)
    .map(g => {
      const skillNames = g.items
        .filter(i => i.isVisible !== false)
        .map(i => i.name)
        .join(', ');
      return `     \\textbf{${g.category}}{: ${skillNames}} \\\\`;
    }).join('\n');

  if (!items) return '';

  return `\\section{${title}}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${items}
    }}
 \\end{itemize}`;
}

// The user provided a partial `generateLatex` function, but it seems to be a mix-up with the old `generateHeader` logic.
// I'm assuming the intent was to add the new helper functions and update `generateSection` to handle new types.
// If `generateLatex` is intended to be a new top-level function, it would need a full definition.
// For now, I'm only applying the changes to `generateSection` as per the instruction's structure.

export function generateSection(section: Section, settings: ResumeSettings): string { // Added settings parameter
  if (!section.isVisible) return '';

  const content = section.content; // Moved content declaration here for new switch structure
  let latex = ''; // Initialize latex string for accumulation

  switch (section.type) {
    case 'header':
      // The original generateHeader function is still available if needed,
      // but the instruction implies a shift towards header-name and header-contact.
      // If 'header' type should now use the new helpers, this case needs adjustment.
      // For now, keeping it as is, assuming 'header' is distinct from the new types.
      latex += generateHeader(content as HeaderContent);
      break;
    case 'header-name':
      latex += generateHeaderName(content as HeaderContent, settings);
      break;
    case 'header-contact':
      latex += generateHeaderContact(content as HeaderContent);
      break;
    case 'long-text':
      latex += generateLongText(section.title, content as LongTextContent);
      break;
    case 'standard-list':
      latex += generateStandardList(section.title, content as StandardListContent);
      break;
    case 'detailed-list':
      latex += generateDetailedList(section.title, content as DetailedListContent);
      break;
    case 'grouped-list':
      latex += generateGroupedList(section.title, content as GroupedListContent);
      break;
    default:
      return '';
  }
  return latex;
}
