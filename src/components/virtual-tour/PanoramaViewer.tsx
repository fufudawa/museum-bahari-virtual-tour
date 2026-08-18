"use client";

import { useEffect } from "react";
import type { Collection, CollectionHotspot as CollectionHotspotData, Hotspot, TourRoom } from "@/types/virtual-tour";
import { usePanorama } from "@/hooks/usePanorama";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SceneTransition } from "./SceneTransition";

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
}: PanoramaViewerProps) {
  const { containerRef, isLoading, isTransitioning, error, currentRoomId, retry } =
    usePanorama(rooms, collections, initialRoomId, (hotspot: CollectionHotspotData) =>
      onHotspotActivate?.(hotspot),
    );

  useEffect(() => {
    onRoomChange?.(currentRoomId);
  }, [currentRoomId, onRoomChange]);

  return (
    <SceneTransition>
      <div className="relative h-full w-full bg-deep" data-current-room-id={currentRoomId}>
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
          className="absolute inset-0"
          style={{
            opacity: isTransitioning ? 0.4 : 1,
            transition: "opacity 300ms ease",
          }}
        />

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
