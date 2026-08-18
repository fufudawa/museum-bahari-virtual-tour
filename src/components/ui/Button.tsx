import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "h-11 bg-deep text-on-deep hover:bg-deep-2",
  ghost:
    "h-10 border border-border bg-transparent text-ink hover:bg-surface",
};

/**
 * Exposed so non-`<button>` elements (e.g. a `next/link` styled as the
 * primary CTA on the Welcome screen) can share the exact same visual
 * treatment without duplicating the class list.
 */
export function buttonClassName(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}
