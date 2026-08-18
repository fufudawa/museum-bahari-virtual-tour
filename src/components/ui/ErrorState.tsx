import { Button } from "./Button";

type ErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

/**
 * Plain-language, on-brand error surface — never a raw technical/browser
 * error message (Design System v0.1, §19).
 */
export function ErrorState({
  message = "Gambar belum bisa dimuat.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-parchment px-8 text-center">
      <p className="font-display text-base text-ink">{message}</p>
      <p className="text-xs text-ink-muted">
        Periksa koneksi internet Anda dan coba lagi.
      </p>
      <Button onClick={onRetry}>Coba Lagi</Button>
    </div>
  );
}
