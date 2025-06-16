/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useToastStore } from "../../app/store/useToastStore";

const Toast = () => {
  const { toast, clearToast } = useToastStore();

  useEffect(() => {
    if (!toast.message) return;
    const timeOut = setTimeout(() => clearToast(), 1500);
    return () => clearTimeout(timeOut);
  }, [toast.message]);

  if (!toast.message) return null;

  const typeClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  }[toast.type || "info"];

  return (
    <div className="toast toast-bottom toast-end z-50 fixed">
      <div className={`alert ${typeClass}`}>
        <span>
          {typeof toast.message === "string"
            ? toast.message
            : typeof toast.message === "object"
            ? JSON.stringify(toast.message)
            : String(toast.message)}
        </span>
      </div>
    </div>
  );
};

export default Toast;
