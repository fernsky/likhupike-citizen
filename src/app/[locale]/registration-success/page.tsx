import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Mail, Clock } from "lucide-react";

type Params = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: "seo.registrationSuccess",
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/registration-success-og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    robots: {
      index: false,
      follow: true,
    },
    authors: [{ name: "Digital Profile Information System" }],
  };
}

export default async function RegistrationSuccessPage(props: {
  params: Params;
}) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: "auth.registrationSuccess",
  });
  const commonT = await getTranslations({ locale, namespace: "common" });

  // Define the next steps items as an array of keys
  const nextStepsItems = ["item1", "item2", "item3", "item4"];

  return (
    <Layout>
      <Container className="py-12 md:py-16 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>

        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10 mb-6">
          <CardContent className="pt-6">
            <div className="prose prose-green dark:prose-invert max-w-none">
              <p className="text-lg">{t("message")}</p>

              <div className="flex items-start space-x-4 mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Mail className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">
                    {t("emailVerification.title")}
                  </h3>
                  <p>{t("emailVerification.description")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Clock className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">{t("processingTime.title")}</h3>
                  <p>{t("processingTime.description")}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4">
            <Link href={`/${locale}/login`} className="w-full md:w-auto">
              <Button variant="default" className="w-full">
                {t("buttons.login")}
              </Button>
            </Link>
            <Link
              href={`/${locale}/citizen-guide`}
              className="w-full md:w-auto"
            >
              <Button variant="outline" className="w-full">
                {t("buttons.learnMore")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>
            {t("contactSupport.text")}{" "}
            <a
              href={`mailto:${t("contactSupport.email")}`}
              className="font-medium hover:underline"
            >
              {t("contactSupport.email")}
            </a>
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Link
              href={`/${locale}`}
              className="text-sm hover:underline flex items-center"
            >
              <ChevronRight className="mr-1 h-3 w-3" />
              {commonT("navigation.home")}
            </Link>
          </div>
        </div>

        {/* Next steps section with fixed key mapping instead of array mapping */}
        <div className="mt-12 bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">{t("nextSteps.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextStepsItems.map((itemKey) => (
              <div
                key={itemKey}
                className="bg-white dark:bg-slate-900 rounded p-4 shadow-sm"
              >
                <h4 className="font-medium">
                  {t(`nextSteps.${itemKey}.title`)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t(`nextSteps.${itemKey}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
