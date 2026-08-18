/**
 * Pannellum integration boundary.
 *
 * This is the ONLY module that knows Pannellum exists. Everything else
 * (usePanorama, PanoramaViewer) talks to the small surface exported here —
 * never to `window.pannellum`, Pannellum's config JSON shape, or its
 * internal DOM/class names directly.
 *
 * Why a runtime <script>/<link> loader instead of `import "pannellum"`:
 * Pannellum ships as a UMD-style script that assigns `window.pannellum` at
 * the top level and touches `window`/`document` as soon as it runs. There
 * is no ESM entry point. Importing it directly would execute that
 * browser-only code during Next.js's server render and crash SSR. Loading
 * it via a script tag, only from the browser, sidesteps that entirely.
 *
 * The files themselves are self-hosted at public/vendor/pannellum (synced
 * from node_modules/pannellum by scripts/sync-pannellum-assets.mjs on
 * every `npm install`) rather than pulled from a CDN.
 *
 * F2B: multi-scene tours.
 * Rather than destroying and recreating the whole viewer (and its WebGL
 * context) every time the visitor moves between rooms, this module builds
 * a single Pannellum "tour" configuration up front — every `TourRoom`
 * becomes a Pannellum scene, keyed by room id — and hands it to
 * `pannellum.viewer()` once. Navigating is then just `viewer.loadScene()`.
 *
 * `sceneFadeDuration` is deliberately left unset (no built-in cross-fade).
 * Pannellum's cross-fade works by taking a WebGL canvas snapshot
 * (`canvas.toDataURL()`), loading it into an `<img>` as a fade overlay, and
 * only continuing the actual scene switch once that image's `load` event
 * fires — but that image has no `onerror` handler anywhere in Pannellum's
 * source. In this environment the snapshot reliably failed to decode, the
 * image's `load` event never fired, and every `loadScene()` call hung
 * forever with `getScene()` still reporting the OLD scene — confirmed by
 * instrumenting `loadScene`/`getScene()` directly in a browser smoke test.
 * That failure mode is silent (no thrown error, no rejected promise, no
 * console output) — a visitor would just tap a navigation hotspot and
 * nothing would ever happen, with no way to recover short of a page
 * reload. Given that risk, `PanoramaViewer` implements its own small,
 * dependency-free cross-fade (an opacity dip on the panorama container,
 * driven by `isTransitioning`) instead of trusting Pannellum's.
 */

import type { Collection, Hotspot, TourRoom } from "@/types/virtual-tour";

const SCRIPT_SRC = "/vendor/pannellum/pannellum.js";
const STYLE_HREF = "/vendor/pannellum/pannellum.css";

// ---- Minimal typed surface of Pannellum's API (only what we use) ----

type PannellumEventMap = {
  load: () => void;
  error: (message: string) => void;
  errorcleared: () => void;
  scenechange: (sceneId: string) => void;
  fullscreenchange: (isFullscreen: boolean) => void;
};

export type PannellumViewerInstance = {
  destroy: () => void;
  on: <K extends keyof PannellumEventMap>(event: K, listener: PannellumEventMap[K]) => PannellumViewerInstance;
  off: <K extends keyof PannellumEventMap>(event: K, listener: PannellumEventMap[K]) => PannellumViewerInstance;
  toggleFullscreen: () => void;
  loadScene: (sceneId: string, pitch?: number | "same", yaw?: number | "same" | "sameAzimuth", hfov?: number | "same") => void;
  getScene: () => string;
  getHfov: () => number;
  setHfov: (hfov: number, animated?: boolean | number) => void;
  resize: () => void;
};

type PannellumHotSpotConfig = {
  id: string;
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  sceneId?: string;
  cssClass?: string;
  createTooltipFunc?: (div: HTMLElement, args: unknown) => void;
  createTooltipArgs?: unknown;
};

type PannellumSceneConfig = {
  type: "equirectangular";
  panorama: string;
  pitch: number;
  yaw: number;
  hfov: number;
  hotSpots: PannellumHotSpotConfig[];
};

type PannellumTourConfig = {
  default: {
    firstScene: string;
    sceneFadeDuration: number;
    compass: boolean;
    showZoomCtrl: boolean;
    showFullscreenCtrl: boolean;
    showControls: boolean;
    draggable: boolean;
    mouseZoom: boolean;
    friction: number;
    minHfov: number;
    maxHfov: number;
    autoLoad: boolean;
  };
  scenes: Record<string, PannellumSceneConfig>;
};

type PannellumGlobal = {
  viewer: (container: HTMLElement, config: PannellumTourConfig) => PannellumViewerInstance;
};

declare global {
  interface Window {
    pannellum?: PannellumGlobal;
  }
}

// ---- Runtime asset loading ----

let runtimeLoadPromise: Promise<void> | null = null;

/** True only once `window.pannellum` is genuinely usable, not just present. */
function isPannellumReady(): boolean {
  return typeof window !== "undefined" && typeof window.pannellum?.viewer === "function";
}

