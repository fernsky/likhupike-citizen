"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Upload, LockIcon, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { DocumentInfo, DocumentState } from "@/domains/citizen/types";
import { useUploadPhotoMutation } from "@/store/services/citizenApi";
import { Badge } from "@/components/ui/badge";
import { ImageViewer } from "@/components/shared/image-viewer";

interface PhotoUploadCardProps {
  title: string;
  description: string;
  documentInfo: DocumentInfo | null;
  locale: string;
}

export function PhotoUploadCard({
  title,
  description,
  documentInfo,
}: PhotoUploadCardProps) {
  const t = useTranslations("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPhoto] = useUploadPhotoMutation();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const isUploaded = documentInfo && documentInfo.state !== "NOT_UPLOADED";
  const url = documentInfo?.url || null;
  const isApproved = documentInfo?.state === "APPROVED";

  // Check if the document can be replaced (not uploaded or rejected)
  const canReplaceDocument =
    !documentInfo ||
    documentInfo.state === "NOT_UPLOADED" ||
    documentInfo.state === "REJECTED_BLURRY" ||
    documentInfo.state === "REJECTED_UNSUITABLE" ||
    documentInfo.state === "REJECTED_MISMATCH" ||
    documentInfo.state === "REJECTED_INCONSISTENT";

  // Get appropriate document state label
  const getDocumentStateLabel = (state: string) => {
    switch (state) {
      case "APPROVED":
        return t("documentState.approved");
      case "AWAITING_REVIEW":
        return t("documentState.underReview");
      case "REJECTED_BLURRY":
        return t("documentState.rejectedBlurry");
      case "REJECTED_UNSUITABLE":
        return t("documentState.rejectedUnsuitable");
      case "REJECTED_MISMATCH":
        return t("documentState.rejectedMismatch");
      case "REJECTED_INCONSISTENT":
        return t("documentState.rejectedInconsistent");
      default:
        return t("documentState.notUploaded");
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
      const response = await uploadPhoto(formData);

      // Check if the response has data property (success case)
      if (response && response.data && response.data.success) {
        // Use the actual success message from the API
        const successMessage =
          response.data.message || "Photo uploaded successfully";
        toast.success(successMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error uploading photo:", error);

      // Extract error details from the API response
      let errorMessage = "Failed to upload photo";
      let errorDetails = "Please try again later";

      // Handle error response
      if (error.data) {
        if (error.data.error) {
          errorMessage = error.data.error.message || errorMessage;
          errorDetails = error.data.error.details?.error || errorDetails;
        } else if (!error.data.success) {
          errorMessage = error.data.message || errorMessage;
          if (error.data.errors) {
            const firstErrorKey = Object.keys(error.data.errors)[0];
            if (
              firstErrorKey &&
              Array.isArray(error.data.errors[firstErrorKey])
            ) {
              errorDetails =
                error.data.errors[firstErrorKey][0] || errorDetails;
            }
          }
        }
      }

      toast.error(errorMessage, {
        description: errorDetails !== errorMessage ? errorDetails : undefined,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get message based on document state
  const getDocumentActionMessage = (state: DocumentState | undefined) => {
    if (!state || state === "NOT_UPLOADED") {
      return t("actions.uploadPhoto");
    }

    if (
      state === "REJECTED_BLURRY" ||
      state === "REJECTED_UNSUITABLE" ||
      state === "REJECTED_MISMATCH" ||
      state === "REJECTED_INCONSISTENT"
    ) {
      return t("actions.replacePhoto");
    }

    if (state === "AWAITING_REVIEW") {
      return t("documentState.underReview");
    }

    if (state === "APPROVED") {
      return t("documentState.approved");
    }

    return t("actions.uploadPhoto");
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative cursor-pointer"
          onClick={() => isUploaded && url && setIsViewerOpen(true)}
        >
          {isUploaded && url ? (
            <>
              <Image
                src={url}
                alt={title}
                width={200}
                height={160}
                className="object-cover w-full h-full"
              />
              {/* Only show zoom icon - no indication of approval state */}
              <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-full opacity-70 hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <User className="h-12 w-12 text-slate-400" />
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

          {/* Show note if any AND the document is not approved */}
          {documentInfo?.note && !isApproved && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
              {t("documentState.note")}: {documentInfo.note}
            </p>
          )}

          <div>
            <input
              type="file"
              id="upload-photo"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading || !canReplaceDocument}
            />
            <Button
              variant={isUploaded ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={() => document.getElementById("upload-photo")?.click()}
              disabled={isUploading || !canReplaceDocument}
            >
              {!canReplaceDocument ? (
                <LockIcon className="mr-2 h-4 w-4" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading
                ? t("state.uploading")
                : getDocumentActionMessage(documentInfo?.state)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Viewer */}
      {url && (
        <ImageViewer
          isOpen={isViewerOpen}
          imageUrl={url}
          title={title}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  );
}
