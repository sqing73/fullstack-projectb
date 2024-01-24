import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import registrationSlice from "./reducers/registration";
import applicationSlice from "./reducers/registration";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    registration: registrationSlice.reducer,
    application: applicationSlice.reducer,
  },
});

export default store;
