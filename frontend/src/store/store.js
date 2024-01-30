import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import registrationSlice from "./reducers/registration";
import applicationSlice from "./reducers/application";
import profileSlice from "./reducers/profile";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    registration: registrationSlice.reducer,
    application: applicationSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export default store;
