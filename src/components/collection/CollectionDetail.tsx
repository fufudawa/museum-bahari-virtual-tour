import type { Collection } from "@/types/virtual-tour";
import { IconButton } from "@/components/ui/IconButton";
import { AudioGuidePlayer } from "@/components/audio/AudioGuidePlayer";
import { CollectionImage } from "./CollectionImage";
import { getCollectionDisplayDescription, getCollectionDisplayTitle } from "@/lib/collection";

type CollectionDetailProps = {
  collection: Collection;
  onClose: () => void;
  /**
   * Accepted for contract stability with CollectionSheet/page.tsx, which
   * already wire it to the existing "transcript" sheet state — but F3
   * explicitly excludes implementing transcript, so nothing here renders
   * an entry point into it yet. Reconnecting it later is a one-line change.
   */
  onOpenTranscript?: () => void;
};

/**
 * Full state: photo, title, description, audio player. Reads as a museum
 * information panel — no cross-navigation CTA lives here ("Explore Next"
 * was removed and never comes back, per Wireframe Set v0.2 R1).
 *
 * F4: none of the 28 current collections have a `description` (no
 * fabricated copy) — rather than leaving a blank gap in a layout that's
 * always shown a description block, this shows a neutral, honestly-worded
 * placeholder ("brief's option B — description block is part of the
 * established Full-state rhythm, title -> body -> divider -> audio).
 * `officialName`/`officialDescription` are read first wherever they
 * exist (see lib/collection.ts) — currently always `undefined`.
 *
 * The audio player renders (Hi-Fi Design v1.0 shows one in this state)
 * but is visually disabled — audio is out of scope through F4; see
 * AudioGuidePlayer's own comment for why disabled beats silently inert.
 */
export function CollectionDetail({ collection, onClose }: CollectionDetailProps) {
  const title = getCollectionDisplayTitle(collection);
  const description = getCollectionDisplayDescription(collection);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between px-4 pt-1">
        <span aria-hidden="true" />
        <IconButton
          label="Tutup"
          onClick={onClose}
          icon={
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      <CollectionImage
        src={collection.detailImage}
        alt={title}
        className="mx-4 h-26 shrink-0 rounded-[var(--radius-media)]"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink">{description}</p>
        ) : (
          <p className="mt-2 text-sm italic text-ink-muted">
            Deskripsi koleksi akan ditambahkan setelah validasi kurator.
          </p>
        )}

        <div className="mt-4 border-y border-border py-3">
          <AudioGuidePlayer collection={collection} />
        </div>
      </div>
    </div>
  );
}
