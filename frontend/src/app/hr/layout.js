"use client";
import useProtectRoute from "@/hooks/useProtectRoute";

const Layout = ({ children }) => {
  const authenticating = useProtectRoute();
  if (authenticating) {
    return null;
  }
  return <>{children}</>;
};

export default Layout;
