import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logoutUser } from "./user";
import { EMPLOYEE_API, HR_API } from "@/utils/api";

export const signupUser = createAsyncThunk(
  "registration/signup",
  async (data, { rejectWithValue }) => {
    const usernameError =
      data.username.length < 1 ? "Please enter a user name" : null;
    const passwordError =
      data.password.length < 1
        ? "Please enter a password"
        : data.password.length < 2
        ? "Password must have at least 2 characters long"
        : null;
    const tokenError =
      data.token.length < 1
        ? "Please enter a token"
        : data.token.length !== 4
        ? "Token must be 4 characters long"
        : null;
    if (usernameError || passwordError || tokenError) {
      return rejectWithValue({
        message: { usernameError, passwordError, tokenError },
      });
    }

    try {
      const res = await EMPLOYEE_API.post("/signup", data);
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

export const fetchRegistrations = createAsyncThunk(
  "registration/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await HR_API.get("/registration");
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

export const addRegistration = createAsyncThunk(
  "registration/add",
  async (data, { rejectWithValue }) => {
    try {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      const emailError =
        data.email.length < 1
          ? "Please enter an email"
          : !re.test(data.email)
          ? "Please enter a valid email"
          : null;
      const nameError = data.employee.length < 1 ? "Please enter a name" : null;
      if (emailError || nameError) {
        return rejectWithValue({ message: { emailError, nameError } });
      }

      const res = await HR_API.post("/registration", data);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error.response?.data.message || error.message,
      });
    }
  }
);

const initialRegistrationState = {
  registrations: [],
  error: {
    username: null,
    password: null,
    token: null,
    unknown: null,
    email: null,
    token: null,
  },
  status: "idle",
  addStatus: "idle",
  notification: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState: initialRegistrationState,
  reducers: {
    registerInputChange(state, action) {
      state.error = { ...initialRegistrationState.error };
    },
    readNotification(state) {
      state.notification = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.status = "idle";
        const errorMessage = payload?.message;
        if (!errorMessage) {
          state.error.unknown = "Unknown error, please try again later";
          console.log("Error not captured");
          return;
        }
        if (typeof errorMessage === "object") {
          state.error.username = errorMessage.usernameError || null;
          state.error.password = errorMessage.passwordError || null;
          state.error.token = errorMessage.tokenError || null;
        } else {
          const transformedMessage = errorMessage.toLowerCase();
          if (transformedMessage.includes("token")) {
            state.error.token = errorMessage;
          } else if (transformedMessage.includes("password")) {
            state.error.password = errorMessage;
          } else if (transformedMessage.includes("username")) {
            state.error.username = errorMessage;
          } else {
            state.error.unknown = errorMessage;
          }
        }
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.notification =
          "Signup succeed, please use your username and passward to signin";
      })
      .addCase(fetchRegistrations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRegistrations.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.registrations = payload.registrations;
      })
      .addCase(fetchRegistrations.rejected, (state, { payload }) => {
        state.status = "idle";
        if (!payload.message) {
          state.error.unknown = "Unknown error, please try again later";
          return;
        }
        state.error.unknown = payload.message;
      })
      .addCase(addRegistration.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addRegistration.rejected, (state, { payload }) => {
        state.addStatus = "idle";
        const errorMessage = payload?.message;
        if (!errorMessage) {
          state.error.unknown = "Unknown error, please try again later";
          return;
        }
        if (typeof errorMessage === "object") {
          state.error.name = errorMessage.nameError || null;
          state.error.email = errorMessage.emailError || null;
        } else {
          const transformedMessage = errorMessage.toLowerCase();
          if (transformedMessage.includes("email")) {
            state.error.email = errorMessage;
          } else {
            state.error.unknown = errorMessage;
          }
        }
      })
      .addCase(addRegistration.fulfilled, (state, { payload }) => {
        state.addStatus = "idle";
        const newRegistration = payload.registration;
        state.registrations.unshift(newRegistration);
        state.notification = payload.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return {
          ...initialRegistrationState,
          notification: state.notification,
        };
      });
  },
});

export const registrationActions = registrationSlice.actions;

export default registrationSlice;
