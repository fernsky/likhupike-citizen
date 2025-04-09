import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CitizenProfile } from "@/domains/citizen/types";
import { DocumentUploadCard } from "../document-upload-card";

interface ProfileDocumentsTabProps {
  profile: CitizenProfile;
  locale: string;
}

export function ProfileDocumentsTab({
  profile,
  locale,
}: ProfileDocumentsTabProps) {
  const t = useTranslations("dashboard.profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.documents")}</CardTitle>
        <CardDescription>{t("documents.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploadCard
            title={t("documents.citizenshipFront")}
            description={t("documents.citizenshipFrontDesc")}
            documentInfo={profile.documents.citizenshipFront}
            documentType="citizenshipFront"
            locale={locale}
          />
          <DocumentUploadCard
            title={t("documents.citizenshipBack")}
            description={t("documents.citizenshipBackDesc")}
            documentInfo={profile.documents.citizenshipBack}
            documentType="citizenshipBack"
            locale={locale}
          />
          <DocumentUploadCard
            title={t("documents.photo")}
            description={t("documents.photoDesc")}
            documentInfo={profile.documents.photo}
            documentType="photo"
            locale={locale}
          />
        </div>
      </CardContent>
    </Card>
  );
}
