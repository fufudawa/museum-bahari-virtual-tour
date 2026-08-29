import type { Collection, CollectionPlacement, Hotspot, TourRoom } from "@/types/virtual-tour";

/**
 * Mock content for Phase 1 development.
 *
 * This is the only file a future backend/API integration (F8) needs to
 * replace. Every component downstream reads through the `TourRoom` /
 * `Collection` types in `types/virtual-tour.ts`, never this module directly.
 */

/**
 * F4: 28 real collection photos, already sorted and supplied — no object
 * names in the filenames themselves, so this list uses the LOCKED COL-01
 * ... COL-28 ordering exactly as given, matched to files in filename
 * order. Titles are development titles only (explicitly not official
 * museum terminology — the lecturer hasn't validated names/descriptions
 * yet), so `officialName`/`officialDescription` stay `undefined` and no
 * `description`/`shortDescription` is fabricated for any of them.
 * `coverImage`/`detailImage` intentionally point at the same file for now
 * (F4 brief) — the type keeps them as separate fields so a distinct,
 * higher-resolution detail photo can be swapped in later without any
 * shape change.
 */
const COLLECTION_RECORDS: ReadonlyArray<{ id: string; title: string; filename: string }> = [
  { id: "COL-01", title: "Perahu Layar Kuning", filename: "IMG_20260806_114215.jpg.jpeg" },
  { id: "COL-02", title: "Perahu Biru Panjang", filename: "IMG_20260806_114230.jpg.jpeg" },
  { id: "COL-03", title: "Perahu Miniatur Abu-Abu", filename: "IMG_20260806_114356.jpg.jpeg" },
  { id: "COL-04", title: "Perahu Miniatur Cokelat", filename: "IMG_20260806_114409.jpg.jpeg" },
  { id: "COL-05", title: "Perahu Ramping Cokelat", filename: "IMG_20260806_114420.jpg.jpeg" },
  { id: "COL-06", title: "Perahu Kayu Cokelat", filename: "IMG_20260806_114430.jpg.jpeg" },
  { id: "COL-07", title: "Perahu Hijau", filename: "IMG_20260806_114455.jpg.jpeg" },
  { id: "COL-08", title: "Perahu Cokelat Panjang", filename: "IMG_20260806_114504.jpg.jpeg" },
  { id: "COL-09", title: "Perahu Layar Cokelat", filename: "IMG_20260806_114514.jpg.jpeg" },
  { id: "COL-10", title: "Perahu Layar Kuning Cerah", filename: "IMG_20260806_114531.jpg.jpeg" },
  { id: "COL-11", title: "Perahu Layar Putih Merah", filename: "IMG_20260806_114546.jpg.jpeg" },
  { id: "COL-12", title: "Perahu Biru Merah", filename: "IMG_20260806_114605.jpg.jpeg" },
  { id: "COL-13", title: "Perahu Merah Biru", filename: "IMG_20260806_114614.jpg.jpeg" },
  { id: "COL-14", title: "Miniatur Kapal Layar Kuning", filename: "IMG_20260806_114620.jpg.jpeg" },
  { id: "COL-15", title: "Miniatur Kapal Layar Putih", filename: "IMG_20260806_114625.jpg.jpeg" },
  { id: "COL-16", title: "Perahu Layar Putih", filename: "IMG_20260806_114643.jpg.jpeg" },
  { id: "COL-17", title: "Perahu Layar Warna-warni", filename: "IMG_20260806_114659.jpg.jpeg" },
  { id: "COL-18", title: "Perahu Layar Putih Panjang", filename: "IMG_20260806_114713.jpg.jpeg" },
  { id: "COL-19", title: "Kapal Miniatur Cokelat", filename: "IMG_20260806_114725.jpg.jpeg" },
  { id: "COL-20", title: "Perahu Merah", filename: "IMG_20260806_114740.jpg.jpeg" },
  { id: "COL-21", title: "Perahu Merah Putih", filename: "IMG_20260806_114746.jpg.jpeg" },
  { id: "COL-22", title: "Perahu Cokelat Rangka", filename: "IMG_20260806_114752.jpg.jpeg" },
  { id: "COL-23", title: "Perahu Kuning Panjang", filename: "IMG_20260806_114758.jpg.jpeg" },
  { id: "COL-24", title: "Kapal Layar Putih", filename: "IMG_20260806_114828.jpg.jpeg" },
  { id: "COL-25", title: "Kapal Layar Salib", filename: "IMG_20260806_114836.jpg.jpeg" },
  { id: "COL-26", title: "Perahu Dayung Hitam", filename: "IMG_20260806_114840.jpg.jpeg" },
  { id: "COL-27", title: "Kapal Miniatur Putih", filename: "IMG_20260806_114853.jpg.jpeg" },
  { id: "COL-28", title: "Kapal Layar Putih Besar", filename: "IMG_20260806_114929.jpg.jpeg" },
];

