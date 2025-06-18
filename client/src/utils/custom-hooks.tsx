import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../redux/user/userSlice";

type RedirectType = "authenticated" | "unauthenticated";

export const useAuthRedirect = (type: RedirectType, fallbackPath = "/") => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(selectCurrentUser);

  useEffect(() => {
    if (type === "authenticated" && currentUser) {
      // Redirect authenticated users (for SignIn, SignUp, Overview pages)
      const from = location.state?.from?.pathname || fallbackPath;
      navigate(from, { replace: true });
    } else if (type === "unauthenticated" && !currentUser) {
      // Redirect unauthenticated users (for protected pages)
      navigate("/sign-in", { state: { from: location }, replace: true });
    }
  }, [currentUser, navigate, location, type, fallbackPath]);

  // Return whether we should show loading/nothing while redirecting
  const shouldRedirect =
    (type === "authenticated" && currentUser) ||
    (type === "unauthenticated" && !currentUser);

  return { shouldRedirect, currentUser };
};
