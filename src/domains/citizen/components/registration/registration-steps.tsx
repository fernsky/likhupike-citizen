"use client";

import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2Icon,
  CircleIcon,
  UserIcon,
  FileTextIcon,
  PhoneIcon,
  LockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RegistrationStep,
  goToStep,
  selectCurrentStep,
  selectStepValidation,
} from "@/store/slices/registrationSlice";

export default function RegistrationSteps() {
  const t = useTranslations("citizen");
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const stepValidation = useSelector(selectStepValidation);

  const steps = [
    {
      id: "personal-info" as RegistrationStep,
      name: t("profile.personalInfo"),
      icon: UserIcon,
    },
    {
      id: "citizenship-details" as RegistrationStep,
      name: t("profile.citizenship"),
      icon: FileTextIcon,
    },
    {
      id: "contact-info" as RegistrationStep,
      name: t("registration.contactInfo"),
      icon: PhoneIcon,
    },
    {
      id: "security" as RegistrationStep,
      name: t("profile.security"),
      icon: LockIcon,
    },
  ];

  const handleStepClick = (step: RegistrationStep) => {
    // Find the index of the clicked step and current step
    const stepIndex = steps.findIndex((s) => s.id === step);
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    // Only allow clicking on completed steps or the next available step
    if (
      stepIndex <= currentIndex ||
      (stepIndex === currentIndex + 1 &&
        steps.slice(0, currentIndex + 1).every((s) => stepValidation[s.id]))
    ) {
      dispatch(goToStep(step));
    }
  };

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="space-y-3 md:flex md:space-x-2 md:space-y-0">
        {steps.map((step, stepIdx) => {
          const isActive = currentStep === step.id;
          const isCompleted = stepValidation[step.id];
          const isAvailable =
            stepIdx === 0 ||
            steps.slice(0, stepIdx).every((s) => stepValidation[s.id]);

          return (
            <li key={step.name} className="md:flex-1">
              <button
                className={cn(
                  "group flex w-full flex-col border-l-4 py-3 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-2",
                  isActive
                    ? "border-blue-600 md:border-blue-600"
                    : isCompleted
                      ? "border-green-600 md:border-green-600"
                      : isAvailable
                        ? "border-slate-200 hover:border-slate-300"
                        : "border-slate-200 opacity-50 cursor-not-allowed",
                  "transition-colors duration-200"
                )}
                aria-current={isActive ? "step" : undefined}
                onClick={() => isAvailable && handleStepClick(step.id)}
                disabled={!isAvailable}
              >
                <span className="flex items-center text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full mr-3",
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "border border-slate-300 bg-white"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : isActive ? (
                      <step.icon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <CircleIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span>{step.name}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
