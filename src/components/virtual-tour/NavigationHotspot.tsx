import type { NavigationHotspot as NavigationHotspotData } from "@/types/virtual-tour";

type NavigationHotspotProps = {
  hotspot: NavigationHotspotData;
  /** Which way this hotspot leads along the tour — drives both the label and the icon's facing. */
  direction: "next" | "previous";
  onActivate: (hotspot: NavigationHotspotData) => void;
};

/** F3A: direction-based labels, not destination-name-based — the tour is
 * a sequential walkthrough, not a set of named rooms yet. */
const DIRECTION_LABEL: Record<"next" | "previous", string> = {
  next: "Ke titik berikutnya",
  previous: "Kembali ke titik sebelumnya",
};

/**
 * Outlined / static ring — visually and semantically distinct from
 * CollectionHotspot's filled, pulsing dot (never merged with it).
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
 *
 * `direction` gives the same chevron a forward (right-pointing, "next")
 * or backward (mirrored, left-pointing, "previous") reading — one icon
 * asset, one CSS flip, no new design system. The label is always shown:
 * always present in `aria-label`, and revealed on hover/focus only as a
 * subtle visible tooltip (locked UX decision) — never a second tap, never
 * blocking navigation, never a button of its own.
 */
export function NavigationHotspot({
  hotspot,
  direction,
  onActivate,
}: NavigationHotspotProps) {
  const accessibleLabel = DIRECTION_LABEL[direction];
  const isPrevious = direction === "previous";

  return (
    <span className="group relative inline-flex h-11 w-11 items-center justify-center">
      <button
        type="button"
        onClick={() => onActivate(hotspot)}
        aria-label={accessibleLabel}
        className="flex h-11 w-11 items-center justify-center rounded-full border-[1.6px] border-white/85 bg-deep/35 text-on-deep shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-150 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${isPrevious ? "-scale-x-100" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M9 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-deep px-2.5 py-1 text-[11px] font-semibold text-on-deep opacity-0 shadow-[0_3px_10px_rgba(0,0,0,0.25)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {accessibleLabel}
      </span>
    </span>
  );
}
