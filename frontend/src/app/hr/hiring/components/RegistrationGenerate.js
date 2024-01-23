import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { registrationActions } from "@/store/reducers/registration";
import { useDispatch, useSelector } from "react-redux";
import { addRegistration } from "@/store/reducers/registration";

const RegistrationGenerate = ({ setRegistrationGenerateOpen }) => {
  const [input, setInput] = React.useState({ email: "", employee: "" });
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.registration.error);
  const status = useSelector((state) => state.registration.addStatus);

  const handleInputChange = (e, field) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputFocus = () => {
    dispatch(registrationActions.registerInputChange());
  };

  const handleRegistrationGenerate = async () => {
    const result = await dispatch(addRegistration(input));
    if (addRegistration.fulfilled.match(result)) {
      setRegistrationGenerateOpen(false);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          error={Boolean(errors.email)}
          label="email"
          onChange={(e) => handleInputChange(e, "email")}
          onFocus={handleInputFocus}
          value={input.email}
          helperText={errors.email}
          disabled={status !== "idle"}
        />
        <TextField
          error={Boolean(errors.name)}
          label="name"
          onChange={(e) => handleInputChange(e, "employee")}
          onFocus={handleInputFocus}
          value={input.name}
          helperText={errors.name}
          disabled={status !== "idle"}
        />
        <Stack justifyContent="center" alignItems="center">
          <Button
            variant="outlined"
            sx={{ width: "30%", mx: "100px", justifySelf: "center" }}
            onClick={handleRegistrationGenerate}
            disabled={status !== "idle"}
          >
            {status === "idle" ? "submit" : "submitting"}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default RegistrationGenerate;
