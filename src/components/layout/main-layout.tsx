import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NavLinks } from "./nav-links";

interface MainLayoutProps {
  children: React.ReactNode;
  /**
   * Whether to show the full header with navigation
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show the full footer
   * @default true
   */
  showFooter?: boolean;
}

export default function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  const t = useTranslations();

  // Define navigation links
  const navLinks = [
    { href: "/", label: t("common.navigation.home") },
    { href: "/profile", label: t("common.navigation.myProfile") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.svg"
                    alt={t("common.appName")}
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                  <span className="font-bold hidden md:inline-block">
                    {t("common.appName")}
                  </span>
                </Link>
              </div>

              {/* Client component for nav links with active state */}
              <NavLinks links={navLinks} />

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ModeToggle />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                >
                  <Link href="/login">{t("common.navigation.login")}</Link>
                </Button>
                <Button asChild size="sm" className="hidden md:flex">
                  <Link href="/register">
                    {t("common.navigation.register")}
                  </Link>
                </Button>

                {/* Mobile menu button would go here */}
              </div>
            </div>
          </Container>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {showFooter && (
        <footer className="border-t bg-muted/40">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between py-8">
              <div className="flex flex-col items-center md:items-start">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.svg"
                    alt={t("common.appName")}
                    width={24}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <span className="font-semibold">{t("common.appName")}</span>
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  &copy; {new Date().getFullYear()} Government of Nepal. All
                  rights reserved.
                </p>
              </div>

              <div className="flex gap-6 mt-4 md:mt-0">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
}
