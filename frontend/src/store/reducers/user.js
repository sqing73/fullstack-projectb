import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/utils/api";

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
    // leave half an hour
    const tokenEpxired = tokenUpdatedAt + 3 * 24 * 60 * 60 * 1000 < Date.now();
    if (tokenEpxired) {
      localStorage.removeItem("user");
      return {};
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
        ? "Password must have at least 2 characters"
        : null;
    if (usernameError || passwordError) {
      return rejectWithValue({ message: { usernameError, passwordError } });
    }
    try {
      const res = await API.post("/signin", data);
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
  },
  error: {
    username: null,
    password: null,
  },
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    signinInputChange(state, action) {
      state.error.username = null;
      state.error.password = null;
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
      })
      .addCase(signinUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(signinUser.fulfilled, (state, { payload, error }) => {
        state.status = "idle";
        state.user.username = payload.user.username;
        state.user.role = payload.user.role;
        state.user.email = payload.user.email || "";
        localStorage.setItem("user", JSON.stringify(payload));
      })
      .addCase(signinUser.rejected, (state, { payload }) => {
        state.status = "idle";
        const errorMessage = payload?.message;
        if (!errorMessage) {
          return;
        }
        if (typeof errorMessage === "object") {
          state.error.username = errorMessage.usernameError || null;
          state.error.password = errorMessage.passwordError || null;
        } else {
          if (errorMessage.toLowerCase().includes("password")) {
            state.error.password = errorMessage;
          } else {
            state.error.username = errorMessage;
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
