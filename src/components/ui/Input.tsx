import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        {...props}
        className={`h-10 rounded-lg border px-3 text-sm outline-none transition focus:ring-2 ${
          error ? "border-red-400 ring-red-200" : "border-slate-300 ring-brand-200"
        } ${className}`}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
};
