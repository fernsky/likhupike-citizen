import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  ApiResponse, 
  CitizenProfile, 
  DocumentUploadResponse,
  RegisterCitizenRequest,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '@/domains/citizen/types';

export const citizenApi = createApi({
  reducerPath: 'citizenApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem('auth_token');
      
      // If token exists, add authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['CitizenProfile', 'Document'],
  endpoints: (builder) => ({
    // Get citizen profile
    getMyProfile: builder.query<CitizenProfile, void>({
      query: () => ({
        url: '/citizen-profile/me',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<CitizenProfile>) => response.data,
      providesTags: ['CitizenProfile'],
    }),
    
    // Register citizen
    registerCitizen: builder.mutation<CitizenProfile, RegisterCitizenRequest>({
      query: (data) => ({
        url: '/citizen-profile/register',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CitizenProfile>) => response.data,
    }),
    
    // Update profile
    updateProfile: builder.mutation<CitizenProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/citizen-profile/me',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CitizenProfile>) => response.data,
      invalidatesTags: ['CitizenProfile'],
    }),
    
    // Change password
    changePassword: builder.mutation<CitizenProfile, ChangePasswordRequest>({
      query: (data) => ({
        url: '/citizen-profile/me/change-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CitizenProfile>) => response.data,
    }),
    
    // Upload photo
    uploadPhoto: builder.mutation<DocumentUploadResponse, FormData>({
      query: (data) => ({
        url: '/citizen-profile/me/photo',
        method: 'POST',
        body: data,
        formData: true,
      }),
      transformResponse: (response: ApiResponse<DocumentUploadResponse>) => response.data,
      invalidatesTags: ['CitizenProfile'],
    }),
    
    // Upload citizenship front
    uploadCitizenshipFront: builder.mutation<DocumentUploadResponse, FormData>({
      query: (data) => ({
        url: '/citizen-profile/me/citizenship/front',
        method: 'POST',
        body: data,
        formData: true,
      }),
      transformResponse: (response: ApiResponse<DocumentUploadResponse>) => response.data,
      invalidatesTags: ['CitizenProfile', 'Document'],
    }),
    
    // Upload citizenship back
    uploadCitizenshipBack: builder.mutation<DocumentUploadResponse, FormData>({
      query: (data) => ({
        url: '/citizen-profile/me/citizenship/back',
        method: 'POST',
        body: data,
        formData: true,
      }),
      transformResponse: (response: ApiResponse<DocumentUploadResponse>) => response.data,
      invalidatesTags: ['CitizenProfile', 'Document'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useRegisterCitizenMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadPhotoMutation,
  useUploadCitizenshipFrontMutation,
  useUploadCitizenshipBackMutation,
} = citizenApi;
