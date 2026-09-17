"use client";

import { useEffect, useState } from "react";
import type { Collection, CollectionHotspot as CollectionHotspotData, Hotspot, TourRoom } from "@/types/virtual-tour";
import { usePanorama } from "@/hooks/usePanorama";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SceneTransition } from "./SceneTransition";
import { NavigationControls } from "./NavigationControls";

/**
 * F7: how long a scene change is allowed to stay in its "transitioning"
 * state (see `isTransitioning` below) before this treats it as a genuinely
 * slow/not-yet-preloaded load rather than the deliberate ~350ms transition
 * animation, and shows a (small, non-blocking) loading affordance. An
 * adjacent scene that was already preloaded (see usePanorama's
 * `preloadAdjacentScenes`) resolves the `load` event well under this, so
 * the indicator never appears on a normal, already-preloaded hop.
 */
const SLOW_TRANSITION_INDICATOR_DELAY_MS = 600;

type PanoramaViewerProps = {
  rooms: TourRoom[];
  collections: Collection[];
  initialRoomId: string;
  onRoomChange?: (roomId: string) => void;
  onHotspotActivate?: (hotspot: Hotspot) => void;
  /**
   * True while the collection sheet is open. Suspends drag-to-look and
   * hotspot focus on the panorama underneath via the `inert` attribute —
   * plain user-agent behavior, not a Pannellum API call — so background
   * interaction doesn't produce confusing focus/keyboard behavior while a
   * dialog is open on top of it (F3 accessibility requirement).
   */
  suspendInteraction?: boolean;
  /** QR/deep-link proof-of-concept — forwarded as-is to `usePanorama`. See
   * `lib/pannellum.ts`'s `createPannellumTourViewer` for what this does. */
  initialCameraOverride?: { pitch: number; yaw: number; hfov?: number };
  /** Fires exactly once, the moment the tour's very first scene finishes
   * loading (mirrors `isLoading` flipping false — see usePanorama.tsx's own
   * doc comment: "True only for the tour's very first load"). Used by the
   * QR/deep-link flow to open a `CollectionSheet` only once the panorama is
   * actually visible, not before. */
  onLoad?: () => void;
};

/**
 * Owns the Pannellum tour viewer: mounts it against every room in `rooms`
 * via `usePanorama` (one viewer, all scenes registered up front — see
 * lib/pannellum.ts for why), and renders loading/error/transition UI
 * around it. Hotspots themselves are rendered BY the hook, mounted
 * directly into Pannellum's positioned DOM nodes — not here — since their
 * screen position depends on Pannellum's own pitch/yaw projection.
 */
