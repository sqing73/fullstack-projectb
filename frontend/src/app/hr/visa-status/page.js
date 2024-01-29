"use client";
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import AllProfiles from "./components/AllProfiles";
import InProgressProfiles from "./components/InProgressProfiles";
import { profileActions } from "@/store/reducers/profile";

const Page = () => {
  const [content, setContent] = useState("inProgressProfiles");
  const profileError = useSelector((state) => state.profile.error.unknown);
  const notification = useSelector((state) => state.profile.notification);
  const dispatch = useDispatch();
  const handleContentChange = (name) => {
    setContent(() => name);
  };

  const errorAlert = profileError && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(profileActions.unknownErrorRead());
      }}
    >
      {setTimeout(() => dispatch(profileActions.unknownErrorRead()), 4000) &&
        profileError}
    </Alert>
  );

  const notificationAlert = notification && (
    <Alert
      severity="success"
      onClose={() => {
        dispatch(profileActions.notificationRead());
      }}
    >
      {setTimeout(() => dispatch(profileActions.notificationRead()), 4000) &&
        notification}
    </Alert>
  );

  return (
    <>
      {errorAlert}
      {notificationAlert}
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
