import React, { useEffect } from "react";
import AuthForm from "../components/AuthForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector(selectCurrentUser);

  // Redirect if already signed in
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  if (currentUser) {
    return null; // Don't render anything while redirecting
  }
  return <AuthForm type="signin" />;
};

export default SignIn;
