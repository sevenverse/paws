import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ResumeData } from '@/lib/types';
import { defaultResumeData } from '@/lib/defaults';
import { migrateResumeData } from '@/lib/migrations';

const dataDir = path.join(process.cwd(), 'data');
const resumePath = path.join(dataDir, 'resume.json');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        if (fs.existsSync(resumePath)) {
            const content = fs.readFileSync(resumePath, 'utf-8');
            const rawData = JSON.parse(content);
            const migratedData = migrateResumeData(rawData);
            return NextResponse.json(migratedData);
        } else {
            return NextResponse.json(defaultResumeData);
        }
    } catch (error) {
        console.error('Error reading resume:', error);
        return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data: ResumeData = await request.json();
        fs.writeFileSync(resumePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, message: 'Saved successfully' });
    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
    }
}
