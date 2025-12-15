import React from 'react';
import { SectionType, HeaderContent, DetailedListContent, StandardListContent, GroupedListContent, LongTextContent, ResumeData } from '@/lib/types';
import { defaultResumeData } from '@/lib/defaults';

interface SectionPreviewProps {
    type: SectionType;
    title?: string;
    settings?: ResumeData['settings'];
    content?: any;
}

// Mimic LaTeX structure.tex styling
const LatexStyles = {
    fontFamily: '"Latin Modern Roman", "Computer Modern", "Times New Roman", serif',
    color: 'black',
    lineHeight: '1.2'
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full border-b border-black mb-2 pb-1 mt-4">
        <h3 className="uppercase text-lg font-bold tracking-wide" style={{ ...LatexStyles, fontVariant: 'small-caps' }}>
            {children}
        </h3>
    </div>
);

const SubHeading = ({ title, location, subtitle, date }: { title: string, location: string, subtitle: string, date: string }) => (
    <div className="mb-1">
        <div className="flex justify-between items-baseline">
            <span className="font-bold">{title}</span>
            <span>{location}</span>
        </div>
        <div className="flex justify-between items-center text-sm italic">
            <span>{subtitle}</span>
            <span>{date}</span>
        </div>
    </div>
);

const ResumeItem = ({ children }: { children: React.ReactNode }) => (
    <li className="text-sm leading-relaxed relative pl-2 before:content-['•'] before:absolute before:left-[-1rem] before:text-black">
        {children}
    </li>
);

