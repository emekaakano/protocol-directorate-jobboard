import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-jb-text"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-jb-danger">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[120px] w-full rounded-xl border border-jb-border bg-white px-3 py-2.5 text-sm text-jb-text",
            "placeholder:text-jb-text-muted resize-y",
            "focus:outline-none focus:ring-2 focus:ring-jb-primary focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            error && "border-jb-danger focus:ring-jb-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-jb-danger">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-jb-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
