"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetMyProfileQuery } from "@/store/services/citizenApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePhotoCard } from "./profile-photo-card";
import { ProfileDetailsTab } from "./tabs/profile-details-tab";
import { ProfileDocumentsTab } from "./tabs/profile-documents-tab";
import { ProfileVerificationTab } from "./tabs/profile-verification-tab";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCardsProps {
  locale: string;
}

export function ProfileCards({ locale }: ProfileCardsProps) {
  const t = useTranslations("profile");
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [activeTab, setActiveTab] = useState("details");

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div>Failed to load profile data</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Photo & Status Card */}
      <ProfilePhotoCard profile={profile} />

      {/* Main profile content */}
      <div className="lg:col-span-2">
        <Tabs
          defaultValue="details"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
            <TabsTrigger value="documents">{t("tabs.documents")}</TabsTrigger>
            <TabsTrigger value="verification">
              {t("tabs.verification")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProfileDetailsTab profile={profile} />
          </TabsContent>

          <TabsContent value="documents">
            <ProfileDocumentsTab profile={profile} locale={locale} />
          </TabsContent>

          <TabsContent value="verification">
            <ProfileVerificationTab profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-[500px] w-full rounded-xl" />
      <div className="lg:col-span-2">
        <Skeleton className="h-10 w-60 mb-4" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  );
}
