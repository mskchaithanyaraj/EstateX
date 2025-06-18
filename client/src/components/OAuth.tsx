import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { app } from "../services/firebase";
import { authAPI } from "../services/api";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetAuthState,
} from "../redux/user/userSlice";
import { showSuccessToast, showErrorToast } from "../utils/custom-toast";
import { GoogleIcon } from "../utils/cutom-icons";

interface OAuthProps {
  disabled?: boolean;
  className?: string;
}

const OAuth: React.FC<OAuthProps> = ({ disabled = false, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset auth state when component mounts
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      dispatch(signInStart());

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      const googleAuthData = {
        name: result.user.displayName || "",
        email: result.user.email || "",
        avatar: result.user.photoURL || "",
      };

      const response = await authAPI.googleAuth(googleAuthData);

      const user = {
        id: response._id,
        username: response.username,
        email: response.email,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        avatar: { url: response.avatar?.url, publicId: null },
        fullname: response.fullname, // Use fullname if available
      };

      dispatch(signInSuccess(user));
      showSuccessToast("Welcome!", `Signed in as ${user.fullname}`);
      navigate("/"); // Redirect to home after auth
    } catch (error) {
      console.error("❌ Google Auth error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      dispatch(signInFailure(errorMessage));
      showErrorToast("Authentication Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center cursor-pointer px-4 py-3 
               bg-neutral-900 dark:bg-neutral-800 
               hover:bg-neutral-800 dark:hover:bg-neutral-700
               border border-neutral-700 dark:border-neutral-600 
               hover:border-neutral-600 dark:hover:border-neutral-500
               rounded-xl font-medium 
               text-white dark:text-neutral-100
               transition-all duration-200 
               disabled:opacity-50 disabled:cursor-not-allowed
               disabled:hover:bg-neutral-900 dark:disabled:hover:bg-neutral-800
               focus:outline-none focus:ring-2 focus:ring-orange-500/20
               shadow-sm hover:shadow-md
               group ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-3 animate-spin text-neutral-400" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <GoogleIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
};

export default OAuth;
