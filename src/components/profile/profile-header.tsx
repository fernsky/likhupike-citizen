"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileHeaderProps {
  locale: string;
}

export function ProfileHeader({ locale }: ProfileHeaderProps) {
  const t = useTranslations("profile");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-4 sm:mt-0 flex gap-3">
        <Button variant="outline" asChild>
          <Link href={`/${locale}/dashboard/profile/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
