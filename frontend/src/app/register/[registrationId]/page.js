"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/store/reducers/user";
import { registrationActions, signupUser } from "@/store/reducers/registration";

const Page = ({ params }) => {
  const resgistrationError = useSelector((state) => state.registration.error);
  const registrationStatus = useSelector((state) => state.registration.status);

  const dispatch = useDispatch();
  const router = useRouter();
  const [input, setInput] = React.useState({
    password: "",
    username: "",
    token: "",
  });

  React.useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const handleInputChange = (event, field) => {
    setInput((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInputFocus = () => {
    dispatch(registrationActions.registerInputChange());
  };

  const handleSignup = async () => {
    const result = await dispatch(
      signupUser({ ...input, registrationId: params.registrationId })
    );
    if (signupUser.fulfilled.match(result)) {
      router.replace("/signin");
    }
  };

  const errorAlert = resgistrationError.unknown && (
    <Alert
      severity="error"
      onClose={() => {
        dispatch(registrationActions.registerInputChange());
      }}
    >
      {resgistrationError.unknown}
    </Alert>
  );

  return (
    <>
      {errorAlert}

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
                Create your employee account
              </Typography>

              <TextField
                error={Boolean(resgistrationError.username)}
                id="username"
                label="Username"
                variant="outlined"
                sx={{ width: "100%" }}
                onChange={(event) => {
                  handleInputChange(event, "username");
                }}
                value={input.username}
                helperText={resgistrationError.username}
                onFocus={handleInputFocus}
                disabled={registrationStatus === "loading"}
              />

              <TextField
                error={Boolean(resgistrationError.password)}
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
                helperText={resgistrationError.password}
                onFocus={handleInputFocus}
                disabled={registrationStatus === "loading"}
              />

              <TextField
                inputProps={{ maxLength: 4 }}
                error={Boolean(resgistrationError.token)}
                id="token"
                label="Token"
                variant="outlined"
                sx={{ width: "100%" }}
                onChange={(event) => {
                  handleInputChange(event, "token");
                }}
                value={input.token}
                helperText={resgistrationError.token}
                onFocus={handleInputFocus}
                disabled={registrationStatus === "loading"}
              />

              <Button
                onClick={handleSignup}
                disabled={registrationStatus === "loading"}
              >
                {registrationStatus === "loading" ? "Submitting" : "Sign up"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default Page;
