import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CitizenProfile, DocumentInfo } from "@/domains/citizen/types";

interface ProfileState {
  data: CitizenProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess(state, action: PayloadAction<CitizenProfile>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchProfileFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileSuccess(
      state,
      action: PayloadAction<Partial<CitizenProfile>>
    ) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    updatePhotoSuccess(state, action: PayloadAction<DocumentInfo>) {
      if (state.data) {
        state.data = {
          ...state.data,
          documents: {
            ...state.data.documents,
            photo: action.payload,
          },
        };
      }
    },
    updateDocumentSuccess(
      state,
      action: PayloadAction<{ type: "front" | "back"; document: DocumentInfo }>
    ) {
      if (state.data) {
        if (action.payload.type === "front") {
          state.data = {
            ...state.data,
            documents: {
              ...state.data.documents,
              citizenshipFront: action.payload.document,
            },
          };
        } else {
          state.data = {
            ...state.data,
            documents: {
              ...state.data.documents,
              citizenshipBack: action.payload.document,
            },
          };
        }
      }
    },
    clearProfile(state) {
      state.data = null;
    },
    clearProfileError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileSuccess,
  updatePhotoSuccess,
  updateDocumentSuccess,
  clearProfile,
  clearProfileError,
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
