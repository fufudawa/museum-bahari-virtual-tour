import type { Collection } from "@/types/virtual-tour";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CollectionImage } from "./CollectionImage";
import { getCollectionDisplayTitle } from "@/lib/collection";

type CollectionPeekProps = {
  collection: Collection;
  onExpand: () => void;
  onClose: () => void;
};

/**
 * Peek state: thumbnail, title, one-line preview (if available), primary
 * CTA, plus an explicit close control — tap card/CTA or swipe up
 * (handled by CollectionSheet's drag handle) both expand; tap close or
 * swipe down both dismiss. The close button is a sibling of the expand
 * button, never nested inside it (a `<button>` inside a `<button>` isn't
 * valid HTML).
 *
 * F4: no `shortDescription` exists for any of the current 28 collections
 * (no fabricated copy) — the preview line simply doesn't render rather
 * than showing an empty line or invented text (brief's preferred "hide"
 * option; Peek's layout already reads fine as title-only).
 */
export function CollectionPeek({ collection, onExpand, onClose }: CollectionPeekProps) {
  const title = getCollectionDisplayTitle(collection);

  return (
    <div className="flex w-full flex-col gap-1 px-4 pb-4">
      <div className="flex justify-end">
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExpand}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-media)] text-left"
        >
          <CollectionImage
            src={collection.coverImage}
            alt={title}
            className="h-13 w-13 shrink-0 rounded-[var(--radius-media)]"
          />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base text-ink">{title}</span>
            {collection.shortDescription && (
              <span className="mt-1 block truncate text-xs text-ink-muted">
                {collection.shortDescription}
              </span>
            )}
          </span>
        </button>
        <Button variant="primary" onClick={onExpand} className="shrink-0">
          Lihat
        </Button>
      </div>
    </div>
  );
}
