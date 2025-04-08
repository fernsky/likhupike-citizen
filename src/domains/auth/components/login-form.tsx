"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useLoginMutation } from "@/store/services/authApi";
import { useAppDispatch } from "@/store";
import { loginSuccess } from "@/store/slices/authSlice";
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getErrorMessage } from "@/lib/utils";
import { CitizenLoginRequest } from "@/domains/auth/types";

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: t("validation.required") })
      .email({ message: t("validation.emailValid") }),
    password: z.string().min(1, { message: t("validation.required") }),
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
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const loginRequest: CitizenLoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await login(loginRequest).unwrap();

      // Update global state with auth information
      dispatch(loginSuccess(response));

      // Store "remember me" preference
      if (rememberMe) {
        localStorage.setItem("remember_email", data.email);
      } else {
        localStorage.removeItem("remember_email");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by RTK Query and displayed in the UI
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="w-full shadow-md border border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {t("auth.login.title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.login.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 bg-red-50 text-red-900 border border-red-200">
            <Lock className="h-4 w-4" />
            <AlertTitle>{t("auth.login.error.title")}</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.login.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.login.emailPlaceholder")}
              {...register("email")}
              className={cn(
                errors.email && "border-red-500 focus-visible:ring-red-500"
              )}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">{t("auth.login.passwordLabel")}</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.login.passwordPlaceholder")}
                {...register("password")}
                className={cn(
                  errors.password &&
                    "border-red-500 focus-visible:ring-red-500",
                  "pr-10"
                )}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
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
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t("auth.login.rememberMe")}
            </Label>
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
                {t("auth.login.loggingIn")}
              </>
            ) : (
              t("auth.login.submit")
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                {t("auth.login.newUser")}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              {t("auth.login.createAccount")}
            </Link>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center px-8 py-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {t("auth.login.securityNotice")}
        </p>
      </CardFooter>
    </Card>
  );
}
