import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "../detail-item";
import { AddressInfo, CitizenProfile } from "@/domains/citizen/types";

interface ProfileDetailsTabProps {
  profile: CitizenProfile;
}

export function ProfileDetailsTab({ profile }: ProfileDetailsTabProps) {
  const t = useTranslations("dashboard.profile");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("sections.personalInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label={t("details.name")} value={profile.name} />
            <DetailItem
              label={t("details.nameDevnagari")}
              value={profile.nameDevnagari}
            />
            <DetailItem
              label={t("details.citizenshipIssuedDate")}
              value={profile.citizenshipIssuedDate}
            />
            <DetailItem
              label={t("details.citizenshipIssuedOffice")}
              value={profile.citizenshipIssuedOffice}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("sections.contactInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label={t("details.email")} value={profile.email} />
            <DetailItem
              label={t("details.phone")}
              value={profile.phoneNumber || "-"}
            />

            {/* Display family information if available */}
            {profile.fatherName && (
              <DetailItem
                label={t("details.fatherName")}
                value={profile.fatherName}
              />
            )}
            {profile.grandfatherName && (
              <DetailItem
                label={t("details.grandfatherName")}
                value={profile.grandfatherName}
              />
            )}
            {profile.spouseName && (
              <DetailItem
                label={t("details.spouseName")}
                value={profile.spouseName}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Show address information if available */}
      {(profile.permanentAddress || profile.temporaryAddress) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("sections.addressInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.permanentAddress && (
                <div>
                  <h3 className="font-medium mb-2">
                    {t("details.permanentAddress")}
                  </h3>
                  <AddressDetails address={profile.permanentAddress} />
                </div>
              )}

              {profile.temporaryAddress && (
                <div>
                  <h3 className="font-medium mb-2">
                    {t("details.temporaryAddress")}
                  </h3>
                  <AddressDetails address={profile.temporaryAddress} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function AddressDetails({ address }: { address: AddressInfo }) {
  return (
    <div className="space-y-1 text-sm">
      <p>
        <span className="text-muted-foreground">Province:</span>{" "}
        {address.provinceName} ({address.provinceNameNepali})
      </p>
      <p>
        <span className="text-muted-foreground">District:</span>{" "}
        {address.districtName} ({address.districtNameNepali})
      </p>
      <p>
        <span className="text-muted-foreground">Municipality:</span>{" "}
        {address.municipalityName} ({address.municipalityNameNepali})
      </p>
      <p>
        <span className="text-muted-foreground">Ward:</span>{" "}
        {address.wardNumber}
      </p>
      {address.streetAddress && (
        <p>
          <span className="text-muted-foreground">Street Address:</span>{" "}
          {address.streetAddress}
        </p>
      )}
    </div>
  );
}
