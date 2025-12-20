import { SectionType } from './types';

export const getEmptyContent = (type: SectionType) => {
    switch (type) {
        case 'header': return { name: '', phone: '', email: '', linkedin: '', github: '', links: [] };
        case 'header-name': return { name: '', phone: '', email: '', linkedin: '', github: '', links: [] };
        case 'header-contact': return { name: '', phone: '', email: '', linkedin: '', github: '', links: [] };
        case 'long-text': return { text: '' };
        case 'standard-list': return {
            items: [{
                id: crypto.randomUUID(),
                title: '',
                subtitle: '',
                dateFrom: '',
                dateTo: '',
                location: '',
                description: '',
                isVisible: true
            }]
        };
        case 'detailed-list': return {
            items: [{
                id: crypto.randomUUID(),
                title: '',
                subtitle: '',
                dateFrom: '',
                dateTo: '',
                location: '',
                points: [{ text: '', isVisible: true }],
                isVisible: true
            }]
        };
        case 'grouped-list': return {
            groups: [{
                id: crypto.randomUUID(),
                category: '',
                items: [{ name: '', isVisible: true }],
                isVisible: true
            }]
        };
        default: return {};
    }
};
// URL Helpers
export const cleanUrl = (url: string): string => {
    if (!url) return '';
    return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
};

export const formatUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
};