export const collections: Collection[] = COLLECTION_RECORDS.map(({ id, title, filename }) => {
  const path = `/collections/${filename}`;
  return {
    id,
    title,
    coverImage: path,
    detailImage: path,
    // shortDescription / description / officialName / officialDescription
    // deliberately omitted for all 28 — no official or draft copy exists
    // yet (F4 brief: do not fabricate). The UI hides or neutrally labels
    // the missing description rather than inventing one — see
    // CollectionPeek / CollectionDetail.
  };
});

/**
 * F3A: real Museum Bahari panorama walkthrough — 32 scenes, strictly
 * sequential (S01 <-> S02 <-> ... <-> S31 <-> S32, no branching, no
 * skipping). This array is the ONLY place scene order or source filenames
 * are declared — application scene ids (S01–S32) are intentionally NOT
 * the filenames (per F3A brief), so the room list, hotspot generation,
 * and asset filenames all stay independently swappable. Original asset
 * filenames are preserved exactly as supplied.
 */
const SCENE_ASSET_FILENAMES: readonly string[] = [
  "1_137_145.jpg", // S01
  "2_155_163.jpg", // S02
  "4_182_188.jpg", // S03
  "7_203_209.jpg", // S04
  "9_217_223.jpg", // S05
  "10_224_230.jpg", // S06
  "11_231_237.jpg", // S07
  "12_238_244.jpg", // S08
  "13_245_251.jpg", // S09
  "14_252_258.jpg", // S10
  "15_259_265.jpg", // S11
  "16_266_272.jpg", // S12
  "17_273_279.jpg", // S13
  "18_280_286.jpg", // S14
  "19_287_293.jpg", // S15
  "20_294_300.jpg", // S16
  "21_301_307.jpg", // S17
  "22_308_314.jpg", // S18
  "23_315_321.jpg", // S19
  "24_322_328.jpg", // S20
  "25_329_335.jpg", // S21
  "26_336_342.jpg", // S22
  "27_344_350.jpg", // S23
  "28_351_357.jpg", // S24
  "29_358_364.jpg", // S25
  "30_365_371.jpg", // S26
  "31_372_378.jpg", // S27
  "32_379_385.jpg", // S28
  "33_386_392.jpg", // S29
  "34_393_399.jpg", // S30
  "35_400_406.jpg", // S31
  "36_407_413.jpg", // S32
];

/**
 * Initial directional baseline for generated next/previous hotspots —
 * NOT final museum-validated coordinates (F3A brief is explicit about
 * this). Named constants, not inlined, specifically so they can be tuned
 * per real walkthrough geometry later without touching lib/pannellum.ts
 * or any component.
 */
const NEXT_HOTSPOT_ANGLE = { yaw: 0, pitch: -5 };
const PREVIOUS_HOTSPOT_ANGLE = { yaw: 180, pitch: -5 };

function sceneIdFromIndex(index: number): string {
  return `S${String(index + 1).padStart(2, "0")}`;
}

/**
 * Generates the strictly sequential room chain from `SCENE_ASSET_FILENAMES`
 * alone — every id, every previous/next link, and every navigation
 * hotspot is derived from array position, never written per-scene. There
 * is no scene-specific if/else anywhere in this function; adding,
 * removing, or reordering an entry in the filename list is the only way
 * the resulting topology changes.
 */
