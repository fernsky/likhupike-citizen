"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, MailIcon } from "lucide-react";
import { useRequestPasswordResetMutation } from "@/store/services/authApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn, getErrorMessage } from "@/lib/utils";

export default function ForgotPasswordForm() {
  const t = useTranslations();

  const [requestPasswordReset, { isLoading, error }] =
    useRequestPasswordResetMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form validation schema
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: t("citizen.validation.required") })
      .email({ message: t("citizen.validation.emailValid") }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await requestPasswordReset({
        email: data.email,
      }).unwrap();

      // Show success message
      setSuccessMessage(t("auth.forgotPassword.success"));
    } catch (error) {
      // Error is handled by RTK Query and displayed in the UI
      console.error("Password reset request error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md border border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {t("auth.forgotPassword.title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.forgotPassword.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {t("auth.forgotPassword.checkEmail")}
            </h3>
            <p className="text-muted-foreground mb-6">{successMessage}</p>
            <Button asChild>
              <Link href="/login">{t("auth.forgotPassword.backToLogin")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <Alert className="mb-6 bg-red-50 text-red-900 border border-red-200">
                <AlertTitle>{t("auth.forgotPassword.error.title")}</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("auth.forgotPassword.emailLabel")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    {...register("email")}
                    className={cn(
                      errors.email &&
                        "border-red-500 focus-visible:ring-red-500",
                      "pl-10"
                    )}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.forgotPassword.sending")}
                  </>
                ) : (
                  t("auth.forgotPassword.submit")
                )}
              </Button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t("auth.forgotPassword.backToLogin")}
                </Link>
              </div>
            </form>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center px-8 py-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {t("auth.forgotPassword.helpText")}
        </p>
      </CardFooter>
    </Card>
  );
}
