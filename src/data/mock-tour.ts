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
const COLLECTION_RECORDS: ReadonlyArray<{
  id: string;
  title: string;
  filename: string;
  /** Optional, plain visual-only description — no fabricated history/
   * provenance/official museum copy (see this const's own doc comment
   * above). `undefined` for every record except where a client explicitly
   * asked for one based only on what's visibly in the photo/panorama. */
  shortDescription?: string;
  /** QR/deep-link proof-of-concept (see `/c/[collectionId]` and
   * `Collection.primarySceneId`'s own doc comment). `undefined` for every
   * record except COL-14, the one POC collection — not a claim about
   * where any other physical QR sticker will actually go. Must name a
   * scene where this collection genuinely has a placement row below,
   * checked by hand for COL-14 (S03) rather than enforced at the type
   * level, to keep this POC's footprint minimal. */
  primarySceneId?: string;
}> = [
  { id: "COL-01", title: "Perahu Layar Kuning", filename: "IMG_20260806_114215.jpg.jpeg", primarySceneId: "S01" },
  {
    id: "COL-02",
    title: "Perahu Biru Panjang",
    filename: "IMG_20260806_114230.jpg.jpeg",
    // S04 is COL-02's ORIGINAL placement (F56 — direct client request); its
    // S03/S05 rows in DEV_COLLECTION_PLACEMENTS were added later purely via
    // cross-scene audit (F55/F58), so S04 is the genuine primary location.
    primarySceneId: "S04",
  },
  { id: "COL-03", title: "Perahu Miniatur Abu-Abu", filename: "IMG_20260806_114356.jpg.jpeg", primarySceneId: "S05" },
  { id: "COL-04", title: "Perahu Miniatur Cokelat", filename: "IMG_20260806_114409.jpg.jpeg", primarySceneId: "S05" },
  { id: "COL-05", title: "Perahu Ramping Cokelat", filename: "IMG_20260806_114420.jpg.jpeg", primarySceneId: "S05" },
  { id: "COL-06", title: "Perahu Kayu Cokelat", filename: "IMG_20260806_114430.jpg.jpeg", primarySceneId: "S06" },
  { id: "COL-07", title: "Perahu Hijau", filename: "IMG_20260806_114455.jpg.jpeg", primarySceneId: "S08" },
  { id: "COL-08", title: "Perahu Cokelat Panjang", filename: "IMG_20260806_114504.jpg.jpeg", primarySceneId: "S06" },
  {
    id: "COL-09",
    title: "Perahu Layar Cokelat",
    filename: "IMG_20260806_114514.jpg.jpeg",
    // S07 is COL-09's ORIGINAL placement (direct client request); its S08
    // row was added later purely via cross-scene audit — see the
    // "second placement for COL-09" comment on that row below.
    primarySceneId: "S07",
  },
  { id: "COL-10", title: "Perahu Layar Kuning Cerah", filename: "IMG_20260806_114531.jpg.jpeg", primarySceneId: "S07" },
  { id: "COL-11", title: "Perahu Layar Putih Merah", filename: "IMG_20260806_114546.jpg.jpeg", primarySceneId: "S08" },
  { id: "COL-12", title: "Perahu Biru Merah", filename: "IMG_20260806_114605.jpg.jpeg" },
  { id: "COL-13", title: "Perahu Merah Biru", filename: "IMG_20260806_114614.jpg.jpeg" },
  {
    id: "COL-14",
    title: "Miniatur Kapal Layar Kuning",
    filename: "IMG_20260806_114620.jpg.jpeg",
    // S03 is COL-14's ORIGINAL placement (F54 — the client's own direct
    // request), not the S04 one added later purely via cross-scene audit
    // (F57) — see the DEV_COLLECTION_PLACEMENTS rows below for both. S03
    // is the more genuine "primary" physical location for a QR sticker.
    primarySceneId: "S03",
  },
  { id: "COL-15", title: "Miniatur Kapal Layar Putih", filename: "IMG_20260806_114625.jpg.jpeg", primarySceneId: "S12" },
  {
    id: "COL-16",
    title: "Perahu Layar Putih",
    filename: "IMG_20260806_114643.jpg.jpeg",
    // S12 is COL-16's ORIGINAL placement; its S14 row was added later
    // purely via cross-scene audit — see the "second placement for
    // COL-16" comment on that row below.
    primarySceneId: "S12",
  },
  {
    id: "COL-17",
    title: "Perahu Layar Warna-warni",
    filename: "IMG_20260806_114659.jpg.jpeg",
    // S14 is COL-17's ORIGINAL placement (via its F67 correction); its S15
    // row was added later purely via cross-scene audit — see the "second
    // placement for COL-17" comment on that row below.
    primarySceneId: "S14",
  },
  { id: "COL-18", title: "Perahu Layar Putih Panjang", filename: "IMG_20260806_114713.jpg.jpeg", primarySceneId: "S15" },
  { id: "COL-19", title: "Kapal Miniatur Cokelat", filename: "IMG_20260806_114725.jpg.jpeg", primarySceneId: "S15" },
  { id: "COL-20", title: "Perahu Merah", filename: "IMG_20260806_114740.jpg.jpeg", primarySceneId: "S23" },
  { id: "COL-21", title: "Perahu Merah Putih", filename: "IMG_20260806_114746.jpg.jpeg", primarySceneId: "S11" },
  { id: "COL-22", title: "Perahu Cokelat Rangka", filename: "IMG_20260806_114752.jpg.jpeg", primarySceneId: "S11" },
  { id: "COL-23", title: "Perahu Kuning Panjang", filename: "IMG_20260806_114758.jpg.jpeg", primarySceneId: "S10" },
  { id: "COL-24", title: "Kapal Layar Putih", filename: "IMG_20260806_114828.jpg.jpeg" },
  {
    id: "COL-25",
    title: "Kapal Layar Salib",
    filename: "IMG_20260806_114836.jpg.jpeg",
    // S19 is COL-25's ORIGINAL placement; its S18 row was added later
    // purely via cross-scene audit — see the "second placement for
    // COL-25" comment on that row below.
    primarySceneId: "S19",
  },
  {
    id: "COL-26",
    title: "Perahu Dayung Hitam",
    filename: "IMG_20260806_114840.jpg.jpeg",
    // S19 is COL-26's ORIGINAL placement; its S18/S20 rows were added
    // later purely via cross-scene audit — see their own "second"/"third
    // placement for COL-26" comments below.
    primarySceneId: "S19",
  },
  {
    id: "COL-27",
    title: "Kapal Miniatur Putih",
    filename: "IMG_20260806_114853.jpg.jpeg",
    // S19 is COL-27's ORIGINAL placement; its S18 row was added later
    // purely via cross-scene audit — see the "second placement for
    // COL-27" comment on that row below.
    primarySceneId: "S19",
  },
  { id: "COL-28", title: "Kapal Layar Putih Besar", filename: "IMG_20260806_114929.jpg.jpeg", primarySceneId: "S32" },
  // COL-29/30/31: all 28 originally-supplied photos (COL-01..COL-28) are
  // now each assigned to at least one live placement, so these 3 new S20
  // objects can't reuse an unused id the way every prior addition in this
  // file did. Client confirmed (when asked) to add new collection records
  // rather than pointing a new placement at an already-used id — filename
  // is a placeholder (reuses an existing photo) until a real photo of
  // these specific objects is supplied.
  { id: "COL-29", title: "Kapal Layar Kuning Hias", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-30", title: "Kapal Layar Putih Panjang", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-31", title: "Perahu Biru Kecil", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-32: 1 more new S20 object, same situation as COL-29/30/31 above —
  // no unused original id left, so a new record again (same placeholder
  // photo, per the same client-confirmed approach).
  { id: "COL-32", title: "Perahu Cadik Putih Merah", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-33: 1 new S23 object, same situation as COL-29..32 above.
  { id: "COL-33", title: "Miniatur Perahu Kembar", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-34: 1 new S25 object, same situation as COL-29..33 above.
  { id: "COL-34", title: "Perahu Cadik Hias Warna", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-35/36: 2 new S26 objects, same situation as COL-29..34 above.
  { id: "COL-35", title: "Kapal Layar Putih Besar Kedua", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-36", title: "Kapal Kayu Putih Kecil", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-37/38/39: 3 new S28 objects, same situation as COL-29..36 above.
  { id: "COL-37", title: "Perahu Hias Bendera Kertas", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-38", title: "Kapal Layar Emas Besar", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-39", title: "Perahu Atap Merah", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-40/41: 2 new S29 objects, same situation as COL-29..39 above.
  { id: "COL-40", title: "Perahu Cokelat Danau Laut Tador", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-41", title: "Miniatur Perahu Vitrin", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-42/43: 2 new S30 objects, same situation as COL-29..41 above.
  { id: "COL-42", title: "Kapal Kayu Biru Vitrin", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-43", title: "Rangka Perahu Cadik", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-44/45: 2 new S31 objects, same situation as COL-29..43 above.
  { id: "COL-44", title: "Perahu Kuning Beungong Meulu", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-45", title: "Kapal Layar Emas Vitrin", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-46/47: 2 new S03 objects, same situation as COL-29..45 above.
  { id: "COL-46", title: "Perahu Anyaman Abu-Abu", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-47", title: "Perahu Anyaman Cokelat", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-48: 1 new S02 object, same situation as COL-29..47 above.
  { id: "COL-48", title: "Perahu Hitam Ramping", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-49: 1 more new S02 object, same situation as COL-29..48 above.
  { id: "COL-49", title: "Perahu Kecil Cokelat Merah", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-50/51: 2 new S04 objects, same situation as COL-29..49 above.
  { id: "COL-50", title: "Perahu Batu Abu-Abu", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-51", title: "Perahu Anyaman Berduri", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-52/53: 2 new S06 objects, same situation as COL-29..51 above.
  { id: "COL-52", title: "Perahu Cadik Kayu Merah", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-53", title: "Perahu Cadik Mungil", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-54/55: 2 new S07 objects, same situation as COL-29..53 above.
  { id: "COL-54", title: "Perahu Kuning Jingga", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-55", title: "Perahu Cadik Merah Tua", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-56: 1 new S08 object, same situation as COL-29..55 above.
  { id: "COL-56", title: "Perahu Layar Krem Kecil", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-57: 1 new S08 object, same situation as COL-29..56 above.
  { id: "COL-57", title: "Perahu Layar Putih Panjang Kecil", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-58: 1 new S10 object, same situation as COL-29..57 above.
  { id: "COL-58", title: "Perahu Layar Cokelat Kemerahan", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-59: 1 new S10 object, same situation as COL-29..58 above.
  { id: "COL-59", title: "Perahu Layar Hijau", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-60/61: 2 new S12 objects, same situation as COL-29..59 above.
  { id: "COL-60", title: "Perahu Layar Krem Kembar", filename: "IMG_20260806_114929.jpg.jpeg" },
  { id: "COL-61", title: "Perahu Layar Krem Tunggal", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-62: 1 new S18 object, same situation as COL-29..61 above.
  { id: "COL-62", title: "Perahu Cadik Merah Biru", filename: "IMG_20260806_114929.jpg.jpeg" },
  // COL-63: 1 new S23 object (the large three-mast tall ship on its own
  // dedicated blue pedestal, yaw ~124 — distinct from S23's existing
  // COL-20/COL-33 placements, confirmed >100° apart live). Title is a
  // plain physical description only, same restraint as every other dev
  // title in this file — no history/provenance claimed, nothing verified
  // by the museum yet. Same situation as COL-29..62 (no unused original id
  // left) — new record rather than reusing an already-used id.
  {
    id: "COL-63",
    title: "Kapal Layar Besar Bertiang Tiga",
    filename: "IMG_20260806_114929.jpg.jpeg",
    // QR 31-final set (client selection) — S23 is its only placement.
    primarySceneId: "S23",
  },
  // COL-64: 1 new S25 object (a single-mast wooden ship with a plain white
  // sail, on its own dedicated blue pedestal, visible right at S25's own
  // default landing — yaw -15.53, untouched). Checked against S25's
  // existing COL-34 (138° apart, different object entirely) and against
  // S26's COL-35 ("large wooden ship, white sails, own blue pedestal" —
  // superficially similar description) — this file's own prior cross-scene
  // audit already confirmed COL-35 does NOT appear in S25's panorama (see
  // that audit's comment above), ruling out reuse. `shortDescription` is a
  // plain visual-only line (client-authorized for this one record) — no
  // history/provenance/official name claimed. Same situation as COL-29..63
  // (no unused original id left) — new record rather than reusing an
  // already-used id.
  {
    id: "COL-64",
    title: "Kapal Layar Putih",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model kapal kayu bertiang satu dengan layar putih, dipajang di atas pedestal biru.",
    // QR 31-final set (client selection) — S25 is its only placement.
    primarySceneId: "S25",
  },
  // COL-65/66: 2 new S25 objects, a SEPARATE blue pedestal from COL-64's own
  // (~100-115° apart, confirmed via live 360° scan — COL-64's pedestal only
  // ever shows 1 boat across that whole range) — holds 2 small junk-style
  // boats side by side, neither matching COL-34 (outrigger canoe, no
  // outrigger floats visible on either of these) or COL-64 (single-mast,
  // plain white sail — these two have multi-batten sails). `shortDescription`
  // is plain visual-only (client-authorized), no history/provenance/origin
  // claimed. Same situation as COL-29..64 (no unused original id left) —
  // new records rather than reusing already-used ids.
  {
    id: "COL-65",
    title: "Kapal Layar Miniatur 1",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model kapal kayu kecil dengan layar bilah putih dan lambung berwarna, di atas pedestal biru.",
  },
  {
    id: "COL-66",
    title: "Kapal Layar Miniatur 2",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model kapal kayu kecil dengan layar bilah putih dan lambung cokelat, di atas pedestal biru.",
  },
  // COL-67/68: 2 new S29 objects, found via a live 360° scan of S29 away
  // from its own default landing (yaw 56.32, untouched). Checked against
  // both of S29's existing placements — COL-40 (small tan boat, white
  // pedestal, near "Danau Laut Tador" poster) and COL-41 (small item in a
  // glass case near an AC unit) — and against each other; all four are
  // >45° apart with distinct visual descriptions, no overlap. `shortDescription`
  // is plain visual-only (client-authorized), no history/provenance/origin
  // claimed. Same situation as COL-29..66 (no unused original id left) —
  // new records rather than reusing already-used ids.
  {
    id: "COL-67",
    title: "Perahu Atap Merah Biru",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model perahu panjang berlambung merah-biru dengan atap/kabin kayu cokelat, di atas pedestal hitam.",
    // QR 31-final set (client selection) — S29 is its only placement.
    primarySceneId: "S29",
  },
  {
    id: "COL-68",
    title: "Kapal Layar Besar Cokelat",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model kapal kayu besar berwarna cokelat dengan banyak layar putih, di atas pedestal putih-kayu.",
    // QR 31-final set (client selection) — S29 is its only placement.
    primarySceneId: "S29",
  },
  // COL-69/70: 2 new S30 objects, found via a live 360° scan of S30 away
  // from its own default landing (yaw 34.09, untouched). Checked against
  // both of S30's existing placements — COL-42 (wooden ship in a glass case
  // on a blue pedestal, near a window) and COL-43 (unfinished/frame-only
  // outrigger canoe, bare wood poles, on a dark bench) — and against each
  // other; all four are >45° apart with distinct visual descriptions, no
  // overlap. `shortDescription` is plain visual-only (client-authorized),
  // no history/provenance/origin claimed. Same situation as COL-29..68 (no
  // unused original id left) — new records rather than reusing already-used
  // ids.
  {
    id: "COL-69",
    title: "Perahu Oranye Putih",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model perahu kecil memanjang berwarna oranye-putih, di atas pedestal hitam.",
    // QR 31-final set (client selection) — S30 is its only placement.
    primarySceneId: "S30",
  },
  {
    id: "COL-70",
    title: "Perahu Kecil Vitrin Putih",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model perahu kecil berlambung biru-merah dengan atap kayu, di atas pedestal putih.",
  },
  // COL-71/72: 2 new S31 objects, found via a live 360° scan of S31 away
  // from its own default landing (yaw 28.61, untouched). Checked against
  // both of S31's existing placements — COL-44 (yellow/orange boat under
  // the "Beungong Meulu dan Beungong Peunek" poster) and COL-45 (golden
  // wooden sail ship on its own low bench) — and against each other; all
  // four are >55° apart with distinct visual descriptions, no overlap.
  // `shortDescription` is plain visual-only (client-authorized), no
  // history/provenance/origin claimed. Same situation as COL-29..70 (no
  // unused original id left) — new records rather than reusing already-used
  // ids.
  {
    id: "COL-71",
    title: "Kapal Rangka Kayu Vitrin",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model kapal berbahan rangka kayu anyaman dengan kabin kecil, di atas pedestal biru.",
    // QR 31-final set (client selection) — S31 is its only placement.
    primarySceneId: "S31",
  },
  {
    id: "COL-72",
    title: "Perahu Kecil Dayung",
    filename: "IMG_20260806_114929.jpg.jpeg",
    shortDescription: "Model perahu kecil berlambung gelap dengan dua dayung kayu bersilang, di atas pedestal hitam.",
  },
];

export const collections: Collection[] = COLLECTION_RECORDS.map(
  ({ id, title, filename, shortDescription, primarySceneId }) => {
    const path = `/collections/${filename}`;
    return {
      id,
      title,
      coverImage: path,
      detailImage: path,
      // shortDescription: passed through only when a record explicitly sets
      // one (currently just COL-64) — `undefined` for every other record,
      // same restraint as always: no official or draft copy exists for them
      // yet (F4 brief: do not fabricate). The UI hides or neutrally labels
      // the missing description rather than inventing one — see
      // CollectionPeek / CollectionDetail.
      shortDescription,
      // description / officialName / officialDescription deliberately
      // omitted for every record, COL-64 included — `shortDescription` above
      // is a plain visual-only line, not a full/official description.
      // primarySceneId: passed through only for COL-14 (QR POC) — see its
      // own doc comment on `Collection` for what this does and doesn't mean.
      primarySceneId,
    };
  },
);

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
 * F10/F11: per-scene forward-orientation calibration for `TourRoom.defaultYaw`
 * (see its doc comment in types/virtual-tour.ts for what this controls and
 * why a single value serves both Next and Previous landings).
 *
 * Generic yaw=0 (F3A's original placeholder) puts every scene's landing
 * view at whatever pixel column happened to be the "seam"/reference
 * direction baked into that scene's own equirectangular capture —
 * essentially arbitrary per photo, unrelated to which way the museum
 * corridor actually runs at that spot. These values replace 0 ONLY for
 * scenes where it visibly landed off-corridor (facing a wall/exhibit
 * close-up instead of down the walkway).
 *
 * Method (not a guess): rendered this app's own Pannellum projection math
 * (yaw/pitch/hfov=100 -> equirectangular pixel lookup, ported from
 * libpannellum.js's fragment shader) as static images, first verifying it
 * against a live browser screenshot (pixel-identical at yaw=0 on S01) so
 * the preview is a faithful stand-in for what Pannellum actually renders.
 *
 * F11 pass: a first pass (F10) swept yaw in coarse 30° steps and covered
 * S11/S12/S13/S14/S15/S18/S19. A follow-up manual test flagged S05-S13
 * specifically as still landing off-center in places, so this pass
 * re-swept EVERY scene in that range at finer 20° yaw steps, AND swept
 * pitch (-20 to +10) at each scene's corrected yaw to check for
 * excessive ceiling/floor. Findings: S06/S08/S09/S10 were already correct
 * at yaw 0 (confirmed again, left alone); S05 and S07 needed a small yaw
 * correction that the coarser 30° grid had skipped past; S11/S12/S13's
 * F10 values (30) were serviceable but 20 centers the corridor slightly
 * better on the finer grid. Pitch: every scene in S05-S13 was already
 * reasonably framed (floor/ceiling roughly balanced) at pitch 0 once yaw
 * was corrected — the "too much ceiling" complaint tracked with the WRONG
 * yaw (facing into a close wall/ceiling corner instead of down the
 * corridor), not an independent pitch problem, so no pitch override was
 * written for any of these scenes (would have been fabricated without a
 * visible improvement to justify it). hfov was left at the single shared
 * 100 for every scene — already uniform across all scenes at the code
 * level (see lib/pannellum.ts), and no scene's audit render looked
 * mis-framed at that hfov, so no per-scene override was warranted there
 * either. S14/S15/S18/S19 were re-checked with fresh eyes this pass and
 * still land correctly — left unchanged from F10.
 *
 * Every scene NOT listed here was visually confirmed to already land on a
 * centered, symmetric corridor view at yaw=0/pitch=0 — deliberately left
 * as `undefined` rather than calibrating scenes that were never wrong.
 * Neither audit pass caught a tilted/rolled horizon, so `defaultRoll`
 * stayed unused for a long time — S08 is the first scene identified with
 * one (see `SCENE_FORWARD_ROLL` below), found later from a direct client
 * report, not either audit pass.
 */
const SCENE_FORWARD_YAW: Readonly<Record<string, number>> = {
  // S05 (9_217_223.jpg): F15 — set back to 0 at explicit user direction
  // after the F14 runtime proof's own yaw=0 screenshot read as the
  // straight-ahead one (vs. yaw=-90's clearly-sideways view); manual
  // testing found -30 (F13's sweep-derived value) still read as skewed
  // right compared to S06. Written explicitly as 0 (not removed from this
  // map) so it's visible this scene was deliberately checked, not merely
  // never calibrated. No further sweep/auto-calibration performed per
  // instruction — this value is a direct, requested revert, not a new
  // conclusion about which angle is "correct."
  S05: 0,
  // S07-S13 (F16): calibrated using the exact method S05 was finally
  // validated with — live screenshots at the real mobile viewport
  // (430x932), a pixel-drawn centerline overlay, judged against the
  // corridor's own distant vanishing point (the far end of the hallway —
  // explicitly NOT the near ceiling lamp or nearby display objects, which
  // move far more than the true vanishing point per yaw and are
  // misleading), compared directly against S05/S06 as the accepted
  // "reads as straight" reference pattern (neither of which sits at
  // perfect geometric center either — a small, consistent offset is
  // apparently how "straight" actually reads in this corridor, not exact
  // pixel-center). No synthetic/downscaled grid renders were used as the
  // deciding evidence this pass — only live full-resolution screenshots.
  //
  // S07 (11_231_237.jpg): F17 correction — a fresh, dedicated pass on this
  // scene alone (full dev-server restart first, to rule out a stale
  // pipeline as the cause) found the ENTIRE negative range explored in
  // F16 (-20 through -48) was the wrong direction: at every negative
  // value tested (-26, -30, -32, -36, -42, -48) the corridor's overall
  // structure — not just one bright point — read progressively worse
  // (more of the frame filled by the near wall/AC unit/display case, less
  // of the actual walkway visible) rather than converging on something
  // resembling S06. Chasing a single distant light point in isolation
  // (the F16 method, technically inherited from F13) was itself
  // misleading here: it can be minimized while the overall "walking down
  // an open corridor" gestalt gets worse, which is exactly what happened
  // between -32 and -48. Testing the POSITIVE range instead (0 landed
  // clearly wrong — vanishing point well right of center, same as
  // before — then 30, 55, 20, 16) found the actual corridor axis on the
  // opposite side of 0 from every earlier guess: +16 reproduces S06's
  // open-walkway structure closely (wall/corridor/display-case
  // proportions comparable, vanishing point on the centerline) where nothing
  // in the negative range came close. Verified live at 430x932 against a
  // pixel-drawn centerline, side-by-side with the S06 reference screenshot,
  // not a synthetic/downscaled render.
  S07: 16,
  // S08 (12_238_244.jpg): F22 — the F19 value (-22) was STILL rejected on
  // manual visual review despite matching the vanishing-point-centerline
  // method that had worked for other scenes. Abandoned that method for
  // this scene entirely and instead: (1) interactively dragged the live
  // panorama at 430x932 (mouse-drag, not a typed candidate) until the
  // room's own operator judged the framing a genuine match for the
  // already-accepted S05/S07 "walking straight" reference views; (2)
  // captured that dragged frame as the target; (3) since this harness's
  // page.evaluate() runs in an isolated JS world that cannot read the
  // live Pannellum instance's own getYaw()/getPitch() (confirmed:
  // window.pannellum and any value the page's own scripts attach to
  // window are invisible to it — the same reason an earlier addInitScript/
  // page.route instrumentation attempt silently no-opped), the exact
  // equivalent absolute yaw was instead determined by re-rendering
  // candidate configured yaw values fresh (source edit -> reload ->
  // screenshot) and pixel-diffing each against the dragged target frame
  // until the closest match was found. That search landed far outside
  // every value tried in F16-F19 (which never left the -48..+20 band):
  // +38 reproduces the dragged "feels straight" frame closely and, side
  // by side, reads the same as the S05/S07 reference screenshots —
  // open corridor, centered vanishing point, balanced wall/floor/ceiling
  // proportions. Pitch left unchanged (0) — the dragged target and every
  // candidate near +38 already showed a naturally balanced floor/ceiling
  // split with no vertical correction needed.
  //
  // Follow-up correction: client still saw this as crooked at yaw 38 (even
  // with the SCENE_FORWARD_ROLL attempt below at the time) and dragged to
  // a genuinely straight-looking view, reporting the live badge values —
  // yaw 25.82, pitch 0.00, roll 0.00. Note the roll reading: Pannellum
  // zeroes `config.roll` on every drag interaction (its own mousedown
  // handler, not a bug here), so that 0.00 isn't evidence roll was already
  // fine — it's a side effect of how the client found this yaw. Taken at
  // face value anyway since it's the client's own direct, confirmed
  // straight-view report, same as every other scene's manual-drag
  // calibration in this file: yaw corrected to 25.82 here, and the
  // SCENE_FORWARD_ROLL.S08 guess below reverted to unused (0) rather than
  // stacked on top of a yaw the client hadn't seen combined with it.
  S08: 25.82,
  // S10 (14_252_258.jpg): F23 — re-audited after S09's exclusion made
  // S08->S10 a direct hop for the first time (previously this scene was
  // only ever reached via S09, and its own orientation was never actually
  // tested against S05/S07 as a real landing target — the earlier "0
  // already matches" note in mock-tour.ts's history was a leftover
  // assumption, never verified). At yaw 0, S08->Next->S10 lands facing a
  // close text panel/model display with the corridor barely visible at
  // the frame's right edge — clearly off-axis. Swept -20/-10/0/10/20
  // first (negative got worse, facing the display dead-on; positive
  // opened the corridor up), then 30/40 (40 overshot: the distant opening
  // moved past center to the left), then refined 25/30/35, then a second
  // micro-tuning pass (F24) at 1° steps around 30 (24/26/28/30/32/34/36,
  // then 29/30/31) — judged specifically on the far walkway/floor path
  // and the corridor's distant opening, deliberately NOT on nearby pillars/
  // ship models/ceiling lamps (parallax-biased). 30 stayed the cleanest,
  // most consistent match across both passes and, side by side, matches
  // the S05/S07 "walking straight" reference screenshots closely (open
  // walkway, balanced wall/floor/ceiling proportions). Pitch/roll left
  // unchanged — floor/ceiling split was already natural at every yaw
  // tested, and no tilted horizon was observed.
  //
  // Follow-up correction: client reported this still read as crooked (same
  // report pattern as S08) and dragged to a genuinely straight-looking
  // view, reading the live debug badge — yaw 39.74, pitch 0.91, roll 0.00.
  // Roll's 0.00 taken at face value here since pitch (not roll) is the
  // paired correction this time. Both values baked in directly from the
  // client's own confirmed straight-view report, same as every other
  // scene's manual-drag calibration in this file.
  S10: 39.74,
  //
  // S11 (15_259_265.jpg): F25 correction — the F12 conclusion (25) was
  // never actually checked against a real S10->Next->S11 landing at
  // 430x932 with a precise centerline; audited fresh and found the
  // corridor's distant opening clearly right of center at 25. Swept
  // 15/25(current)/35/45 first (15 was worse — no corridor visible at
  // all, facing a display dead-on; 35/45 progressively opened the
  // corridor up and centered it), then refined 40/45/50, then 43/47 —
  // 47 lands the distant opening essentially on the centerline. Confirmed
  // side by side against S05/S07/S10 (all already-accepted "walking
  // straight" references) — matching open-walkway structure and balanced
  // wall/floor/ceiling proportions. Pitch/roll left unchanged — floor/
  // ceiling split stayed naturally balanced at every yaw tested, no
  // tilted horizon observed.
  S11: 47,
  // S12 (16_266_272.jpg): F26 correction — the F12 conclusion (25) was
  // never checked against a real S11->Next->S12 landing at 430x932; that
  // landing turned out clearly right of center. Swept 5/15/25(prior)/35/45
  // first (5 and 15 were worse — facing the display dead-on, no corridor
  // visible at all; 35/45 progressively opened the corridor and centered
  // it), pushed further to 55/65 (65 overshot left), then refined 50/52 —
  // 50 lands the distant opening essentially on the centerline. Confirmed
  // side by side against S05/S07/S10/S11 (all already-accepted "walking
  // straight" references) — matching open-walkway structure and balanced
  // wall/floor/ceiling proportions. Pitch/roll left unchanged — floor/
  // ceiling split stayed naturally balanced at every yaw tested, no
  // tilted horizon observed.
  S12: 50,
  // S13 (17_273_279.jpg): same pattern as S12 — yaw 0 faces the yellow
  // sail-flag model close up; same 20->25 refinement.
  S13: 25,
  // S14 (18_280_286.jpg): F28 correction — -120 (prior value) DID land on
  // a geometrically centered corridor, but centered isn't the same as
  // forward: -120 and +60 are opposite hemispheres (180° apart), and a
  // symmetric corridor can look "straight" facing either way. Resolved
  // which one is actually forward by comparing display styles across
  // S12/S14/S15 rather than trusting centering alone — S12 and S14@-120
  // both show the same blue-pedestal ship-model display (S14@-120 was
  // looking BACK toward S12's own decor), while S14@+60 and S15 both show
  // a matching light-wood cabinet + sail-model display (S15 is a
  // different room entirely — steel-truss ceiling vs. S12-S14's wood
  // beams — so this match only makes sense if +60 faces genuinely FORWARD
  // toward it). With the hemisphere confirmed, swept 40/50/60/70/80
  // around it (40 too far — corridor not visible at all; 80 overshot —
  // pillar dominates center) then refined to 63, which lands the
  // corridor's distant opening on the centerline. Confirmed as a coherent
  // S12->S14->S15 forward walk, not just three independently-centered
  // scenes. Pitch/roll left unchanged — no tilted horizon, floor/ceiling
  // split stayed natural at every yaw tested.
  S14: 63,
  // S15 (19_287_293.jpg): F30 correction — F29's -135/-150 conclusion was
  // WRONG. It reasoned from corridor geometry/architecture-matching alone
  // ("a walkway exists, therefore this hemisphere is forward"), but a
  // straight, well-centered corridor view can still face directly
  // backward — geometry can't tell the two apart, only the user's own
  // sense of travel direction can. Live runtime check with a temporary
  // on-screen yaw/pitch/hfov badge (S14->Next->S15, manual drag to the
  // view the user actually considers "maju") landed at yaw=-138.67,
  // pitch=1.22 — user confirmed this view IS straight/centered but faces
  // BACKWARD (toward S14), not forward toward S18. True forward is the
  // opposite hemisphere: -138.67 + 180 = +41.33, rounded to 41 as the
  // sweep baseline. This hemisphere is an open display hall, not a
  // corridor, so there's no single walkway vanishing point — centering was
  // instead measured against the distant back-wall opening's pixel
  // centroid, which drifted steadily toward the frame centerline as yaw
  // increased across the tested candidates (35/38/40/41/42/44/47: centroid
  // x went 313->299->294->293->291->288->284, screen center is x~215 at
  // 430px width) with no left/right roll/tilt introduced. 47 (the top of
  // the tested range) was the closest of the candidates actually tested;
  // pitch/roll/hfov left unchanged. COL-14 hotspot (yaw 90, pitch -8) is
  // unaffected — its placement is independent of defaultYaw.
  S15: 47,
  // S18 (22_308_314.jpg): F36 correction — yaw 0 faces into a mostly-empty
  // side alcove. -150 (prior value) already showed the real corridor
  // (confirmed forward: its 180-opposite, +30, is a dead-end open hall
  // with no through-walkway at all — same pattern used to confirm S15's
  // hemisphere — so -150 was never actually backward), but wasn't
  // precisely centered. Landing tested via the real S15 -> hotspot -> S18
  // flow (not a synthetic render). Swept -170/-160/-150/-140/-130, then
  // fine-tuned -135/-130/-128/-125/-120: measured the far corridor
  // vanishing point's pixel centroid at each (dark band at the corridor's
  // distant end) — -130 landed closest to true center (207px vs target
  // 215px at 430px width; next-best -135 was 231px, 16px further off).
  // Pitch/roll left unchanged — no tilted horizon, floor/ceiling split
  // stayed natural at every yaw tested.
  S18: -145,
  // S19 (23_315_321.jpg): F37 correction — -150 (prior value) showed the
  // real corridor but wasn't precisely centered/straight. Landing tested
  // via the real S15 -> hotspot -> S18 -> Next -> S19 flow (not synthetic).
  // Confirmed -150's hemisphere first: its 180-opposite, +30, is the same
  // dead-end open-hall-with-no-walkway pattern already seen disqualifying
  // this hemisphere for S15/S18, so -150's hemisphere is genuinely forward.
  // Swept -180/-165/-150/-135/-120 (visually, not just math — -180 skewed
  // hard left onto the near wall, -120 let the right-side boat display
  // dominate/unbalance the frame, -135 looked the most "walking straight"
  // of the coarse sweep), then fine-tuned -142/-138/-135/-132/-128.
  // Corridor vanishing-point centroid measurement across the fine
  // candidates (-150:204px, -142:278px, -138:250px, -135:236px,
  // -132:218px, -128:233px vs 215px target at 430px width) agreed with the
  // visual read: -132 is both closest to center AND reads as straight/
  // symmetric in the actual screenshot (pillar and displays balanced on
  // both sides, no left/right lean). Pitch/roll left unchanged — no
  // tilted horizon or off-level floor/ceiling split at any yaw tested.
  S19: -132,
  // S20 (24_322_328.jpg): F39 correction — F38's automated sweep (hemisphere
  // scan + vanishing-point centroid math) landed on -35 but the user
  // reported the real landing still looked skewed. Per explicit instruction,
  // abandoned the automated/centroid method entirely for this scene and
  // used a live on-screen yaw/pitch/hfov debug badge (temporarily added to
  // PanoramaViewer, since removed) so the user could drag S20 by hand to
  // the view they consider genuinely straight-ahead, then read the exact
  // runtime values off the badge. User-approved result: yaw -8.22, pitch
  // -2.50, hfov 115.58 — note this needed a pitch and hfov correction too
  // (see `SCENE_FORWARD_PITCH`/`SCENE_FORWARD_HFOV` below), not just yaw;
  // every other scene's calibration to date only ever needed yaw.
  S20: -8.22,
  // S23 (27_344_350.jpg): F41 — yaw 0 (no prior entry) landed off-corridor,
  // skewed. Same manual-drag debug-badge method as S20 (temporarily added
  // to PanoramaViewer, since removed): live S20 -> Next -> S23 flow, user
  // dragged to the view they consider genuinely straight, read the exact
  // runtime values off the badge. User-approved result: yaw -19.18, pitch
  // 2.44, hfov 100 (pitch also needed correction — see
  // `SCENE_FORWARD_PITCH` below; hfov matches the shared default so no
  // `SCENE_FORWARD_HFOV` entry was needed for this one).
  S23: -19.18,
  // S25 (29_358_364.jpg): F43 — yaw 0 (no prior entry) landed off-corridor,
  // skewed (S24 now excluded, see EXCLUDED_SCENE_IDS, so this is now the
  // S23->S25 landing). Same manual-drag debug-badge method as S20/S23
  // (temporarily added to PanoramaViewer, since removed): live
  // S23 -> Next -> S25 flow, user dragged to the view they consider
  // genuinely straight, read the exact runtime values off the badge.
  // User-approved result: yaw -15.53, pitch -0.30, hfov 100 (pitch also
  // needed a small correction — see `SCENE_FORWARD_PITCH` below; hfov
  // matches the shared default so no `SCENE_FORWARD_HFOV` entry needed).
  S25: -15.53,
  // S26 (30_365_371.jpg): F44 — yaw 0 (no prior entry) landed off-corridor,
  // skewed right. Same manual-drag debug-badge method as S20/S23/S25
  // (temporarily reactivated on PanoramaViewer, since removed again): live
  // S25 -> Next -> S26 flow, user dragged to the view they consider
  // genuinely straight, read the exact runtime values off the badge.
  // User-approved result: yaw 21.31, pitch 0.91 (hfov left at the shared
  // default 100 — user's approved reading stayed there).
  S26: 21.31,
  // S28 (32_379_385.jpg): F46 — yaw 0 (no prior entry) landed off-corridor.
  // Same manual-drag debug-badge method as S20/S23/S25/S26 (temporarily
  // reactivated on PanoramaViewer, removed again after verification): live
  // S26 -> Next -> S28 flow, user dragged to the view they consider
  // genuinely straight, read the exact runtime values off the badge.
  // User-approved result: yaw 55.10, pitch 4.57, hfov 100 (matches the
  // shared default, no `SCENE_FORWARD_HFOV` entry needed).
  S28: 55.1,
  // S29 (33_386_392.jpg): F47 — yaw 0 (no prior entry) landed off-corridor.
  // Same manual-drag debug-badge method as S20/S23/S25/S26/S28 (temporarily
  // reactivated on PanoramaViewer, removed again after verification): live
  // S28 -> Next -> S29 flow, user dragged to the view they consider
  // genuinely straight, read the exact runtime values off the badge.
  // User-approved result: yaw 56.32, pitch 0 (matches the neutral default,
  // no `SCENE_FORWARD_PITCH` entry needed — unlike S20/S23/S25/S26/S28,
  // this one didn't need a pitch correction).
  S29: 56.32,
  // S30 (34_393_399.jpg): F48 — yaw 0 (no prior entry) landed off-corridor,
  // skewed. Same manual-drag debug-badge method as S20/S23/S25/S26/S28/S29
  // (badge stays active for now per this task's instruction): live
  // S29 -> Next -> S30 flow, user dragged to the view they consider
  // genuinely straight (staircase centered-left, corridor floor not
  // skewed), read the exact runtime values off the badge. First
  // user-approved result was yaw 28.61 — F49 correction nudged it slightly
  // further to yaw 34.09 (still same pitch -0.30, hfov 100) after the user
  // compared the landing against a target reference screenshot and found
  // 28.61 still a touch off.
  S30: 34.09,
  // S31 (35_400_406.jpg): F50 — yaw 0 (no prior entry) landed off-corridor,
  // heavy on the staircase structure. Same manual-drag debug-badge method
  // as S20/S23/S25/S26/S28/S29/S30 (badge stays active for now per this
  // task's instruction): live S30 -> Next -> S31 flow, user dragged to the
  // view matching their reference screenshot, read the exact runtime
  // values off the badge. User-approved result: yaw 28.61, pitch 0, hfov
  // 100 (pitch/hfov both match the shared defaults, no
  // `SCENE_FORWARD_PITCH`/`SCENE_FORWARD_HFOV` entry needed).
  S31: 28.61,
  // S32 (36_407_413.jpg): F51 — yaw 0 (no prior entry) landed off-corridor,
  // heavy on the staircase structure. Same manual-drag debug-badge method
  // as S20/S23/S25/S26/S28/S29/S30/S31 (badge stays active for now per
  // this task's instruction): live S31 -> Next -> S32 flow, user dragged
  // to the view matching their reference screenshot, read the exact
  // runtime values off the badge. User-approved result: yaw 28.61, pitch
  // -2.13, hfov 100 (matches the shared default, no `SCENE_FORWARD_HFOV`
  // entry needed).
  S32: 28.61,
};

/**
 * F39: per-scene pitch override, same shape/reasoning as
 * `SCENE_FORWARD_YAW` but for `TourRoom.defaultPitch`. Empty for every
 * scene except S20 until now — S20 is the first scene whose user-approved
 * manual forward view needed a pitch correction, not just yaw (see the F39
 * comment on `SCENE_FORWARD_YAW.S20` for how this value was obtained).
 */
const SCENE_FORWARD_PITCH: Readonly<Record<string, number>> = {
  // S10: client-confirmed straight-view drag (see the F24-follow-up
  // comment on `SCENE_FORWARD_YAW.S10` above) — paired with that scene's
  // yaw 39.74 correction.
  S10: 0.91,
  S20: -2.5,
  S23: 2.44,
  S25: -0.3,
  S26: 0.91,
  S28: 4.57,
  S30: -0.3,
  S32: -2.13,
};

/**
 * F39: per-scene HFOV override, same shape/reasoning as
 * `SCENE_FORWARD_YAW` but for `TourRoom.defaultHfov`. Empty for every scene
 * except S20 until now — see the F39 comment on `SCENE_FORWARD_YAW.S20`.
 */
const SCENE_FORWARD_HFOV: Readonly<Record<string, number>> = {
  S20: 115.58,
};

/**
 * Per-scene roll override, same shape/reasoning as `SCENE_FORWARD_YAW` but
 * for `TourRoom.defaultRoll`. Still empty — S08 was a first attempt at
 * using this (client reported the yaw-38 landing looked crooked; measured
 * a true vertical reference — a ceiling support post and its adjacent
 * barrier stanchion — leaning a few degrees at roll 0, and a `roll: -2.8`
 * pixel-grid check confirmed it straightened that reference).
 *
 * Superseded, not stacked: the client still saw yaw 38 (even with that
 * -2.8 roll) as crooked, and instead dragged to a different yaw entirely —
 * 25.82 — which read as straight with Pannellum's own drag-reset roll of
 * 0.00 (see the `SCENE_FORWARD_YAW.S08` comment above for why that 0.00
 * reading isn't itself meaningful). Taking the client's direct straight-
 * view report at face value, same as every other scene's manual-drag
 * calibration in this file, means yaw alone explains what they saw as
 * crooked — reverted this map back to empty rather than guessing a new
 * roll to pair with yaw 25.82 that was never itself confirmed against a
 * live drag. Left as a working per-scene override for the day a scene
 * genuinely needs both a yaw and a roll correction together.
 */
const SCENE_FORWARD_ROLL: Readonly<Record<string, number>> = {};

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
      defaultYaw: SCENE_FORWARD_YAW[id],
      defaultPitch: SCENE_FORWARD_PITCH[id],
      defaultHfov: SCENE_FORWARD_HFOV[id],
      defaultRoll: SCENE_FORWARD_ROLL[id],
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
  // F64 correction: the original F4-era placement (yaw 270/pitch -8) was
  // never actually on a boat — a live re-check showed it sitting squarely
  // on the room's AC/heater unit. Client flagged this directly (pointed at
  // a second reference screenshot showing the real target: a green
  // dragon-head canoe model on its own stand, under a "Kisah Ikan Paus dan
  // Lumba-lumba" wall poster). Repositioned this SAME placement row (still
  // `COL-07`, not a new collection, not a new row) onto that canoe's hull,
  // solved via `mouseEventToCoords` from a live screen point on it.
  { sceneId: "S08", collectionId: "COL-07", yaw: -45.84, pitch: -20.67 },
  // F63: client pointed at 2 views in S08. One matched the existing
  // `COL-07` marker already visible there (see F64 correction above — that
  // one turned out to be misplaced and was fixed, not left as originally
  // assumed here). The other (an orange/brown sailboat on a blue pedestal)
  // was already visible in S08's own default landing (yaw 38 — the
  // documented "best visual compromise" value from the earlier parallax
  // audit, untouched by this change) — no scan needed, solved directly
  // from a screen point on it at that live heading via
  // `mouseEventToCoords`. `COL-11` is a
  // previously-unplaced collection id.
  { sceneId: "S08", collectionId: "COL-11", yaw: 57.4, pitch: -12.18 },
  // S15's COL-14 placement removed (F35, client request) — S15 should show
  // only its navigation-to-S18 hotspot, no collection hotspot. `COL-14`
  // itself is untouched in `COLLECTION_RECORDS`/`collections` above (still
  // resolvable by id, e.g. if a future scene places it) — only this one
  // scene's placement entry is gone, which is all `applyCollectionPlacements`
  // needs to stop generating a hotspot for it in S15.
  //
  // F54: `COL-14` re-placed here at S03 (client request — a collection
  // hotspot visible on landing, without drag, was actually meant for S03,
  // not S32 where it was mistakenly chased first — see S32's own F53
  // revert comment below). No pre-existing S03 placement to move; this is
  // a brand-new entry using an already-unplaced collection id, not a new
  // Collection record.
  //
  // F55 correction: the F54 target (a white sail-ship model, yaw 45.72/
  // pitch 1.33) was wrong — the client's actual ground truth was a
  // reference screenshot of a THREE-boat-miniature display on a black
  // table with colorful wall banners behind it, reached only by dragging
  // well away from S03's own default landing (defaultYaw/pitch confirmed
  // still 0/0, untouched — that reference view was the client's own
  // manual drag, not the landing). Found this exact display by scanning
  // S03 in 45° steps (0/45/90/135/180/225/270/315), landing near yaw 270,
  // then fine-tuning 250/260/280/290 against the reference screenshot —
  // yaw 280 matched it closely (same three boats, same banner positions).
  // yaw/pitch then solved from a screen point on the middle boat's hull at
  // that exact heading via Pannellum's own `mouseEventToCoords` projection
  // math — not guessed from the screenshot alone.
  { sceneId: "S03", collectionId: "COL-14", yaw: -54.77, pitch: -24.05 },
  // Client pointed at the same three-boat table as `COL-14` (same yaw ~-55
  // heading, S03's own default landing yaw 0 untouched) — the other two
  // woven-hull canoes on that bench, previously unmarked: a gray one on
  // the left, a tan one on the right. Solved via `mouseEventToCoords`
  // against a temporary defaultYaw override, reverted after verification.
  // Same situation as COL-29..45 (no unused original id left) — added
  // COL-46/47 as new records rather than reusing already-used ids.
  { sceneId: "S03", collectionId: "COL-46", yaw: -87.73, pitch: -20.17 },
  { sceneId: "S03", collectionId: "COL-47", yaw: -30.86, pitch: -19.27 },
  // Client asked for S03's hotspots to also show in S02. Re-scanned S02
  // (client's own screenshot showed `data-current-room-id="S02"` alongside
  // a plain corridor view, prompting a closer look at the dark-bench
  // display already noted — but not confidently matched — in the earlier
  // S01-S15 zone audit). That bench holds two boats: a smooth black-hulled
  // canoe with no weave texture (does not match any of S03's three woven
  // canoes, or any other catalogued collection — left unplaced, same as
  // the earlier audit's conclusion), and a tan woven-basket canoe that
  // matches `COL-47`'s weave pattern and color specifically (distinct from
  // `COL-14`'s dark-brown weave and `COL-46`'s gray weave at the same S03
  // table). Solved via `mouseEventToCoords` against a temporary defaultYaw
  // override, reverted after verification. This is a second placement for
  // `COL-47`; its S03 row above is untouched. `COL-14`/`COL-46`/`COL-02`
  // were also checked against S02 and not found.
  { sceneId: "S02", collectionId: "COL-47", yaw: -55.49, pitch: -6.95 },
  // Client pointed at the same dark bench, this time asking for a hotspot
  // on the smooth black-hulled canoe next to `COL-47` above — the one
  // flagged as unplaced (no weave texture, doesn't match any catalogued
  // collection) in that earlier pass. Since the client is now pointing at
  // it directly rather than asking for a cross-scene match, it gets a
  // hotspot as its own new object. Solved via `mouseEventToCoords` against
  // a temporary defaultYaw override, reverted after verification. Same
  // situation as COL-29..47 (no unused original id left) — added COL-48 as
  // a new record rather than reusing an already-used id.
  { sceneId: "S02", collectionId: "COL-48", yaw: -68.51, pitch: -10.56 },
  // Client flagged a third, smaller boat on the same bench — a
  // reddish-brown model with a raised bow/stern, sitting between `COL-48`
  // (black canoe) and `COL-47` (tan woven canoe), easy to miss since it's
  // partly hidden behind the other two from most angles. Solved via
  // `mouseEventToCoords` against a temporary defaultYaw override, reverted
  // after verification. Same situation as COL-29..48 (no unused original
  // id left) — added COL-49 as a new record rather than reusing an
  // already-used id.
  { sceneId: "S02", collectionId: "COL-49", yaw: -60.0, pitch: -6.95 },
  // Cross-scene visibility audit (client request): systematically checked
  // every collection already placed in S03/S04/S05 against ALL THREE of
  // those scenes' own panoramas (8-direction 45°-step scans of each,
  // cross-referenced against every existing placement's target object),
  // not just the one-directional "does this carry forward" check — to
  // find any collection that's visibly present in a scene it has no
  // placement in yet. Found one: `COL-02` (the wooden galleon on a white
  // pedestal in front of the staircase, already placed at S04/S05/S06 —
  // see F56/F58/F60 below) is ALSO visible from S03, at a greater distance
  // near the same staircase landmark. Confirmed by scanning S03 in 45°
  // steps, spotting the galleon near yaw 60-90, then fine-tuning 44 for
  // framing and solving the exact yaw/pitch from a screen point on its
  // hull via `mouseEventToCoords` — same method as every other placement.
  // This is a fourth placement for `COL-02`, added purely additively: none
  // of its S04/S05/S06 rows (or S03's own COL-14 row above) are touched.
  // Audit also re-confirmed (independently of the existing F58 comment)
  // that `COL-14` itself (S03/S04's three-boat table) does NOT appear
  // anywhere in S05's panorama, and that S05's own COL-03/COL-04/COL-05
  // pedestal displays do NOT appear anywhere in S04's or S03's panoramas —
  // both re-scanned fresh, not just taken on the prior comment's word — so
  // no placement was added for those combinations.
  { sceneId: "S03", collectionId: "COL-02", yaw: 46.22, pitch: -1.27 },
  // F56: S04's own new placement (client request — a distinct object,
  // separate from S03's; S03's own COL-14 placement above is untouched by
  // this addition). Client's reference screenshot showed a large wooden
  // galleon-style ship model (white/tan sails) in front of a staircase.
  // S04's defaultYaw/pitch confirmed still 0/0 (untouched by this change)
  // — that reference view required a drag to reach, same as S03's. Found
  // it by scanning S04 in 45° steps (0/45/90/135/180/225/270/315): yaw 90
  // already matched closely (same ship, same staircase, same fire
  // extinguisher), fine-tuned 75/100/110 against the reference — yaw 100
  // matched it most precisely. yaw/pitch then solved from a screen point
  // on the hull at that exact heading via Pannellum's own
  // `mouseEventToCoords` projection math — not guessed. `COL-02` is a
  // previously-unplaced collection id (no other scene uses it), used here
  // since this ship reads as visually distinct from S03's/S32's models,
  // not a fabricated new Collection record.
  { sceneId: "S04", collectionId: "COL-02", yaw: 80.19, pitch: -10.05 },
  // F57: `COL-14` gets a SECOND placement here, in S04, alongside its
  // existing S03 placement above — neither one is moved or removed.
  // `applyCollectionPlacements` groups placements by `sceneId` only (see
  // its own doc comment below) and has never deduplicated by
  // `collectionId` — nothing needed fixing there; the reason S04 never
  // showed this hotspot before is simply that no S04 entry existed yet,
  // not a dedup bug. S03/S04 are adjacent capture points that both see
  // the same three-boat-miniature display near their shared boundary
  // (same wall banners, same dark table) — confirmed by scanning S04 in
  // 45° steps and finding it again near yaw 180, then fine-tuning
  // 160/170/190/200 to frame it; the boat picked here is the one that
  // best visually matches (by shape/color) the specific boat S03's
  // placement points to, though matching one static photo's specific
  // boat across two very different viewing angles of the same table
  // can't be pixel-certain the way a single-viewpoint placement is —
  // flagged here rather than silently claimed as exact. yaw/pitch solved
  // via the same `mouseEventToCoords` method as every other placement.
  // S04's own defaultYaw/pitch (still 0/0) and its own COL-02 placement
  // above are both untouched by this addition.
  { sceneId: "S04", collectionId: "COL-14", yaw: -137.43, pitch: -16.8 },
  // Client pointed at the same S04 pedestal as `COL-14` (same yaw ~-137 to
  // -155 heading, S04's own default landing yaw 0 untouched) — the other
  // two objects on that same bench, previously unmarked: a gray
  // stone-shaped hull (genuinely rock-like in form, not just color) and a
  // brown woven boat with a spiky/bristled deck decoration, both distinct
  // from `COL-14`'s own tan woven boat further along the same pedestal.
  // Solved via `mouseEventToCoords` against a temporary defaultYaw
  // override, reverted after verification. Same situation as COL-29..49
  // (no unused original id left) — added COL-50/51 as new records rather
  // than reusing already-used ids.
  { sceneId: "S04", collectionId: "COL-50", yaw: -165.7, pitch: -11.28 },
  { sceneId: "S04", collectionId: "COL-51", yaw: -155.31, pitch: -14.12 },
  // F58: `COL-02` gets a THIRD placement here (S04's own placement above is
  // untouched) — S05 is adjacent to S04 and shares a sightline to the same
  // wooden galleon-model display (same staircase visible behind it in both
  // scenes). Confirmed by a full 8-direction scan of S05 (45° steps,
  // 0/45/90/135/180/225/270/315): the ship was clearly visible and
  // unambiguous around yaw 90-135, fine-tuned 100/110/120 for framing.
  // S03's OWN collection (`COL-14`, the three-boat/poster table) was
  // explicitly checked for in that same 8-direction scan and NOT found
  // anywhere in S05's panorama — not guessed, not assumed from scene
  // adjacency alone, and deliberately not placed here as a result. If a
  // future audit finds it after all, add one more row here — never a
  // per-scene special case.
  { sceneId: "S05", collectionId: "COL-02", yaw: 140.2, pitch: -10.58 },
  // F59: client pointed at 3 more views of S05, each showing its OWN
  // display-pedestal object along the same corridor S05's tour walks
  // through — a repeating "small boat/raft on its own pedestal, own
  // wall poster" bay pattern, distinct from S03's three-boat table and
  // S04's galleon (neither of those objects appears in any of these 3
  // views). These are FIRST-time placements, not more sightings of an
  // already-placed collection — same reusable pattern as COL-02's first
  // placement at S04, just newly-unplaced collection ids rather than a
  // repeat one. Found live via a finer ~22.5° scan of S05 filling the
  // gaps between the original 8-direction scan, matched against the
  // client's 3 reference screenshots, then solved via the same
  // `mouseEventToCoords` method.
  { sceneId: "S05", collectionId: "COL-03", yaw: -45.43, pitch: -14.08 },
  { sceneId: "S05", collectionId: "COL-04", yaw: -113, pitch: -23.08 },
  { sceneId: "S05", collectionId: "COL-05", yaw: 44.57, pitch: -14.08 },
  // F60: client pointed at 2 more views, this time in S06 — same repeating
  // pedestal-display corridor pattern as S05, continuing into this scene.
  // Audited whether S03's own collection (`COL-14`, the three-boat/poster
  // table) is visible from S06 first, per the client's explicit ask to
  // keep it visible if so: a full 16-direction scan (8 main + 8 filling
  // the gaps, same method as S05's audit) found NO trace of that table
  // anywhere in S06 — not placed here, same honest non-finding as S05.
  // These 2 are FIRST-time placements for previously-unplaced collection
  // ids, matched against the client's 2 reference screenshots (a
  // boat/raft on a dark table below a "Kisah Pulau Venue" wall poster, and
  // a small item on its own white pedestal), solved via the same
  // `mouseEventToCoords` method.
  { sceneId: "S06", collectionId: "COL-06", yaw: -64.77, pitch: -21.61 },
  { sceneId: "S06", collectionId: "COL-08", yaw: 79.72, pitch: -10.08 },
  // F61's `COL-02` placement here (yaw 162.52/pitch -10.33) removed per
  // direct client request — it never actually sat on the galleon, only on
  // the open floor near it (confirmed live). `COL-02` remains a valid,
  // clickable collection via its S03/S04/S05 placements above/elsewhere;
  // this only removes the one inaccurate S06 sighting, not the collection
  // itself. If a genuinely correct S06 sighting is found later, add a
  // fresh row here rather than guessing a new yaw/pitch for this one.
  // Client pointed at 2 more views in S06. Both required a scan of S06
  // away from its own default landing (yaw 0, untouched by this change):
  // - a slender red-hulled outrigger canoe with thin bamboo/wood outrigger
  //   poles, on its own blue crate near a wooden pillar — found at yaw
  //   ~123.
  // - a matching delicate outrigger canoe (red/pink hull, beaded detail)
  //   on a white pedestal, near a barred window — found at yaw ~-117.
  // Both solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification. Same situation as COL-29..51
  // (no unused original id left) — added COL-52/53 as new records rather
  // than reusing already-used ids.
  { sceneId: "S06", collectionId: "COL-52", yaw: 122.8, pitch: -18.96 },
  { sceneId: "S06", collectionId: "COL-53", yaw: -117.48, pitch: -17.76 },
  // F62: client pointed at 2 views in S07 — same reusable pattern as
  // S05/S06 (first-time placements for previously-unplaced collection
  // ids). One (the large wooden galleon, tan/white sails, blue flag) was
  // already partly visible in S07's own default landing (yaw 16,
  // untouched by this change); the other (a small sailboat on its own
  // white pedestal, next to a barred window and an AC unit) required a
  // scan — found near yaw -90. Both solved via the same
  // `mouseEventToCoords` method against S07's live landing heading.
  { sceneId: "S07", collectionId: "COL-09", yaw: 72.7, pitch: -11.98 },
  { sceneId: "S07", collectionId: "COL-10", yaw: -75.99, pitch: -18.99 },
  // Client pointed at 2 more views in S07, near the "...au Venue" wall
  // poster — both required a scan of S07 away from its own default
  // landing (yaw 16, untouched by this change):
  // - a small yellow/orange outrigger boat on a white pedestal — found at
  //   yaw ~-142.
  // - a larger dark red/brown outrigger boat on its own dark bench, right
  //   next to it — found at yaw ~-124.
  // Both solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification. Same situation as COL-29..53
  // (no unused original id left) — added COL-54/55 as new records rather
  // than reusing already-used ids.
  { sceneId: "S07", collectionId: "COL-54", yaw: -142.18, pitch: -10.66 },
  { sceneId: "S07", collectionId: "COL-55", yaw: -124.14, pitch: -14.21 },
  // Cross-scene visibility audit (client request), continuing the same
  // method used for S03-S05, this time on S06-S07-S08-S10 (S09 is
  // excluded from the tour topology entirely — see EXCLUDED_SCENE_IDS —
  // so S08->S10 is the real adjacent hop, not S08->S09). Fresh 8-direction
  // 45°-step scans of all 4 scenes, cross-checking every existing
  // placement's actual object against every other scene in the range, not
  // just a one-directional forward check:
  // - `COL-09` (S07's large tan-sailed galleon, above) is ALSO visible
  //   from S08, further down the same hall — found scanning S08 near yaw
  //   135-180, fine-tuned to 160, solved via `mouseEventToCoords`. This is
  //   a second placement for `COL-09`; its S07 row above is untouched.
  // - No other cross-visibility found in this range: `COL-02`/`COL-06`/
  //   `COL-08` (S06) do not appear in S07's panorama; `COL-10` does not
  //   appear in S06 or S08; `COL-07`/`COL-11` (S08) do not appear in S07's
  //   or S10's panoramas; `COL-23` (S10) does not appear in S08's
  //   panorama. Each checked by full 8-direction scan, not assumed from
  //   scene adjacency.
  { sceneId: "S08", collectionId: "COL-09", yaw: 158.41, pitch: -9.13 },
  // COL-56 ("Perahu Layar Krem Kecil") previously had one placement here
  // at yaw 136.54 — client review found it floating in mid-air between
  // `COL-09`'s golden ship and the small cream-sailed boat it was meant to
  // mark (confirmed via a live screenshot at yaw ~145: the marker sat in
  // open space between the two, on neither), and asked for it removed
  // outright rather than repositioned (same instruction pattern as the
  // earlier S06/COL-02 removal above). COL-56 currently has no other
  // placement in any scene, so it's now unreachable in the tour — left in
  // `COLLECTION_RECORDS` rather than deleted, since removing the record
  // itself wasn't asked for.
  // Client pointed at 1 more view in S08 — a small wooden sailboat model
  // (cream/tan sail, blue-striped hull) on its own tall white cube
  // pedestal, next to a floor-standing AC unit and in front of a barred
  // window, further down the same display run from `COL-56` (dark round
  // base) and `COL-09`'s golden ship. Required a scan of S08 away from its
  // own default landing (yaw 25.82, untouched by this change); found at
  // yaw ~-100. Solved via `mouseEventToCoords` against a temporary
  // defaultYaw override, reverted after verification. Client's first-pass
  // review found the initial ~-100/-10 placement floating on the AC unit
  // wall, well off the boat — re-solved with the camera pinned at a fixed
  // reference yaw and the target screen pixel read off the model's blue
  // hull stripe (color-sampled, not eyeballed) for the final yaw/pitch
  // below; re-verified against the same fixed reference until the marker
  // rendered on the hull itself. Same situation as COL-29..56 (no unused
  // original id left) — added COL-57 as a new record rather than reusing
  // an already-used id.
  { sceneId: "S08", collectionId: "COL-57", yaw: -121.63, pitch: -6.19 },
  // Client pointed at 1 view in S10 — a small wooden boat model on its own
  // dark pedestal, in front of the "Legenda Ikan Duyung dan Burung Tahoko"
  // wall poster next to a barred window. Required a scan of S10 beyond the
  // default landing heading (S10's own defaultYaw of 30, untouched by this
  // change); found at yaw ~-75, solved via `mouseEventToCoords` against a
  // temporary defaultYaw override, reverted after verification. Reused an
  // existing unused Collection id (COL-23) rather than inventing a new
  // record, per the established rule.
  { sceneId: "S10", collectionId: "COL-23", yaw: -75.23, pitch: -21.61 },
  // COL-58 ("Perahu Layar Cokelat Kemerahan") and COL-59 ("Perahu Layar
  // Hijau") previously each had one placement here, on the two boats
  // sharing the blue display pedestal in S10's default landing view.
  // Client reviewed both live (yaw 39.74/69.67 and 55/83.24 respectively,
  // both verified on-hull via `getBoundingClientRect()` before this) and
  // asked for both removed. Neither collection has any other placement in
  // any scene, so both are now unreachable in the tour — left in
  // `COLLECTION_RECORDS` rather than deleted, since removing the records
  // themselves wasn't asked for (same handling as `COL-56` above).
  // COL-12 ("Perahu Biru Merah") and COL-13 ("Perahu Merah Biru")
  // previously each had one placement here — the small sailboat on the
  // dark table near the "Para Nelayan..." wall poster, and the boat on
  // its own blue pedestal further down the hall, both visible together in
  // S11's own default landing view. Client reviewed both live and asked
  // for both removed. Neither collection has any other placement in any
  // scene, so both are now unreachable in the tour — left in
  // `COLLECTION_RECORDS` rather than deleted, since removing the records
  // themselves wasn't asked for (same handling as `COL-56`/`COL-58`/
  // `COL-59` above).
  // Follow-up: client pointed at 2 more views in S11, distinct from the
  // F65 pair above. Both objects required a scan of S11 beyond the default
  // landing heading (S11's own defaultYaw of 47, untouched by this change):
  // a colorful ship sharing the same blue pedestal as COL-13 (found at
  // yaw ~144, a scan-and-refine using `mouseEventToCoords` against a
  // temporary defaultYaw override, reverted after verification), and a
  // large wooden double-outrigger canoe with a tan/burlap sail further
  // down the hall (found at yaw ~-62, same method). Reused two existing
  // unused Collection ids (COL-21/COL-22) rather than inventing new
  // records, per the established rule.
  { sceneId: "S11", collectionId: "COL-21", yaw: 144.19, pitch: -18.61 },
  { sceneId: "S11", collectionId: "COL-22", yaw: -62.52, pitch: -23.72 },
  // F66: client pointed at 2 views in S12 — same reusable pattern. One
  // object (a large wooden ship on a blue pedestal) was already visible in
  // S12's own default landing (yaw 50, untouched by this change) — no scan
  // needed, solved directly from a screen point at that live heading via
  // `mouseEventToCoords`.
  //
  // F66 correction: the OTHER original F66 target (yaw 21.63/pitch 0.31)
  // was wrong — that point landed on empty walkway floor between the
  // camera and a distant colorful-flag boat, not on any object at all.
  // Client's actual reference was a different photo entirely: a blue-
  // hulled boat on a black pedestal, under a "Laut, Ibu Para Nelayan di
  // Lamalera" wall poster. Required a scan away from S12's own default
  // landing — found near yaw -38 (poster text fully legible, confirms the
  // match), refined to a precise point on the hull via
  // `mouseEventToCoords`. Still `COL-15`, same row — corrected in place,
  // not a new placement.
  { sceneId: "S12", collectionId: "COL-15", yaw: -37.89, pitch: -16.51 },
  { sceneId: "S12", collectionId: "COL-16", yaw: 95.62, pitch: -12.18 },
  // COL-60 ("Perahu Layar Krem Kembar") and COL-61 ("Perahu Layar Krem
  // Tunggal") previously each had one placement here, on the left and
  // right blue display pedestals further down the hall from S12's own
  // default landing. Despite passing `getBoundingClientRect()`
  // verification against each one's own calibration camera at the time,
  // client review found both actually rendering on wooden ceiling pillars
  // in front of the boats, not on the boats themselves, and asked for
  // both removed. Neither collection has any other placement in any
  // scene, so both are now unreachable in the tour — left in
  // `COLLECTION_RECORDS` rather than deleted, since removing the records
  // themselves wasn't asked for (same handling as `COL-56`/`COL-58`/
  // `COL-59`/`COL-12`/`COL-13` above).
  // Cross-scene visibility audit (client request), continuing the same
  // method used for S03-S05 and S06-S10, this time on S11-S12-S14-S15
  // (S13 is excluded from the tour topology — see EXCLUDED_SCENE_IDS — so
  // S12->S14 is the real adjacent hop). Fresh 8-direction 45°-step scans
  // of all 4 scenes, cross-checking every existing placement's actual
  // object against every other scene in the range:
  // - `COL-16` (S12's tall ship on its own blue pedestal, above) is ALSO
  //   visible from S14, down a long straight sightline near yaw 195-210 —
  //   same staircase-adjacent blue-pedestal display, confirmed by the same
  //   ship silhouette/rigging. Solved via `mouseEventToCoords`. This is a
  //   second placement for `COL-16`; its S12 row above is untouched.
  { sceneId: "S14", collectionId: "COL-16", yaw: -148.05, pitch: -8.74 },
  // F67 correction: the first F67 target (yaw 101.4/pitch -9.13, a single
  // tan-hulled boat with a cream sail on a white/wood-panel pedestal) was
  // the WRONG object — client clarified their reference was a different
  // photo entirely: a yellow multi-flag boat + a smaller brown boat
  // together on a white pedestal, next to a barred window, under a
  // "Pantangan Makan Ikan Moa" wall poster. That required a scan away
  // from S14's own default landing (yaw 63, untouched by this change) —
  // found near yaw -37 (poster text fully legible, confirms the match),
  // then refined to a precise point on the yellow boat's hull via
  // `mouseEventToCoords`. Still `COL-17`, same row — corrected in place,
  // not a new placement.
  { sceneId: "S14", collectionId: "COL-17", yaw: -32.68, pitch: -18.05 },
  // Cross-scene visibility audit continued: `COL-17` (S14's yellow
  // multi-flag boat under the "Pantangan Makan Ikan Moa" poster, above) is
  // ALSO visible from S15, down a long straight sightline near yaw
  // 235-245 — the same poster title fully legible from that distance,
  // confirming the match. Solved via `mouseEventToCoords`. This is a
  // second placement for `COL-17`; its S14 row above is untouched. No
  // other cross-visibility found across S11/S12/S14/S15: `COL-12`/
  // `COL-13`/`COL-21`/`COL-22` (S11) do not appear in S12's panorama;
  // `COL-15` (S12) does not appear in S11's or S14's panoramas; `COL-18`/
  // `COL-19` (S15) do not appear in S14's panorama. Each checked by full
  // 8-direction scan, not assumed from scene adjacency.
  { sceneId: "S15", collectionId: "COL-17", yaw: -96.6, pitch: -10.14 },
  // F68: S15 previously had its collection hotspot deliberately removed
  // (F35 — "S15 should show only its navigation-to-S18 hotspot, no
  // collection hotspot"). That decision is explicitly reversed here per a
  // direct, confirmed client request (client was shown the conflict and
  // chose to add hotspots anyway) — S15's navigation-to-S18 hotspot (see
  // `DEV_SCENE_LINK_PLACEMENTS`) is untouched, this only adds collection
  // hotspots alongside it, which coexist fine (different hotspot types,
  // no shared identity). Both objects (a white-sailed boat on a dark
  // table with a blue accent strip, next to a "Pantangan..." wall poster;
  // and a tan-hulled boat with a cream sail on its own white pedestal)
  // required a scan of S15 away from its own default landing (yaw 47,
  // untouched by this change) — found near yaw -47 and yaw 153
  // respectively, solved via `mouseEventToCoords`.
  { sceneId: "S15", collectionId: "COL-18", yaw: -48.4, pitch: -12.19 },
  { sceneId: "S15", collectionId: "COL-19", yaw: 154.16, pitch: -10.67 },
  // COL-24 ("Kapal Layar Putih") previously had one placement here — a
  // teal-hulled boat with red trim on a low white stand, in front of two
  // salmon-colored "Legenda..." wall posters. Client review found this is
  // the exact same physical boat as `COL-25` ("Kapal Layar Salib", below,
  // yaw ~154) — a duplicate from earlier work — and asked for only one
  // hotspot kept on it. Removed this one rather than `COL-25`, since
  // `COL-25` is the identity already tracked across both S18 and S19 for
  // this boat (see its own comment below); keeping it here preserves that
  // cross-scene link instead of breaking it. COL-24 has no other
  // placement in any scene, so it's now unreachable in the tour — left in
  // `COLLECTION_RECORDS` rather than deleted, since removing the record
  // itself wasn't asked for (same handling as `COL-56`/etc. above).
  // Cross-scene visibility audit (client request), continuing the same
  // method used for S03-S05/S06-S10/S11-S15, this time on S18-S19-S20
  // (S16/S17 are excluded from the tour topology — see
  // EXCLUDED_SCENE_IDS — so they're not audited as active scenes). Fresh
  // 8-direction 45°-step scans of all 3 scenes, cross-checking every
  // existing placement's actual object against every other scene in the
  // range. S18 and S19 turned out to share a long straight sightline down
  // the same corridor, so THREE of S19's own collections are also visible
  // from S18, far down the hall near the "Legenda Danau Lipan" poster
  // cluster:
  // - `COL-25` (S19's small blue-hulled canoe with red mast, below) — found
  //   from S18 near yaw 154-165, solved via `mouseEventToCoords`. Second
  //   placement; S19's own row is untouched.
  // - `COL-26` (S19's yellow-sailed boat on a white pedestal, below) —
  //   found from S18 near yaw -155. Second placement; S19's row untouched.
  // - `COL-27` (S19's golden wooden ship with two small flags, below) —
  //   found from S18 near yaw -108. Second placement; S19's row untouched.
  { sceneId: "S18", collectionId: "COL-25", yaw: 154.62, pitch: -28.18 },
  { sceneId: "S18", collectionId: "COL-26", yaw: -155.38, pitch: -3.79 },
  { sceneId: "S18", collectionId: "COL-27", yaw: -107.9, pitch: -5.64 },
  // Client pointed at 1 more view in S18 — a small red/blue canoe model
  // on its own red wooden stool, on a dark bench near `COL-26`'s yellow
  // item. First attempt (yaw ~156, near the "Legenda Danau Lipan" poster)
  // was wrong — client review found it floating on the poster instead,
  // pointing at a *different* screenshot of the actual target; re-solved
  // via `mouseEventToCoords` against a temporary defaultYaw override
  // (yaw ~-145 this time), reverted after verification. Same situation as
  // COL-29..61 (no unused original id left) — added COL-62 as a new
  // record rather than reusing an already-used id.
  //
  // Correction: client's reference screenshot of the live S18 landing view
  // showed this marker still off — sitting on the wall behind the pedestal,
  // not on the boat itself. Re-solved via `mouseEventToCoords` against a
  // temporary click-to-DOM-badge instrumentation on the real S18 landing
  // view (S15 -> scene-link -> S18, no drag), clicked directly on the red/
  // blue hull's body (verified against a cropped/zoomed screenshot before
  // clicking, and against a crosshair overlay after), reverted after
  // verification. Confirmed same hotspot (not a new one) by also reading
  // the coordinates at the old marker's own on-screen position (~-172.72/
  // -12.19), close to the prior -175.67/-8.67 value.
  { sceneId: "S18", collectionId: "COL-62", yaw: -172.87, pitch: -13.12 },
  // Client pointed at 3 views in S19. All required a scan of S19 away from
  // its own default landing (yaw -132, untouched by this change):
  // - a small blue-hulled canoe with red mast on its own dark bench, in
  //   front of the "Legenda Danau Lipan" wall poster, next to a barred
  //   window — found at yaw ~153.
  // - a yellow-sailed boat on a white pedestal, in front of the "Pandai
  //   Besi..." wall poster — found at yaw ~176.
  // - a wooden ship with a small yellow flag and a small red flag on its
  //   bow/stern posts, on its own wood-topped pedestal further down the
  //   hall — found at yaw ~-82.
  // All three solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification (an initial pixel-pick for the
  // third one landed on empty floor between displays and was corrected in
  // place after re-scanning). Reused three existing unused Collection ids
  // (COL-25/26/27) rather than inventing new records, per the established
  // rule.
  { sceneId: "S19", collectionId: "COL-25", yaw: 153.21, pitch: -18.99 },
  { sceneId: "S19", collectionId: "COL-26", yaw: 176.33, pitch: -9.08 },
  { sceneId: "S19", collectionId: "COL-27", yaw: -81.59, pitch: -16.8 },
  // Client pointed at 3 views in S20. All required a scan of S20 away from
  // its own default landing (yaw -8.22/pitch -2.5/hfov 115.58, untouched
  // by this change), except one which was already the default landing:
  // - a ship model on a black pedestal, in front of the "Pandai Besi, Ikan
  //   Gabus, dan Laron" wall poster — found at yaw ~-98.
  // - a boat with a cream/white sail on a light wood pedestal — found at
  //   yaw ~116.
  // - a small boat on its own blue pedestal, further down the hall —
  //   already visible in S20's own default landing, no scan needed.
  // All three solved via `mouseEventToCoords` against (temporary, for the
  // first two) defaultYaw overrides, reverted after verification. All 28
  // originally-supplied Collection ids (COL-01..28) were already assigned
  // to a placement by this point, so — unlike every prior addition in this
  // file — there was no unused id left to reuse; asked the client, who
  // confirmed adding new collection records (COL-29/30/31) rather than
  // pointing a new placement at an already-used id.
  { sceneId: "S20", collectionId: "COL-29", yaw: -97.66, pitch: -16.45 },
  { sceneId: "S20", collectionId: "COL-30", yaw: 116.37, pitch: -12.47 },
  { sceneId: "S20", collectionId: "COL-31", yaw: 11.39, pitch: -7.92 },
  // Follow-up: client pointed at 1 more view in S20 — a wooden outrigger
  // boat with a white sail and red/blue trim on the same dark bench as
  // COL-29, near the AC unit. Required a scan of S20 away from its own
  // default landing (yaw -8.22, untouched by this change); found at
  // yaw ~-62, solved via `mouseEventToCoords` against a temporary
  // defaultYaw override, reverted after verification. Same situation as
  // COL-29/30/31 (no unused original id left) — added COL-32 as a new
  // record rather than reusing an already-used id.
  { sceneId: "S20", collectionId: "COL-32", yaw: -59.61, pitch: -16.58 },
  // Cross-scene visibility audit continued: `COL-26` (S19's yellow-sailed
  // boat on a white pedestal, near the "Legenda Danau Lipan" poster — also
  // already placed a second time in S18, above) is ALSO visible from S20,
  // down the same long corridor sightline, near yaw 160-175 — poster text
  // fully legible from that distance, confirming the match. Solved via
  // `mouseEventToCoords`. This is a third placement for `COL-26`; its S19
  // and S18 rows above are untouched. No other cross-visibility found in
  // this range: `COL-24` (S18) does not appear in S19's panorama;
  // `COL-25`/`COL-27` (S19) do not appear in S20's panorama; none of
  // S20's own `COL-29`/`COL-30`/`COL-31`/`COL-32` appear in S19's
  // panorama. Each checked by full 8-direction scan, not assumed from
  // scene adjacency.
  { sceneId: "S20", collectionId: "COL-26", yaw: -134.37, pitch: -11.23 },
  // Correction: COL-20's original placement (yaw 270/pitch -8, generic F4-
  // era default, never re-checked against S23's actual room layout) put
  // the marker on the wall poster above the boat, not on the boat itself.
  // Client's screenshot showed the dot sitting on the wall — re-scanned
  // S23 at that same yaw~270 heading and found the actual target (a
  // colorful dragon-prow canoe on the floor below the poster) via
  // `mouseEventToCoords` against a temporary defaultYaw override, reverted
  // after verification. Corrected this same COL-20 row in place, not a new
  // placement.
  { sceneId: "S23", collectionId: "COL-20", yaw: -109.25, pitch: -33.64 },
  // Client pointed at 1 more view in S23 — 2 small boat models on their
  // own blue pedestal, further down the hall. Required a scan of S23 away
  // from its own default landing (yaw -19.18, untouched by this change);
  // found at yaw ~17, solved via `mouseEventToCoords` against a temporary
  // defaultYaw override, reverted after verification. Same situation as
  // COL-29..32 (no unused original id left) — added COL-33 as a new record
  // rather than reusing an already-used id.
  { sceneId: "S23", collectionId: "COL-33", yaw: 17.47, pitch: -2.0 },
  // Client pointed at a large three-mast tall ship (cream sails, brown
  // wooden hull) on its own dedicated blue pedestal, further down S23's
  // hall from COL-20/COL-33 above — neither of those matches (>100° away
  // from each, confirmed live). Required a scan/drag of S23 away from its
  // own default landing (yaw -19.18, untouched by this change); found at
  // yaw ~124, solved via `mouseEventToCoords` clicked directly on the
  // hull's body (verified against a cropped/zoomed screenshot and a
  // crosshair overlay). No existing collection record matched this object
  // (checked against every other "large ship on blue pedestal" placement
  // in this file — all in Zone A or S26, a different physical location
  // from S23 — see getZoneForSceneId). Added COL-63 as a new record.
  { sceneId: "S23", collectionId: "COL-63", yaw: 123.87, pitch: -13.18 },
  // Client pointed at 1 view in S25 — a colorful outrigger canoe (red/blue
  // striped hull, flag-striped mast, cream sail), in front of two framed
  // wall posters near a barred window. Required a scan of S25 away from
  // its own default landing (yaw -15.53, untouched by this change); found
  // at yaw ~-116, solved via `mouseEventToCoords` against a temporary
  // defaultYaw override, reverted after verification. Same situation as
  // COL-29..33 (no unused original id left) — added COL-34 as a new record
  // rather than reusing an already-used id.
  { sceneId: "S25", collectionId: "COL-34", yaw: -115.95, pitch: -32.91 },
  // Client pointed at the single-mast, white-sailed wooden ship on its own
  // blue pedestal, visible right at S25's own default landing (yaw -15.53,
  // untouched). Distinct from `COL-34` above (138° apart, different
  // object/description). Also checked against S26's `COL-35` ("large
  // wooden ship, white sails, own blue pedestal" — superficially similar
  // wording) — this file's own cross-scene audit below already confirmed
  // COL-35 does NOT appear in S25's panorama, ruling out reuse. Solved via
  // `mouseEventToCoords` clicked directly on the hull's mid-body (verified
  // against a cropped/zoomed screenshot and a crosshair overlay). Same
  // situation as COL-29..63 (no unused original id left) — added COL-64 as
  // a new record.
  { sceneId: "S25", collectionId: "COL-64", yaw: 22.19, pitch: -8.55 },
  // Client pointed at a second blue pedestal in S25 (separate from COL-64's
  // own, ~100-115° away — confirmed via a live 360° scan that COL-64's
  // pedestal only ever shows 1 boat) holding 2 small junk-style boats side
  // by side. Required panning well away from S25's own default landing
  // (yaw -15.53, untouched) to frame cleanly. Solved via `mouseEventToCoords`
  // clicked directly on each hull's body (verified against a cropped/zoomed
  // screenshot and a crosshair overlay for both). Neither matches COL-34
  // (outrigger canoe) or COL-64 (single plain-sail ship) — both new records.
  { sceneId: "S25", collectionId: "COL-65", yaw: 127.75, pitch: -14.88 },
  { sceneId: "S25", collectionId: "COL-66", yaw: 135.94, pitch: -13.27 },
  // Cross-scene visibility audit (client request), continuing the same
  // method used for S03-S05/S06-S10/S11-S15/S18-S20, this time on
  // S23-S25-S26-S28-S29-S30-S31-S32 (S21/S22/S24/S27 excluded — see
  // EXCLUDED_SCENE_IDS — not audited as active scenes). Fresh 8-direction
  // 45°-step scans of all 8 scenes, cross-checking every existing
  // placement's actual object against every other scene in the range:
  // - `COL-34` (S25's colorful outrigger canoe, above) is ALSO visible
  //   from S26, down a long sightline near yaw 235-245 — the "Raja dan
  //   Tujuh Istri" poster fully legible from that distance, same as it was
  //   in S25, confirming the match. Solved via `mouseEventToCoords`. This
  //   is a second placement for `COL-34`; its S25 row above is untouched.
  { sceneId: "S26", collectionId: "COL-34", yaw: -132.86, pitch: -11.18 },
  // Client pointed at 2 views in S26. Both required a scan of S26 away
  // from its own default landing (yaw 21.31, untouched by this change):
  // - a large wooden ship with white sails on its own blue pedestal —
  //   found at yaw ~65.
  // - a small light-colored wooden ship on a dark bench, in front of a
  //   barred window — found at yaw ~-66.
  // Both solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification. Same situation as COL-29..34
  // (no unused original id left) — added COL-35/36 as new records rather
  // than reusing already-used ids.
  { sceneId: "S26", collectionId: "COL-35", yaw: 95.51, pitch: -19.94 },
  { sceneId: "S26", collectionId: "COL-36", yaw: -65.52, pitch: -24.6 },
  // Client pointed at 3 views in S28. All required a scan of S28 away from
  // its own default landing (yaw 55.1, untouched by this change):
  // - a colorful boat decorated with paper flags, under the "Hikayat
  //   Datuk Hitam dan Bajak Laut" wall poster — found at yaw ~-62.
  // - a large golden wooden ship with tall masts on its own white pedestal
  //   — found at yaw ~157.
  // - a small boat with a red/orange roof, on a dark bench — found at
  //   yaw ~16.
  // All three solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification. Same situation as COL-29..36
  // (no unused original id left) — added COL-37/38/39 as new records
  // rather than reusing already-used ids.
  { sceneId: "S28", collectionId: "COL-37", yaw: -61.94, pitch: -21.66 },
  { sceneId: "S28", collectionId: "COL-38", yaw: 157.16, pitch: -11.22 },
  { sceneId: "S28", collectionId: "COL-39", yaw: 16.3, pitch: -13.08 },
  // Client pointed at 2 views in S29. Both required a scan of S29 away
  // from its own default landing (yaw 56.32, untouched by this change):
  // - a small orange/tan boat on a white pedestal, under the "Danau Laut
  //   Tador" wall poster, next to a blue crate — found at yaw ~2.
  // - a small item in its own glass display case, near an AC unit —
  //   found at yaw ~117.
  // Both solved via `mouseEventToCoords` against temporary defaultYaw
  // overrides, reverted after verification. Same situation as COL-29..39
  // (no unused original id left) — added COL-40/41 as new records rather
  // than reusing already-used ids.
  { sceneId: "S29", collectionId: "COL-40", yaw: 1.6, pitch: -18.6 },
  { sceneId: "S29", collectionId: "COL-41", yaw: 118.78, pitch: -9.13 },
  // Client pointed at 2 more views in S29, both requiring a scan away from
  // its own default landing (yaw 56.32, untouched) and away from COL-40/41
  // above (>45° apart from each, different objects/pedestals entirely):
  // - the long red/blue-hulled boat with a brown wooden roof/cabin, on its
  //   own black pedestal.
  // - the large carved wooden tall ship, cream/white multi-sail rig, on its
  //   own white-and-wood pedestal.
  // Both solved via `mouseEventToCoords` clicked directly on each hull's
  // body (verified against cropped/zoomed screenshots and crosshair
  // overlays for both).
  { sceneId: "S29", collectionId: "COL-67", yaw: -44.5, pitch: -25.31 },
  { sceneId: "S29", collectionId: "COL-68", yaw: -158.32, pitch: -7.06 },
  // Client pointed at 2 views in S30, this time supplying the exact live
  // yaw/pitch/hfov the client's own view was at (read off a debug overlay)
  // instead of only a screenshot — used those exact camera parameters with
  // `mouseEventToCoords` on the object's screen position in each shot,
  // rather than re-scanning S30 from scratch. Both required moving away
  // from S30's own default landing (yaw 34.09, untouched by this change):
  // - a wooden ship model in its own glass case on a blue pedestal, near a
  //   window — client's view was at yaw -30.26/pitch -2.52/hfov 68.57;
  //   object solved to yaw ~-34.
  // - an unfinished/frame-only outrigger canoe (bare wood poles, no hull
  //   panels yet) on a dark bench — client's view was at yaw 113.81/pitch
  //   -12.75/hfov 68.57; object solved to yaw ~110.
  // Same situation as COL-29..41 (no unused original id left) — added
  // COL-42/43 as new records rather than reusing already-used ids.
  { sceneId: "S30", collectionId: "COL-42", yaw: -33.94, pitch: -17.4 },
  { sceneId: "S30", collectionId: "COL-43", yaw: 110.02, pitch: -17.07 },
  // Client pointed at 2 more views in S30, both requiring a scan away from
  // its own default landing (yaw 34.09, untouched) and away from COL-42/43
  // above (>45° apart from each, different objects/pedestals entirely):
  // - a small, long orange/white-hulled boat on its own black pedestal.
  // - a small blue/red-hulled boat with a tan wooden roof, on its own
  //   narrow white pedestal/vitrine.
  // Both solved via `mouseEventToCoords` clicked directly on each hull's
  // body (verified against cropped/zoomed screenshots and crosshair
  // overlays for both).
  { sceneId: "S30", collectionId: "COL-69", yaw: -94.31, pitch: -17.0 },
  { sceneId: "S30", collectionId: "COL-70", yaw: 159.32, pitch: -7.66 },
  // Client pointed at 2 views in S31, again supplying the exact live
  // yaw/pitch/hfov from the debug overlay for each shot — used those exact
  // camera parameters with `mouseEventToCoords` on the object's screen
  // position, same method as S30's COL-42/43. Both required moving away
  // from S31's own default landing (yaw 28.61, untouched by this change):
  // - a yellow/orange boat on a dark bench, in front of the "Beungong
  //   Meulu dan Beungong Peunek" wall poster — client's view was at
  //   yaw -41.14/pitch 0.00/hfov 65.78; object solved to yaw ~-44.
  // - a golden wooden ship model on its own low bench — client's view was
  //   at yaw 81.15/pitch 6.95/hfov 106.52; object solved to yaw ~76.
  // Same situation as COL-29..43 (no unused original id left) — added
  // COL-44/45 as new records rather than reusing already-used ids.
  { sceneId: "S31", collectionId: "COL-44", yaw: -48.47, pitch: -18.91 },
  { sceneId: "S31", collectionId: "COL-45", yaw: 83.95, pitch: 0.31 },
  // Client pointed at 2 more views in S31, both requiring a scan away from
  // its own default landing (yaw 28.61, untouched) and away from COL-44/45
  // above (>55° apart from each, different objects/pedestals entirely):
  // - an unfinished-style woven-wood-frame ship with a small cabin, on its
  //   own blue pedestal, near the "Danau Laut Tador" wall poster.
  // - a small dark-hulled boat with two crossed wooden oars, on its own
  //   black pedestal.
  // Both solved via `mouseEventToCoords` clicked directly on each hull's
  // body (verified against cropped/zoomed screenshots and crosshair
  // overlays for both).
  { sceneId: "S31", collectionId: "COL-71", yaw: -106.33, pitch: -12.65 },
  { sceneId: "S31", collectionId: "COL-72", yaw: 174.34, pitch: -11.55 },
  // Cross-scene visibility audit continued: `COL-44` (S31's yellow boat
  // with blue/orange accents, under the "Beungong Meulu dan Beungong
  // Peunek" poster, above) is ALSO visible from S32, near yaw 295 — the
  // same poster title fully legible from that distance, confirming the
  // match. Solved via `mouseEventToCoords`. This is a second placement for
  // `COL-44`; its S31 row above is untouched. No other cross-visibility
  // found across S23/S25/S26/S28/S29/S30/S31/S32: `COL-20`/`COL-33` (S23)
  // do not appear in S25's panorama; `COL-35`/`COL-36` (S26) do not appear
  // in S25's or S28's panoramas; `COL-37`/`COL-38`/`COL-39` (S28) do not
  // appear in S26's or S29's panoramas; `COL-40`/`COL-41` (S29) do not
  // appear in S28's or S30's panoramas; `COL-42`/`COL-43` (S30) do not
  // appear in S29's or S31's panoramas; `COL-45` (S31) does not appear in
  // S30's or S32's panoramas; `COL-28` (S32) does not appear in S31's
  // panorama. Each checked by full 8-direction scan, not assumed from
  // scene adjacency. A recurring unfinished/wicker-frame boat display on
  // its own blue pedestal was seen repeatedly near S29/S30/S31/S32 (each
  // time next to a different wall poster) but does not match any of this
  // range's 15 existing collections closely enough to be the same
  // physical object with confidence — left unplaced per the "must
  // genuinely be the same collection, not just similar" rule, rather than
  // guessing.
  { sceneId: "S32", collectionId: "COL-44", yaw: -108.65, pitch: -14.28 },
  // F52: S32's placement was yaw 90/pitch -8 (generic F4-era default,
  // never re-checked against S32's actual room layout) — that put the
  // marker floating in empty floor space, not on any object. Panned S32
  // live (430x932) to find the large ship-model display ("Kapal Layar
  // Putih Besar" — matches COL-28) at yaw ~134, then solved this exact
  // yaw/pitch from a screen point on its hull via Pannellum's own
  // `mouseEventToCoords` projection math — not guessed.
  //
  // F53 correction (reverted): briefly moved this to yaw 26.7/pitch -4.35
  // chasing a "must be visible on landing without drag" requirement that
  // turned out to be a mix-up — the client's actual target for that
  // requirement was S03, not S32 (see S03's own placement below). That
  // position sat on an unconfirmed, blurry distant shape, not verifiably
  // the ship at all. Reverted back to the F52 value below, which IS
  // confirmed on the real ship, even though it needs a drag to reach from
  // S32's own landing heading (yaw 28.61) — no "visible without drag"
  // requirement actually applies to S32.
  { sceneId: "S32", collectionId: "COL-28", yaw: 156.57, pitch: -6.06 },
];

/**
 * Appends collection hotspots onto whichever rooms `placements` name —
 * purely additive over the already-built sequential chain. Never touches
 * `previousSceneId`/`nextSceneId` or the navigation hotspots a room
 * already has, so the locked S01–S32 topology cannot be affected by this
 * step even in principle.
 *
 * F57: `placements` is a flat list of `{ sceneId, collectionId, yaw,
 * pitch }` rows, grouped ONLY by `sceneId` below — there has never been,
 * and must never be, any grouping/deduplication by `collectionId` alone.
 * The same `collectionId` can and does appear in more than one row (one
 * physical object visible from more than one scene/viewpoint, e.g.
 * COL-14 at both S03 and S04): each row is its own independent hotspot,
 * because real placement identity is the (sceneId, collectionId, yaw,
 * pitch) row itself, not the collection id in isolation. Two rows sharing
 * a `sceneId` also both survive (see `collectionHotspots` below, keyed by
 * array index, not by `collectionId`) — a single scene can show several
 * collections' hotspots at once. Adding a collection to a new scene/
 * viewpoint is always just one more row here — never a per-scene special
 * case in `applyCollectionPlacements`, `buildHotspotConfig`, or any
 * component.
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

/**
 * F32: explicit in-scene link to another scene via a hotspot, rather than
 * the fixed Next button (S15's forward navigation is intentionally
 * hotspot-only — see PanoramaViewer's `hideNext`). Kept as its own list,
 * same pattern as `DEV_COLLECTION_PLACEMENTS`, so it stays independently
 * swappable.
 *
 * F33 correction: target changed from S16 to S18. S16/S17 are excluded
 * from the tour topology entirely (client decision, unchanged by this
 * hotspot) — the earlier F32 version briefly special-cased S16 back into
 * `rooms` as an explicit-target-only scene so this hotspot could reach it;
 * that was wrong given S16 must stay fully excluded, so this hotspot now
 * targets S18 — the real next scene in the effective S14->S15->S18
 * topology — instead.
 *
 * F34: repositioned off the cream display cabinet (yaw 175/pitch -30, ~130°
 * off S15's own landing heading — required panning to even see) onto the
 * long central wooden pillar that's already in frame at S15's own landing
 * view (yaw 47), per client feedback wanting a "path forward" marker on the
 * structural column rather than tied to a display object. Found by the same
 * verified method each time: `mouseEventToCoords` (Pannellum's own
 * screen-point -> yaw/pitch projection, ported to Python) applied to a
 * screen point on the pillar in a live 430x932 render at S15's landing
 * heading, not guessed from a screenshot. Landed at yaw 80/pitch 2 first
 * (a point on the pillar just above COL-14's own marker), then nudged to
 * pitch 9.5 after checking the two hotspots' on-screen bounding boxes came
 * within ~4px of touching — now ~25px clear of COL-14 (yaw 90/pitch -8, see
 * `DEV_COLLECTION_PLACEMENTS`, untouched by this change) and clear of the
 * steel bracket joint above it on the pillar.
 */
type SceneLinkPlacement = { sceneId: string; targetSceneId: string; yaw: number; pitch: number };
const DEV_SCENE_LINK_PLACEMENTS: SceneLinkPlacement[] = [
  { sceneId: "S15", targetSceneId: "S18", yaw: 80, pitch: 9.5 },
];

/**
 * Appends `scene-link` hotspots onto whichever rooms `placements` name —
 * purely additive, same shape as `applyCollectionPlacements` above. Must
 * run BEFORE `excludeScenesFromNavigation` so its
 * `nonNavigationHotspots`-carry-over step preserves these (it only strips
 * `type: "navigation"`, never `"scene-link"`).
 */
function applySceneLinkPlacements(
  sequentialRooms: TourRoom[],
  placements: SceneLinkPlacement[],
): TourRoom[] {
  const placementsByScene = new Map<string, SceneLinkPlacement[]>();
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

    const sceneLinkHotspots: Hotspot[] = scenePlacements.map((placement, index) => ({
      type: "scene-link",
      id: `hotspot-${room.id}-scene-link-${index}`,
      targetRoomId: placement.targetSceneId,
      yaw: placement.yaw,
      pitch: placement.pitch,
    }));

    return { ...room, hotspots: [...room.hotspots, ...sceneLinkHotspots] };
  });
}

/**
 * F7 (UX pass): S16 and S17 dropped from the navigable tour per client
 * request. Deliberately NOT removed from `SCENE_ASSET_FILENAMES` — that
 * array's index is what assigns every scene its S01–S32 id (see
 * `sceneIdFromIndex`), so deleting entries there would silently renumber
 * every scene after them and break `DEV_COLLECTION_PLACEMENTS`'s sceneId
 * references. This list names the SCENE IDS to exclude, applied as a
 * post-processing step (`excludeScenesFromNavigation` below) after the
 * full S01–S32 topology is built, so every other scene keeps the id it
 * already had.
 *
 * NAMING TRAP, confirmed against `SCENE_ASSET_FILENAMES` before writing
 * this: "scene 16/17" is NOT the same as the filenames `16_266_272.jpg` /
 * `17_273_279.jpg` — those numbers are the original camera capture
 * sequence, not tour position. Scene id is assigned by ARRAY POSITION
 * (S{index+1}), so S16/S17 actually land on `20_294_300.jpg` (index 15)
 * and `21_301_307.jpg` (index 16) instead. The panorama files themselves
 * are untouched by this change either way.
 *
 * F23: S09 (`13_245_251.jpg`) added per product decision — excluded from
 * normal navigation the same way, not deleted, not renumbered. Checked
 * `DEV_COLLECTION_PLACEMENTS` before adding it: S09 has no collection
 * hotspot (only S01/S08/S15/S23/S32 do), so nothing becomes unreachable
 * collection-wise from this specific exclusion.
 *
 * F27: S13 (`17_273_279.jpg`) added per product decision — same pattern,
 * not deleted, not renumbered. Checked `DEV_COLLECTION_PLACEMENTS` first:
 * S13 has no collection hotspot either, so nothing becomes unreachable.
 *
 * F40: S21 (`25_329_335.jpg`) and S22 (`26_336_342.jpg`) added per product
 * decision — same pattern, not deleted, not renumbered, panorama files
 * untouched. Checked `DEV_COLLECTION_PLACEMENTS` first: neither has a
 * collection hotspot (only S01/S08/S23/S32 do currently), so nothing
 * becomes unreachable collection-wise. Effective topology becomes
 * ...S20->S23... once these two are excluded.
 *
 * F42: S24 (`28_351_357.jpg`) added per product decision — same pattern,
 * not deleted, not renumbered, panorama file untouched. Checked
 * `DEV_COLLECTION_PLACEMENTS` first: S24 has no collection hotspot, so
 * nothing becomes unreachable. Effective topology becomes ...S23->S25...
 * once this one is excluded too.
 *
 * F45: S27 (`31_372_378.jpg`) added per product decision — same pattern,
 * not deleted, not renumbered, panorama file untouched. Checked
 * `DEV_COLLECTION_PLACEMENTS` first: S27 has no collection hotspot, so
 * nothing becomes unreachable. Effective topology becomes ...S26->S28...
 * once this one is excluded too.
 */
const EXCLUDED_SCENE_IDS: ReadonlySet<string> = new Set([
  "S09",
  "S13",
  "S16",
  "S17",
  "S21",
  "S22",
  "S24",
  "S27",
]);

/**
 * Drops `excludedIds` from the navigable chain and relinks their
 * neighbours directly (e.g. S15 -> S18 once S16/S17 are excluded) so
 * next/previous stays a single unbroken sequence. Every remaining room
 * keeps the id it already had — only `previousSceneId`/`nextSceneId` and
 * the two generated navigation hotspots are recomputed; collection and
 * scene-link hotspots (added by `applyCollectionPlacements`/
 * `applySceneLinkPlacements` before this step runs) are carried over
 * untouched. Excluded rooms are simply absent from the returned list, so
 * they're also absent from the Pannellum `scenes` map built from it (see
 * lib/pannellum.ts) — unreachable via `loadScene` or `getRoomById`, without
 * deleting the underlying panorama file.
 *
 * F33: an earlier F32 pass briefly special-cased S16 back into this list
 * (an `explicitTargetEntryPoints` param) so a scene-link hotspot on S15
 * could target it directly. That was reverted — S16/S17 must stay fully
 * excluded per client decision; the S15 hotspot now targets S18 instead
 * (see `DEV_SCENE_LINK_PLACEMENTS`), which is already a normal reachable
 * scene in the relinked chain below, so no special-casing is needed here
 * at all.
 */
function excludeScenesFromNavigation(
  allRooms: TourRoom[],
  excludedIds: ReadonlySet<string>,
): TourRoom[] {
  const remaining = allRooms.filter((room) => !excludedIds.has(room.id));

  return remaining.map((room, index) => {
    const previousSceneId = index > 0 ? remaining[index - 1].id : null;
    const nextSceneId = index < remaining.length - 1 ? remaining[index + 1].id : null;

    const navigationHotspots: Hotspot[] = [];
    if (nextSceneId) {
      navigationHotspots.push({
        type: "navigation",
        id: `hotspot-${room.id}-next`,
        targetRoomId: nextSceneId,
        yaw: NEXT_HOTSPOT_ANGLE.yaw,
        pitch: NEXT_HOTSPOT_ANGLE.pitch,
        direction: "next",
      });
    }
    if (previousSceneId) {
      navigationHotspots.push({
        type: "navigation",
        id: `hotspot-${room.id}-previous`,
        targetRoomId: previousSceneId,
        yaw: PREVIOUS_HOTSPOT_ANGLE.yaw,
        pitch: PREVIOUS_HOTSPOT_ANGLE.pitch,
        direction: "previous",
      });
    }

    const nonNavigationHotspots = room.hotspots.filter((hotspot) => hotspot.type !== "navigation");

    return {
      ...room,
      previousSceneId,
      nextSceneId,
      hotspots: [...nonNavigationHotspots, ...navigationHotspots],
    };
  });
}

export const rooms: TourRoom[] = excludeScenesFromNavigation(
  applySceneLinkPlacements(
    applyCollectionPlacements(
      buildSequentialRooms(SCENE_ASSET_FILENAMES),
      DEV_COLLECTION_PLACEMENTS,
    ),
    DEV_SCENE_LINK_PLACEMENTS,
  ),
  EXCLUDED_SCENE_IDS,
);

export function getRoomById(roomId: string): TourRoom | undefined {
  return rooms.find((room) => room.id === roomId);
}

export function getCollectionById(collectionId: string): Collection | undefined {
  return collections.find((collection) => collection.id === collectionId);
}

/**
 * QR/deep-link support: the yaw/pitch a `collectionId` is actually placed
 * at within one specific `sceneId` — read from `rooms` (the public,
 * post-processing hotspot list), never from the private
 * `DEV_COLLECTION_PLACEMENTS` array directly, same "derive from `rooms`,
 * don't keep a second hand-maintained list" rule `getZoneForSceneId`/
 * `buildZoneCollections` already follow above. Returns `undefined` if this
 * collection has no collection-hotspot in that scene at all (wrong scene,
 * dangling `primarySceneId`, or scene excluded from navigation) — callers
 * must treat that as "no placement to aim the camera at", not throw.
 */
export function getCollectionPlacement(
  sceneId: string,
  collectionId: string,
): { yaw: number; pitch: number } | undefined {
  const room = getRoomById(sceneId);
  if (!room) return undefined;
  const hotspot = room.hotspots.find(
    (h) => h.type === "collection" && h.collectionId === collectionId,
  );
  return hotspot ? { yaw: hotspot.yaw, pitch: hotspot.pitch } : undefined;
}

/**
 * Zone-persistent collection access (client request): a collection must
 * not feel "lost" when moving between scenes within the same zone, even
 * on a hop where its physical object isn't in view. This is a SEPARATE
 * concern from the physical orange hotspot — that stays exactly as-is,
 * rendered only where `DEV_COLLECTION_PLACEMENTS` puts it. This is purely
 * an additional persistent-access affordance (a top chip + drawer, see
 * ZoneCollectionsChip/ZoneCollectionsDrawer) that must never require a
 * second, parallel list of "which collection belongs to which zone" —
 * that would drift from the real placement data the moment a future
 * placement is added or corrected. So zone membership is derived, not
 * declared: a collection belongs to whichever zone contains at least one
 * scene where it already has a real physical placement, read directly off
 * `rooms` (the final, post-exclusion, hotspots-already-baked-in list)
 * rather than the private `DEV_COLLECTION_PLACEMENTS` array — `rooms` is
 * already the safest available source: it's public, and any future
 * change to placements/exclusions flows through it automatically.
 *
 * Zone boundaries are exactly the client's own definition (S01-S15 /
 * S18-S32); scenes outside both (S16/S17, and anything beyond S32) return
 * `null`. Excluded scenes (S09/S13/S21/S22/S24/S27, ...) never reach this
 * check at all in practice, since `rooms` no longer contains them — but
 * the numeric check alone would also correctly call them zone-less if it
 * ever did.
 */
export type CollectionZone = "A" | "B";

export function getZoneForSceneId(sceneId: string): CollectionZone | null {
  const sceneNumber = Number(sceneId.slice(1));
  if (Number.isNaN(sceneNumber)) return null;
  if (sceneNumber >= 1 && sceneNumber <= 15) return "A";
  if (sceneNumber >= 18 && sceneNumber <= 32) return "B";
  return null;
}

/**
 * All collections with at least one physical placement inside `zone`,
 * de-duplicated (a collection placed in three different Zone A scenes
 * still appears once here) and in first-encountered order. Built once at
 * module load, same lifetime as `rooms`/`collections` themselves.
 */
function buildZoneCollections(zone: CollectionZone): Collection[] {
  const seenCollectionIds = new Set<string>();
  const result: Collection[] = [];
  for (const room of rooms) {
    if (getZoneForSceneId(room.id) !== zone) continue;
    for (const hotspot of room.hotspots) {
      if (hotspot.type !== "collection") continue;
      if (seenCollectionIds.has(hotspot.collectionId)) continue;
      const collection = getCollectionById(hotspot.collectionId);
      if (!collection) continue;
      seenCollectionIds.add(hotspot.collectionId);
      result.push(collection);
    }
  }
  return result;
}

export const ZONE_A_COLLECTIONS: Collection[] = buildZoneCollections("A");
export const ZONE_B_COLLECTIONS: Collection[] = buildZoneCollections("B");

export function getZoneCollections(zone: CollectionZone): Collection[] {
  return zone === "A" ? ZONE_A_COLLECTIONS : ZONE_B_COLLECTIONS;
}
