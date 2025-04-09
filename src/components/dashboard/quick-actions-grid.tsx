"use client";

import { useTranslations } from "next-intl";
import { QuickActionCard } from "./quick-action-card";

interface QuickActionsGridProps {
  locale: string;
}

export function QuickActionsGrid({ locale }: QuickActionsGridProps) {
  const t = useTranslations("dashboard");
  return (
    <>
      <h2 className="text-xl font-semibold mt-8 mb-4">
        {t("quickActions.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title={t("quickActions.uploadDocuments")}
          description={t("quickActions.uploadDocumentsDesc")}
          href={`/${locale}/dashboard/documents`}
        />
        <QuickActionCard
          title={t("quickActions.updateProfile")}
          description={t("quickActions.updateProfileDesc")}
          href={`/${locale}/dashboard/profile/edit`}
        />
        <QuickActionCard
          title={t("quickActions.checkStatus")}
          description={t("quickActions.checkStatusDesc")}
          href={`/${locale}/dashboard/profile/verification`}
        />
        <QuickActionCard
          title={t("quickActions.viewNotifications")}
          description={t("quickActions.viewNotificationsDesc")}
          href={`/${locale}/dashboard/notifications`}
        />
      </div>
    </>
  );
}
