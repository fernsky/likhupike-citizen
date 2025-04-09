/**
 * Possible states for a citizen in the verification workflow
 */
export type CitizenState =
  | "PENDING_REGISTRATION" // Newly self-registered citizens
  | "UNDER_REVIEW" // Registration is being reviewed by administrator
  | "ACTION_REQUIRED" // Issues that require citizen action
  | "REJECTED" // Registration has been rejected
  | "APPROVED"; // Registration is fully verified and approved

/**
 * Possible states for documents in the verification workflow
 */
export type DocumentState =
  | "NOT_UPLOADED" // Document hasn't been uploaded yet
  | "AWAITING_REVIEW" // Document is waiting for administrator review
  | "REJECTED_BLURRY" // Document rejected because it's too blurry or unclear
  | "REJECTED_UNSUITABLE" // Document rejected because it's unsuitable
  | "REJECTED_MISMATCH" // Document rejected due to mismatched information
  | "REJECTED_INCONSISTENT" // Document rejected due to inconsistency with other documents
  | "APPROVED"; // Document has been approved and verified

/**
 * Address information following Nepal's administrative structure
 */
export interface AddressInfo {
  provinceCode: string;
  provinceName: string;
  provinceNameNepali?: string;
  districtCode: string;
  districtName: string;
  districtNameNepali?: string;
  municipalityCode: string;
  municipalityName: string;
  municipalityNameNepali?: string;
  municipalityType: string;
  wardNumber: number;
  streetAddress?: string;
}

/**
 * Document information structure
 */
export interface DocumentInfo {
  url: string | null;
  state: DocumentState;
  note: string | null;
  uploadedAt: string | null;
}

/**
 * Document collection for a citizen
 */
export interface CitizenDocuments {
  photo: DocumentInfo | null;
  citizenshipFront: DocumentInfo | null;
  citizenshipBack: DocumentInfo | null;
}

export interface CitizenProfile {
  id: string;
  name: string;
  nameDevnagari: string;
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  citizenshipIssuedOffice: string;
  email: string;
  phoneNumber?: string;
  permanentAddress: AddressInfo | null;
  temporaryAddress: AddressInfo | null;
  fatherName: string | null;
  grandfatherName: string | null;
  spouseName: string | null;
  state: CitizenState;
  stateNote: string | null;
  stateUpdatedAt: string | null;
  stateUpdatedBy: string | null;
  isApproved: boolean;
  approvedAt: string | null;
  documents: CitizenDocuments;
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
  permanentAddress?: string;
  temporaryAddress?: string;
  fatherName?: string;
  grandfatherName?: string;
  spouseName?: string;
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
  timestamp?: string;
  errors?: Record<string, string[]>;
}

// A type that can represent either a successful or error response
export type ApiResult<T> = ApiResponse<T>;
