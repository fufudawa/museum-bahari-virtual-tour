/**
 * Frontend data contract for the Virtual Visit experience.
 *
 * Components consume these types only — never a concrete data source.
 * Phase 1 is backed by `data/mock-tour.ts`; a future backend/API can
 * replace that module without any change to the types below or to
 * the components that consume them.
 */

export type NavigationHotspot = {
  type: "navigation";
  id: string;
  targetRoomId: string;
  pitch: number;
  yaw: number;
  /**
   * Visual/accessibility hint only (F3A) — which way this hotspot
   * conceptually leads along a sequential tour. Optional: a topology
   * that isn't a simple previous/next chain (e.g. a room with several
   * unrelated exits) may have navigation hotspots with no meaningful
   * "direction" at all.
   */
  direction?: "next" | "previous";
};

export type CollectionHotspot = {
  type: "collection";
  id: string;
  collectionId: string;
  pitch: number;
  yaw: number;
};

/**
 * F32: a single, explicitly-placed in-scene link to another scene —
 * distinct from `NavigationHotspot` specifically so it's NOT swept up by
 * the `hotspot.type !== "navigation"` filter in lib/pannellum.ts that
 * hides every generic sequential next/previous hotspot in favor of the
 * fixed NavigationControls pill. Used for S15's cream-display hotspot into
 * S16 (a scene outside the normal sequential chain), where a visible,
 * object-anchored hotspot is the intended primary way to move forward —
 * see data/mock-tour.ts's `DEV_SCENE_LINK_PLACEMENTS`.
 */
export type SceneLinkHotspot = {
  type: "scene-link";
  id: string;
  targetRoomId: string;
  pitch: number;
  yaw: number;
};

export type Hotspot = NavigationHotspot | CollectionHotspot | SceneLinkHotspot;

export type TourRoom = {
  id: string;
  title: string;
  panoramaUrl: string;
  ambienceUrl?: string;
  hotspots: Hotspot[];
  /**
   * Sequential topology (F3A). Source of truth for the tour's linear scene
   * order — `null` at either end of the chain. The navigation hotspots in
   * `hotspots` are generated FROM these two fields (see data/mock-tour.ts),
   * not the other way around, so the graph only ever has one place it's
   * declared. Optional: rooms that predate a linear-chain topology, or a
   * future non-linear one, don't need to carry this.
   */
  previousSceneId?: string | null;
  nextSceneId?: string | null;

  /**
   * F10: camera orientation the visitor lands on when arriving at this
   * scene (both via Next and via Previous — Pannellum's `loadScene()` has
   * no notion of "arrived from which direction", so this is the one
   * orientation used either way; see lib/pannellum.ts's module doc comment
   * and the F10 report for why a single well-centered forward view works
   * for both directions in practice). Calibrated per-scene from the source
   * photo's own composition — NOT a generic constant — because each
   * scene's equirectangular capture has its own arbitrary "seam" direction
   * unrelated to which way the museum corridor runs at that spot. `undefined`
   * means yaw 0 already lands correctly for that scene (most of them do;
   * see data/mock-tour.ts's `SCENE_FORWARD_YAW` for which ones needed an
   * explicit value and why) — deliberately not filled in with 0 for every
   * scene just to have a value present everywhere.
   */
  defaultYaw?: number;
  /** Same idea as `defaultYaw`, for pitch. `undefined` (-> neutral 0) for
   * every current scene — none needed a tilt correction on audit. */
  defaultPitch?: number;
  /** Corrects the source photo's own camera roll (horizon not level in
   * the capture itself) — NOT navigation drift, which does not occur (see
   * the F10 report's empirical proof). `undefined` (-> 0) for every
   * current scene; none showed a tilted horizon on audit. */
  defaultRoll?: number;
  /** Per-scene framing override. `undefined` (-> 100, the shared default —
   * see lib/pannellum.ts) for every current scene; no scene's audit render
   * looked mis-framed at 100, so none has needed a different value. */
  defaultHfov?: number;
};

export type Collection = {
  id: string;
  /** Development/working title (F4) — not official museum terminology. */
  title: string;

  /** Thumbnail used in the Peek state and hotspot previews. */
  coverImage: string;
  /** Larger image used in the Full state. May equal `coverImage` (F4: no
   * separate detail photography exists yet) — kept as a distinct field so
   * a different, higher-resolution asset can be swapped in later without
   * changing the data shape. */
  detailImage: string;

  /** One-line preview shown in Peek, if available. Never fabricated. */
  shortDescription?: string;
  /** Full description shown in Full state, if available. Never fabricated. */
  description?: string;

  /** Curator-approved name, once validated. `undefined` in the current
   * prototype — the UI falls back to `title` until this exists. */
  officialName?: string;
  /** Curator-approved description, once validated. `undefined` in the
   * current prototype — the UI falls back to `description` until this
   * exists. */
  officialDescription?: string;

  audioUrl?: string;
  transcript?: string;
};

/**
 * DEVELOPMENT-ONLY collection-to-scene mapping (F4). Deliberately a
 * separate structure from `TourRoom`/`Hotspot` — neither which collections
 * belong in the tour nor their physical position within any scene has
 * been finalized by the lecturer. See data/mock-tour.ts for the small,
 * clearly-labeled mock placement list this type backs.
 */
export type CollectionPlacement = {
  sceneId: string;
  collectionId: string;
  yaw: number;
  pitch: number;
};

/**
 * Collection bottom sheet state machine.
 * "transcript" is reached only from "full" and returns to "full" on collapse.
 */
export type CollectionSheetState = "closed" | "peek" | "full" | "transcript";

export type AudioGuideStatus = "idle" | "playing" | "paused" | "ended";

export type AudioGuideState = {
  status: AudioGuideStatus;
  currentTime: number;
  duration: number;
};

/**
 * Top-level application state shape (Section 7 of the blueprint).
 * Phase 1 holds this with local component state — no Redux/store yet.
 */
export type VirtualTourState = {
  currentRoomId: string;
  selectedCollectionId: string | null;
  collectionSheetState: CollectionSheetState;
  audioGuideState: AudioGuideState;
  isLoading: boolean;
  error: string | null;
};
