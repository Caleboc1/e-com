import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-none border border-clay bg-transparent px-4 py-2 text-sm text-charcoal outline-none transition-colors placeholder:text-text-muted focus:border-charcoal",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
