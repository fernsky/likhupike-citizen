"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  Home,
  User,
  FileText,
  AlertCircle,
  Settings,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardSidebar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: profile } = useSelector((state: RootState) => state.profile);

  // Profile verification status tags
  const isProfileComplete = profile?.status === "ACTIVE";
  const isProfilePending =
    profile?.status === "PENDING_REGISTRATION" ||
    profile?.status === "UNDER_REVIEW";
  const needsAction = profile?.status === "ACTION_REQUIRED";

  // Check if current route is active
  const isActive = (path: string) => {
    // Extract the base path for comparison (e.g., /en/dashboard/profile -> /dashboard/profile)
    const basePath = pathname.split("/").slice(2).join("/");
    const baseRoutePath = path.split("/").slice(2).join("/");
    return (
      basePath === baseRoutePath || basePath.startsWith(`${baseRoutePath}/`)
    );
  };

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Navigation items
  const navigationItems = [
    {
      name: t("dashboard.menu.home"),
      href: `/${locale}/dashboard`,
      icon: Home,
      exact: true,
    },
    {
      name: t("dashboard.menu.profile"),
      href: `/${locale}/dashboard/profile`,
      icon: User,
      badge: needsAction
        ? "action"
        : isProfileComplete
          ? "verified"
          : "pending",
    },
    {
      name: t("dashboard.menu.documents"),
      href: `/${locale}/dashboard/documents`,
      icon: FileText,
    },
    {
      name: t("dashboard.menu.notifications"),
      href: `/${locale}/dashboard/notifications`,
      icon: AlertCircle,
      // Optional notification count
      notificationCount: 0,
    },
    {
      name: t("dashboard.menu.settings"),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
    },
    {
      name: t("dashboard.menu.activity"),
      href: `/${locale}/dashboard/activity`,
      icon: BarChart3,
    },
  ];

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700",
          "transition-all duration-300 ease-in-out z-40",
          isMobile
            ? "fixed left-0 top-16 bottom-0 w-64"
            : "w-64 hidden lg:block"
        )}
      >
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="py-4 px-3">
            {/* Verification Status */}
            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-sm font-medium mb-2">
                {t("dashboard.sidebar.status")}
              </h3>
              <div className="flex items-center">
                {isProfileComplete ? (
                  <Badge
                    variant="default"
                    className="w-full justify-center py-1"
                  >
                    {t("dashboard.sidebar.verified")}
                  </Badge>
                ) : isProfilePending ? (
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-1"
                  >
                    {t("dashboard.sidebar.pending")}
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="w-full justify-center py-1"
                  >
                    {t("dashboard.sidebar.actionRequired")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md group",
                      active
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          active
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                        )}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    {/* Display badge or notification count */}
                    {item.badge && (
                      <Badge
                        variant={
                          item.badge === "verified"
                            ? "default"
                            : item.badge === "pending"
                              ? "outline"
                              : "destructive"
                        }
                        className="text-[10px] h-5 whitespace-nowrap"
                      >
                        {item.badge === "verified" &&
                          t("dashboard.sidebar.verified")}
                        {item.badge === "pending" &&
                          t("dashboard.sidebar.pending")}
                        {item.badge === "action" &&
                          t("dashboard.sidebar.action")}
                      </Badge>
                    )}

                    {item.notificationCount && item.notificationCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-[20px] px-1"
                      >
                        {item.notificationCount}
                      </Badge>
                    )}

                    {!item.badge && !item.notificationCount && (
                      <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Helpful information block */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="px-3 mb-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t("dashboard.sidebar.helpSection")}
                </h4>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-3">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  {t("dashboard.sidebar.helpTitle")}
                </h5>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  {t("dashboard.sidebar.helpText")}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400"
                >
                  {t("dashboard.sidebar.helpAction")}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
