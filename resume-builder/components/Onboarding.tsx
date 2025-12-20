import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProps {
    onStart: () => void;
    onImport: () => void;
}

export function Onboarding({ onStart, onImport }: OnboardingProps) {
    return (
        <div className="fixed inset-0 z-40 flex bg-slate-50 font-sans animate-in fade-in duration-500">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24 xl:px-32 z-10 relative">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                            Let&apos;s start building<br />
                            <span className="text-emerald-700">your resume.</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                            Create a professional resume in minutes with our clean, distraction-free builder.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            onClick={onImport}
                            variant="outline"
                            className="h-14 px-8 text-base border-2 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all rounded-xl gap-2 group"
                        >
                            <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            Upload existing resume
                        </Button>

                        <Button
                            onClick={onStart}
                            className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-900/20 transition-all rounded-xl gap-2 group"
                        >
                            <Keyboard className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            Start typing
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Art Section */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                {/* Abstract Background Base */}
                <div className="absolute inset-0 bg-slate-50" />

                {/* Gradient Overlay - Fading Left */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent z-10" />

                {/* Abstract Art Shapes */}
                <div className="absolute inset-0 opacity-100">
                    {/* Main Emerald Flow */}
                    <div className="absolute -right-[10%] top-[10%] w-[80%] h-[120%] bg-emerald-900/5 blur-3xl rounded-full transform -rotate-12" />
                    <div className="absolute -right-[5%] top-[20%] w-[60%] h-[100%] bg-emerald-600/10 blur-3xl rounded-full transform -rotate-12" />

                    {/* Red/Rose Accents */}
                    <div className="absolute right-[10%] top-[30%] w-[40%] h-[40%] bg-rose-500/10 blur-[100px] rounded-full" />
                    <div className="absolute right-[20%] bottom-[10%] w-[30%] h-[30%] bg-rose-400/20 blur-[80px] rounded-full mix-blend-multiply" />

                    {/* Dynamic Lines/shapes for "Art" feel */}
                    <div className="absolute right-0 top-0 bottom-0 w-full opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M100 0 C 60 0 60 100 20 100 L 100 100 Z" fill="url(#grad1)" />
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" /> {/* Emerald */}
                                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.2" /> {/* Dark Emerald */}
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-full opacity-20 transform translate-x-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M100 20 C 70 20 70 80 40 80 L 100 100 Z" fill="url(#grad2)" />
                            <defs>
                                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" /> {/* Rose */}
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
