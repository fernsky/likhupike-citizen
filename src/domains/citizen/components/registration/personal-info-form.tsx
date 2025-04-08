"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  selectRegistrationFormData, 
  setFormField, 
  setStepValidation 
} from "@/store/slices/registrationSlice";

export default function PersonalInfoForm() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const formData = useSelector(selectRegistrationFormData);
  
  // Create schema using zod
  const schema = z.object({
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
      name: formData.name || "",
      nameDevnagari: formData.nameDevnagari || "",
    },
  });

  const watchedFields = watch();

  // Update Redux store when form fields change
  useEffect(() => {
    if (watchedFields.name !== formData.name) {
      dispatch(setFormField({ field: "name", value: watchedFields.name }));
    }
    
    if (watchedFields.nameDevnagari !== formData.nameDevnagari) {
      dispatch(setFormField({ field: "nameDevnagari", value: watchedFields.nameDevnagari }));
    }
    
    dispatch(setStepValidation({ step: "personal-info", isValid }));
  }, [watchedFields, isValid, dispatch, formData]);

  return (
    <div className="space-y-6">
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
                    Enter your full name as it appears on your citizenship certificate
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter your full name"
            className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
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
            className={cn(errors.nameDevnagari && "border-red-500 focus-visible:ring-red-500")}
            aria-invalid={!!errors.nameDevnagari}
          />
          {errors.nameDevnagari && (
            <p className="text-sm text-red-500">{errors.nameDevnagari.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
