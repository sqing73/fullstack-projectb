import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const useProtectRoute = () => {
  const user = useSelector((state) => state.user.user);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!user.username && !user.role) {
      router.push("/signin");
    } else {
      router.push(`/${user.role}`);
      setIsAuthenticated(true);
    }
  }, [router, user.role, user.username]);

  return isAuthenticated;
};

export default useProtectRoute;
