import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import registrationSlice from "./reducers/registration";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    registration: registrationSlice.reducer,
  },
});

export default store;