// Preview Components
export const HeaderPreview = ({ content, variant = 'full' }: { content: HeaderContent, variant?: 'full' | 'name' | 'contact' }) => {
    const links = content.links?.filter(l => l.isVisible) || [];
    const linkText = [
        content.email && <span key="email" className="underline">{content.email}</span>,
        content.linkedin && <span key="linkedin" className="underline">{content.linkedin.replace('https://', '')}</span>,
        content.github && <span key="github" className="underline">{content.github.replace('https://', '')}</span>,
        ...links.map(l => <span key={l.id} className="underline">{l.text}</span>)
    ].filter(Boolean);

    const showName = variant === 'full' || variant === 'name';
    const showContact = variant === 'full' || variant === 'contact';

    return (
        <div className="text-center mb-4">
            {showName && (
                <h1 className="text-3xl font-normal uppercase mb-1" style={{ ...LatexStyles, fontVariant: 'small-caps' }}>
                    {content.name}
                </h1>
            )}
            {showContact && (
                <div className="text-sm space-x-2 flex items-center justify-center flex-wrap">
                    {content.phone && <span>{content.phone}</span>}
                    {linkText.map((item, i) => (
                        <React.Fragment key={i}>
                            <span>|</span>
                            {item}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export const DetailedListPreview = ({ title, content }: { title: string, content: DetailedListContent }) => (
    <div>
        <SectionTitle>{title}</SectionTitle>
        <div className="space-y-3">
            {content.items.map((item, idx) => (
                <div key={idx}>
                    <SubHeading
                        title={item.title}
                        location={item.location}
                        subtitle={item.subtitle}
                        date={item.date}
                    />
                    <ul className="list-none pl-4 space-y-0.5 mt-1">
                        {item.points.map((p, pIdx) => (
                            <ResumeItem key={pIdx}>{p.text}</ResumeItem>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

export const StandardListPreview = ({ title, content }: { title: string, content: StandardListContent }) => (
    <div>
        <SectionTitle>{title}</SectionTitle>
        <div className="space-y-2">
            {content.items.map((item, idx) => (
                <div key={idx}>
                    <SubHeading
                        title={item.title}
                        location={item.location}
                        subtitle={item.subtitle}
                        date={`${item.dateFrom}${item.dateTo ? ` – ${item.dateTo}` : ''}`}
                    />
                    {item.description && (
                        <div className="text-sm pl-0">
                            {item.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export const GroupedListPreview = ({ title, content }: { title: string, content: GroupedListContent }) => (
    <div>
        <SectionTitle>{title}</SectionTitle>
        <ul className="list-none pl-4 text-sm space-y-1">
            {content.groups.map((group, idx) => (
                <li key={idx}>
                    <span className="font-bold">{group.category}: </span>
                    <span>{group.items.map(i => i.name).join(', ')}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const LongTextPreview = ({ title, content }: { title: string, content: LongTextContent }) => (
    <div>
        <SectionTitle>{title}</SectionTitle>
        <div className="text-sm text-justify">
            {content.text}
        </div>
    </div>
);

export const getFontFamily = (font: string = 'serif') => {
    switch (font) {
        case 'sans': return '"Helvetica", "Arial", sans-serif';
        case 'cormorant': return '"Cormorant Garamond", "Garamond", serif';
        case 'charter': return '"Charter", "Bitstream Charter", serif';
        case 'fira': return '"Fira Sans", "Segoe UI", sans-serif';
        case 'roboto': return '"Roboto", "Segoe UI", sans-serif';
        case 'noto': return '"Noto Sans", "Segoe UI", sans-serif';
        case 'source': return '"Source Sans Pro", "Segoe UI", sans-serif';
        case 'serif': default: return '"Latin Modern Roman", "Computer Modern", "Times New Roman", serif';
    }
};

// ... interface code

interface SectionPreviewProps {
    type: SectionType;
    title?: string;
    settings?: ResumeData['settings'];
    content?: any;
    isLivePreview?: boolean;
}

export function SectionPreview({ type, title, settings, content: propsContent, isLivePreview = false }: SectionPreviewProps) {
    const defaultSection = defaultResumeData.sections.find(s => s.type === type);
    const content = propsContent || (defaultSection ? defaultSection.content : getEmptyContent(type));
    const displayTitle = title || defaultSection?.title || "Section Title";

    const fontFamily = getFontFamily(settings?.font);
    const combineStyles = { ...LatexStyles, fontFamily };

    // Header Handling
    if (type === 'header' || type === 'header-name' || type === 'header-contact') {
        const headerContent = propsContent || defaultResumeData.header || { name: 'First Last', email: 'email@example.com', phone: '123-456-7890', linkedin: '', github: '' };
        let variant: 'full' | 'name' | 'contact' = 'full';
        if (type === 'header-name') variant = 'name';
        if (type === 'header-contact') variant = 'contact';

        if (isLivePreview) {
            return (
                <div className="w-full mb-4" style={{ fontFamily }}>
                    <HeaderPreview content={headerContent} variant={variant} />
                </div>
            );
        }

        return (
            <div className="bg-white p-8 shadow-sm min-h-[150px] w-full" style={combineStyles}>
                <HeaderPreview content={headerContent} variant={variant} />
            </div>
        );
    }

    if (isLivePreview) {
        return (
            <div className="w-full mb-4" style={{ fontFamily }}>
                {type === 'detailed-list' && <DetailedListPreview title={displayTitle} content={content as DetailedListContent} />}
                {type === 'standard-list' && <StandardListPreview title={displayTitle} content={content as StandardListContent} />}
                {type === 'grouped-list' && <GroupedListPreview title={displayTitle} content={content as GroupedListContent} />}
                {type === 'long-text' && <LongTextPreview title={displayTitle} content={content as LongTextContent} />}
            </div>
        );
    }

    return (
        <div className="bg-white p-8 shadow-sm min-h-[200px] w-full overflow-hidden border border-slate-100" style={combineStyles}>
            {type === 'detailed-list' && <DetailedListPreview title={displayTitle} content={content as DetailedListContent} />}
            {type === 'standard-list' && <StandardListPreview title={displayTitle} content={content as StandardListContent} />}
            {type === 'grouped-list' && <GroupedListPreview title={displayTitle} content={content as GroupedListContent} />}
            {type === 'long-text' && <LongTextPreview title={displayTitle} content={content as LongTextContent} />}
        </div>
    );
}

function getEmptyContent(type: SectionType) {
    switch (type) {
        case 'header': return { name: '', phone: '', email: '', linkedin: '', github: '', links: [] };
        case 'long-text': return { text: 'Sample text.' };
        case 'standard-list': return { items: [] };
        case 'detailed-list': return { items: [] };
        case 'grouped-list': return { groups: [] };
    }
    return {};
}