export function PanoramaViewer({
  rooms,
  collections,
  initialRoomId,
  onRoomChange,
  onHotspotActivate,
  suspendInteraction = false,
  initialCameraOverride,
  onLoad,
}: PanoramaViewerProps) {
  const { containerRef, isLoading, isTransitioning, error, currentRoomId, retry, goToScene } = usePanorama(
    rooms,
    collections,
    initialRoomId,
    (hotspot: CollectionHotspotData) => onHotspotActivate?.(hotspot),
    initialCameraOverride,
  );

  useEffect(() => {
    onRoomChange?.(currentRoomId);
  }, [currentRoomId, onRoomChange]);

  // Fires once, exactly when the tour's first scene finishes loading — see
  // this component's own `onLoad` prop doc comment.
  useEffect(() => {
    if (!isLoading) onLoad?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately NOT keyed on onLoad identity: this must fire once per isLoading true->false edge, not re-fire if the caller passes a new callback identity on a later render while isLoading is already false.
  }, [isLoading]);

  // F7: only shown once a scene change has stayed "transitioning" longer
  // than a deliberate animation reasonably takes — see the constant's doc
  // comment above. Never set on the very first tour load (`isLoading`
  // covers that with its own, unrelated overlay).
  //
  // The reset-on-new-transition below runs during render, not inside an
  // effect — React's documented pattern for "adjust state when a prop
  // changes" (comparing against a mirrored previous-render value and
  // calling setState conditionally while rendering is explicitly safe;
  // see https://react.dev/learn/you-might-not-need-an-effect). Calling
  // `setState` unconditionally inside an effect body instead — the more
  // obvious way to write this — trips `react-hooks/set-state-in-effect`
  // (a synchronous setState with no actual async work), and reading a ref
  // during render to work around that trips `react-hooks/refs` instead.
  // This sidesteps both: `showSlowIndicator` is set to `true` only from
  // the genuinely-async `setTimeout` callback below, and reset to `false`
  // only at the exact render where a new transition starts.
  const [showSlowIndicator, setShowSlowIndicator] = useState(false);
  const [trackedIsTransitioning, setTrackedIsTransitioning] = useState(isTransitioning);
  if (isTransitioning !== trackedIsTransitioning) {
    setTrackedIsTransitioning(isTransitioning);
    // Reset on BOTH edges: false->true so a new transition starts its own
    // fresh delay window, and true->false so the indicator doesn't linger
    // after a slow transition has actually finished loading.
    setShowSlowIndicator(false);
  }

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => setShowSlowIndicator(true), SLOW_TRANSITION_INDICATOR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const currentRoom = rooms.find((room) => room.id === currentRoomId);

  return (
    <SceneTransition>
      <div
        // flex-1 + min-h-0, not h-full: this div's height must come from
        // the flex algorithm (flex-grow along <main>'s now-column main
        // axis), not from `height: 100%` resolving against the parent —
        // that percentage failed to resolve to a non-zero height in
        // practice even though the parent measured a real 812px (see
        // virtual-tour/page.tsx's comment on <main>). `min-h-0` overrides
        // the flex-item default `min-height: auto`, which would otherwise
        // let this item's content push it taller than the available space
        // instead of being sized by flex-grow.
        className="relative min-h-0 w-full flex-1 bg-deep"
        data-current-room-id={currentRoomId}
      >
        <div
          ref={containerRef}
          role="img"
          aria-label="Panorama 360 derajat ruang museum"
          inert={suspendInteraction}
          // className is intentionally a *fixed* string, never derived from
          // state. Pannellum adds its own classes (e.g. `pnlm-container`)
          // to this exact node via `classList.add()` once the viewer
          // mounts; React overwrites the whole `class` attribute on any
          // render where the className prop's *value* changes, which
          // silently wiped those out the first time this was wired to
          // `isTransitioning` (confirmed in a browser smoke test — the
          // Pannellum container vanished from the DOM after a couple of
          // transitions). Style, unlike className, is diffed per-property,
          // so driving the opacity dip through `style` instead leaves any
          // classes/inline styles Pannellum manages on this node alone
          // (Pannellum sets `style.touchAction` here too).
          //
          // F7: `transform`/`filter` layer a slight forward push (scale up)
          // and blur on top of the existing opacity dip — same
          // style-diffing safety as the opacity-only version above, just
          // two more properties Pannellum never touches itself. The intent
          // (per the UX brief) is a scene change that reads as the camera
          // moving forward, not a screen unloading/reloading — Pannellum's
          // own built-in `sceneFadeDuration` is deliberately NOT used for
          // this (see lib/pannellum.ts's module doc comment: its
          // canvas-snapshot cross-fade hangs `loadScene()` forever in this
          // environment), so this stays a plain CSS transition driven by
          // React state, with no snapshot/canvas work involved.
          className="absolute inset-0"
          style={{
            opacity: isTransitioning ? 0.55 : 1,
            transform: isTransitioning ? "scale(1.045)" : "scale(1)",
            filter: isTransitioning ? "blur(5px)" : "blur(0px)",
            transition: "opacity 350ms ease, transform 350ms ease, filter 350ms ease",
          }}
        />

        <NavigationControls
          previousSceneId={currentRoom?.previousSceneId}
          nextSceneId={currentRoom?.nextSceneId}
          // F11: only ever consulted by NavigationControls when
          // `nextSceneId` is falsy (the actual end of the chain, S32) —
          // harmless to always pass the tour's first room here.
          returnSceneId={rooms[0]?.id ?? null}
          onNavigate={goToScene}
          suspended={suspendInteraction}
          disabled={isLoading || isTransitioning}
          // F32: S15's forward navigation is intentionally hotspot-only
          // (the cream-display scene-link hotspot into S16) — the fixed
          // Next button would otherwise skip straight to S18, bypassing
          // it. Scoped to this one scene id; every other scene's Next
          // button is unaffected.
          hideNext={currentRoomId === "S15"}
        />

        {/* F7: only a small, non-blocking badge — never the full
            `LoadingState` overlay used for the very first tour load below —
            and only once `SLOW_TRANSITION_INDICATOR_DELAY_MS` has actually
            passed, so a normal preloaded hop (see usePanorama's
            `preloadAdjacentScenes`) never shows it. */}
        {showSlowIndicator && !error && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            role="status"
            aria-label="Memuat panorama…"
          >
            <div className="h-9 w-9 animate-pulse rounded-full border-2 border-brass-line bg-deep/30" />
          </div>
        )}

        {isLoading && !error && (
          <div className="absolute inset-0">
            <LoadingState label="Memuat ruang…" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0">
            <ErrorState message={error} onRetry={retry} />
          </div>
        )}
      </div>
    </SceneTransition>
  );
}
