"use client";

import { useEffect, useState } from "react";
import type { NavigationHotspot as NavigationHotspotData } from "@/types/virtual-tour";

type NavigationHotspotProps = {
  hotspot: NavigationHotspotData;
  /** Which way this hotspot leads along the tour — drives both the label and the icon's facing. */
  direction: "next" | "previous";
  onActivate: (hotspot: NavigationHotspotData) => void;
};

/** F3A: direction-based labels, not destination-name-based — the tour is
 * a sequential walkthrough, not a set of named rooms yet. Full sentences,
 * kept as the accessible name; the on-screen chip below shows a shorter
 * "Kembali" / "Lanjut" pair instead (see COMPACT_LABEL). */
const DIRECTION_LABEL: Record<"next" | "previous", string> = {
  next: "Ke titik berikutnya",
  previous: "Kembali ke titik sebelumnya",
};

const COMPACT_LABEL: Record<"next" | "previous", string> = {
  next: "Lanjut",
  previous: "Kembali",
};

/** How long the label chip stays open right after a hotspot mounts, before
 * settling back to the icon-only idle ring. */
const AUTO_REVEAL_MS = 2200;

/**
 * Outlined ring (idle) that expands into a compact "← Kembali" /
 * "Lanjut →" label chip — visually and semantically distinct from
 * CollectionHotspot's filled, pulsing dot (never merged with it).
 *
 * F3B: previously this used one chevron path mirrored via `-scale-x-100`
 * for "previous", which visitors reported as impossible to read at a
 * glance — a mirrored right-arrow doesn't unambiguously read as "back".
 * Each direction now gets its own explicit path (no mirroring), and the
 * chip's DOM/flex order is swapped per direction so the reading order
 * always matches the requested "← Kembali" / "Lanjut →" shape.
 *
 * The label chip has no hover-only path: Pannellum destroys and remounts
 * every hotspot's DOM node (and this component with it) on each
 * `scenechange` (see lib/pannellum.ts), so a fresh mount is exactly the
 * moment a visitor most needs the Next/Previous cue — and the only signal
 * touch devices can give us at all, since they have no hover state. The
 * chip auto-opens for `AUTO_REVEAL_MS` on mount, then settles back to the
 * compact ring; `group-hover`/`group-focus-within` reopen it afterward for
 * mouse/keyboard users, but touch users are never dependent on either.
 *
 * This component is mounted BY Pannellum itself (see lib/pannellum.ts /
 * usePanorama.tsx): Pannellum owns pitch/yaw → screen-position projection
 * for the wrapping DOM node, this component just renders what goes inside
 * it. `onActivate` is a real, single tap → immediate transition: the
 * mount site wires it straight to `viewer.loadScene()`, NOT to
 * Pannellum's own built-in `sceneId` click handling — mounting a React
 * root into a hotspot's container turns out to silently clobber
 * Pannellum's own `onclick` on that same node (verified in a browser
 * smoke test), so this component's button click is the only thing
 * actually driving navigation. No confirmation step, no hold, no second
 * tap — one `onClick` straight to one `onActivate` call.
 */
export function NavigationHotspot({
  hotspot,
  direction,
  onActivate,
}: NavigationHotspotProps) {
  const accessibleLabel = DIRECTION_LABEL[direction];
  const compactLabel = COMPACT_LABEL[direction];
  const isPrevious = direction === "previous";

  const [autoOpen, setAutoOpen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setAutoOpen(false), AUTO_REVEAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="group relative inline-flex h-11 items-center">
      <button
        type="button"
        onClick={() => onActivate(hotspot)}
        aria-label={accessibleLabel}
        className={`flex h-11 min-w-11 items-center justify-center rounded-full border-[1.6px] border-white/85 bg-deep/70 px-3.5 text-on-deep shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-[gap,transform] duration-200 active:scale-95 group-hover:gap-1.5 group-focus-within:gap-1.5 ${
          isPrevious ? "" : "flex-row-reverse"
        } ${autoOpen ? "gap-1.5" : "gap-0"}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
          <path
            d={isPrevious ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          aria-hidden="true"
          className={`overflow-hidden whitespace-nowrap text-[11px] font-semibold tracking-wide transition-[max-width,opacity] duration-200 group-hover:max-w-[6rem] group-hover:opacity-100 group-focus-within:max-w-[6rem] group-focus-within:opacity-100 ${
            autoOpen ? "max-w-[6rem] opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          {compactLabel}
        </span>
      </button>
    </span>
  );
}
