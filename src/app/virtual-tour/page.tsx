"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Collection, CollectionSheetState, Hotspot } from "@/types/virtual-tour";
import { collections, getCollectionById, rooms } from "@/data/mock-tour";
import { PanoramaViewer } from "@/components/virtual-tour/PanoramaViewer";
import { RoomControls } from "@/components/virtual-tour/RoomControls";
import { CollectionSheet } from "@/components/collection/CollectionSheet";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

/**
 * F1 wired the full data path —
 *   TourRoom -> PanoramaViewer -> hotspots -> CollectionSheet -> Collection
 * — using local component state (Section 7 of the blueprint; no store
 * needed for Phase 1).
 *
 * F2B: `PanoramaViewer` now owns a single multi-scene tour (all of
 * `rooms`) instead of one room at a time, so this page hands it the whole
 * list plus the starting room id, and mirrors whichever room the tour
 * actually lands on back into `currentRoomId` via `onRoomChange` — the
 * tour's own `scenechange` event is the source of truth (see
 * usePanorama.tsx), this state is a read-only reflection of it, not a
 * second thing that drives navigation.
 *
 * F3: `handleHotspotActivate`'s collection branch (built in F1, dormant
 * through F2A/F2B) is now live — CollectionHotspot taps reach it for real.
 * `selectedCollection` is set to `null` on a lookup miss rather than left
 * alone, and the sheet still opens either way: a dangling `collectionId`
 * must surface as a handled "not found" state in the sheet, not a tap
 * that silently does nothing (see CollectionSheet). `suspendInteraction`
 * on `PanoramaViewer` makes the panorama `inert` while the sheet is open,
 * so background hotspots can't be focused/dragged into confusing states
 * underneath an open dialog.
 */
export default function VirtualTourPage() {
  const router = useRouter();

  const [currentRoomId, setCurrentRoomId] = useState(rooms[0].id);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(
    null,
  );
  const [sheetState, setSheetState] = useState<CollectionSheetState>("closed");
  const [isAmbienceOn, setIsAmbienceOn] = useState(true);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleRoomChange = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
  }, []);

  const handleHotspotActivate = useCallback((hotspot: Hotspot) => {
    if (hotspot.type !== "collection") return;
    // Always opens the sheet, even if the lookup misses — a hotspot with
    // a dangling `collectionId` must not just silently do nothing on tap.
    // CollectionSheet renders a "Koleksi tidak ditemukan." panel when
    // `collection` is null but the sheet isn't closed (see its guard).
    const collection = getCollectionById(hotspot.collectionId) ?? null;
    setSelectedCollection(collection);
    setSheetState("peek");
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-dvh flex-1">
        <LoadingState />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-dvh flex-1">
        <ErrorState onRetry={() => router.refresh()} />
      </main>
    );
  }

  return (
    // `data-current-room-id` surfaces the mirrored room state on the DOM —
    // genuinely read by nothing in-app yet, but it's the state Section 7
    // of the blueprint asks the frontend to maintain, and having it
    // observable is what let this phase's browser smoke test assert that
    // React and Pannellum's scene state actually stay synchronized.
    <main
      // flex-col (not the row default): `<main>` holds exactly one in-flow
      // child (PanoramaViewer's wrapper below) plus two absolutely-
      // positioned overlays (RoomControls, CollectionSheet) that don't
      // participate in flex layout at all — so direction only matters for
      // that one child, and column direction is what lets it claim height
      // via flex-grow (see PanoramaViewer's wrapper) instead of a
      // percentage `height: 100%`, which doesn't reliably resolve against
      // a flex container whose own height comes from `min-h-dvh` + a
      // flex-item `flex-1` on itself (confirmed via computed-style
      // inspection — `<main>` measured a real, definite 812px, but the
      // percentage-height child still computed to 0px).
      className="relative flex flex-col min-h-dvh flex-1 overflow-hidden bg-deep"
      data-current-room-id={currentRoomId}
    >
      <PanoramaViewer
        rooms={rooms}
        collections={collections}
        // Seeds the tour's starting scene only — must stay the fixed
        // starting room, NOT `currentRoomId`. Feeding the mirrored,
        // navigation-driven state back in here would re-trigger the tour
        // viewer's init effect (see usePanorama.tsx) on every hotspot tap,
        // destroying and recreating the whole viewer exactly like F2A did
        // — the thing F2B's multi-scene tour exists to avoid.
        initialRoomId={rooms[0].id}
        onRoomChange={handleRoomChange}
        onHotspotActivate={handleHotspotActivate}
        suspendInteraction={sheetState !== "closed"}
      />

      <RoomControls
        onExit={() => router.push("/")}
        onToggleAmbience={() => setIsAmbienceOn((on) => !on)}
        isAmbienceOn={isAmbienceOn}
      />

      <CollectionSheet
        state={sheetState}
        collection={selectedCollection}
        onExpand={() => setSheetState("full")}
        onClose={() => setSheetState("closed")}
        onOpenTranscript={() => setSheetState("transcript")}
        onCollapseTranscript={() => setSheetState("full")}
      />
    </main>
  );
}
