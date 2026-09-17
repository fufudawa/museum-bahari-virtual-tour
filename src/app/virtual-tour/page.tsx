"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Collection, CollectionSheetState, Hotspot } from "@/types/virtual-tour";
import {
  collections,
  getCollectionById,
  getCollectionPlacement,
  getZoneCollections,
  getZoneForSceneId,
  rooms,
} from "@/data/mock-tour";
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
 * QR/deep-link proof-of-concept (`/c/[collectionId]` redirects here as
 * `?collection=COL-14`). Resolved ONCE, synchronously, from whatever the
 * URL's `collection` param is on this page's very first render — see
 * `VirtualTourPage`'s own `useState(() => ...)` call sites below for why
 * that has to be a lazy initializer, same pattern `currentRoomId` already
 * uses for `rooms[0].id`. `primarySceneId` (not yaw/pitch) is the only
 * thing the URL ever points at; the actual camera numbers still come from
 * `getCollectionPlacement`, i.e. straight out of
 * `DEV_COLLECTION_PLACEMENTS` — the QR flow never carries yaw/pitch of its
 * own. Returns the tour's normal `rooms[0].id` (and no camera override) for
 * every case that isn't a fully-resolved, placed COL-14-style deep link: no
 * `?collection=` param, an unknown id, or a known id with no
 * `primarySceneId`/no matching placement yet — normal `/virtual-tour`
 * behavior must stay byte-identical to before this feature existed.
 */
function resolveDeepLinkEntry(collectionId: string | null): {
  initialRoomId: string;
  initialCameraOverride?: { pitch: number; yaw: number };
} {
  if (!collectionId) return { initialRoomId: rooms[0].id };

  const collection = getCollectionById(collectionId);
  if (!collection?.primarySceneId) return { initialRoomId: rooms[0].id };

  const placement = getCollectionPlacement(collection.primarySceneId, collectionId);
  if (!placement) return { initialRoomId: rooms[0].id };

  return { initialRoomId: collection.primarySceneId, initialCameraOverride: placement };
}

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
function VirtualTourPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // QR/deep-link (client request): resolved once, from the URL as it was
  // on first render — see `resolveDeepLinkEntry`'s own doc comment for why
  // a lazy `useState` initializer, not a `useMemo`/plain read, is what
  // "compute once" has to mean here (mirrors how `currentRoomId` below
  // already seeds itself from `rooms[0].id` once and never re-derives).
  const [{ initialRoomId, initialCameraOverride }] = useState(() =>
    resolveDeepLinkEntry(searchParams.get("collection")),
  );
  // Read once alongside the above, for the "open the sheet once loaded"
  // effect further down — same one-shot-at-mount contract.
  const [deepLinkCollectionId] = useState(() => searchParams.get("collection"));

  const [currentRoomId, setCurrentRoomId] = useState(initialRoomId);
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

  // QR/deep-link: opens the SAME CollectionSheet the physical hotspot/zone
  // drawer already open (via the same `openCollection`, no separate sheet
  // logic) — but only once the panorama has actually finished its first
  // load (`PanoramaViewer`'s own `onLoad`, which itself only ever fires
  // once), so the sheet doesn't appear before the scene is visible. A
  // `useRef` guard (not just relying on `onLoad` firing once) makes this
  // resilient even if a future change ever calls `onLoad` more than once.
  const hasOpenedDeepLinkCollection = useRef(false);
  const handlePanoramaLoad = useCallback(() => {
    if (!deepLinkCollectionId) return;
    if (hasOpenedDeepLinkCollection.current) return;
    hasOpenedDeepLinkCollection.current = true;
    openCollection(deepLinkCollectionId);
  }, [deepLinkCollectionId, openCollection]);

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
        // — the thing F2B's multi-scene tour exists to avoid. Normally
        // `rooms[0].id`; a resolved QR/deep-link (see `resolveDeepLinkEntry`
        // above) is the only thing that ever makes this anything else.
        initialRoomId={initialRoomId}
        // QR/deep-link only — `undefined` for every normal `/virtual-tour`
        // visit, in which case `PanoramaViewer`/`usePanorama` behave exactly
        // as before this feature existed.
        initialCameraOverride={initialCameraOverride}
        onRoomChange={handleRoomChange}
        onHotspotActivate={handleHotspotActivate}
        onLoad={handlePanoramaLoad}
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

/**
 * `VirtualTourPageInner` calls `useSearchParams()` (for the QR/deep-link
 * `?collection=` param), which Next.js requires a `<Suspense>` boundary
 * around in a Client Component page — otherwise a production build fails
 * with "Missing Suspense boundary with useSearchParams". The fallback is
 * the same `LoadingState` the page already showed for its own (currently
 * always-false) `isLoading` branch, so a visitor never sees a different
 * loading affordance depending on which one happens to apply.
 */
export default function VirtualTourPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh flex-1">
          <LoadingState />
        </main>
      }
    >
      <VirtualTourPageInner />
    </Suspense>
  );
}
