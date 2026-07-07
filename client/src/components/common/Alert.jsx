import { FiAlertTriangle, FiCheckCircle, FiX } from "react-icons/fi";

const STYLES = {
  error: "border-danger text-danger",
  success: "border-success text-success",
  info: "border-ink text-ink",
};

const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  const Icon = type === "success" ? FiCheckCircle : FiAlertTriangle;

  return (
    <div
      className={`flex items-start gap-2.5 border-l-4 bg-paper px-4 py-3 text-sm animate-fade-in ${STYLES[type]}`}
      role="alert"
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <p className="flex-1 font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="text-gray-mid hover:text-ink cursor-pointer"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
