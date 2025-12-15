import React, { useRef, useState, useEffect } from 'react';
import { ResumeData } from '@/lib/types';
import { SectionPreview, getFontFamily } from './SectionPreviews';

interface LiveResumePreviewProps {
    data: ResumeData;
}

export function LiveResumePreview({ data }: LiveResumePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');

    // Dimensions in px at 96 DPI
    // A4: 210mm x 297mm -> ~794px x 1123px
    // Letter: 8.5in x 11in -> 816px x 1056px
    const dimensions = {
        a4: { width: 794, height: 1123, widthMm: 210, heightMm: 297 },
        letter: { width: 816, height: 1056, widthMm: 215.9, heightMm: 279.4 }
    };

    const currentDim = dimensions[paperSize];

    useEffect(() => {
        if (data.settings?.paperSize) {
            setPaperSize(data.settings.paperSize === 'letterpaper' ? 'letter' : 'a4');
        }
    }, [data.settings?.paperSize]);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;

                // Fit Width Logic
                const padding = 16;
                const availableWidth = Math.max(containerWidth - padding, 200);
                const newScale = availableWidth / currentDim.width;

                setScale(newScale);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [currentDim.width]);

    const fontFamily = getFontFamily(data.settings?.font);

    return (
        <div
            className="w-full flex justify-center sticky top-8 bg-slate-100/50 rounded-lg border border-slate-200"
            style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto', overflowX: 'hidden' }}
            ref={containerRef}
        >
            <div
                style={{
                    // visual dimensions of the wrapper match the scaled resume
                    width: currentDim.width * scale,
                    minHeight: currentDim.height * scale,
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    position: 'relative',
                    // This wrapper ensures the scrollable area knows the true height
                }}
            >
                <div
                    className="bg-white shadow-2xl"
                    style={{
                        width: currentDim.width,
                        minHeight: currentDim.height, // Starts at A4/Letter, grows if content overflows
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left', // We wrap it tightly, so top-left is easier to position
                        boxSizing: 'border-box',
                        fontFamily: fontFamily,
                        fontSize: `${data.settings?.fontSize || 10}pt`,
                        lineHeight: data.settings?.lineHeight || 1.4,
                        color: 'black',
                        padding: (() => {
                            const m = data.settings?.margin;
                            if (typeof m === 'object' && m !== null) {
                                return `${m.top || 20}mm ${m.right || 20}mm ${m.bottom || 20}mm ${m.left || 20}mm`;
                            }
                            const val = typeof m === 'number' ? m * 25.4 : 20;
                            return `${val}mm ${val}mm ${val}mm ${val}mm`;
                        })(),
                    }}
                >
                    {data.sections
                        .filter(s => s.isVisible !== false)
                        .map(section => (
                            <div key={section.id}>
                                <SectionPreview
                                    type={section.type}
                                    title={section.title}
                                    settings={data.settings}
                                    content={section.content}
                                    isLivePreview={true}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
