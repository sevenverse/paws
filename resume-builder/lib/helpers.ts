import { SectionType } from './types';

export const getEmptyContent = (type: SectionType) => {
    switch (type) {
        case 'header': return { name: 'First Last', phone: '123-456-7890', email: 'email@example.com', linkedin: '', github: '', links: [] };
        case 'header-name': return { name: 'First Last', phone: '', email: '', linkedin: '', github: '', links: [] };
        case 'header-contact': return { name: '', phone: '123-456-7890', email: 'email@example.com', linkedin: 'linkedin.com/in/user', github: 'github.com/user', links: [] };
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
        case 'detailed-list': return { items: [] };
        case 'grouped-list': return { groups: [] };
        default: return {};
    }
};