/**
 * Injects Pannellum's stylesheet + script exactly once and resolves only
 * once `window.pannellum` is confirmed available — never earlier. Safe to
 * call from multiple components: subsequent calls reuse the same
 * in-flight/resolved promise, and a script tag is only ever injected once
 * per page (guarded via `document.querySelector`, independent of this
 * module's own cache, in case something else in the page already has one).
 *
 * Two failure modes this specifically guards against, found via a browser
 * bug report of `window.pannellum === undefined` at runtime even though
 * the vendored file itself served fine on request:
 *
 * 1. A `<script>` tag from an earlier call may already have finished
 *    loading — its `load` event already fired once, in the past. Attaching
 *    a *new* `addEventListener("load", ...)` to it at that point never
 *    fires again, so the promise returned to a later caller would hang
 *    forever (viewer never created, no error, panorama silently stays
 *    blank). Completion is now tracked with an explicit
 *    `data-pannellum-loaded`/`data-pannellum-failed` marker on the script
 *    element itself, checked *before* attaching new listeners.
 * 2. A script's `load` event only proves the file was fetched and parsed —
 *    not that `window.pannellum` actually got assigned (a runtime error
 *    partway through the vendor script's IIFE, before its
 *    `window.pannellum = ...` assignment, would still fire `load`
 *    normally). `isPannellumReady()` is checked explicitly before
 *    resolving; if the script "loaded" but the global genuinely isn't
 *    there, this rejects with a clear error instead of silently
 *    continuing — `usePanorama`'s existing `.catch()` turns that into the
 *    same "Panorama belum bisa dimuat." error state as any other failure.
 */
export function loadPannellumRuntime(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadPannellumRuntime() called outside the browser"));
  }

  if (isPannellumReady()) {
    return Promise.resolve();
  }

  if (runtimeLoadPromise) {
    return runtimeLoadPromise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    function settle() {
      if (isPannellumReady()) {
        resolve();
      } else {
        reject(new Error("Pannellum script loaded but window.pannellum was not set"));
      }
    }

    if (!document.querySelector("link[data-pannellum-style]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STYLE_HREF;
      link.setAttribute("data-pannellum-style", "true");
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-pannellum-script]",
    );

    if (existingScript) {
      if (existingScript.dataset.pannellumLoaded === "true") {
        settle();
        return;
      }
      if (existingScript.dataset.pannellumFailed === "true") {
        reject(new Error("Pannellum script previously failed to load"));
        return;
      }
      // Still genuinely in flight — safe to wait for its events.
      existingScript.addEventListener("load", settle);
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Pannellum script")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-pannellum-script", "true");
    script.addEventListener("load", () => {
      script.dataset.pannellumLoaded = "true";
      settle();
    });
    script.addEventListener("error", () => {
      script.dataset.pannellumFailed = "true";
      reject(new Error("Failed to load Pannellum script"));
    });
    document.body.appendChild(script);
  });

  runtimeLoadPromise = promise;
  // Don't let a failed attempt poison every future call in this session —
  // clear the cache on rejection so a later retry (e.g. usePanorama's
  // `retry()`) gets a genuinely fresh attempt instead of the same
  // already-rejected promise forever.
  promise.catch(() => {
    runtimeLoadPromise = null;
  });

  return promise;
}

// ---- Tour construction ----

/**
 * Callbacks invoked once per hotspot, right when Pannellum creates that
 * hotspot's DOM node (on tour init, and again every time a scene is
 * (re)entered — Pannellum destroys and rebuilds hotspot DOM per scene
 * change). This is the seam where React takes over rendering inside a
 * Pannellum-owned, Pannellum-positioned container: the caller mounts
 * whatever it wants into `container` and gets full pitch/yaw-aware
 * placement for free, without this module needing to know React exists.
 *
 * `navigate` is passed in (rather than this module wiring Pannellum's own
 * `sceneId`-driven click handling) because of a real, verified conflict:
 * `react-dom/client`'s `createRoot(container)` resets `container.onclick`
 * to an internal no-op the moment a root is created on it — confirmed by
 * inspecting the live DOM in a browser smoke test, where Pannellum's own
 * click handler (assigned via `hs.sceneId`) had silently become
 * `function noop$1() {}` after mounting React into the same node. Since
 * every hotspot's container IS a React root's container here, Pannellum's
 * built-in scene-hotspot click wiring can never fire. Driving navigation
 * from our own button's `onClick` (which calls `navigate` -> `loadScene`)
 * sidesteps the conflict entirely and is, if anything, more robust: it's
 * an ordinary React click handler, not dependent on native event bubbling
 * timing relative to when React attaches its root listener.
 */
export type PannellumHotspotMountHooks = {
  mountNavigationHotspot: (
    container: HTMLElement,
    hotspot: Extract<Hotspot, { type: "navigation" }>,
    destinationRoomTitle: string | undefined,
    navigate: () => void,
  ) => void;
  mountCollectionHotspot: (
    container: HTMLElement,
    hotspot: Extract<Hotspot, { type: "collection" }>,
    collection: Collection | undefined,
  ) => void;
};

