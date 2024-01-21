"use client";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Page = () => {
  const username = useSelector((state) => state.user.user.username);
  const router = useRouter();

  React.useLayoutEffect(() => {
    if (username) {
      router.push("/employee");
    } else {
      router.push("/signin");
    }
  }, [router, username]);

  return null;
};

export default Page;
