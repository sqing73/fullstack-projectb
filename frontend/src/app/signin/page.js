"use client";
import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, signinUser, userActions } from "@/store/reducers/user";
import { registrationActions } from "@/store/reducers/registration";

const Page = () => {
  const userSlice = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [input, setInput] = React.useState({
    password: "",
    username: "",
  });

  const registrationNotification = useSelector(
    (state) => state.registration.notification
  );

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const handleSignin = async () => {
    const result = await dispatch(signinUser(input));
    if (signinUser.fulfilled.match(result)) {
      router.push(`/${result.payload.user.role}`);
    }
  };

  const handleInputChange = (event, field) => {
    setInput((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInputFocus = () => {
    dispatch(userActions.signinInputChange());
  };

  const alert = userSlice.error.unknown && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(userActions.signinInputChange());
      }}
    >
      {userSlice.error.unknown}
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
      {alert}
      {notificationAlert}

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", mt: "15%" }}
      >
        <Card sx={{ width: "45%", maxWidth: "540px" }}>
          <CardContent>
            <Stack direction="column" alignItems="center" spacing={4}>
              <Typography variant="h5" component="div">
                Sign in to your account
              </Typography>

              <TextField
                error={Boolean(userSlice.error.username)}
                id="username"
                label="Username"
                variant="outlined"
                sx={{ width: "100%" }}
                onChange={(event) => {
                  handleInputChange(event, "username");
                }}
                value={input.username}
                helperText={userSlice.error.username}
                onFocus={handleInputFocus}
                disabled={userSlice.status === "loading"}
              />

              <TextField
                error={Boolean(userSlice.error.password)}
                id="password"
                label="Password"
                variant="outlined"
                sx={{ width: "100%" }}
                type="password"
                key="password"
                onChange={(event) => {
                  handleInputChange(event, "password");
                }}
                value={input.password}
                helperText={userSlice.error.password}
                onFocus={handleInputFocus}
                disabled={userSlice.status === "loading"}
              />
              <Button
                onClick={handleSignin}
                disabled={userSlice.status === "loading"}
              >
                {userSlice.status === "loading" ? "Submitting" : "Sign in"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default Page;
