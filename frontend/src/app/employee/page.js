"use client";
import React from "react";
import useProtectRoute from "@/hooks/useProtectRoute";

const Page = () => {
  const isAuthenticated = useProtectRoute();
  if (!isAuthenticated) {
    return null;
  }

  return <div>employee</div>;
};

export default Page;
