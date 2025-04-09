"use client";

import React from "react";
import { cn } from "@/lib/utils";

type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * A component that visually hides content while keeping it accessible to screen readers.
 * This is useful for providing labels or descriptions for screen reader users
 * without affecting the visual layout.
 */
export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  VisuallyHiddenProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}
      {...props}
    />
  );
});
VisuallyHidden.displayName = "VisuallyHidden";
