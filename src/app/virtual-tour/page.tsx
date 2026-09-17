"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Collection, CollectionSheetState, Hotspot } from "@/types/virtual-tour";
import { collections, getCollectionById, getZoneCollections, getZoneForSceneId, rooms } from "@/data/mock-tour";
import { PanoramaViewer } from "@/components/virtual-tour/PanoramaViewer";
import { RoomControls } from "@/components/virtual-tour/RoomControls";
import { ZoneCollectionsChip } from "@/components/virtual-tour/ZoneCollectionsChip";
import { ZoneCollectionsDrawer } from "@/components/virtual-tour/ZoneCollectionsDrawer";
import { CollectionSheet } from "@/components/collection/CollectionSheet";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAmbience } from "@/hooks/useAmbience";

const AMBIENCE_URL = "/audio/museum-ambience.mp3";

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
  // Background ambience (client request): one looping element for the
  // whole tour session, owned by this hook — see its own doc comment for
  // why it lives here (page level, not per-room) and never restarts on
  // scene navigation. `isAmbienceOn`/`onToggleAmbience` below now mirror
  // the element's REAL play state (never an assumed/optimistic flag), so
  // RoomControls' existing speaker button needs no changes of its own.
  const { isPlaying: isAmbienceOn, toggle: toggleAmbience } = useAmbience(AMBIENCE_URL);
  const [isZoneDrawerOpen, setIsZoneDrawerOpen] = useState(false);
  // Reported by ZoneCollectionsDrawer itself, not derived from
  // `isZoneDrawerOpen` — stays true for the drawer's whole closing
  // animation, only flipping false once it has actually finished and
  // unmounted, so the panorama stays frozen for the full close transition
  // (see `suspendInteraction` below), not just until the close tap fires.
  const [isZoneDrawerVisible, setIsZoneDrawerVisible] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleRoomChange = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
  }, []);

  // Shared by the physical orange hotspot path (below) and the
  // zone-persistent drawer (see ZoneCollectionsDrawer's onSelect) — a
  // collection opens the exact same sheet regardless of which of the two
  // ever-coexisting entry points it came from.
  const openCollection = useCallback((collectionId: string) => {
    // Always opens the sheet, even if the lookup misses — an entry point
    // with a dangling `collectionId` must not just silently do nothing.
    // CollectionSheet renders a "Koleksi tidak ditemukan." panel when
    // `collection` is null but the sheet isn't closed (see its guard).
    const collection = getCollectionById(collectionId) ?? null;
    setSelectedCollection(collection);
    setSheetState("peek");
  }, []);

  const handleHotspotActivate = useCallback(
    (hotspot: Hotspot) => {
      if (hotspot.type !== "collection") return;
      openCollection(hotspot.collectionId);
    },
    [openCollection],
  );

  // Zone-persistent collection access (client request): a SEPARATE concern
  // from the physical orange hotspots above, which are untouched. Zone
  // membership and its collection list are both derived from `rooms`
  // itself (see mock-tour.ts's getZoneForSceneId/getZoneCollections) —
  // no second, hand-maintained "which collection belongs to which zone"
  // list exists here to drift out of sync.
  const currentZone = getZoneForSceneId(currentRoomId);
  const zoneCollections = useMemo(
    () => (currentZone ? getZoneCollections(currentZone) : []),
    [currentZone],
  );

  const handleZoneCollectionSelect = useCallback(
    (collectionId: string) => {
      setIsZoneDrawerOpen(false);
      openCollection(collectionId);
    },
    [openCollection],
  );

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
        suspendInteraction={sheetState !== "closed" || isZoneDrawerVisible}
      />

      <RoomControls
        onExit={() => router.push("/")}
        onToggleAmbience={toggleAmbience}
        isAmbienceOn={isAmbienceOn}
      />

      <ZoneCollectionsChip
        count={zoneCollections.length}
        onClick={() => setIsZoneDrawerOpen(true)}
      />

      <ZoneCollectionsDrawer
        isOpen={isZoneDrawerOpen}
        collections={zoneCollections}
        onSelect={handleZoneCollectionSelect}
        onClose={() => setIsZoneDrawerOpen(false)}
        onVisibilityChange={setIsZoneDrawerVisible}
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
