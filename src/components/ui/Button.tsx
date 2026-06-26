import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
>;

export const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
  const variantClass =
    variant === "primary"
      ? "bg-brand-700 text-white hover:bg-brand-800"
      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300";

  return (
    <button
      {...props}
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};
