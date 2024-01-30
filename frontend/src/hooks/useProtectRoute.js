import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/store/reducers/user";

const useProtectRoute = () => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch();
  const [authenticating, setAuthenticating] = React.useState(true);
  const rootPath = path.split("/")[1];

  React.useEffect(() => {
    if (
      !user.username ||
      !user.role ||
      (rootPath !== "application" && rootPath !== user.role) ||
      (rootPath === "application" && user.role === "hr") ||
      (rootPath === "application" &&
        user.role === "employee" &&
        user.profile &&
        user.profile.applicationStatus === "approved")
    ) {
      dispatch(logoutUser());
      router.replace("/signin");
    } else if (
      rootPath !== "application" &&
      user.role === "employee" &&
      (user.profile === null || user.profile.applicationStatus !== "approved")
    ) {
      router.replace("/application");
    } else {
      setAuthenticating(false);
    }
  }, []);

  return authenticating;
};

export default useProtectRoute;
