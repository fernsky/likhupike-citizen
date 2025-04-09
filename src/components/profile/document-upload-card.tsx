"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { DocumentInfo } from "@/domains/citizen/types";
import {
  useUploadCitizenshipFrontMutation,
  useUploadCitizenshipBackMutation,
  useUploadPhotoMutation,
} from "@/store/services/citizenApi";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  documentInfo: DocumentInfo | null;
  documentType: "photo" | "citizenshipFront" | "citizenshipBack";
  locale: string;
}

export function DocumentUploadCard({
  title,
  description,
  documentInfo,
  documentType,
}: DocumentUploadCardProps) {
  const t = useTranslations("dashboard.profile");
  const [isUploading, setIsUploading] = useState(false);

  // Select the appropriate upload mutation based on document type
  const [uploadCitizenshipFront] = useUploadCitizenshipFrontMutation();
  const [uploadCitizenshipBack] = useUploadCitizenshipBackMutation();
  const [uploadPhoto] = useUploadPhotoMutation();

  const isUploaded = documentInfo && documentInfo.state !== "NOT_UPLOADED";
  const url = documentInfo?.url || null;

  // Get appropriate document state label
  const getDocumentStateLabel = (state: string) => {
    switch (state) {
      case "APPROVED":
        return "Approved";
      case "AWAITING_REVIEW":
        return "Under Review";
      case "REJECTED_BLURRY":
        return "Rejected: Too Blurry";
      case "REJECTED_UNSUITABLE":
        return "Rejected: Unsuitable";
      case "REJECTED_MISMATCH":
        return "Rejected: Mismatch";
      case "REJECTED_INCONSISTENT":
        return "Rejected: Inconsistent";
      default:
        return "Not Uploaded";
    }
  };

  // Get badge variant based on document state
  const getStateVariant = (state: string) => {
    if (state === "APPROVED") return "default";
    if (state.startsWith("REJECTED")) return "destructive";
    if (state === "AWAITING_REVIEW") return "outline";
    return "secondary";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);

      // Call the appropriate upload mutation
      if (documentType === "photo") {
        await uploadPhoto(formData).unwrap();
      } else if (documentType === "citizenshipFront") {
        await uploadCitizenshipFront(formData).unwrap();
      } else if (documentType === "citizenshipBack") {
        await uploadCitizenshipBack(formData).unwrap();
      }
    } catch (error) {
      console.error(`Error uploading ${documentType}:`, error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {isUploaded && url ? (
          <Image
            src={url}
            alt={title}
            width={200}
            height={160}
            className="object-cover w-full h-full"
          />
        ) : (
          <FileText className="h-12 w-12 text-slate-400" />
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium">{title}</h3>
          {isUploaded && documentInfo && (
            <Badge variant={getStateVariant(documentInfo.state)}>
              {getDocumentStateLabel(documentInfo.state)}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>

        {/* Show note if any */}
        {documentInfo?.note && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
            Note: {documentInfo.note}
          </p>
        )}

        <div>
          <input
            type="file"
            id={`upload-${documentType}`}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            variant={isUploaded ? "outline" : "default"}
            size="sm"
            className="w-full"
            onClick={() =>
              document.getElementById(`upload-${documentType}`)?.click()
            }
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading
              ? t("common.state.uploading")
              : isUploaded
                ? t("common.action.replace")
                : t("common.action.upload")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
