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
  // Read inside the Pannellum `load` listener (see preloadAdjacentScenes
  // below) instead of the `currentRoomId` React state value, because that
  // listener closure is attached once when the tour is created and would
  // otherwise only ever see the `initialRoomId` it captured at that time —
  // this ref is updated synchronously in the `scenechange` listener, which
  // does receive the new scene id directly as an argument.
  const currentRoomIdRef = useRef(initialRoomId);
  // Panorama URLs already handed to `new Image()` this tour, so walking
  // back and forth between two already-preloaded neighbours doesn't keep
  // re-issuing `Image()` allocations — the browser's own HTTP cache
  // already dedupes the actual network fetch either way.
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

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

  /**
   * F3B: after a scene finishes loading, fetch its immediate neighbours'
   * (`previousSceneId`/`nextSceneId`) panorama images — never the whole
   * 32-scene tour — via a plain `new Image()`, so a subsequent
   * `loadScene()` to either one is very likely already in the browser's
   * HTTP/decode cache instead of starting a ~10MB fetch cold.
   *
   * These panoramas are 6528x3264, roughly 10MB each — preloading both
   * neighbours on every scene unconditionally could cost a visitor on a
   * slow or metered connection ~20MB they never asked for. The Network
   * Information API (`navigator.connection`) lets this skip preloading
   * when the browser itself reports `saveData` or a slow `effectiveType`;
   * it's unsupported in Safari/iOS, where this deliberately degrades to
   * "always preload" rather than "never preload" — the two neighbours are
   * a small, bounded cost even there, not the full tour.
   */
  const preloadAdjacentScenes = useCallback(
    (roomId: string) => {
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (connection?.saveData) return;
      if (connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType)) {
        return;
      }

      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      const neighborUrls = [room.previousSceneId, room.nextSceneId]
        .filter((id): id is string => Boolean(id))
        .map((id) => rooms.find((r) => r.id === id)?.panoramaUrl)
        .filter((url): url is string => Boolean(url))
        .filter((url) => !preloadedUrlsRef.current.has(url));

      if (neighborUrls.length === 0) return;

      const run = () => {
        for (const url of neighborUrls) {
          preloadedUrlsRef.current.add(url);
          const img = new Image();
          img.src = url;
        }
      };

      // Deferred to idle time so this never competes with the scene the
      // visitor is actually looking at right now.
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 300);
      }
    },
    [rooms],
  );

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
    currentRoomIdRef.current = initialRoomId;
    preloadedUrlsRef.current = new Set();

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
          preloadAdjacentScenes(currentRoomIdRef.current);
        });

        viewer.on("scenechange", (sceneId) => {
          if (cancelled) return;
          // The previous scene's hotspot DOM nodes are already destroyed
          // by Pannellum at this point; unmount our React roots for them
          // so nothing leaks or logs a stale-root warning. Fresh roots are
          // created by mountNavigationHotspot/mountCollectionHotspot once
          // the new scene's hotspots are (re)built.
          unmountHotspotRoots();
          currentRoomIdRef.current = sceneId;
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
