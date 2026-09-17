import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonTone = "onDeep" | "onLight";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  tone?: IconButtonTone;
};

/**
 * Exported so other on-panorama controls (e.g. NavigationControls' labeled
 * Next/Previous pills) can share the exact same "glass" tone without
 * duplicating the class list.
 */
export const tones: Record<IconButtonTone, string> = {
  onDeep:
    "bg-deep/40 text-on-deep border border-white/25 hover:bg-deep/60",
  onLight: "bg-surface text-ink border border-border hover:bg-parchment",
};

/**
 * Circular icon-only control. Always carries an accessible name via
 * `label` — never relies on the icon alone (Design System v0.1, §20).
 * 44px min touch target regardless of the visual icon size inside it.
 */
export function IconButton({
  icon,
  label,
  tone = "onLight",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full ${tones[tone]} ${className}`.trim()}
      {...props}
    >
      {icon}
    </button>
  );
}
