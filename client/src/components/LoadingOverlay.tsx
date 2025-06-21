import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Creating Listing...",
  submessage = "Please wait while we process your request",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Simple backdrop with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Loading Content */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4 max-w-sm w-full">
        <div className="text-center space-y-4">
          {/* Simple Spinner */}
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              {message}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {submessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
