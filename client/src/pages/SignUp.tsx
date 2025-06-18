import React from "react";
import AuthForm from "../components/AuthForm";
import { useAuthRedirect } from "../utils/custom-hooks";

const SignUp: React.FC = () => {
  const { shouldRedirect } = useAuthRedirect("authenticated", "/");

  if (shouldRedirect) {
    return null; // Don't render anything while redirecting
  }
  return <AuthForm type="signup" />;
};

export default SignUp;
