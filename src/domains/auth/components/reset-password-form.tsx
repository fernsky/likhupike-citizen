"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useResetPasswordMutation } from "@/store/services/authApi";
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

export default function ResetPasswordForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email and OTP from URL parameters
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation schema
  const formSchema = z
    .object({
      newPassword: z
        .string()
        .min(8, { message: t("validation.passwordMinLength") })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          {
            message: t("validation.passwordRequirements"),
          }
        ),
      confirmPassword: z.string().min(1, { message: t("validation.required") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("newPassword");

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "None", color: "bg-slate-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    const strengthMap = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Medium", color: "bg-yellow-500" },
      { label: "Strong", color: "bg-blue-500" },
      { label: "Very Strong", color: "bg-green-500" },
    ];

    return {
      strength,
      ...(strengthMap[strength - 1] || strengthMap[0]),
    };
  };

  const passwordStrength = getPasswordStrength(watchPassword);

  const onSubmit = async (data: FormValues) => {
    if (!email || !otp) {
      return; // Missing required parameters
    }

    try {
      await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      // Show success message
      setSuccessMessage(t("auth.resetPassword.success"));

      // Redirect to login after delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      // Error is handled by RTK Query and displayed in the UI
      console.error("Password reset error:", error);
    }
  };

  // If OTP or email is missing, show an error
  if (!otp || !email) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md border border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t("auth.resetPassword.invalidRequest")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-red-50 text-red-900 border border-red-200">
            <AlertTitle>{t("auth.resetPassword.error.title")}</AlertTitle>
            <AlertDescription>
              {t("auth.resetPassword.error.invalidLink")}
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/forgot-password">
              {t("auth.resetPassword.tryAgain")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md border border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {t("auth.resetPassword.title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.resetPassword.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {t("auth.resetPassword.passwordUpdated")}
            </h3>
            <p className="text-muted-foreground mb-6">{successMessage}</p>
            <p className="text-sm text-muted-foreground mb-2">
              {t("auth.resetPassword.redirecting")}
            </p>
            <Button asChild>
              <Link href="/login">{t("auth.resetPassword.backToLogin")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <Alert className="mb-6 bg-red-50 text-red-900 border border-red-200">
                <AlertTitle>{t("auth.resetPassword.error.title")}</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 text-sm mb-4">
                <div className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <p>
                    {t("auth.resetPassword.resetFor")} <strong>{email}</strong>
                  </p>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  {t("auth.resetPassword.newPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword")}
                    placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                    className={cn(
                      errors.newPassword &&
                        "border-red-500 focus-visible:ring-red-500",
                      "pr-10"
                    )}
                    aria-invalid={!!errors.newPassword}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {watchPassword && (
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs">{passwordStrength.label}</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li
                        className={cn(
                          watchPassword.length >= 8 ? "text-green-600" : ""
                        )}
                      >
                        • At least 8 characters
                      </li>
                      <li
                        className={cn(
                          watchPassword.match(/[A-Z]/) ? "text-green-600" : ""
                        )}
                      >
                        • At least one uppercase letter
                      </li>
                      <li
                        className={cn(
                          watchPassword.match(/[a-z]/) ? "text-green-600" : ""
                        )}
                      >
                        • At least one lowercase letter
                      </li>
                      <li
                        className={cn(
                          watchPassword.match(/\d/) ? "text-green-600" : ""
                        )}
                      >
                        • At least one number
                      </li>
                      <li
                        className={cn(
                          watchPassword.match(/[^A-Za-z0-9]/)
                            ? "text-green-600"
                            : ""
                        )}
                      >
                        • At least one special character
                      </li>
                    </ul>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("auth.resetPassword.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder={t(
                      "auth.resetPassword.confirmPasswordPlaceholder"
                    )}
                    className={cn(
                      errors.confirmPassword &&
                        "border-red-500 focus-visible:ring-red-500",
                      "pr-10"
                    )}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.resetPassword.processing")}
                  </>
                ) : (
                  t("auth.resetPassword.submit")
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center px-8 py-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {t("auth.resetPassword.securityNotice")}
        </p>
      </CardFooter>
    </Card>
  );
}
