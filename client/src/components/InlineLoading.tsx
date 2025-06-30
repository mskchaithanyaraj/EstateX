import React from "react";
import { Loader2 } from "lucide-react";

interface InlineLoadingProps {
  isVisible: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const InlineLoading: React.FC<InlineLoadingProps> = ({
  isVisible,
  message = "Loading...",
  size = "md",
  className = "",
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} text-orange-500 animate-spin flex-shrink-0`}
      />
      <span
        className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}
      >
        {message}
      </span>
    </div>
  );
};

export default InlineLoading;
