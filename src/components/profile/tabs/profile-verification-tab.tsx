import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { CitizenProfile } from "@/domains/citizen/types";
import { cn } from "@/lib/utils";

interface ProfileVerificationTabProps {
  profile: CitizenProfile;
}

export function ProfileVerificationTab({
  profile,
}: ProfileVerificationTabProps) {
  const t = useTranslations("profile");

  // Determine verification status for display
  const verificationStatus = profile.isApproved
    ? "verified"
    : profile.state === "UNDER_REVIEW" ||
        profile.state === "PENDING_REGISTRATION"
      ? "pending"
      : "action";

  // Mock verification history (would come from API in real implementation)
  const verificationHistory = [
    {
      status: "SUBMITTED",
      date: profile.createdAt,
      message: "Initial registration submitted",
    },
    {
      status: profile.state,
      date: profile.stateUpdatedAt || profile.updatedAt,
      message: profile.stateNote || `Profile state changed to ${profile.state}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.verificationStatus")}</CardTitle>
        <CardDescription>{t("verification.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <div
            className={cn(
              "p-2 rounded-full",
              verificationStatus === "verified" &&
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              verificationStatus === "pending" &&
                "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              verificationStatus === "action" &&
                "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {verificationStatus === "verified" && (
              <CheckCircle className="h-6 w-6" />
            )}
            {verificationStatus === "pending" && <Clock className="h-6 w-6" />}
            {verificationStatus === "action" && (
              <AlertCircle className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {verificationStatus === "verified" &&
                t("verification.verifiedTitle")}
              {verificationStatus === "pending" &&
                t("verification.pendingTitle")}
              {verificationStatus === "action" && t("verification.actionTitle")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {profile.stateNote ||
                (verificationStatus === "verified"
                  ? t("verification.verifiedDesc")
                  : verificationStatus === "pending"
                    ? t("verification.pendingDesc")
                    : t("verification.actionDesc"))}
            </p>
          </div>
        </div>

        <h3 className="font-medium mb-3">{t("verification.history")}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("verification.date")}</TableHead>
              <TableHead>{t("verification.status")}</TableHead>
              <TableHead>{t("verification.details")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verificationHistory.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "SUBMITTED" ||
                      item.status === "PENDING_REGISTRATION"
                        ? "outline"
                        : item.status === "UNDER_REVIEW"
                          ? "secondary"
                          : item.status === "APPROVED"
                            ? "default"
                            : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
