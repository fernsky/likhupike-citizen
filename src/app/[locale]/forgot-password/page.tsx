import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import ForgotPasswordForm from "@/domains/auth/components/forgot-password-form";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.forgotPassword" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ForgotPasswordPage() {
  return (
    <Layout>
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      </Container>
    </Layout>
  );
}
