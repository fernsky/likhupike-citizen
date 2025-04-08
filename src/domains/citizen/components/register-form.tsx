"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ShieldCheck } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/utils";
import PersonalInfoForm from "./registration/personal-info-form";
import CitizenshipForm from "./registration/citizenship-form";
import ContactInfoForm from "./registration/contact-info-form";
import SecurityForm from "./registration/security-form";
import RegistrationSteps from "./registration/registration-steps";
import {
  nextStep,
  prevStep,
  resetForm,
  selectCurrentStep,
  selectFormattedRegistrationData,
  selectIsStepValid,
  selectIsSubmitting,
  selectIsSuccess,
  selectRegistrationError,
} from "@/store/slices/registrationSlice";

export default function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux selectors
  const currentStep = useSelector(selectCurrentStep);
  const isCurrentStepValid = useSelector(selectIsStepValid(currentStep));
  const formData = useSelector(selectFormattedRegistrationData);
  const isSubmitting = useSelector(selectIsSubmitting);
  const isSuccess = useSelector(selectIsSuccess);
  const error = useSelector(selectRegistrationError);

  // RTK Query mutation hook
  const [registerCitizen] = useRegisterCitizenMutation();

  // Step titles and forms
  const steps = {
    "personal-info": {
      title: t("citizen.profile.personalInfo"),
      component: <PersonalInfoForm />,
    },
    "citizenship-details": {
      title: t("citizen.profile.citizenship"),
      component: <CitizenshipForm />,
    },
    "contact-info": {
      title: t("citizen.registration.contactInfo"),
      component: <ContactInfoForm />,
    },
    security: {
      title: t("citizen.profile.security"),
      component: <SecurityForm />,
    },
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await registerCitizen(formData).unwrap();

      // Show success state and redirect after delay
      setTimeout(() => {
        router.push("/registration-success");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  // Determine if on the final step
  const isLastStep = currentStep === "security";
  const isFirstStep = currentStep === "personal-info";

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      dispatch(nextStep());
    }
  };

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

        <RegistrationSteps />

        <div className="space-y-6">
          <div className="border-b pb-4 mb-4">
            <h3 className="font-medium text-base mb-3">
              {steps[currentStep].title}
            </h3>
            {/* Current step form */}
            {steps[currentStep].component}
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
            <div className="flex gap-3">
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  {t("common.form.back")}
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || !isCurrentStepValid}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.form.submitting")}
                  </>
                ) : isLastStep ? (
                  t("citizen.registration.registerNow")
                ) : (
                  t("common.form.next")
                )}
              </Button>
            </div>
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  );
}
