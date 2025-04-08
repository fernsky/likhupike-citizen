import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import RegisterForm from "@/domains/citizen/components/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "seo.register" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/register-og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
    authors: [{ name: "Digital Profile Information System" }],
  };
}

export default function RegisterPage() {
  const t = useTranslations("auth.register");

  return (
    <Layout>
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Information and security notices */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-md">
              <CardContent className="p-6 space-y-6">
                {/* Government Logo */}
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/nepal-govt-logo.png"
                    alt="Government of Nepal"
                    width={120}
                    height={120}
                    className="mb-4"
                  />
                </div>

                <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
                <p className="text-muted-foreground">{t("description")}</p>

                <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 my-4">
                  <h3 className="font-semibold mb-2">
                    {t("requirements.title")}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t("requirements.citizenship")}</li>
                    <li>{t("requirements.email")}</li>
                    <li>{t("requirements.phone")}</li>
                    <li>{t("requirements.password")}</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-md border border-amber-200 dark:border-amber-900 text-sm">
                  <strong className="block mb-1">{t("notice.title")}</strong>
                  <p>{t("notice.content")}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">{t("agreement.intro")}</p>
                  <div className="space-y-1">
                    <Link
                      href="/policies/terms"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />{" "}
                      {t("agreement.terms")}
                    </Link>
                    <Link
                      href="/policies/privacy"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />{" "}
                      {t("agreement.privacy")}
                    </Link>
                    <Link
                      href="/policies/data-usage"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />{" "}
                      {t("agreement.dataUsage")}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Registration form */}
          <div className="lg:col-span-2">
            <RegisterForm />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {t("help.text")}{" "}
            <a
              href={`mailto:${t("help.email")}`}
              className="font-medium hover:underline"
            >
              {t("help.email")}
            </a>{" "}
            {t("help.or")}{" "}
            <a href="tel:+9771450xxxx" className="font-medium hover:underline">
              {t("help.phone")}
            </a>
          </p>
        </div>
      </Container>
    </Layout>
  );
}
