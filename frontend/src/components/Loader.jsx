import React from "react";

const Loader = ({
  size = "medium",
  message = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 border-t-[#0077b6] rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {/* Loading Message */}
        {message && (
          <p className="text-gray-600 font-medium text-sm md:text-base animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
