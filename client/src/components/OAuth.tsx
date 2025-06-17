import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { app } from "../services/firebase";
import { GoogleIcon } from "../utils/cutom-icons";

interface OAuthProps {
  disabled?: boolean;
  className?: string;
}

const OAuth: React.FC<OAuthProps> = ({ disabled = false, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("❌ Google Auth error:", error);
      setIsLoading(false);
    }
  };

  // Replace the OAuth button styles in OAuth.tsx
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