function buildSequentialRooms(filenames: readonly string[]): TourRoom[] {
  return filenames.map((filename, index) => {
    const id = sceneIdFromIndex(index);
    const previousSceneId = index > 0 ? sceneIdFromIndex(index - 1) : null;
    const nextSceneId = index < filenames.length - 1 ? sceneIdFromIndex(index + 1) : null;

    const hotspots: Hotspot[] = [];
    if (nextSceneId) {
      hotspots.push({
        type: "navigation",
        id: `hotspot-${id}-next`,
        targetRoomId: nextSceneId,
        yaw: NEXT_HOTSPOT_ANGLE.yaw,
        pitch: NEXT_HOTSPOT_ANGLE.pitch,
        direction: "next",
      });
    }
    if (previousSceneId) {
      hotspots.push({
        type: "navigation",
        id: `hotspot-${id}-previous`,
        targetRoomId: previousSceneId,
        yaw: PREVIOUS_HOTSPOT_ANGLE.yaw,
        pitch: PREVIOUS_HOTSPOT_ANGLE.pitch,
        direction: "previous",
      });
    }

    return {
      id,
      // Real per-scene museum room names aren't available yet — the
      // scene id is the only honest human-facing label for now.
      title: `Titik ${id}`,
      panoramaUrl: `/panoramas/${filename}`,
      hotspots,
      previousSceneId,
      nextSceneId,
    };
  });
}

/**
 * DEVELOPMENT MOCK — NOT FINAL MUSEUM PLACEMENT.
 *
 * Neither which of the 28 collections belong inside the virtual tour, nor
 * where any of them physically sit within a real scene, has been decided
 * by the lecturer. This is a small, arbitrary set of placements — just
 * enough to demonstrate the collection-hotspot UI flow end-to-end — not
 * a claim about where these objects actually are. Kept as a separate
 * structure from the locked S01–S32 navigation topology on purpose: it
 * can be deleted, replaced, or grown to a real placement list later
 * without touching `buildSequentialRooms` or the navigation graph at all.
 */
const DEV_COLLECTION_PLACEMENTS: CollectionPlacement[] = [
  { sceneId: "S01", collectionId: "COL-01", yaw: 90, pitch: -8 },
  { sceneId: "S08", collectionId: "COL-07", yaw: 270, pitch: -8 },
  { sceneId: "S15", collectionId: "COL-14", yaw: 90, pitch: -8 },
  { sceneId: "S23", collectionId: "COL-20", yaw: 270, pitch: -8 },
  { sceneId: "S32", collectionId: "COL-28", yaw: 90, pitch: -8 },
];

/**
 * Appends collection hotspots onto whichever rooms `placements` name —
 * purely additive over the already-built sequential chain. Never touches
 * `previousSceneId`/`nextSceneId` or the navigation hotspots a room
 * already has, so the locked S01–S32 topology cannot be affected by this
 * step even in principle.
 */
function applyCollectionPlacements(
  sequentialRooms: TourRoom[],
  placements: CollectionPlacement[],
): TourRoom[] {
  const placementsByScene = new Map<string, CollectionPlacement[]>();
  for (const placement of placements) {
    const existing = placementsByScene.get(placement.sceneId) ?? [];
    existing.push(placement);
    placementsByScene.set(placement.sceneId, existing);
  }

  return sequentialRooms.map((room) => {
    const scenePlacements = placementsByScene.get(room.id);
    if (!scenePlacements) {
      return room;
    }

    const collectionHotspots: Hotspot[] = scenePlacements.map((placement, index) => ({
      type: "collection",
      id: `hotspot-${room.id}-collection-${index}`,
      collectionId: placement.collectionId,
      yaw: placement.yaw,
      pitch: placement.pitch,
    }));

    return { ...room, hotspots: [...room.hotspots, ...collectionHotspots] };
  });
}

export const rooms: TourRoom[] = applyCollectionPlacements(
  buildSequentialRooms(SCENE_ASSET_FILENAMES),
  DEV_COLLECTION_PLACEMENTS,
);

export function getRoomById(roomId: string): TourRoom | undefined {
  return rooms.find((room) => room.id === roomId);
}

export function getCollectionById(collectionId: string): Collection | undefined {
  return collections.find((collection) => collection.id === collectionId);
}
