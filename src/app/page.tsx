import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden bg-parchment px-8 py-14 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brass-line text-deep">
          <svg viewBox="0 0 64 44" className="h-6 w-8" aria-hidden="true">
            <path
              d="M4 34c6 6 50 6 56 0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
            <path
              d="M18 34V10M40 34V6"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
            <path
              d="M6 34l6-10h34l8 10z"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-display text-sm uppercase tracking-[0.14em] text-deep">
            Museum Bahari
          </p>
          <p className="mt-1 font-display text-xs italic text-ink-muted">
            Kunjungan Virtual
          </p>
        </div>
      </div>

      <p className="max-w-xs text-sm leading-relaxed text-ink">
        Jelajahi satu ruang koleksi bahari secara virtual. Lihat benda-benda
        bersejarah, baca kisahnya, dan dengarkan narasi reflektif tentang
        warisan maritim Indonesia.
      </p>

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Link href="/virtual-tour" className={buttonClassName("primary", "w-full")}>
          Masuk
        </Link>
        <p className="text-[11px] text-ink-muted">
          Geser untuk melihat sekeliling di dalam ruang
        </p>
      </div>
    </main>
  );
}
