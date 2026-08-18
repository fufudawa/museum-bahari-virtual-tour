import type { Collection } from "@/types/virtual-tour";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CollectionImage } from "./CollectionImage";

type CollectionPeekProps = {
  collection: Collection;
  onExpand: () => void;
  onClose: () => void;
};

/**
 * Peek state: thumbnail, title, one-line preview, primary CTA, plus an
 * explicit close control — tap card/CTA or swipe up (handled by
 * CollectionSheet's drag handle) both expand; tap close or swipe down
 * both dismiss. The close button is a sibling of the expand button, never
 * nested inside it (a `<button>` inside a `<button>` isn't valid HTML).
 */
export function CollectionPeek({ collection, onExpand, onClose }: CollectionPeekProps) {
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
            src={collection.imageUrl}
            alt={collection.title}
            className="h-13 w-13 shrink-0 rounded-[var(--radius-media)]"
          />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base text-ink">{collection.title}</span>
            <span className="mt-1 block truncate text-xs text-ink-muted">{collection.description}</span>
          </span>
        </button>
        <Button variant="primary" onClick={onExpand} className="shrink-0">
          Lihat
        </Button>
      </div>
    </div>
  );
}
