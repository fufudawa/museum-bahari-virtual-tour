import type { CollectionHotspot as CollectionHotspotData } from "@/types/virtual-tour";

type CollectionHotspotProps = {
  hotspot: CollectionHotspotData;
  /** Collection title, if resolved — used only for the accessible label. */
  title?: string;
  onActivate: (hotspot: CollectionHotspotData) => void;
};

/**
 * Filled marker — visually and semantically distinct from
 * NavigationHotspot's outlined ring (never merged with it). Rendered so
 * the visual contrast between hotspot types is real and on-screen, not
 * just documented — but F2B explicitly does not connect this to the
 * collection sheet. `onActivate` is wired to an inert stub at the mount
 * site (see usePanorama.tsx); connecting it is next-phase work.
 */
export function CollectionHotspot({
  hotspot,
  title,
  onActivate,
}: CollectionHotspotProps) {
  return (
    <button
      type="button"
      onClick={() => onActivate(hotspot)}
      aria-label={title ? `Lihat koleksi: ${title}` : "Lihat koleksi"}
      className="relative flex h-11 w-11 items-center justify-center"
    >
      <span className="absolute h-7 w-7 rounded-full border border-brass-line/70" aria-hidden="true" />
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass text-ink shadow-[0_0_0_3px_rgba(246,240,225,0.55)]" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      </span>
    </button>
  );
}
