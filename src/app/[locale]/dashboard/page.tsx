import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  CheckCircle,
  ChevronRight,
  FileText,
  ShieldCheck,
  User,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "seo.dashboard" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage(props: { params: Params }) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "dashboard" });

  // This is a mock function to demonstrate the page - in real implementation,
  // you would fetch this data from an API
  const mockProfileData = {
    status: "UNDER_REVIEW",
    completionPercentage: 60,
    documentsUploaded: 1,
    documentsRequired: 3,
    actionItems: 2,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("welcome")}
            </h1>
            <p className="text-muted-foreground">{t("welcomeMessage")}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link href={`/${locale}/dashboard/profile`}>
                {t("completeProfile")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Alert based on profile status */}
        {mockProfileData.status === "UNDER_REVIEW" && (
          <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{t("alerts.underReviewTitle")}</AlertTitle>
            <AlertDescription>
              {t("alerts.underReviewDescription")}
            </AlertDescription>
          </Alert>
        )}

        {mockProfileData.status === "ACTION_REQUIRED" && (
          <Alert className="bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{t("alerts.actionRequiredTitle")}</AlertTitle>
            <AlertDescription>
              {t("alerts.actionRequiredDescription")}
            </AlertDescription>
          </Alert>
        )}

        {mockProfileData.status === "APPROVED" && (
          <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 mb-6">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>{t("alerts.approvedTitle")}</AlertTitle>
            <AlertDescription>
              {t("alerts.approvedDescription")}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Completion Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t("profileCompletion.title")}</CardTitle>
            <CardDescription>
              {t("profileCompletion.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("profileCompletion.progress", {
                    percentage: mockProfileData.completionPercentage,
                  })}
                </span>
                <span className="font-medium">
                  {mockProfileData.completionPercentage}%
                </span>
              </div>
              <Progress value={mockProfileData.completionPercentage} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <ProfileCompletionItem
                icon={<User className="h-5 w-5" />}
                title={t("profileCompletion.personalInfo")}
                status="complete"
                href={`/${locale}/dashboard/profile`}
              />
              <ProfileCompletionItem
                icon={<FileText className="h-5 w-5" />}
                title={t("profileCompletion.documents")}
                status="incomplete"
                details={t("profileCompletion.documentsStatus", {
                  uploaded: mockProfileData.documentsUploaded,
                  total: mockProfileData.documentsRequired,
                })}
                href={`/${locale}/dashboard/documents`}
              />
              <ProfileCompletionItem
                icon={<ShieldCheck className="h-5 w-5" />}
                title={t("profileCompletion.verification")}
                status="pending"
                details={t("profileCompletion.verificationPending")}
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

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mt-8 mb-4">
          {t("quickActions.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title={t("quickActions.uploadDocuments")}
            description={t("quickActions.uploadDocumentsDesc")}
            href={`/${locale}/dashboard/documents`}
          />
          <QuickActionCard
            title={t("quickActions.updateProfile")}
            description={t("quickActions.updateProfileDesc")}
            href={`/${locale}/dashboard/profile/edit`}
          />
          <QuickActionCard
            title={t("quickActions.checkStatus")}
            description={t("quickActions.checkStatusDesc")}
            href={`/${locale}/dashboard/profile/verification`}
          />
          <QuickActionCard
            title={t("quickActions.viewNotifications")}
            description={t("quickActions.viewNotificationsDesc")}
            href={`/${locale}/dashboard/notifications`}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper components
function ProfileCompletionItem({
  icon,
  title,
  status,
  details,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  status: "complete" | "incomplete" | "pending";
  details?: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <div className="flex items-start">
          <div
            className={cn(
              "mr-3 p-1.5 rounded-full",
              status === "complete" &&
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              status === "incomplete" &&
                "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
              status === "pending" &&
                "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {details ||
                (status === "complete"
                  ? "Completed"
                  : status === "incomplete"
                    ? "Incomplete"
                    : "Pending")}
            </p>
          </div>
          {status === "complete" && (
            <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const t = useTranslations();
  return (
    <Link href={href} className="block">
      <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400"
          >
            {t("common.button.learnMore")}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
