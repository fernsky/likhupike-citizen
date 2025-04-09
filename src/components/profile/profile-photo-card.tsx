"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, User } from "lucide-react";
import { CitizenProfile } from "@/domains/citizen/types";
import { DetailItem } from "./detail-item";

interface ProfilePhotoCardProps {
  profile: CitizenProfile;
}

export function ProfilePhotoCard({ profile }: ProfilePhotoCardProps) {
  const t = useTranslations("profile");

  // Determine verification status for display
  const verificationStatus = profile.isApproved
    ? "verified"
    : profile.state === "UNDER_REVIEW" ||
        profile.state === "PENDING_REGISTRATION"
      ? "pending"
      : "action";

  const photoUrl = profile.documents.photo?.url || null;

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-28 w-28 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={profile.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-slate-500" />
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mt-2">
          {profile.name}
        </h2>
        <p className="text-center text-muted-foreground mb-4">
          {profile.nameDevnagari}
        </p>

        <Badge
          variant={
            verificationStatus === "verified"
              ? "default"
              : verificationStatus === "pending"
                ? "outline"
                : "destructive"
          }
          className="mb-6"
        >
          {verificationStatus === "verified" && (
            <CheckCircle className="mr-1 h-3 w-3" />
          )}
          {verificationStatus === "pending" && (
            <Clock className="mr-1 h-3 w-3" />
          )}
          {verificationStatus === "action" && (
            <AlertCircle className="mr-1 h-3 w-3" />
          )}
          {verificationStatus === "verified" && t("status.verified")}
          {verificationStatus === "pending" && t("status.pending")}
          {verificationStatus === "action" && t("status.action")}
        </Badge>

        <div className="grid grid-cols-1 divide-y w-full">
          <DetailItem
            label={t("details.citizenshipNumber")}
            value={profile.citizenshipNumber}
          />
          <DetailItem label={t("details.email")} value={profile.email} />
          <DetailItem
            label={t("details.phone")}
            value={profile.phoneNumber || "-"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
