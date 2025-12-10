import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-emerald-300 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
