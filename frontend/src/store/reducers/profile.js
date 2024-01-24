import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HR_API } from "@/utils/api";

export const fetchProfiles = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await HR_API.get("/employeeProfile");
      const profileData = res.data;
      const profileDataWithFullname = profileData.map((profile) => {
        return {
          ...profile,
          fullName: !profile.name
            ? ""
            : profile.name?.middle
            ? `${profile.name.first} ${profile.name.middle} ${profile.name.last}`
            : `${profile.name.first} ${profile.name.last}`,
        };
      });
      return profileDataWithFullname;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

const initialProfileState = {
  profiles: [],
  error: {
    unknown: null,
  },
  status: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    unknownErrorRead(state) {
      state.error.unknown = null;
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
      });
  },
});

export const profileActions = profileSlice.actions;

export default profileSlice;
