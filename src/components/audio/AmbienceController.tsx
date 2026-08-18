"use client";

type AmbienceControllerProps = {
  ambienceUrl?: string;
  isEnabled: boolean;
  isDucked: boolean;
};

/**
 * F1 stub — renders nothing, owns no audio element yet. F5 gives this
 * component the actual `<audio>` element and the duck/restore logic
 * (Section 9 of the blueprint: 100% -> 20-30% while the audio guide
 * plays, restored to the previous volume on stop/end; ambience keeps
 * playing, it never stops). Kept as a real component now — not just a
 * comment — so the room composition tree already has its final shape.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- props are part of the F5 contract, unused until the audio graph lands
export function AmbienceController(_props: AmbienceControllerProps) {
  return null;
}
