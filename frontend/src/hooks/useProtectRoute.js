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

  React.useEffect(() => {
    if (!user.username || !user.role || !path.includes(user.role)) {
      dispatch(logoutUser());
      router.replace("/signin");
    } else {
      setAuthenticating(false);
    }
  }, [dispatch, path, router, user.role, user.username]);

  return authenticating;
};

export default useProtectRoute;
