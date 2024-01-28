"use client";
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import AllProfiles from "./components/AllProfiles";
import InProgressProfiles from "./components/InProgressProfiles";

const Page = () => {
  const [content, setContent] = useState("allProfiles");
  const profileError = useSelector((state) => state.profile.error.unknonw);
  const dispatch = useDispatch();
  const handleContentChange = (name) => {
    setContent(() => name);
  };

  const registrationAlert = profileError && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(registrationActions.registerInputChange());
      }}
    >
      {profileError}
    </Alert>
  );

  // const notificationAlert = registrationNotification && (
  //   <Alert
  //     severity="success"
  //     onClose={() => {
  //       dispatch(registrationActions.readNotification());
  //     }}
  //   >
  //     {registrationNotification}
  //   </Alert>
  // );

  return (
    <>
      {registrationAlert}
      {/* {notificationAlert} */}
      <Stack direction="column" sx={{ width: "100%", p: 15 }}>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => handleContentChange("inProgressProfiles")}
          >
            In Progress
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleContentChange("allProfiles")}
          >
            All Visa Status
          </Button>
        </Stack>
        {content === "allProfiles" && <AllProfiles />}
        {content === "inProgressProfiles" && <InProgressProfiles />}
      </Stack>
    </>
  );
};

export default Page;
