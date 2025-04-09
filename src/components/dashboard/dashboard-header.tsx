"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DashboardHeaderProps {
  locale: string;
}

export function DashboardHeader({ locale }: DashboardHeaderProps) {
  const t = useTranslations("dashboard.header");
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("welcome")}</h1>
        <p className="text-muted-foreground">{t("welcomeMessage")}</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button asChild>
          <Link href={`/${locale}/dashboard/profile`}>
            {t("completeProfile")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
