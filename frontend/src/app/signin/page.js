"use client";
import React from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { signinUser, userActions } from "@/store/reducers/user";
import { useRouter } from "next/navigation";

const Page = () => {
  const userSlice = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [input, setInput] = React.useState({
    password: "",
    username: "",
  });

  const handleSignin = async () => {
    const result = await dispatch(signinUser(input));
    if (signinUser.fulfilled.match(result)) {
      router.push("/employee");
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

  return (
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
  );
};

export default Page;
