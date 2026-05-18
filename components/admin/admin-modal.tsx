"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface AdminModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl"
};

export function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  size = "lg"
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/45 p-4" onClick={onClose}>
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto bg-[#fbf8f1] shadow-[0_20px_60px_rgba(44,37,32,0.22)] ${sizeClasses[size]}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-linen-dark bg-[#fbf8f1] px-6 py-5 md:px-8">
          <div>
            <h2 className="font-display text-3xl font-light">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-7 text-text-muted">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="text-earth transition-colors hover:text-charcoal" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
