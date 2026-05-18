import { useId } from "react";

import { cn } from "@/lib/utils";
import type { PatternVariant } from "@/types";

interface AdirePatternProps {
  variant?: PatternVariant;
  color?: string;
  opacity?: number;
  className?: string;
}

export function AdirePattern({
  variant = "circle",
  color = "white",
  opacity = 0.35,
  className
}: AdirePatternProps) {
  const reactId = useId();
  const id = `adire-${variant}-${color.replace("#", "")}-${reactId.replace(/:/g, "")}`;

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
      viewBox="0 0 150 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {variant === "circle" && (
          <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="10" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="14" cy="14" r="5" fill="none" stroke={color} strokeWidth="0.6" />
            <circle cx="14" cy="14" r="1.5" fill={color} />
          </pattern>
        )}
        {variant === "hex" && (
          <pattern id={id} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <polygon points="11,1 21,7 21,17 11,21 1,17 1,7" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="11" cy="11" r="3" fill={color} opacity="0.5" />
          </pattern>
        )}
        {variant === "grid" && (
          <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="16" height="16" fill="none" stroke={color} strokeWidth="0.8" />
            <rect x="7" y="7" width="6" height="6" fill={color} opacity="0.4" />
          </pattern>
        )}
        {variant === "cross" && (
          <pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M12 4v16M4 12h16" stroke={color} strokeWidth="0.8" />
            <circle cx="12" cy="12" r="2" fill={color} opacity="0.4" />
          </pattern>
        )}
      </defs>
      <rect width="150" height="200" fill={`url(#${id})`} />
    </svg>
  );
}