/** Mutable holder so hotspot closures can reach the viewer instance that
 * is only created *after* their config (including this closure) is built
 * — see the `navigate` doc comment above for why this exists at all. */
type ViewerRef = { current: PannellumViewerInstance | undefined };

function buildHotspotConfig(
  hotspot: Hotspot,
  rooms: TourRoom[],
  collections: Collection[],
  hooks: PannellumHotspotMountHooks,
  viewerRef: ViewerRef,
): PannellumHotSpotConfig {
  if (hotspot.type === "navigation") {
    const destinationRoom = rooms.find((room) => room.id === hotspot.targetRoomId);
    return {
      id: hotspot.id,
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      // Deliberately no `sceneId` here — see the `navigate` doc comment on
      // `PannellumHotspotMountHooks` above for why relying on Pannellum's
      // own sceneId-driven click wiring doesn't work once a React root is
      // mounted into the hotspot's container. `type: "scene"` is kept for
      // data fidelity even though it's no longer functionally load-bearing.
      type: "scene",
      cssClass: "pnlm-hotspot-mount",
      createTooltipFunc: (div) => {
        hooks.mountNavigationHotspot(div, hotspot, destinationRoom?.title, () => {
          viewerRef.current?.loadScene(hotspot.targetRoomId);
        });
      },
    };
  }

  const collection = collections.find((item) => item.id === hotspot.collectionId);
  return {
    id: hotspot.id,
    pitch: hotspot.pitch,
    yaw: hotspot.yaw,
    // Deliberately "info", not "scene": no `sceneId` means Pannellum
    // attaches no click behavior of its own. Collection interaction is
    // out of scope for F2B (see mountCollectionHotspot callers).
    type: "info",
    cssClass: "pnlm-hotspot-mount",
    createTooltipFunc: (div) => {
      hooks.mountCollectionHotspot(div, hotspot, collection);
    },
  };
}

/**
 * Creates a single Pannellum viewer covering every room in `rooms` as a
 * scene. Mobile-first defaults: a wider starting HFOV (100°) suits small
 * portrait screens better than desktop-oriented viewers; drag/touch and
 * mouse-wheel zoom stay enabled. Native zoom/fullscreen controls are
 * enabled — restyled to the heritage design system in a later polish
 * pass; the always-on device-orientation ("tilt to look") button is
 * hidden via CSS (globals.css), since tilt-to-look is an unconfirmed
 * future option, never a required control (PRD §12).
 */
export function createPannellumTourViewer(
  container: HTMLElement,
  rooms: TourRoom[],
  collections: Collection[],
  initialRoomId: string,
  hooks: PannellumHotspotMountHooks,
): PannellumViewerInstance {
  if (!window.pannellum) {
    throw new Error("createPannellumTourViewer() called before loadPannellumRuntime() resolved");
  }

  // Populated after `window.pannellum.viewer()` returns below. Navigation
  // hotspots' `createTooltipFunc` runs synchronously during that call (for
  // the first scene) but the `navigate` closures they build are only ever
  // *invoked* later, on an actual tap — by then this will be set.
  const viewerRef: ViewerRef = { current: undefined };

  const scenes: Record<string, PannellumSceneConfig> = {};
  for (const room of rooms) {
    scenes[room.id] = {
      type: "equirectangular",
      panorama: room.panoramaUrl,
      pitch: 0,
      yaw: 0,
      hfov: 100,
      hotSpots: room.hotspots.map((hotspot) =>
        buildHotspotConfig(hotspot, rooms, collections, hooks, viewerRef),
      ),
    };
  }

  const viewer = window.pannellum.viewer(container, {
    default: {
      firstScene: initialRoomId,
      // 0, not a real duration — see the module doc comment above for why
      // Pannellum's own cross-fade is not used.
      sceneFadeDuration: 0,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      showControls: true,
      draggable: true,
      mouseZoom: true,
      friction: 0.15,
      minHfov: 50,
      maxHfov: 120,
      autoLoad: true,
    },
    scenes,
  });
  viewerRef.current = viewer;

  applyControlAccessibility(container);

  return viewer;
}

/**
 * Pannellum's native control buttons are plain unlabeled `<div>`s with no
 * accessible name (verified against pannellum@2.5.7 source — no
 * aria-label/title is ever set). This adds the missing labels/roles
 * directly on Pannellum's own DOM nodes, immediately after viewer
 * construction (they exist synchronously; visibility is what config flags
 * toggle). Kept inside this module so no other file needs to know
 * Pannellum's internal class names.
 */
function applyControlAccessibility(container: HTMLElement): void {
  const labels: Array<[string, string]> = [
    [".pnlm-zoom-in", "Perbesar"],
    [".pnlm-zoom-out", "Perkecil"],
    [".pnlm-fullscreen-toggle-button", "Layar penuh"],
  ];

  for (const [selector, label] of labels) {
    const el = container.querySelector<HTMLElement>(selector);
    if (!el) continue;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", label);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        el.click();
      }
    });
  }
}
