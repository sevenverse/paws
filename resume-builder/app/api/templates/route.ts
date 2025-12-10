import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Template } from '@/lib/types';

const templatesDir = path.join(process.cwd(), 'data/templates');

// Ensure directory exists
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
}

export async function GET() {
    try {
        const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
        const templates: Template[] = files.map(file => {
            const filePath = path.join(templatesDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        });

        // Sort by lastUpdated desc
        templates.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error reading templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const template: Template = await request.json();

        if (!template.id || !template.name) {
            return NextResponse.json({ error: 'Invalid template data' }, { status: 400 });
        }

        const filePath = path.join(templatesDir, `${template.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(template, null, 2));

        return NextResponse.json({ success: true, template });
    } catch (error) {
        console.error('Error saving template:', error);
        return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
    }
}
