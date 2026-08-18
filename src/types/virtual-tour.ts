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
};

export type Collection = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  audioUrl?: string;
  transcript?: string;
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
