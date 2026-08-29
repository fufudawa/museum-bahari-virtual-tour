"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import type {
  Collection,
  CollectionHotspot as CollectionHotspotData,
  TourRoom,
} from "@/types/virtual-tour";
import {
  createPannellumTourViewer,
  loadPannellumRuntime,
  type PannellumViewerInstance,
} from "@/lib/pannellum";
import { NavigationHotspot } from "@/components/virtual-tour/NavigationHotspot";
import { CollectionHotspot } from "@/components/virtual-tour/CollectionHotspot";
import { getCollectionDisplayTitle } from "@/lib/collection";

export type UsePanoramaResult = {
  /** Attach to the element Pannellum should mount the tour into. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** True only for the tour's very first load — never during navigation. */
  isLoading: boolean;
  /** True between a scene change starting and the new scene finishing load. */
  isTransitioning: boolean;
  error: string | null;
  currentRoomId: string;
  /** Re-runs tour initialization from scratch. */
  retry: () => void;
  toggleFullscreen: () => void;
};

/**
 * Owns the Pannellum tour viewer's imperative lifecycle — mount once,
 * destroy once — and surfaces it as plain React state. React owns
 * `isLoading` / `isTransitioning` / `error` / `currentRoomId`; Pannellum
 * owns the actual 360° camera and scene graph once created. This hook is
 * the seam between the two, and the only place that mounts React
 * (`NavigationHotspot` / `CollectionHotspot`) into Pannellum-owned DOM
 * nodes — lib/pannellum.ts stays React-agnostic.
 *
 * F2B change from F2A: a single viewer is created for the whole `rooms`
 * list (a Pannellum "tour"), not recreated per room. Moving between rooms
 * is `viewer.loadScene()`, called from the `navigate` callback threaded
 * through to each mounted `NavigationHotspot`'s `onActivate` (see
 * lib/pannellum.ts's `PannellumHotspotMountHooks` doc comment for why this
 * hook drives that call directly rather than relying on Pannellum's own
 * `sceneId` click wiring). This hook then listens for the `scenechange`
 * event to keep `currentRoomId` in sync with whatever scene is actually
 * active, rather than assuming the `loadScene()` call it made "wins."
 *
 * F3: `onCollectionActivate` is now wired for real (a collection hotspot
 * tap calls it with the raw hotspot data, letting the page resolve
 * `collectionId` -> `Collection` itself, per the data flow this phase's
 * brief specifies). It's threaded through a ref, not a normal closure
 * variable, specifically so passing a new callback identity on every page
 * render never re-triggers the tour-creation effect above — that effect's
 * whole job is to create the Pannellum viewer exactly once per tour.
 */
