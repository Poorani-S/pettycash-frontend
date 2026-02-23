import React from "react";

const sizeMap = {
  small: "h-5 w-5 border-2",
  medium: "h-8 w-8 border-4",
  large: "h-12 w-12 border-4",
};

export default function Loader({
  fullScreen = false,
  message = "Loading...",
  size = "medium",
}) {
  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${spinnerSize} animate-spin rounded-full border-gray-300 border-t-[#0077b6]`}
        role="status"
        aria-label={message}
      />
      {message ? (
        <p className="text-sm font-medium text-gray-700">{message}</p>
      ) : null}
    </div>
  );

  if (!fullScreen) {
    return <div className="py-6">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      {content}
    </div>
  );
}
