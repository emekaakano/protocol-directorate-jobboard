import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, hint, options, placeholder, className, id, ...props },
    ref
  ) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "h-10 w-full appearance-none rounded-xl border border-jb-border bg-white pl-3 pr-9 text-sm text-jb-text",
              "focus:outline-none focus:ring-2 focus:ring-jb-primary focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
              error && "border-jb-danger focus:ring-jb-danger",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-jb-text-muted"
            size={16}
          />
        </div>
        {error && <p className="text-xs text-jb-danger">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-jb-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
