import { ResumeData } from './types';

export const defaultResumeData: ResumeData = {
    settings: {
        font: 'serif',
        fontSize: '10pt',
        margin: { top: 0.75, right: 0.75, bottom: 0.75, left: 0.75 },
        paperSize: 'a4paper',
        lineHeight: 1.5
    },
    sections: [
        {
            id: "header",
            type: "header",
            title: "Personal Details",
            isVisible: true,
            content: {
                name: "",
                phone: "",
                email: "",
                linkedin: "",
                github: "",
                links: []
            }
        },
        {
            id: "summary",
            type: "long-text",
            title: "Professional Summary",
            isVisible: true,
            content: {
                text: ""
            }
        },
        {
            id: "education",
            type: "standard-list",
            title: "Education",
            isVisible: true,
            content: {
                items: [
                    {
                        id: "1",
                        title: "", // School
                        subtitle: "", // Degree
                        location: "",
                        dateFrom: "",
                        dateTo: "",
                        isVisible: true,
                    }
                ]
            }
        },
        {
            id: "experience",
            type: "detailed-list",
            title: "Experience",
            isVisible: true,
            content: {
                items: [
                    {
                        id: "1",
                        title: "", // Company
                        location: "",
                        subtitle: "", // Role
                        dateFrom: "",
                        dateTo: "",
                        points: [
                            { text: "", isVisible: true }
                        ],
                        isVisible: true,
                    }
                ]
            }
        },
        {
            id: "projects",
            type: "detailed-list",
            title: "Projects",
            isVisible: true,
            content: {
                items: [
                    {
                        id: "1",
                        title: "", // Project Name
                        location: "",
                        subtitle: "", // Technologies
                        dateFrom: "",
                        dateTo: "",
                        points: [
                            { text: "", isVisible: true }
                        ],
                        isVisible: true,
                    }
                ]
            }
        },
        {
            id: "skills",
            type: "grouped-list",
            title: "Technical Skills",
            isVisible: true,
            content: {
                groups: [
                    {
                        id: "1",
                        category: "",
                        items: [{ name: "", isVisible: true }],
                        isVisible: true
                    }
                ]
            }
        }
    ]
};
