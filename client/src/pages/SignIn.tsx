import React from "react";
import AuthForm from "../components/AuthForm";
import { useAuthRedirect } from "../utils/custom-hooks";

const SignIn: React.FC = () => {
  const { shouldRedirect } = useAuthRedirect("authenticated", "/");

  if (shouldRedirect) {
    return null; // Don't render anything while redirecting
  }
  return <AuthForm type="signin" />;
};

export default SignIn;
