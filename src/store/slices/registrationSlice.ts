import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RegisterCitizenRequest, ApiErrorResponse } from "@/domains/citizen/types";
import { RootState } from "@/store";
import { format } from "date-fns";
import { citizenApi } from "../services/citizenApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export type RegistrationStep =
  | "personal-info"
  | "citizenship-details"
  | "contact-info"
  | "security";

export interface RegistrationState {
  formData: Partial<RegisterCitizenRequest> & {
    confirmPassword?: string;
    citizenshipIssuedDate?: Date | string;
  };
  currentStep: RegistrationStep;
  stepValidation: {
    "personal-info": boolean;
    "citizenship-details": boolean;
    "contact-info": boolean;
    security: boolean;
  };
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: RegistrationState = {
  formData: {
    name: "",
    nameDevnagari: "",
    citizenshipNumber: "",
    citizenshipIssuedDate: undefined,
    citizenshipIssuedOffice: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  },
  currentStep: "personal-info",
  stepValidation: {
    "personal-info": false,
    "citizenship-details": false,
    "contact-info": false,
    security: false,
  },
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setFormField(
      state,
      action: PayloadAction<{ field: string; value: unknown }>
    ) {
      const { field, value } = action.payload;
      state.formData = {
        ...state.formData,
        [field]: value,
      };
    },

    setStepValidation(
      state,
      action: PayloadAction<{ step: RegistrationStep; isValid: boolean }>
    ) {
      const { step, isValid } = action.payload;
      state.stepValidation[step] = isValid;
    },

    nextStep(state) {
      const steps: RegistrationStep[] = [
        "personal-info",
        "citizenship-details",
        "contact-info",
        "security",
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex < steps.length - 1) {
        state.currentStep = steps[currentIndex + 1];
      }
    },

    prevStep(state) {
      const steps: RegistrationStep[] = [
        "personal-info",
        "citizenship-details",
        "contact-info",
        "security",
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = steps[currentIndex - 1];
      }
    },

    goToStep(state, action: PayloadAction<RegistrationStep>) {
      state.currentStep = action.payload;
    },

    resetForm() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        citizenApi.endpoints.registerCitizen.matchPending,
        (state) => {
          state.isSubmitting = true;
          state.error = null;
        }
      )
      .addMatcher(
        citizenApi.endpoints.registerCitizen.matchFulfilled,
        (state) => {
          state.isSubmitting = false;
          state.isSuccess = true;
        }
      )
      .addMatcher(
        citizenApi.endpoints.registerCitizen.matchRejected,
        (state, action) => {
          state.isSubmitting = false;

          // Extract error message from API response if available
          const errorData = extractApiErrorMessage(action.payload, action.error);
          state.error = errorData;
        }
      );
  },
});

// Helper function to extract error message from RTK Query error
function extractApiErrorMessage(
  payload: unknown,
  error: FetchBaseQueryError | SerializedError | undefined
): string {
  // Case 1: API returned a structured error response
  if (payload) {
    const errorPayload = payload as { data?: unknown };
    if (errorPayload.data) {
      const data = errorPayload.data as any;
      if (data.error && data.error.message) {
        return data.error.message; // Return the API error message key
      }
    }
  }

  // Case 2: Connection error (could not reach server)
  if (error && 'status' in error && error.status === 'FETCH_ERROR') {
    return 'errors.connectionFailed';
  }

  // Case 3: Server error (5xx)
  if (error && 'status' in error && typeof error.status === 'number' && error.status >= 500) {
    return 'errors.serverError';
  }

  // Case 4: Default fallback
  return 'errors.registrationFailed';
}

// Export actions
export const {
  setFormField,
  setStepValidation,
  nextStep,
  prevStep,
  goToStep,
  resetForm,
} = registrationSlice.actions;

// Selectors
export const selectRegistrationFormData = (state: RootState) =>
  state.registration.formData;
export const selectCurrentStep = (state: RootState) =>
  state.registration.currentStep;
export const selectStepValidation = (state: RootState) =>
  state.registration.stepValidation;
export const selectIsStepValid =
  (step: RegistrationStep) => (state: RootState) =>
    state.registration.stepValidation[step];
export const selectIsSubmitting = (state: RootState) =>
  state.registration.isSubmitting;
export const selectIsSuccess = (state: RootState) =>
  state.registration.isSuccess;
export const selectRegistrationError = (state: RootState) =>
  state.registration.error;
export const selectFormattedRegistrationData = (state: RootState) => {
  const data = state.registration.formData;
  const formatted: RegisterCitizenRequest = {
    name: data.name || "",
    nameDevnagari: data.nameDevnagari || "",
    citizenshipNumber: data.citizenshipNumber || "",
    citizenshipIssuedOffice: data.citizenshipIssuedOffice || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    password: data.password || "",
    confirmPassword: data.confirmPassword || "",
    citizenshipIssuedDate: "",
  };

  // Format date if it exists
  if (data.citizenshipIssuedDate) {
    const date = data.citizenshipIssuedDate as unknown;
    if (date instanceof Date) {
      formatted.citizenshipIssuedDate = format(
        data.citizenshipIssuedDate,
        "yyyy-MM-dd"
      );
    } else if (typeof data.citizenshipIssuedDate === "string") {
      formatted.citizenshipIssuedDate = data.citizenshipIssuedDate;
    }
  }

  return formatted;
};

// Export reducer
export const registrationReducer = registrationSlice.reducer;
