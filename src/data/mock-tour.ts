import type { Collection, TourRoom } from "@/types/virtual-tour";

/**
 * Mock content for Phase 1 development.
 *
 * This is the only file a future backend/API integration (F8) needs to
 * replace. Every component downstream reads through the `TourRoom` /
 * `Collection` types in `types/virtual-tour.ts`, never this module directly.
 *
 * Room `panoramaUrl`s point at real (dummy, dev-only) equirectangular
 * images generated for F2A/F2B — see public/panoramas/. Collection image
 * and audio URLs are still placeholders; real Museum Bahari photography,
 * audio, and copy are not yet supplied (see Hi-Fi Design v1.0, Section 5E).
 */

export const collections: Collection[] = [
  {
    id: "boat-1",
    title: "Miniatur Kapal Phinisi",
    imageUrl: "/mock/collections/boat-1.jpg",
    description:
      "Kapal phinisi adalah kapal layar tradisional yang digunakan pelaut Bugis-Makassar untuk pelayaran antarpulau di Nusantara sejak berabad-abad silam.",
    audioUrl: "/mock/audio/boat-1.mp3",
    transcript:
      "Di antara gemuruh ombak Laut Flores, kapal phinisi berlayar membawa rempah dan cerita dari satu pulau ke pulau lain. Setiap lekuk kayunya menyimpan keterampilan para pengrajin Bugis yang diwariskan turun-temurun.",
  },
  {
    id: "boat-2",
    title: "Miniatur Perahu Pinisi Nusantara",
    imageUrl: "/mock/collections/boat-2.jpg",
    description:
      "Replika perahu nelayan tradisional yang menggambarkan kehidupan maritim masyarakat pesisir Indonesia.",
    audioUrl: "/mock/audio/boat-2.mp3",
    transcript:
      "Perahu ini menjadi saksi bisu kehidupan sehari-hari nelayan pesisir — berangkat sebelum fajar, pulang membawa hasil laut dan harapan.",
  },
  {
    id: "artifact-1",
    title: "Kompas Pelaut Tradisional",
    imageUrl: "/mock/collections/artifact-1.jpg",
    description:
      "Alat navigasi yang digunakan pelaut Nusantara sebelum era navigasi modern, mengandalkan bintang dan arah angin.",
    transcript:
      "Sebelum GPS dikenal, para pelaut membaca langit dan angin. Kompas ini adalah salah satu jembatan antara cara lama dan yang lebih baru.",
  },
];

export const rooms: TourRoom[] = [
  {
    id: "ruang-utama",
    title: "Ruang Utama",
    panoramaUrl: "/panoramas/dummy-room-a.jpg",
    ambienceUrl: "/mock/audio/ambience-ruang-utama.mp3",
    hotspots: [
      {
        type: "collection",
        id: "hotspot-ruang-utama-1",
        collectionId: "boat-1",
        pitch: -5,
        yaw: 30,
      },
      {
        type: "collection",
        id: "hotspot-ruang-utama-2",
        collectionId: "artifact-1",
        pitch: 0,
        yaw: 110,
      },
      {
        type: "navigation",
        id: "hotspot-ruang-utama-nav-1",
        targetRoomId: "anjungan",
        pitch: -2,
        yaw: 200,
      },
    ],
  },
  {
    id: "anjungan",
    title: "Anjungan",
    panoramaUrl: "/panoramas/dummy-room-b.jpg",
    ambienceUrl: "/mock/audio/ambience-anjungan.mp3",
    hotspots: [
      {
        type: "collection",
        id: "hotspot-anjungan-1",
        collectionId: "boat-2",
        pitch: -3,
        yaw: 45,
      },
      {
        type: "navigation",
        id: "hotspot-anjungan-nav-1",
        targetRoomId: "ruang-utama",
        pitch: -2,
        yaw: 260,
      },
    ],
  },
];

export function getRoomById(roomId: string): TourRoom | undefined {
  return rooms.find((room) => room.id === roomId);
}

export function getCollectionById(collectionId: string): Collection | undefined {
  return collections.find((collection) => collection.id === collectionId);
}
