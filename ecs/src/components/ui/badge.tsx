import * as React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]";

  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-rose-200 bg-rose-50 text-rose-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    destructive: "border-rose-300 bg-rose-50 text-rose-900",
    outline: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <div className={clsx(base, styles[variant], className)} {...props} />
  );
}

