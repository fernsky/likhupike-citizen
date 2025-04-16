import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Municipality, MunicipalityApiResponse } from "@/domains/profile/location/types";

/**
 * RTK Query API for location related endpoints
 */
export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/profile/location`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Municipality"],
  endpoints: (builder) => ({
    // Get municipality profile
    getMunicipality: builder.query<Municipality, void>({
      query: () => ({
        url: "/municipality",
        method: "GET",
      }),
      transformResponse: (response: MunicipalityApiResponse) => response.data,
      providesTags: ["Municipality"],
    }),
  }),
});

export const { useGetMunicipalityQuery } = locationApi;
