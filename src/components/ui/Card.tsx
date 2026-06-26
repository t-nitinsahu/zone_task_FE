import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export const Card = ({ title, subtitle, children }: CardProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-4" : ""}>{children}</div>
    </section>
  );
};
