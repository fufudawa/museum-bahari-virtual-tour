import type { NavigationHotspot as NavigationHotspotData } from "@/types/virtual-tour";

type NavigationHotspotProps = {
  hotspot: NavigationHotspotData;
  /** Human-readable target room title, e.g. "Anjungan". Optional — see F2B report. */
  destinationLabel?: string;
  onActivate: (hotspot: NavigationHotspotData) => void;
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
 * The destination label is optional contextual feedback (locked UX
 * decision): revealed on hover/focus only, via CSS — never a second tap,
 * never blocking navigation, never a button of its own.
 */
export function NavigationHotspot({
  hotspot,
  destinationLabel,
  onActivate,
}: NavigationHotspotProps) {
  const accessibleLabel = destinationLabel
    ? `Menuju ${destinationLabel}`
    : "Menuju ruang lain";

  return (
    <span className="group relative inline-flex h-11 w-11 items-center justify-center">
      <button
        type="button"
        onClick={() => onActivate(hotspot)}
        aria-label={accessibleLabel}
        className="flex h-11 w-11 items-center justify-center rounded-full border-[1.6px] border-white/85 bg-deep/35 text-on-deep shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-150 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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

      {destinationLabel && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-deep px-2.5 py-1 text-[11px] font-semibold text-on-deep opacity-0 shadow-[0_3px_10px_rgba(0,0,0,0.25)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          Menuju {destinationLabel}
        </span>
      )}
    </span>
  );
}
