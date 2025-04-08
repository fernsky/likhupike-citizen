"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  selectRegistrationFormData,
  setFormField,
  setStepValidation,
} from "@/store/slices/registrationSlice";

export default function ContactInfoForm() {
  const t = useTranslations("citizen");
  const dispatch = useDispatch();
  const formData = useSelector(selectRegistrationFormData);

  // Create schema
  const schema = z.object({
    email: z.string().email({ message: t("validation.emailValid") }),

    phoneNumber: z.string().regex(/^(\+977)?[9][6-9]\d{8}$/, {
      message: t("validation.phoneFormat"),
    }),
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
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
    },
  });

  // Watch form values
  const watchedFields = watch();

  // Update Redux store when form fields change
  useEffect(() => {
    if (watchedFields.email !== formData.email) {
      dispatch(setFormField({ field: "email", value: watchedFields.email }));
    }

    if (watchedFields.phoneNumber !== formData.phoneNumber) {
      dispatch(
        setFormField({ field: "phoneNumber", value: watchedFields.phoneNumber })
      );
    }

    dispatch(setStepValidation({ step: "contact-info", isValid }));
  }, [watchedFields, isValid, dispatch, formData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            {t("profile.email")} <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email address"
            className={cn(
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center">
            {t("profile.phoneNumber")}{" "}
            <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="e.g., +9779812345678"
            className={cn(
              errors.phoneNumber && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
