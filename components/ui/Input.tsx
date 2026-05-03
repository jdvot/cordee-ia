import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
