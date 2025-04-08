import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   * @default "max-w-7xl"
   */
  maxWidth?:
    | "max-w-5xl"
    | "max-w-6xl"
    | "max-w-7xl"
    | "max-w-screen-xl"
    | string;
}

/**
 * Container component for consistent layout spacing
 */
export function Container({
  className,
  children,
  maxWidth = "max-w-7xl",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(maxWidth, "mx-auto w-full px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
