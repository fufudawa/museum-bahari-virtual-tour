"use client";

/**
 * F1 stub. In F5 this hook will own the dual audio graph — background
 * ambience + audio guide, including the ducking behavior (Section 9 of
 * the blueprint: ambience 100% -> 20-30% while the guide plays, restored
 * on stop/end). Kept as a typed no-op today so `AudioGuidePlayer` and
 * `AmbienceController` can already import from their final location.
 */

import type { AudioGuideState } from "@/types/virtual-tour";

export type UseAudioResult = {
  audioGuideState: AudioGuideState;
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (seconds: number) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature is final for F5; body is a no-op until then
export function useAudio(_audioUrl?: string): UseAudioResult {
  return {
    audioGuideState: { status: "idle", currentTime: 0, duration: 0 },
    play: () => {},
    pause: () => {},
    restart: () => {},
    seek: () => {},
  };
}
