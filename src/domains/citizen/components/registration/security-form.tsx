"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  selectRegistrationFormData,
  setFormField,
  setStepValidation,
} from "@/store/slices/registrationSlice";

export default function SecurityForm() {
  const t = useTranslations("citizen");
  const dispatch = useDispatch();
  const formData = useSelector(selectRegistrationFormData);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create schema
  const schema = z
    .object({
      password: z
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
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      password: formData.password || "",
      confirmPassword: formData.confirmPassword || "",
    },
  });

  // Watch form values
  const watchedFields = watch();
  const watchPassword = watch("password");

  // Update Redux store when form fields change
  useEffect(() => {
    if (watchedFields.password !== formData.password) {
      dispatch(
        setFormField({ field: "password", value: watchedFields.password })
      );
    }

    if (watchedFields.confirmPassword !== formData.confirmPassword) {
      dispatch(
        setFormField({
          field: "confirmPassword",
          value: watchedFields.confirmPassword,
        })
      );
    }

    dispatch(setStepValidation({ step: "security", isValid }));
  }, [watchedFields, isValid, dispatch, formData]);

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center">
            {t("profile.password")}{" "}
            <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Create a secure password"
              className={cn(
                errors.password && "border-red-500 focus-visible:ring-red-500",
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
                    watchPassword.match(/[^A-Za-z0-9]/) ? "text-green-600" : ""
                  )}
                >
                  • At least one special character
                </li>
              </ul>
            </div>
          )}
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center">
            {t("profile.confirmPassword")}{" "}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
  );
}
