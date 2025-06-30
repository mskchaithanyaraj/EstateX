import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Loading...",
  submessage,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Much lighter backdrop - less overwhelming */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* Smaller, more elegant loading content */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 mx-4 max-w-xs w-full">
        <div className="text-center space-y-3">
          {/* Smaller Spinner */}
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>

          {/* Compact Message */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {message}
            </h3>
            {submessage && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {submessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
