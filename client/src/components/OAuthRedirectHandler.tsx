import { useEffect, useState } from "react";
import { getRedirectResult, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { app } from "../services/firebase";
import { authAPI } from "../services/api";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { showSuccessToast, showErrorToast } from "../utils/custom-toast";
import type { AuthResult, GoogleAuthResponse } from "../types/auth.types";

type AuthStatus = "loading" | "processing" | "success" | "error";

const OAuthRedirectHandler: React.FC = () => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [message, setMessage] = useState("Initializing authentication...");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth(app);
        setMessage("Checking authentication result...");

        const result = (await getRedirectResult(auth)) as AuthResult | null;

        if (result?.user) {
          setStatus("processing");
          setMessage("Processing your account...");
          dispatch(signInStart());

          const googleAuthData = {
            name: result.user.displayName || "",
            email: result.user.email || "",
            image: result.user.photoURL || "",
          };

          const response: GoogleAuthResponse = await authAPI.googleAuth(
            googleAuthData
          );

          // Transform response to match User interface
          const user = {
            id: response._id,
            username: response.username,
            email: response.email,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
          };

          dispatch(signInSuccess(user));
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");

          showSuccessToast(
            "Welcome to EstateX!",
            `Signed in successfully as ${user.username}`
          );

          // Delay navigation for better UX
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          // No redirect result means user landed here directly
          setStatus("error");
          setMessage(
            "No authentication result found. Redirecting to sign in..."
          );

          setTimeout(() => {
            navigate("/sign-in");
          }, 2000);
        }
      } catch (error) {
        console.error("❌ OAuth Redirect error:", error);
        setStatus("error");

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Authentication failed. Please try again.";

        setMessage(errorMessage);
        dispatch(signInFailure(errorMessage));

        showErrorToast("Authentication Failed", errorMessage);

        // Redirect to sign in after showing error
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    };

    handleRedirectResult();
  }, [dispatch, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
      case "processing":
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
      case "processing":
        return "text-blue-600 dark:text-blue-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="font-extrabold text-4xl flex items-center justify-center mb-4"
            style={{ fontFamily: "Xtradex" }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-800 dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 bg-clip-text text-transparent">
              Estate
            </span>
            <span className="ml-1 text-amber-600 dark:text-amber-400">X</span>
          </div>
        </div>

        {/* Auth Status Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-default p-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {getStatusIcon()}
              {(status === "loading" || status === "processing") && (
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              {status === "loading" && "Authenticating..."}
              {status === "processing" && "Processing Account..."}
              {status === "success" && "Success!"}
              {status === "error" && "Authentication Failed"}
            </h2>

            <p className={`text-sm ${getStatusColor()}`}>{message}</p>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-muted">
              <Shield className="w-4 h-4" />
              <span>Secured with Google OAuth 2.0</span>
            </div>
          </div>

          {/* Progress Indicator */}
          {(status === "loading" || status === "processing") && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full animate-pulse"
                  style={{
                    width: status === "loading" ? "60%" : "90%",
                    transition: "width 1s ease-in-out",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Additional Actions */}
          {status === "error" && (
            <div className="mt-6">
              <button
                onClick={() => navigate("/sign-in")}
                className="btn-primary px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-muted mt-6">
          Having trouble? Please ensure you have cookies enabled and try again.
        </p>
      </div>
    </div>
  );
};

export default OAuthRedirectHandler;
