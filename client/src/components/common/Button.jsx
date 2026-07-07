import { FiLoader } from "react-icons/fi";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "text-ink hover:bg-paper-dim",
  danger: "bg-danger text-paper hover:opacity-85",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...rest
}) => {
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
        ? "px-6 py-3 text-base"
        : "px-4 py-2.5 text-sm";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-none cursor-pointer disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${sizeClasses} ${className}`}
      {...rest}
    >
      {loading && <FiLoader className="animate-spin" size={16} />}
      {children}
    </button>
  );
};

export default Button;
