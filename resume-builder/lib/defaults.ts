import { ResumeData } from './types';

export const defaultResumeData: ResumeData = {
    header: {
        name: "First Last",
        phone: "123-456-7890",
        email: "email@example.com",
        linkedin: "linkedin.com/in/username",
        github: "github.com/username",
        links: []
    },
    sections: [
        {
            id: "summary",
            type: "long-text",
            title: "Professional Summary",
            isVisible: true,
            content: {
                text: "Results-oriented software engineer with expertise in full-stack development. Proven track record of delivering scalable web applications and optimizing system performance. Passionate about learning new technologies and solving complex problems."
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
                        title: "University Name", // School
                        subtitle: "Bachelor of Science in Computer Science", // Degree
                        location: "City, State",
                        date: "Aug. 2020 -- May 2024",
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
                        title: "Company Name",
                        location: "City, State",
                        subtitle: "Software Engineer Intern", // Role
                        date: "May 2023 -- Aug. 2023",
                        points: [
                            { text: "Developed a full-stack web application using React and Node.js.", isVisible: true },
                            { text: "Optimized database queries, reducing load times by 30%.", isVisible: true },
                            { text: "Collaborated with a team of 4 engineers to deliver features on time.", isVisible: true }
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
                        title: "Project Name",
                        location: "",
                        subtitle: "React, Node.js, MongoDB", // Technologies
                        date: "June 2023 -- Present",
                        points: [
                            { text: "Designed and built a scalable platform for X.", isVisible: true },
                            { text: "Implemented authentication using JWT and OAuth.", isVisible: true }
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
                    { id: "g1", category: "Languages", items: [{ name: "Java", isVisible: true }, { name: "Python", isVisible: true }, { name: "JavaScript", isVisible: true }, { name: "SQL", isVisible: true }], isVisible: true },
                    { id: "g2", category: "Frameworks", items: [{ name: "React", isVisible: true }, { name: "Node.js", isVisible: true }, { name: "Spring Boot", isVisible: true }], isVisible: true },
                    { id: "g3", category: "Developer Tools", items: [{ name: "Git", isVisible: true }, { name: "Docker", isVisible: true }, { name: "AWS", isVisible: true }, { name: "Linux", isVisible: true }], isVisible: true }
                ]
            }
        },
        {
            id: "achievements",
            type: "standard-list",
            title: "Achievements",
            isVisible: true,
            content: {
                items: [
                    {
                        id: "1",
                        title: "Hackathon Winner",
                        subtitle: "",
                        location: "",
                        date: "Nov. 2023",
                        description: "Secured 1st place in the Global Tech Hackathon for creating an innovative AI solution.",
                        isVisible: true,
                    }
                ]
            }
        },
        {
            id: "certifications",
            type: "standard-list",
            title: "Certifications",
            isVisible: true,
            content: {
                items: [
                    {
                        id: "1",
                        title: "AWS Certified Solutions Architect", // Name
                        subtitle: "Associate Level", // Type
                        location: "Amazon Web Services", // Issuer
                        date: "Sep. 2023",
                        isVisible: true,
                    }
                ]
            }
        }
    ]
};
