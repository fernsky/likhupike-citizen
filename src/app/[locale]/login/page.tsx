import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import LoginForm from "@/domains/auth/components/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: "seo.login" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/login-og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
  };
}

export default function LoginPage() {
  return (
    <Layout>
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Login form */}
          <div className="lg:col-span-2">
            <LoginForm />
          </div>

          {/* Right column - Information and security notices */}
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
                  Login Information
                </h2>
                <p className="text-muted-foreground">
                  Login to access your Digital Profile and government services
                  securely.
                </p>

                <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 my-4">
                  <h3 className="font-semibold mb-2">Secure Login Tips:</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>
                      Ensure you&apos;re on the official government domain
                    </li>
                    <li>Never share your password with anyone</li>
                    <li>Use a strong, unique password</li>
                    <li>Log out when using public computers</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-md border border-blue-200 dark:border-blue-900 text-sm">
                  <p className="font-medium flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                    Secure Government Service
                  </p>
                  <p className="mt-1">
                    This is an official government portal. All activities are
                    monitored and logged for security purposes.
                  </p>
                </div>

                <div className="text-sm text-center">
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Don&apos;t have an account? Register here
                  </Link>
                </div>
              </CardContent>
            </Card>
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
