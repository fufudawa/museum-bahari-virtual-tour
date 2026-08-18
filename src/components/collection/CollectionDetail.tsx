import type { Collection } from "@/types/virtual-tour";
import { IconButton } from "@/components/ui/IconButton";
import { AudioGuidePlayer } from "@/components/audio/AudioGuidePlayer";
import { CollectionImage } from "./CollectionImage";

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
 * Full state: photo, title, full description, audio player. Reads as a
 * museum information panel — no cross-navigation CTA lives here ("Explore
 * Next" was removed and never comes back, per Wireframe Set v0.2 R1).
 *
 * The audio player renders (Hi-Fi Design v1.0 shows one in this state)
 * but is visually disabled — F3 explicitly excludes functional audio;
 * see AudioGuidePlayer's own comment for why disabled beats silently inert.
 */
export function CollectionDetail({ collection, onClose }: CollectionDetailProps) {
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
        src={collection.imageUrl}
        alt={collection.title}
        className="mx-4 h-26 shrink-0 rounded-[var(--radius-media)]"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="font-display text-xl text-ink">{collection.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">{collection.description}</p>

        <div className="mt-4 border-y border-border py-3">
          <AudioGuidePlayer collection={collection} />
        </div>
      </div>
    </div>
  );
}
