"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  LogOut,
  Menu,
  Settings,
  User,
  Bell,
  ChevronDown,
  Globe,
} from "lucide-react";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { data: citizenProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    // Replace the locale segment in the URL
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${pathWithoutLocale}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}/login`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="Digital Profile System"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-lg font-bold tracking-tight hidden md:inline-block">
                {t("common.appName")}
              </span>
            </Link>
          </div>

          {/* Right section: notifications, language, profile */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>
                  {t("dashboard.notifications.title")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  {/* Empty state */}
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.notifications.empty")}
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline-block">
                    {locale === "en" ? "English" : "नेपाली"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={cn(
                      "cursor-pointer",
                      locale === loc && "bg-accent"
                    )}
                  >
                    {loc === "en" ? "English" : "नेपाली"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {citizenProfile?.documents?.photo?.url ? (
                      <Image
                        src={citizenProfile.documents.photo.url}
                        alt={citizenProfile.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                  <span className="hidden md:inline-block font-medium">
                    {citizenProfile?.name?.split(" ")[0] ||
                      t("dashboard.user.greeting")}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {citizenProfile?.name || t("dashboard.user.profile")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${locale}/dashboard/profile`}
                    className="cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("dashboard.menu.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${locale}/dashboard/settings`}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t("dashboard.menu.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("common.navigation.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
