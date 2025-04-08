import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import RegisterForm from "@/domains/citizen/components/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

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

                <h2 className="text-2xl font-bold text-center">
                  Citizen Registration
                </h2>
                <p className="text-muted-foreground">
                  Register yourself in the Digital Profile Information System to
                  access and manage your official government identity and
                  documents securely online.
                </p>

                <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 my-4">
                  <h3 className="font-semibold mb-2">
                    Registration Requirements:
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Citizenship certificate details</li>
                    <li>Valid email address</li>
                    <li>Mobile phone number</li>
                    <li>Secure password</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-md border border-amber-200 dark:border-amber-900 text-sm">
                  <strong className="block mb-1">Important Notice:</strong>
                  <p>
                    All information provided must be accurate and match your
                    citizenship certificate. False information may result in
                    legal consequences.
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">By registering, you agree to our:</p>
                  <div className="space-y-1">
                    <Link
                      href="/policies/terms"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Terms of Service
                    </Link>
                    <Link
                      href="/policies/privacy"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Privacy Policy
                    </Link>
                    <Link
                      href="/policies/data-usage"
                      className="flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Data Usage
                      Policy
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
            Need help? Contact our support at{" "}
            <a
              href="mailto:support@dpis.gov.np"
              className="font-medium hover:underline"
            >
              support@dpis.gov.np
            </a>{" "}
            or call{" "}
            <a href="tel:+9771450xxxx" className="font-medium hover:underline">
              01-450xxxx
            </a>
          </p>
        </div>
      </Container>
    </Layout>
  );
}
