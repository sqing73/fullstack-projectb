"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

function Footer() {
  return (
    <AppBar position="static" sx={{ mt: "auto" }}>
      <Container maxWidth="xl">
        <Toolbar></Toolbar>
      </Container>
    </AppBar>
  );
}
export default Footer;
