import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API, EMPLOYEE_API } from "@/utils/api";

export const logoutUser = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("user");
});

export const initializeUser = createAsyncThunk("user/initialize", async () => {
  if (typeof window !== "undefined") {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser || !localUser.token || !localUser.tokenUpdatedAt) {
      localStorage.removeItem("user");
      return {};
    }
    const tokenUpdatedAt = new Date(localUser.tokenUpdatedAt);
    const tokenEpxired = tokenUpdatedAt + 3 * 24 * 60 * 60 * 1000 < Date.now();
    if (tokenEpxired) {
      localStorage.removeItem("user");
      return {};
    }
    if (localUser.user.role === "employee") {
      try {
        const res = await EMPLOYEE_API.get("/");
        localUser.user = { ...res.data, profile: undefined };
        localStorage.setItem("user", JSON.stringify(localUser));
        return res.data;
      } catch (error) {
        return {};
      }
    }
    return localUser.user;
  }
});

export const signinUser = createAsyncThunk(
  "user/signin",
  async (data, { rejectWithValue }) => {
    const usernameError =
      data.username.length < 1 ? "Please enter a username" : null;
    const passwordError =
      data.password.length < 1
        ? "Please enter a password"
        : data.password.length < 2
        ? "Password must have at least 2 characters long"
        : null;
    if (usernameError || passwordError) {
      return rejectWithValue({ message: { usernameError, passwordError } });
    }
    try {
      const res = await API.post("/signin", data);
      const localUser = { ...res.data };
      localUser.user = { ...res.data.user };
      localUser.user.profile = undefined;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(localUser));
      }
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

const initialUserState = {
  user: {
    username: "",
    role: "",
    email: "",
    profile: null,
  },
  error: {
    username: null,
    password: null,
    unknown: null,
  },
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    signinInputChange(state, action) {
      state.error = { ...initialUserState.error };
    },
    singinInputError(state, { payload }) {
      state.error.username = payload.usernameError;
      state.error.password = payload.passwordError;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeUser.fulfilled, (state, { payload }) => {
        state.user.username = payload?.username || "";
        state.user.role = payload?.role || "";
        state.user.email = payload?.email || "";
        state.user.profile = payload?.profile || null;
      })
      .addCase(signinUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signinUser.fulfilled, (state, { payload, error }) => {
        state.status = "idle";
        state.user.username = payload.user.username;
        state.user.role = payload.user.role;
        state.user.email = payload.user.email || "";
        state.user.profile = payload.user.profile || null;
      })
      .addCase(signinUser.rejected, (state, { payload }) => {
        state.status = "idle";
        const errorMessage = payload?.message;
        if (!errorMessage) {
          state.error.unknown = "Unknwon error, please try again later";
          console.log("Error not captured");
          return;
        }
        if (typeof errorMessage === "object") {
          state.error.username = errorMessage.usernameError || null;
          state.error.password = errorMessage.passwordError || null;
        } else {
          const transformedMessage = errorMessage.toLowerCase();
          if (transformedMessage.includes("password")) {
            state.error.password = errorMessage;
          } else if (transformedMessage.includes("username")) {
            state.error.username = errorMessage;
          } else {
            state.error.unknown = errorMessage;
          }
        }
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialUserState;
      });
  },
});

export const userActions = userSlice.actions;

export default userSlice;
