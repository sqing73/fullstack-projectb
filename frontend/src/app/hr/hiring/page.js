"use client";
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import RegistrationContent from "./components/RegistrationContent";
import OnboardContent from "./components/OnboardContent";
import { useDispatch, useSelector } from "react-redux";
import { registrationActions } from "@/store/reducers/registration";

const Page = () => {
  const [content, setContent] = useState("registration");
  const dispatch = useDispatch();
  const handleContentChange = (name) => {
    setContent(() => name);
  };

  const registrationError = useSelector(
    (state) => state.registration.error.unknown
  );

  const registrationNotification = useSelector(
    (state) => state.registration.notification
  );

  const registrationAlert = registrationError && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(registrationActions.registerInputChange());
      }}
    >
      {registrationError}
    </Alert>
  );

  const notificationAlert = registrationNotification && (
    <Alert
      severity="success"
      onClose={() => {
        dispatch(registrationActions.readNotification());
      }}
    >
      {registrationNotification}
    </Alert>
  );

  return (
    <>
      {registrationAlert}
      {notificationAlert}
      <Stack direction="column" sx={{ width: "100%", p: 15 }}>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => handleContentChange("registration")}
          >
            registration
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleContentChange("onboard")}
          >
            onboard
          </Button>
        </Stack>
        {content === "registration" && <RegistrationContent />}
        {content === "onboard" && <OnboardContent />}
      </Stack>
    </>
  );
};

export default Page;
