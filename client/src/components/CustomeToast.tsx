import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import toast, { type Toast } from "react-hot-toast";

interface CustomToastProps {
  t: Toast;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  t,
  type,
  title,
  message,
}) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  const styles = {
    success: {
      iconColor: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      progressColor: "bg-green-500 dark:bg-green-400",
    },
    error: {
      iconColor: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      progressColor: "bg-red-500 dark:bg-red-400",
    },
    info: {
      iconColor: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      progressColor: "bg-blue-500 dark:bg-blue-400",
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`
        ${t.visible ? "animate-enter" : "animate-leave"}
        max-w-md w-full ${currentStyle.bgColor} ${currentStyle.borderColor}
        border backdrop-blur-md rounded-xl shadow-lg pointer-events-auto 
        flex ring-1 ring-black ring-opacity-5 overflow-hidden
        transform transition-all duration-300 ease-out
      `}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${currentStyle.progressColor} animate-toast-progress`}
          style={{
            animationDuration: `${t.duration}ms`,
            animationTimingFunction: "linear",
          }}
        />
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${currentStyle.iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1 transition-colors duration-200"
              onClick={() => toast.dismiss(t.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomToast;
