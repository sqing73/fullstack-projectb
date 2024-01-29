import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HR_API } from "@/utils/api";
import { logoutUser } from "./user";

export const fetchProfiles = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await HR_API.get("/employeeProfile");
      const profileData = res.data;
      return profileData;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

export const fectNoProfileEmployees = createAsyncThunk(
  "profile/fectNoProfileEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await HR_API.get("/noProfileEmployee");
      const employees = res.data;
      return employees;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

export const updateVisaStatus = createAsyncThunk(
  "profile/update",
  async ({ profileId, action, feedback }, { rejectWithValue }) => {
    try {
      const res = await HR_API.put("/VisaStatus", {
        profileId,
        action,
        feedback,
      });
      const newProfile = res.data;
      return newProfile;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

const initialProfileState = {
  profiles: [],
  noProfileEmployees: [],
  error: {
    unknown: null,
  },
  status: "idle",
  notification: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    unknownErrorRead(state) {
      state.error.unknown = null;
    },
    notificationRead(state) {
      state.notification = null;
    },
    unknownErrorSet(state, action) {
      state.error.unknown = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfiles.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.profiles = payload;
      })
      .addCase(fetchProfiles.rejected, (state, { payload }) => {
        state.status = "idle";
        state.error.unknown =
          payload?.message || "Unknown error, please try a again later";
      })
      .addCase(fectNoProfileEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fectNoProfileEmployees.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.noProfileEmployees = payload;
      })
      .addCase(fectNoProfileEmployees.rejected, (state, { payload }) => {
        state.status = "idle";
        state.error.unknown =
          payload?.message || "Unknown error, please try a again later";
      })
      .addCase(updateVisaStatus.pending, (state, { payload }) => {
        state.status = "loading";
      })
      .addCase(updateVisaStatus.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.profiles.forEach((profile, idx) => {
          if (profile._id === payload._id) {
            state.profiles[idx] = payload;
          }
        });
        state.notification = `You have successfully updated ${payload.fullname}'s status`;
      })
      .addCase(updateVisaStatus.rejected, (state, { payload }) => {
        state.status = "loading";
        state.error.unknown =
          payload?.message || "Unknown error, please try a again later";
      })
      .addCase(logoutUser.fulfilled, () => {
        return {
          ...initialProfileState,
        };
      });
  },
});

export const profileActions = profileSlice.actions;

export default profileSlice;
