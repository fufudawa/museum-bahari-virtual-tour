"use client";

import type { Collection } from "@/types/virtual-tour";
import { useAudio } from "@/hooks/useAudio";

type AudioGuidePlayerProps = {
  collection: Collection;
  compact?: boolean;
};

/**
 * F3: rendered as a visibly disabled placeholder, not a functional
 * player. `useAudio` is still a no-op stub (F5 fills it in), but a
 * clickable-yet-inert button is a worse experience than an honestly
 * disabled one — tapping it did nothing either way, so `disabled` says
 * so instead of staying silent about it. Layout/hook wiring are otherwise
 * unchanged from F1 so F5 only has to remove `disabled` and implement
 * `useAudio` for real.
 */
export function AudioGuidePlayer({ collection, compact = false }: AudioGuidePlayerProps) {
  const { audioGuideState } = useAudio(collection.audioUrl);
  const isPlaying = audioGuideState.status === "playing";
  const size = compact ? "h-8 w-8" : "h-13 w-13";

  return (
    <div className="flex items-center gap-3 opacity-50">
      <button
        type="button"
        disabled
        aria-label="Panduan audio belum tersedia"
        className={`flex ${size} shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-deep text-on-deep`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          {isPlaying ? (
            <>
              <rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" />
              <rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" />
            </>
          ) : (
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className="flex-1">
        <div className="h-[3px] rounded-full bg-border">
          <div className="h-full w-0 rounded-full bg-brass" />
        </div>
        <p className="mt-1.5 text-[11px] text-ink-muted">Panduan audio segera hadir</p>
      </div>
    </div>
  );
}
