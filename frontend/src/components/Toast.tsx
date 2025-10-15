import React, { useState, useEffect } from "react";
import "../styles/components/Toast.scss";
import CheckIcon from "./icons/CheckIcon";
import CloseIcon from "./icons/CloseIcon";
import InfoIcon from "./icons/InfoIcon";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon />;
      case "error":
        return <CloseIcon />;
      case "info":
      default:
        return <InfoIcon />;
    }
  };

  return (
    <div
      id="app-toast"
      className={`toast toast--${type} ${isVisible ? "show" : ""}`}
    >
      <div className="toast-icon">{getIcon()}</div>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
