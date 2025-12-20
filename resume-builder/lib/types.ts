export interface ResumeSettings {
    font: 'serif' | 'sans' | 'mono' | 'cormorant' | 'charter' | 'fira' | 'roboto' | 'noto' | 'source';
    fontSize: '10pt' | '11pt' | '12pt';
    margin: number | { top: number; right: number; bottom: number; left: number }; // in inches
    paperSize: 'a4paper' | 'letterpaper';
    lineHeight?: number;
}

export interface ResumeData {
    header?: {
        name: string;
        phone: string;
        email: string;
        linkedin: string;
        github: string;
        links?: Array<{
            id: string;
            text: string;
            url: string;
            isVisible: boolean;
        }>;
    };
    settings?: ResumeSettings;
    sections: Section[];
}

export type SectionType = 'header' | 'header-name' | 'header-contact' | 'long-text' | 'standard-list' | 'detailed-list' | 'grouped-list';

export interface Section {
    id: string;
    type: SectionType;
    title: string;
    isVisible: boolean;
    content: HeaderContent | LongTextContent | StandardListContent | DetailedListContent | GroupedListContent;
}

// Template 0: Header
export interface HeaderContent {
    name: string;
    phone: string;
    email: string;
    linkedin: string;
    linkedinVisible?: boolean;
    github: string;
    githubVisible?: boolean;
    links?: Array<{
        id: string;
        text: string;
        url: string;
        isVisible: boolean;
    }>;
}

// Template 1: Long Text (Summary, Declaration)
export interface LongTextContent {
    text: string;
}

// Template 2: Standard List (Education, Certifications, Achievements - Simple)
export interface StandardListContent {
    items: Array<{
        id: string;
        title: string;       // School, Certification Name, Achievement Title
        subtitle: string;    // Degree, Issuer
        dateFrom: string;    // Start Date
        dateTo: string;      // End Date
        location: string;    // Location (optional)
        description?: string; // One-line description?
        isVisible: boolean;
    }>;
}

// Template 3: Detailed List (Experience, Projects)
export interface DetailedListContent {
    items: Array<{
        id: string;
        title: string;       // Company, Project Name
        subtitle: string;    // Role, Technologies
        dateFrom: string;
        dateTo: string;
        location: string;
        points: Array<{ text: string; isVisible: boolean }>;
        isVisible: boolean;
    }>;
}

// Template 4: Grouped List (Skills)
export interface GroupedListContent {
    groups: Array<{
        id: string;
        category: string; // "Languages", "Frameworks"
        items: Array<{ name: string; isVisible: boolean }>;
        isVisible: boolean;
    }>;
}

export interface Template {
    id: string;
    name: string;
    lastUpdated: string;
    data: ResumeData;
}
