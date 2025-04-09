"use client";

import Link from "next/link";
import { useGetMyProfileQuery } from "@/store/services/citizenApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, User, FileText, ShieldCheck } from "lucide-react";
import { ProfileCompletionItem } from "./profile-completion-item";
import { useTranslations } from "next-intl";

interface ProfileCompletionCardProps {
  locale: string;
}

export function ProfileCompletionCard({ locale }: ProfileCompletionCardProps) {
  const t = useTranslations("dashboard");
  const { data: profile, isLoading } = useGetMyProfileQuery();

  if (isLoading || !profile) {
    return <div className="h-40 animate-pulse bg-slate-100 rounded-lg"></div>;
  }

  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    let points = 0;
    let totalPoints = 0;

    // Basic info (required fields)
    if (profile.name) points += 1;
    if (profile.nameDevnagari) points += 1;
    if (profile.citizenshipNumber) points += 1;
    if (profile.citizenshipIssuedDate) points += 1;
    if (profile.citizenshipIssuedOffice) points += 1;
    if (profile.email) points += 1;
    totalPoints += 6;

    // Optional fields
    if (profile.phoneNumber) points += 1;
    if (profile.permanentAddress) points += 1;
    if (profile.temporaryAddress) points += 1;
    if (profile.fatherName) points += 1;
    if (profile.grandfatherName) points += 1;
    if (profile.spouseName) points += 1;
    totalPoints += 6;

    // Documents
    const { photo, citizenshipFront, citizenshipBack } = profile.documents;

    if (photo && photo.state !== "NOT_UPLOADED") points += 1;
    if (citizenshipFront && citizenshipFront.state !== "NOT_UPLOADED")
      points += 1;
    if (citizenshipBack && citizenshipBack.state !== "NOT_UPLOADED")
      points += 1;
    totalPoints += 3;

    return Math.round((points / totalPoints) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  // Count uploaded documents
  const countUploadedDocuments = () => {
    let count = 0;
    if (
      profile.documents.photo &&
      profile.documents.photo.state !== "NOT_UPLOADED"
    )
      count++;
    if (
      profile.documents.citizenshipFront &&
      profile.documents.citizenshipFront.state !== "NOT_UPLOADED"
    )
      count++;
    if (
      profile.documents.citizenshipBack &&
      profile.documents.citizenshipBack.state !== "NOT_UPLOADED"
    )
      count++;
    return count;
  };

  const documentsUploaded = countUploadedDocuments();
  const totalDocuments = 3; // Photo, citizenship front, citizenship back

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t("profileCompletion.title")}</CardTitle>
        <CardDescription>{t("profileCompletion.description")}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("profileCompletion.progress", {
                percentage: completionPercentage,
              })}
            </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <ProfileCompletionItem
            icon={<User className="h-5 w-5" />}
            title={t("profileCompletion.personalInfo")}
            status={completionPercentage >= 80 ? "complete" : "incomplete"}
            href={`/${locale}/dashboard/profile`}
          />
          <ProfileCompletionItem
            icon={<FileText className="h-5 w-5" />}
            title={t("profileCompletion.documents")}
            status={
              documentsUploaded === totalDocuments ? "complete" : "incomplete"
            }
            details={t("profileCompletion.documentsStatus", {
              uploaded: documentsUploaded,
              total: totalDocuments,
            })}
            href={`/${locale}/dashboard/documents`}
          />
          <ProfileCompletionItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title={t("profileCompletion.verification")}
            status={profile.state === "APPROVED" ? "complete" : "pending"}
            details={
              profile.state === "APPROVED"
                ? t("status.verified")
                : t("profileCompletion.verificationPending")
            }
            href={`/${locale}/dashboard/profile/verification`}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="p-0">
          <Link
            href={`/${locale}/dashboard/profile`}
            className="flex items-center"
          >
            {t("profileCompletion.viewProfile")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
