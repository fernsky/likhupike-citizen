"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="hidden md:flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive(link.href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
