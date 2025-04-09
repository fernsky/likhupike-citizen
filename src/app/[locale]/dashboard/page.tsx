import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardAlert } from "@/components/dashboard/dashboard-alert";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { QuickActionsGrid } from "@/components/dashboard/quick-actions-grid";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "seo.dashboard" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage(props: { params: Params }) {
  const params = await props.params;
  const { locale } = params;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader locale={locale} />
        <DashboardAlert />
        <ProfileCompletionCard locale={locale} />
        <QuickActionsGrid locale={locale} />
      </div>
    </DashboardLayout>
  );
}
