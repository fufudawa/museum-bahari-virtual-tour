import { Button } from "@/components/ui/Button";

type CollectionNotFoundProps = {
  onClose: () => void;
};

/**
 * Shown when a collection hotspot's `collectionId` doesn't resolve to any
 * `Collection` in the data source. Should never happen with well-formed
 * data, but a dangling id must degrade gracefully — never a crash, never a
 * tap that silently does nothing, never a raw technical error.
 */
export function CollectionNotFound({ onClose }: CollectionNotFoundProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <p className="font-display text-base text-ink">Koleksi tidak ditemukan.</p>
      <p className="text-xs text-ink-muted">
        Informasi koleksi ini belum tersedia. Silakan tutup dan lanjutkan menjelajah ruangan.
      </p>
      <Button onClick={onClose} className="mt-1">
        Tutup
      </Button>
    </div>
  );
}
