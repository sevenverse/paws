import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'data/templates');

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const filePath = path.join(templatesDir, `${id}.json`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ success: true, message: 'Template deleted' });
        } else {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}
