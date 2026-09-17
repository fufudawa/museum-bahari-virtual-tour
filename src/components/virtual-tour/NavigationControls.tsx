import { tones } from "@/components/ui/IconButton";

type NavigationControlsProps = {
  previousSceneId?: string | null;
  nextSceneId?: string | null;
  /** F11: id to loop back to (S01) once the tour has no further scene to
   * go to — only consulted when `nextSceneId` is falsy; see the top-slot
   * doc comment below for how this swaps "Next" for "Return". */
  returnSceneId?: string | null;
  onNavigate: (sceneId: string) => void;
  /** True while the collection sheet is open — mirrors PanoramaViewer's
   * `suspendInteraction`, so this control can't be tapped underneath an
   * open dialog. */
  suspended?: boolean;
  /** True while a scene change is already in flight — disables both
   * buttons so a rapid double-tap can't queue a second `loadScene()` call
   * on top of one still resolving. */
  disabled?: boolean;
  /** F32: suppresses the entire top slot (Next OR its Return fallback)
   * regardless of `nextSceneId`/`returnSceneId` — used only for S15, where
   * forward navigation is intentionally hotspot-only (the cream-display
   * scene-link hotspot into S16, see PanoramaViewer). `previousSceneId`
   * still renders normally either way. */
  hideNext?: boolean;
};

/**
 * Active/pressed feedback (mobile taps land here — Tailwind v4's `hover:`
 * already compiles to `@media (hover: hover)`, so hover stays desktop-only
 * for free and only `active:`/`disabled:`/focus need adding), a visible
 * keyboard focus ring, and a muted-not-hidden disabled look. `active:`
 * reportedly needs a touch listener to fire reliably in older iOS Safari
 * (a known WebKit quirk) — flagged in the report, not worked around here
 * to keep this change CSS-only.
 */
const BUTTON_STATE_CLASSES =
  "active:scale-95 active:bg-deep/80 disabled:opacity-40 disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-line";

/** Shared pill shape: 44px tall (touch-target minimum) regardless of label
 * length, icon + text side by side. */
const PILL_BASE_CLASSES = `flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold tracking-wide ${tones.onDeep} ${BUTTON_STATE_CLASSES}`;

/**
 * F7/F8/F9 (UX pass): fixed-position Next/Previous control, bottom-right —
 * replaces the old mid-panorama "Lanjut" hotspot (F3A/F3B) and the
 * icon-only chevron pair (F8). Plain CSS `position: absolute` anchored to
 * the panorama's containing block, NOT one of Pannellum's pitch/yaw-
 * projected hotspots — so its on-screen position never drifts as the
 * visitor drags/looks around. Pannellum's own zoom/fullscreen controls are
 * pinned bottom-LEFT (see globals.css), and the compass is disabled
 * entirely (`compass: false` in lib/pannellum.ts), so bottom-right stays
 * clear of both.
 *
 * Reads `previousSceneId`/`nextSceneId` straight off the current
 * `TourRoom` (the tour's own source of truth for topology — see
 * types/virtual-tour.ts) rather than a navigation hotspot, so scenes
 * excluded from the chain (see data/mock-tour.ts's
 * `excludeScenesFromNavigation`, S16/S17) are automatically unreachable
 * here too, with nothing extra to keep in sync.
 *
 * F9: always a VERTICAL stack now, at every breakpoint — not just below
 * `sm` like F8's version. Two reasons this replaced the responsive
 * horizontal/vertical split: (1) the brief asks for icons that read as
 * "forward"/"back" rather than "left"/"right", and an up/down chevron pair
 * only makes spatial sense stacked vertically — a horizontal layout would
 * need a second, different icon language just for desktop; (2) a labeled
 * pill pair (not bare 44px circles) reads fine as a small vertical toolbar
 * at any viewport width, so there's no layout reason to switch. `flex-col-
 * reverse` still does the top/bottom ordering: this file keeps rendering
 * Previous then Next in the DOM (stable tab order for keyboard users), and
 * `column-reverse` puts the last DOM child (Next) at the top of the stack
 * — see the icon choice below for why that pairs correctly with "up".
 *
 * Icon choice: the up-chevron here is the SAME path already used for
 * "collapse" in Transcript.tsx (`M6 15l6-6 6 6`) — reused deliberately
 * rather than inventing a new glyph, and it fits "Next" naturally since
 * it's the top button in the stack. "Previous" gets the mirrored
 * down-chevron. Both labels reuse the app's existing English button-copy
 * precedent are the two words the brief asked for outright ("Next"/
 * "Previous") — NOTE this departs from the rest of the app's Indonesian
 * copy (e.g. "Kembali", "Lanjut" elsewhere); flagged as a deliberate,
 * scoped exception in the implementation report, not an oversight.
 * `aria-label` is set to the exact same text as the visible label (not a
 * longer Indonesian description like the previous version had) so the
 * accessible name matches what's on screen (WCAG 2.5.3 Label in Name) —
 * screen-reader and voice-control users hear/target the same word sighted
 * users read.
 *
 * F11: the top slot becomes "Return" (a circular/rotate-arrow icon, not
 * the up-chevron) once `nextSceneId` is falsy — i.e. only at the actual
 * end of the reachable chain (S32; S16/S17 are excluded from the chain
 * entirely, not "the end"). It targets `returnSceneId` (S01, passed by
 * PanoramaViewer) through the exact same `onNavigate` -> `goToScene()`
 * path as every other hop, so it lands on S01's own calibrated forward
 * orientation (see TourRoom.defaultYaw) and runs through the same
 * transition — nothing scene-change-related is special-cased for it.
 */
export function NavigationControls({
  previousSceneId,
  nextSceneId,
  returnSceneId,
  onNavigate,
  suspended = false,
  disabled = false,
  hideNext = false,
}: NavigationControlsProps) {
  const isReturn = !nextSceneId && !!returnSceneId;
  const topTargetId = hideNext ? null : (nextSceneId ?? (isReturn ? returnSceneId : null) ?? null);

  if (!previousSceneId && !topTargetId) return null;

  return (
    <div
      inert={suspended}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col-reverse items-end justify-end gap-3 p-4"
      style={{
        opacity: suspended ? 0 : 1,
        transition: "opacity 200ms ease",
        // Safe-area aware: on a device with a home-indicator/gesture bar or
        // a notch, `env(safe-area-inset-*)` reports how much extra inset is
        // needed to clear it; `max()` falls back to the plain 16px (`p-4`)
        // everywhere else, where the env() value is 0. Only bottom/right
        // need it — this control never touches the top or left edges.
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {previousSceneId && (
        <div className="pointer-events-auto">
          <button
            type="button"
            aria-label="Previous"
            disabled={disabled}
            onClick={() => onNavigate(previousSceneId)}
            className={PILL_BASE_CLASSES}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>
        </div>
      )}
      {topTargetId && (
        <div className="pointer-events-auto">
          <button
            type="button"
            aria-label={isReturn ? "Return" : "Next"}
            disabled={disabled}
            onClick={() => onNavigate(topTargetId)}
            className={PILL_BASE_CLASSES}
          >
            {isReturn ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path
                  d="M5 11a7 7 0 1 1 1.8 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path
                  d="M5 16v-5h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path
                  d="M6 15l6-6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {isReturn ? "Return" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
