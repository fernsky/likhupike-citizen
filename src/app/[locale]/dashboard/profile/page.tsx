import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Upload,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "seo.profile" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage(props: { params: Params }) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "dashboard.profile" });

  // This is a mock function to demonstrate the page - in real implementation,
  // you would fetch this data from Redux or an API call
  const mockProfileData = {
    name: "Ramesh Sharma",
    nameDevnagari: "रमेश शर्मा",
    status: "UNDER_REVIEW",
    citizenshipNumber: "01-01-76-12345",
    citizenshipIssuedDate: "2076-01-15",
    citizenshipIssuedOffice: "District Administration Office, Kathmandu",
    email: "ramesh.sharma@example.com",
    phoneNumber: "+9779812345678",
    photoUrl: null,
    citizenshipFrontUrl: null,
    citizenshipBackUrl: null,
    verificationHistory: [
      {
        status: "SUBMITTED",
        date: "2023-01-15T08:30:00",
        message: "Initial registration submitted",
      },
      {
        status: "UNDER_REVIEW",
        date: "2023-01-15T09:15:00",
        message: "Registration under review by verification officer",
      },
    ],
  };

  // Determine verification status for display
  const verificationStatus =
    mockProfileData.status === "ACTIVE"
      ? "verified"
      : mockProfileData.status === "UNDER_REVIEW" ||
          mockProfileData.status === "PENDING_REGISTRATION"
        ? "pending"
        : "action";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/dashboard/profile/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                {t("actions.edit")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo & Status Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-28 w-28 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {mockProfileData.photoUrl ? (
                    <Image
                      src={mockProfileData.photoUrl}
                      alt={mockProfileData.name}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-slate-500" />
                  )}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                  title={t("actions.uploadPhoto")}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-semibold text-center mt-2">
                {mockProfileData.name}
              </h2>
              <p className="text-center text-muted-foreground mb-4">
                {mockProfileData.nameDevnagari}
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
                  value={mockProfileData.citizenshipNumber}
                />
                <DetailItem
                  label={t("details.email")}
                  value={mockProfileData.email}
                />
                <DetailItem
                  label={t("details.phone")}
                  value={mockProfileData.phoneNumber}
                />
              </div>
            </CardContent>
          </Card>

          {/* Main profile content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
                <TabsTrigger value="documents">
                  {t("tabs.documents")}
                </TabsTrigger>
                <TabsTrigger value="verification">
                  {t("tabs.verification")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("sections.personalInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        label={t("details.name")}
                        value={mockProfileData.name}
                      />
                      <DetailItem
                        label={t("details.nameDevnagari")}
                        value={mockProfileData.nameDevnagari}
                      />
                      <DetailItem
                        label={t("details.citizenshipIssuedDate")}
                        value={mockProfileData.citizenshipIssuedDate}
                      />
                      <DetailItem
                        label={t("details.citizenshipIssuedOffice")}
                        value={mockProfileData.citizenshipIssuedOffice}
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
                      <DetailItem
                        label={t("details.email")}
                        value={mockProfileData.email}
                      />
                      <DetailItem
                        label={t("details.phone")}
                        value={mockProfileData.phoneNumber}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("sections.documents")}</CardTitle>
                    <CardDescription>
                      {t("documents.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DocumentUploadCard
                        title={t("documents.citizenshipFront")}
                        description={t("documents.citizenshipFrontDesc")}
                        uploaded={!!mockProfileData.citizenshipFrontUrl}
                        url={mockProfileData.citizenshipFrontUrl}
                        locale={locale}
                      />
                      <DocumentUploadCard
                        title={t("documents.citizenshipBack")}
                        description={t("documents.citizenshipBackDesc")}
                        uploaded={!!mockProfileData.citizenshipBackUrl}
                        url={mockProfileData.citizenshipBackUrl}
                        locale={locale}
                      />
                      <DocumentUploadCard
                        title={t("documents.photo")}
                        description={t("documents.photoDesc")}
                        uploaded={!!mockProfileData.photoUrl}
                        url={mockProfileData.photoUrl}
                        locale={locale}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("sections.verificationStatus")}</CardTitle>
                    <CardDescription>
                      {t("verification.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-center gap-4">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          verificationStatus === "verified" &&
                            "bg-green-100 text-green-700",
                          verificationStatus === "pending" &&
                            "bg-blue-100 text-blue-700",
                          verificationStatus === "action" &&
                            "bg-red-100 text-red-700"
                        )}
                      >
                        {verificationStatus === "verified" && (
                          <CheckCircle className="h-6 w-6" />
                        )}
                        {verificationStatus === "pending" && (
                          <Clock className="h-6 w-6" />
                        )}
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
                          {verificationStatus === "action" &&
                            t("verification.actionTitle")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {verificationStatus === "verified" &&
                            t("verification.verifiedDesc")}
                          {verificationStatus === "pending" &&
                            t("verification.pendingDesc")}
                          {verificationStatus === "action" &&
                            t("verification.actionDesc")}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-medium mb-3">
                      {t("verification.history")}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("verification.date")}</TableHead>
                          <TableHead>{t("verification.status")}</TableHead>
                          <TableHead>{t("verification.details")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProfileData.verificationHistory.map(
                          (item, index) => (
                            <TableRow key={index}>
                              <TableCell className="whitespace-nowrap">
                                {new Date(item.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    item.status === "SUBMITTED"
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
                          )
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper components
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function DocumentUploadCard({
  title,
  description,
  uploaded,
  url,
  locale,
}: {
  title: string;
  description: string;
  uploaded: boolean;
  url: string | null;
  locale: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {uploaded && url ? (
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
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button
          variant={uploaded ? "outline" : "default"}
          size="sm"
          className="w-full"
          asChild
        >
          <Link href={`/${locale}/dashboard/documents/upload`}>
            <Upload className="mr-2 h-4 w-4" />
            {uploaded ? "Replace" : "Upload"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
