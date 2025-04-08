"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarIcon,
  Eye,
  EyeOff,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useRegisterCitizenMutation } from "@/store/services/citizenApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getErrorMessage } from "@/lib/utils";
import { RegisterCitizenRequest } from "@/domains/citizen/types";
import { InterFont } from "@/lib/utils";

export default function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();

  const [registerCitizen, { isLoading, isSuccess, error }] =
    useRegisterCitizenMutation();

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create schema using zod with enterprise-grade validation
  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: t("citizen.validation.nameMinLength") })
        .max(100, { message: t("citizen.validation.nameMaxLength") })
        .regex(/^[A-Za-z\s.'()-]+$/, {
          message: t("citizen.validation.nameFormat"),
        }),

      nameDevnagari: z
        .string()
        .min(2, { message: t("citizen.validation.nameDevnagariMinLength") })
        .max(100, { message: t("citizen.validation.nameDevnagariMaxLength") }),

      citizenshipNumber: z
        .string()
        .min(1, { message: t("citizen.validation.required") })
        .regex(/^[0-9\-\/]+$/, {
          message: t("citizen.validation.citizenshipNumberFormat"),
        }),

      citizenshipIssuedDate: z
        .date({
          required_error: t("citizen.validation.required"),
        })
        .refine((date) => date <= new Date(), {
          message: t("citizen.validation.dateInPast"),
        })
        .refine(
          (date) => {
            // Must be at least 16 years ago (citizenship eligibility)
            const sixteenYearsAgo = new Date();
            sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
            return date <= sixteenYearsAgo;
          },
          { message: t("citizen.validation.citizenshipDateValid") }
        ),

      citizenshipIssuedOffice: z
        .string()
        .min(2, { message: t("citizen.validation.required") })
        .max(150, {
          message: t("citizen.validation.maxLength", { length: 150 }),
        }),

      email: z.string().email({ message: t("citizen.validation.emailValid") }),

      phoneNumber: z.string().regex(/^(\+977)?[9][6-9]\d{8}$/, {
        message: t("citizen.validation.phoneFormat"),
      }),

      password: z
        .string()
        .min(8, { message: t("citizen.validation.passwordMinLength") })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          {
            message: t("citizen.validation.passwordRequirements"),
          }
        ),

      confirmPassword: z
        .string()
        .min(1, { message: t("citizen.validation.required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("citizen.validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nameDevnagari: "",
      citizenshipNumber: "",
      citizenshipIssuedOffice: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isDateOpen, setIsDateOpen] = useState(false);
  const selectedDate = watch("citizenshipIssuedDate");
  const watchPassword = watch("password");

  const onSubmit = async (data: FormValues) => {
    try {
      const registrationData: RegisterCitizenRequest = {
        ...data,
        citizenshipIssuedDate: format(data.citizenshipIssuedDate, "yyyy-MM-dd"),
      };

      await registerCitizen(registrationData).unwrap();

      // Show success state and redirect after delay
      setTimeout(() => {
        router.push("/registration-success");
      }, 2000);
    } catch (error) {
      // Error handling is managed by RTK Query
      console.error("Registration error:", error);
    }
  };

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

  return (
    <Card className="w-full shadow-md border border-slate-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <CardTitle className="text-2xl">
          {t("citizen.registration.title")}
        </CardTitle>
        <CardDescription>
          {t("citizen.registration.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-900 border border-green-200">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>{t("citizen.registration.successTitle")}</AlertTitle>
            <AlertDescription>
              {t("citizen.registration.success")}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 text-red-900 border border-red-200">
            <AlertTitle>{t("errors.registrationFailed")}</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium text-base mb-3">
                {t("citizen.profile.personalInfo")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    {t("citizen.profile.name")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            Enter your full name as it appears on your
                            citizenship certificate
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className={cn(
                      errors.name &&
                        "border-red-500 focus-visible:ring-red-500" &&
                        InterFont.className
                    )}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Name in Devnagari */}
                <div className="space-y-2">
                  <Label htmlFor="nameDevnagari" className="flex items-center">
                    {t("citizen.profile.nameDevnagari")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id="nameDevnagari"
                    {...register("nameDevnagari")}
                    placeholder="पूरा नाम प्रविष्ट गर्नुहोस्"
                    className={cn(
                      errors.nameDevnagari &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={!!errors.nameDevnagari}
                  />
                  {errors.nameDevnagari && (
                    <p className="text-sm text-red-500">
                      {errors.nameDevnagari.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium text-base mb-3">
                {t("citizen.profile.citizenship")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Citizenship Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="citizenshipNumber"
                    className="flex items-center"
                  >
                    {t("citizen.profile.citizenshipNumber")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id="citizenshipNumber"
                    {...register("citizenshipNumber")}
                    placeholder="Enter your citizenship number"
                    className={cn(
                      errors.citizenshipNumber &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={!!errors.citizenshipNumber}
                  />
                  {errors.citizenshipNumber && (
                    <p className="text-sm text-red-500">
                      {errors.citizenshipNumber.message}
                    </p>
                  )}
                </div>

                {/* Issued Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="citizenshipIssuedDate"
                    className="flex items-center"
                  >
                    {t("citizen.profile.citizenshipIssuedDate")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="citizenshipIssuedDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                          errors.citizenshipIssuedDate &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                        aria-invalid={!!errors.citizenshipIssuedDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setValue("citizenshipIssuedDate", date as Date, {
                            shouldValidate: true,
                          });
                          setIsDateOpen(false);
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.citizenshipIssuedDate && (
                    <p className="text-sm text-red-500">
                      {errors.citizenshipIssuedDate.message?.toString()}
                    </p>
                  )}
                </div>

                {/* Issued Office */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="citizenshipIssuedOffice"
                    className="flex items-center"
                  >
                    {t("citizen.profile.citizenshipIssuedOffice")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id="citizenshipIssuedOffice"
                    {...register("citizenshipIssuedOffice")}
                    placeholder="Enter the office that issued your citizenship"
                    className={cn(
                      errors.citizenshipIssuedOffice &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={!!errors.citizenshipIssuedOffice}
                  />
                  {errors.citizenshipIssuedOffice && (
                    <p className="text-sm text-red-500">
                      {errors.citizenshipIssuedOffice.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium text-base mb-3">
                {t("citizen.profile.contactInfo")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    {t("citizen.profile.email")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className={cn(
                      errors.email &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center">
                    {t("citizen.profile.phoneNumber")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="e.g., +9779812345678"
                    className={cn(
                      errors.phoneNumber &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={!!errors.phoneNumber}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base mb-3">
                {t("citizen.profile.security")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    {t("citizen.profile.password")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Create a secure password"
                      className={cn(
                        errors.password &&
                          "border-red-500 focus-visible:ring-red-500",
                        "pr-10"
                      )}
                      aria-invalid={!!errors.password}
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
                        <span className="text-xs">
                          {passwordStrength.label}
                        </span>
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
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center"
                  >
                    {t("citizen.profile.confirmPassword")}{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm your password"
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm">
            <p className="font-medium flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
              {t("citizen.registration.dataProtectionNotice")}
            </p>
            <p className="mt-1 text-muted-foreground">
              {t("citizen.registration.dataProtectionDescription")}
            </p>
          </div>

          <CardFooter className="flex justify-between items-center px-0 pt-2">
            <div className="text-sm text-muted-foreground">
              <span className="text-red-500">*</span>{" "}
              {t("common.form.requiredFields")}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !isValid}
              className="min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("citizen.registration.registerNow")
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
