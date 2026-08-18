import type { Collection } from "@/types/virtual-tour";
import { IconButton } from "@/components/ui/IconButton";
import { AudioGuidePlayer } from "@/components/audio/AudioGuidePlayer";

type TranscriptProps = {
  collection: Collection;
  onCollapse: () => void;
};

/**
 * Two bounded zones, per the locked wireframe rule: a header zone
 * (handle + collapse + close) that owns sheet gestures, and a scrollable
 * body zone that owns text scroll only. A vertical swipe that starts
 * inside the body must never be read as a sheet dismiss — enforced by
 * keeping the header controls as the only collapse/close affordance and
 * giving the body its own `overflow-y-auto` region.
 */
export function Transcript({ collection, onCollapse }: TranscriptProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-brass-line px-4 py-3">
        <IconButton
          label="Tutup transkrip"
          onClick={onCollapse}
          icon={
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6 15l6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <h2 className="font-display text-sm text-ink">Transkrip</h2>
        <span className="w-11" aria-hidden="true" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <p className="text-sm leading-7 text-ink">{collection.transcript}</p>
      </div>

      <div className="border-t border-border px-4 py-3">
        <AudioGuidePlayer collection={collection} compact />
      </div>
    </div>
  );
}
