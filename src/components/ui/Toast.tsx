type ToastProps = {
  message: string;
  variant?: "success" | "error";
};

export const Toast = ({ message, variant = "success" }: ToastProps) => {
  const classes =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${classes}`} role="status" aria-live="polite">
      {message}
    </div>
  );
};
