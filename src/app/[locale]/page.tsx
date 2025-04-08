import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  generateSEOMetadata,
  getOrganizationStructuredData,
} from "@/utils/seo-helpers";
import {
  useCommonTranslations,
  useDomainTranslations,
} from "@/utils/i18n-helpers";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, ShieldCheck, User } from "lucide-react";

// Generate static metadata for SEO
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  return generateSEOMetadata(locale, "home", {
    // Additional page-specific metadata
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
        ne: `${process.env.NEXT_PUBLIC_BASE_URL}/ne`,
      },
    },
  });
}

// Static page generation for all locales
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ne" }];
}

export default function HomePage() {
  const common = useCommonTranslations();
  const citizen = useDomainTranslations("citizen");

  return (
    <Layout>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={getOrganizationStructuredData()}
      />

      <Container className="py-12">
        {/* Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="flex flex-col md:flex-row items-center gap-8 py-12"
        >
          <div className="flex-1">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              {citizen("registration.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {citizen("registration.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/register">
                  {citizen("registration.registerNow")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">{common("navigation.login")}</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <Image
              src="/images/hero-illustration.svg"
              alt={common("appName")}
              width={600}
              height={400}
              className="w-full"
              priority
            />
          </div>
        </section>

        {/* Services Section */}
        <section aria-labelledby="services-heading" className="py-16">
          <h2
            id="services-heading"
            className="text-3xl font-bold text-center mb-4"
          >
            {common("homepage.services.heading")}
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            {common("homepage.services.description")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>
                  {common("homepage.services.profileManagement.title")}
                </CardTitle>
                <CardDescription>
                  {common("homepage.services.profileManagement.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {common("homepage.services.profileManagement.content")}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  asChild
                >
                  <Link href="/profile">
                    {common("button.learnMore")}{" "}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>
                  {common("homepage.services.documentUpload.title")}
                </CardTitle>
                <CardDescription>
                  {common("homepage.services.documentUpload.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {common("homepage.services.documentUpload.content")}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  asChild
                >
                  <Link href="/documents">
                    {common("button.learnMore")}{" "}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>
                  {common("homepage.services.digitalIdentity.title")}
                </CardTitle>
                <CardDescription>
                  {common("homepage.services.digitalIdentity.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {common("homepage.services.digitalIdentity.content")}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  asChild
                >
                  <Link href="/services">
                    {common("button.learnMore")}{" "}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Information Section */}
        <section
          aria-labelledby="info-heading"
          className="py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 my-12"
        >
          <h2 id="info-heading" className="text-3xl font-bold text-center mb-6">
            {common("homepage.information.heading")}
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-4">{common("homepage.information.description")}</p>
            <p className="text-muted-foreground mb-8">
              {common("homepage.information.additionalInfo")}
            </p>
            <Button asChild>
              <Link href="/about">
                {common("homepage.information.aboutButton")}
              </Link>
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
