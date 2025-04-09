import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CitizenProfile } from "@/domains/citizen/types";
import { PhotoUploadCard } from "../document-uploads/photo-upload-card";
import { CitizenshipFrontUploadCard } from "../document-uploads/citizenship-front-upload-card";
import { CitizenshipBackUploadCard } from "../document-uploads/citizenship-back-upload-card";

interface ProfileDocumentsTabProps {
  profile: CitizenProfile;
  locale: string;
}

export function ProfileDocumentsTab({
  profile,
  locale,
}: ProfileDocumentsTabProps) {
  const t = useTranslations("profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.documents")}</CardTitle>
        <CardDescription>{t("documents.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CitizenshipFrontUploadCard
            title={t("documents.citizenshipFront")}
            description={t("documents.citizenshipFrontDesc")}
            documentInfo={profile.documents.citizenshipFront}
            locale={locale}
          />
          <CitizenshipBackUploadCard
            title={t("documents.citizenshipBack")}
            description={t("documents.citizenshipBackDesc")}
            documentInfo={profile.documents.citizenshipBack}
            locale={locale}
          />
          <PhotoUploadCard
            title={t("documents.photo")}
            description={t("documents.photoDesc")}
            documentInfo={profile.documents.photo}
            locale={locale}
          />
        </div>
      </CardContent>
    </Card>
  );
}
