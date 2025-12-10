import {
  ResumeData,
  Section,
  HeaderContent,
  LongTextContent,
  StandardListContent,
  DetailedListContent,
  GroupedListContent
} from './types';

export function generateHeader(content: HeaderContent): string {
  const links = content.links && content.links.length > 0
    ? content.links.filter(l => l.isVisible)
    : [
      content.linkedin ? { text: content.linkedin, url: `https://${content.linkedin}`, isVisible: true } : null,
      content.github ? { text: content.github, url: `https://${content.github}`, isVisible: true } : null
    ].filter(l => l !== null);

  const linkStrings = links.map(link =>
    `\\href{${link?.url.startsWith('http') ? link.url : 'https://' + link?.url}}{\\underline{${link?.text}}}`
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
      {${item.subtitle}}{${item.date}}
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
      {${item.subtitle}}{${item.date}}
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

export function generateSection(section: Section): string {
  if (!section.isVisible) return '';

  switch (section.type) {
    case 'header':
      return generateHeader(section.content as HeaderContent);
    case 'long-text':
      return generateLongText(section.title, section.content as LongTextContent);
    case 'standard-list':
      return generateStandardList(section.title, section.content as StandardListContent);
    case 'detailed-list':
      return generateDetailedList(section.title, section.content as DetailedListContent);
    case 'grouped-list':
      return generateGroupedList(section.title, section.content as GroupedListContent);
    default:
      return '';
  }
}
