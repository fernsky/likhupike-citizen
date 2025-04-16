import { Metadata } from "next";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { generateSEOMetadata } from "@/utils/seo-helpers";
import MunicipalityProfileView from "@/components/municipality/municipality-profile-view";
import { MunicipalityProfileSkeleton } from "@/components/municipality/skeletons";

// Generate static metadata for SEO
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  return generateSEOMetadata(locale, "municipality", {
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/municipality`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_BASE_URL}/en/municipality`,
        ne: `${process.env.NEXT_PUBLIC_BASE_URL}/ne/municipality`,
      },
    },
  });
}

// Static page generation for all locales
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ne" }];
}

export default function MunicipalityProfilePage() {
  const t = useTranslations();

  return (
    <Layout>
      <Container className="py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          {t("municipality.title")}
        </h1>
        
        <Suspense fallback={<MunicipalityProfileSkeleton />}>
          <MunicipalityProfileView />
        </Suspense>
      </Container>
    </Layout>
  );
}
