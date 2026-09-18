import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type AudioEntryPromptProps = {
  onEnable: () => void;
  onDismiss: () => void;
  /** True while `onEnable`'s own `play()` request is in flight — disables
   * the primary CTA so a slow/double tap can't fire a second overlapping
   * `play()` call, without needing to know anything about its result. */
  isRequesting?: boolean;
};

/** Vertical breathing room between this card's bottom edge and the
 * `CollectionSheet` peek's own top edge. */
const GAP_ABOVE_SHEET_PX = 16;
/** Fallback used only for the very first paint, before the layout-effect
 * below has measured the real sheet — `CollectionSheet`'s peek state is a
 * fixed shape (thumbnail row + title + CTA), so this is a reasonable
 * starting guess, immediately corrected to the real value below. */
const FALLBACK_SHEET_HEIGHT_PX = 160;

/**
 * QR/deep-link-only audio-entry prompt (client request) — offers to start
 * background ambience from a real tap, since a visitor arriving via
 * `/c/[collectionId]` has had no prior gesture on this page for the browser
 * to have honored an autoplay attempt with. Deliberately NOT a fullscreen
 * modal and NOT paired with a dark backdrop: the panorama and the
 * `CollectionSheet` peek already open underneath stay fully visible and
 * interactive — this is a small, dismissible card floating just above the
 * sheet, not a gate the visitor must clear first (see virtual-tour/page.tsx
 * for exactly which four conditions gate rendering this at all).
 *
 * Positioning: measured off the real `CollectionSheet` DOM node (found via
 * the `role="dialog"][aria-modal="true"]` attributes that component already
 * sets when open — nothing new added there), not a guessed CSS percentage.
 * A first pass at this used `bottom: calc(34% + 16px)` — `34%` being
 * `CollectionSheet`'s own `max-height` for its peek state — but the peek
 * card's REAL rendered height is only ~140px (content-sized: thumbnail row
 * + title + CTA, nowhere near that cap), so that guess left ~147px of
 * empty gap the card filled by reaching upward — squarely on top of the
 * one hotspot a QR/deep-link visitor is guaranteed to be looking at (the
 * camera is aimed straight at it, so it always renders near vertical-
 * center). Confirmed via a live bounding-box check before fixing. This
 * measured approach tracks whatever the sheet's true height turns out to
 * be (including a resize), so it can never repeat that mistake.
 */
export function AudioEntryPrompt({ onEnable, onDismiss, isRequesting = false }: AudioEntryPromptProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [bottomOffset, setBottomOffset] = useState(FALLBACK_SHEET_HEIGHT_PX + GAP_ABOVE_SHEET_PX);

  useLayoutEffect(() => {
    const measure = () => {
      const sheet = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!sheet) return;
      const height = sheet.getBoundingClientRect().height;
      setBottomOffset(height + GAP_ABOVE_SHEET_PX);
    };
    measure();

    const sheet = document.querySelector('[role="dialog"][aria-modal="true"]');
    const resizeObserver = new ResizeObserver(measure);
    if (sheet) resizeObserver.observe(sheet);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Aktifkan suara latar"
      className="absolute inset-x-4 z-10 flex flex-col gap-3 rounded-[var(--radius-sheet)] border border-border bg-surface p-4 shadow-[0_-6px_24px_rgba(18,12,4,0.18)]"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass-soft text-brass"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            <path
              d="M16 9a4 4 0 010 6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-display text-base text-ink">Aktifkan suara latar</span>
          <span className="text-sm text-ink-muted">
            Nikmati kunjungan virtual dengan suasana audio Museum Bahari.
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="h-10 rounded-[var(--radius-control)] px-4 text-sm font-semibold tracking-wide text-ink-muted transition-colors hover:text-ink"
        >
          Nanti saja
        </button>
        <Button variant="primary" onClick={onEnable} disabled={isRequesting}>
          Mulai Kunjungan
        </Button>
      </div>
    </div>
  );
}
