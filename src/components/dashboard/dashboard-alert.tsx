"use client";

import { useGetMyProfileQuery } from "@/store/services/citizenApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function DashboardAlert() {
  const t = useTranslations();
  const { data: profile, isLoading } = useGetMyProfileQuery();

  if (isLoading || !profile) {
    return null;
  }

  // Return the appropriate alert based on profile state
  if (profile.state === "UNDER_REVIEW") {
    return (
      <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>{t("alerts.underReviewTitle")}</AlertTitle>
        <AlertDescription>
          {t("alerts.underReviewDescription")}
        </AlertDescription>
      </Alert>
    );
  }

  if (profile.state === "ACTION_REQUIRED") {
    return (
      <Alert className="bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>{t("alerts.actionRequiredTitle")}</AlertTitle>
        <AlertDescription>
          {profile.stateNote || t("alerts.actionRequiredDescription")}
        </AlertDescription>
      </Alert>
    );
  }

  if (profile.state === "APPROVED") {
    return (
      <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 mb-6">
        <CheckCircle className="h-5 w-5" />
        <AlertTitle>{t("alerts.approvedTitle")}</AlertTitle>
        <AlertDescription>{t("alerts.approvedDescription")}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
