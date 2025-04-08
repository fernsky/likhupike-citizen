export interface CitizenProfile {
  id: string;
  name: string;
  nameDevnagari: string;
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  citizenshipIssuedOffice: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  citizenshipFrontUrl?: string;
  citizenshipBackUrl?: string;
  status: "ACTIVE" | "PENDING_REGISTRATION" | "INACTIVE" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}

export interface RegisterCitizenRequest {
  name: string;
  nameDevnagari: string;
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  citizenshipIssuedOffice: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdateProfileRequest {
  email?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DocumentUploadResponse {
  documentId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    status: number;
  };
}

// A type that can represent either a successful or error response
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
