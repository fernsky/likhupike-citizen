import { createSlice } from "@reduxjs/toolkit";
import { Municipality } from "@/domains/profile/location/types";
import { locationApi } from "../services/locationApi";
import { RootState } from "../index";

interface MunicipalityState {
  data: Municipality | null;
  loading: boolean;
  error: string | null;
}

const initialState: MunicipalityState = {
  data: null,
  loading: false,
  error: null,
};

export const municipalitySlice = createSlice({
  name: "municipality",
  initialState,
  reducers: {
    clearMunicipalityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addMatcher(
        locationApi.endpoints.getMunicipality.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Handle successful response
      .addMatcher(
        locationApi.endpoints.getMunicipality.matchFulfilled,
        (state, action) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      // Handle error
      .addMatcher(
        locationApi.endpoints.getMunicipality.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch municipality data";
        }
      );
  },
});

// Export actions
export const { clearMunicipalityError } = municipalitySlice.actions;

// Export selectors
export const selectMunicipality = (state: RootState) => state.municipality.data;
export const selectMunicipalityLoading = (state: RootState) => state.municipality.loading;
export const selectMunicipalityError = (state: RootState) => state.municipality.error;

// Export reducer
export const municipalityReducer = municipalitySlice.reducer;
