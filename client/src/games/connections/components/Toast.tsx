import React, { useEffect } from "react";

interface ToastProps {
  message: string | null;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, onClose }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-md">
      <div className="bg-app-text text-app-bg px-4 py-2 rounded-lg font-semibold text-sm shadow-md animate-toast-in">
        {message}
      </div>
    </div>
  );
};

export default Toast;
