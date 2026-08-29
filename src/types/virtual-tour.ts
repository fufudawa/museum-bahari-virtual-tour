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

export type Hotspot = NavigationHotspot | CollectionHotspot;

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
