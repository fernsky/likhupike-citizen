import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileCards } from "@/components/profile/profile-cards";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "seo.profile" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage(props: { params: Params }) {
  const params = await props.params;
  const { locale } = params;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileHeader locale={locale} />
        <ProfileCards locale={locale} />
      </div>
    </DashboardLayout>
  );
}
