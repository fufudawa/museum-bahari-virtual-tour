type LoadingStateProps = {
  label?: string;
};

/**
 * On-tone loading placeholder — never a generic browser/system spinner
 * (Design System v0.1, §18). Same shape used for room load and, scaled
 * down, for in-sheet media loads.
 */
export function LoadingState({ label = "Memuat ruang…" }: LoadingStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-parchment">
      <div className="h-11 w-11 animate-pulse rounded-full border border-brass-line" />
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
