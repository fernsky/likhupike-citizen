"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  selectRegistrationFormData,
  setFormField,
  setStepValidation,
} from "@/store/slices/registrationSlice";

export default function CitizenshipForm() {
  const t = useTranslations("citizen");
  const dispatch = useDispatch();
  const formData = useSelector(selectRegistrationFormData);

  // Date picker state
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Create schema
  const schema = z.object({
    citizenshipNumber: z
      .string()
      .min(1, { message: t("validation.required") })
      .regex(/^[0-9\-\/]+$/, {
        message: t("validation.citizenshipNumberFormat"),
      }),

    citizenshipIssuedDate: z
      .date({
        required_error: t("validation.required"),
      })
      .refine((date) => date <= new Date(), {
        message: t("validation.dateInPast"),
      }),
    citizenshipIssuedOffice: z
      .string()
      .min(2, { message: t("validation.required") })
      .max(150, {
        message: t("validation.maxLength", { length: 150 }),
      }),
  });

  type FormValues = z.infer<typeof schema>;

  // Parse date from string if it exists
  const defaultDate =
    (formData.citizenshipIssuedDate as unknown) instanceof Date
      ? formData.citizenshipIssuedDate
      : formData.citizenshipIssuedDate
        ? new Date(formData.citizenshipIssuedDate)
        : undefined;

  const {
    register,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      citizenshipNumber: formData.citizenshipNumber || "",
      citizenshipIssuedDate: defaultDate as Date,
      citizenshipIssuedOffice: formData.citizenshipIssuedOffice || "",
    },
  });

  // Watch form values
  const watchedFields = watch();
  const selectedDate = watch("citizenshipIssuedDate");

  // Update Redux store when form fields change
  useEffect(() => {
    if (watchedFields.citizenshipNumber !== formData.citizenshipNumber) {
      dispatch(
        setFormField({
          field: "citizenshipNumber",
          value: watchedFields.citizenshipNumber,
        })
      );
    }

    if (
      watchedFields.citizenshipIssuedOffice !== formData.citizenshipIssuedOffice
    ) {
      dispatch(
        setFormField({
          field: "citizenshipIssuedOffice",
          value: watchedFields.citizenshipIssuedOffice,
        })
      );
    }

    if (
      selectedDate &&
      (!formData.citizenshipIssuedDate ||
        ((formData.citizenshipIssuedDate as unknown) instanceof Date &&
          (formData.citizenshipIssuedDate as Date).getTime() !==
            selectedDate.getTime()))
    ) {
      dispatch(
        setFormField({
          field: "citizenshipIssuedDate",
          value: selectedDate,
        })
      );
    }

    dispatch(setStepValidation({ step: "citizenship-details", isValid }));
  }, [watchedFields, selectedDate, isValid, dispatch, formData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Citizenship Number */}
        <div className="space-y-2">
          <Label htmlFor="citizenshipNumber" className="flex items-center">
            {t("profile.citizenshipNumber")}{" "}
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
          <Label htmlFor="citizenshipIssuedDate" className="flex items-center">
            {t("profile.citizenshipIssuedDate")}{" "}
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
            {t("profile.citizenshipIssuedOffice")}{" "}
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
  );
}