export function usePanorama(
  rooms: TourRoom[],
  collections: Collection[],
  initialRoomId: string,
  onCollectionActivate?: (hotspot: CollectionHotspotData) => void,
): UsePanoramaResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewerInstance | null>(null);
  const hotspotRootsRef = useRef<Root[]>([]);
  // Guards against unmounting the same root twice — see scheduleRootUnmount.
  const unmountedRootsRef = useRef<WeakSet<Root>>(new WeakSet());

  // Always-latest ref so the tour-creation effect below (deliberately not
  // re-run when this callback's identity changes — see its deps array)
  // can still call whatever `onCollectionActivate` the caller passed most
  // recently, without needing to rebuild the whole viewer for it. Updated
  // in an effect, not during render — refs are for effects/handlers, not
  // render-time writes (react-hooks/refs).
  const onCollectionActivateRef = useRef(onCollectionActivate);
  useEffect(() => {
    onCollectionActivateRef.current = onCollectionActivate;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState(initialRoomId);
  const [retryToken, setRetryToken] = useState(0);

  // Unmounting a hotspot's React root can be triggered from inside the
  // Pannellum `scenechange` listener below, which itself fires
  // synchronously from `loadScene()`, which is called synchronously from
  // a navigation hotspot's `onClick` — i.e. still inside the same React
  // event-handling/commit pass that click kicked off. Calling
  // `root.unmount()` there throws "Attempted to synchronously unmount a
  // root while React was already rendering." `setTimeout` defers the
  // actual unmount to a fresh macrotask, guaranteed to run only after
  // React has finished committing the current update — by then Pannellum
  // has already removed the hotspot's DOM node from the document too,
  // which `root.unmount()` handles fine either way. The `unmountedRoots`
  // WeakSet makes the call idempotent in case the same root ever ends up
  // scheduled more than once.
  const scheduleRootUnmount = useCallback((root: Root) => {
    setTimeout(() => {
      if (unmountedRootsRef.current.has(root)) return;
      unmountedRootsRef.current.add(root);
      root.unmount();
    }, 0);
  }, []);

  const unmountHotspotRoots = useCallback(() => {
    const roots = hotspotRootsRef.current;
    hotspotRootsRef.current = [];
    for (const root of roots) {
      scheduleRootUnmount(root);
    }
  }, [scheduleRootUnmount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    let hasLoadedOnce = false;
    setIsLoading(true);
    setIsTransitioning(false);
    setError(null);
    setCurrentRoomId(initialRoomId);

    loadPannellumRuntime()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        const viewer = createPannellumTourViewer(
          containerRef.current,
          rooms,
          collections,
          initialRoomId,
          {
            mountNavigationHotspot: (mountEl, hotspot, direction, navigate) => {
              const root = createRoot(mountEl);
              hotspotRootsRef.current.push(root);
              root.render(
                <NavigationHotspot
                  hotspot={hotspot}
                  // Defensive fallback only — every F3A-generated hotspot
                  // always carries an explicit direction; `direction` is
                  // optional on the type for topologies that might not
                  // have one (see types/virtual-tour.ts).
                  direction={direction ?? "next"}
                  onActivate={navigate}
                />,
              );
            },
            mountCollectionHotspot: (mountEl, hotspot, collection) => {
              const root = createRoot(mountEl);
              hotspotRootsRef.current.push(root);
              root.render(
                <CollectionHotspot
                  hotspot={hotspot}
                  title={collection ? getCollectionDisplayTitle(collection) : undefined}
                  onActivate={() => onCollectionActivateRef.current?.(hotspot)}
                />,
              );
            },
          },
        );
        viewerRef.current = viewer;

        viewer.on("load", () => {
          if (cancelled) return;
          hasLoadedOnce = true;
          setIsLoading(false);
          setIsTransitioning(false);
        });

        viewer.on("scenechange", (sceneId) => {
          if (cancelled) return;
          // The previous scene's hotspot DOM nodes are already destroyed
          // by Pannellum at this point; unmount our React roots for them
          // so nothing leaks or logs a stale-root warning. Fresh roots are
          // created by mountNavigationHotspot/mountCollectionHotspot once
          // the new scene's hotspots are (re)built.
          unmountHotspotRoots();
          setCurrentRoomId(sceneId);
          if (hasLoadedOnce) {
            setIsTransitioning(true);
          }
        });

        viewer.on("error", (message) => {
          console.error("[Pannellum] failed to load panorama:", message);
          if (!cancelled) {
            setError("Panorama belum bisa dimuat.");
            setIsLoading(false);
            setIsTransitioning(false);
          }
        });
      })
      .catch((err: unknown) => {
        console.error("[Pannellum] runtime failed to load:", err);
        if (!cancelled) {
          setError("Panorama belum bisa dimuat.");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      unmountHotspotRoots();
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init is keyed on the tour's identity/initial room, not object identity of rooms/collections
  }, [initialRoomId, retryToken]);

  const retry = useCallback(() => {
    setRetryToken((token) => token + 1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    viewerRef.current?.toggleFullscreen();
  }, []);

  return {
    containerRef,
    isLoading,
    isTransitioning,
    error,
    currentRoomId,
    retry,
    toggleFullscreen,
  };
}
