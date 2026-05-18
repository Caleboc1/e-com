import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-light transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-charcoal px-6 py-4 uppercase tracking-[0.2em] text-white hover:bg-earth",
        outline: "border border-clay bg-transparent px-6 py-4 uppercase tracking-[0.2em] text-charcoal hover:border-charcoal",
        ghost: "text-earth hover:text-charcoal",
        secondary: "bg-linen px-6 py-4 uppercase tracking-[0.2em] text-charcoal hover:bg-linen-dark"
      },
      size: {
        default: "",
        sm: "px-4 py-3 text-xs",
        lg: "px-8 py-5 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
