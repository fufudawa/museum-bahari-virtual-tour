import { IconButton } from "@/components/ui/IconButton";

type RoomControlsProps = {
  onExit: () => void;
  onToggleAmbience: () => void;
  isAmbienceOn: boolean;
};

/**
 * The only persistent chrome over the panorama: exit (top-left) and
 * ambience toggle (top-right). No sidebar, drawer, or menu is ever added
 * here (Design System v0.1, §14 / Hi-Fi Design v1.0, screen 02).
 * F1: presentational — real exit routing and ambience playback wire up
 * in F3/F5.
 */
export function RoomControls({
  onExit,
  onToggleAmbience,
  isAmbienceOn,
}: RoomControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
      <div className="pointer-events-auto">
        <IconButton
          label="Keluar"
          tone="onDeep"
          onClick={onExit}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
      <div className="pointer-events-auto">
        <IconButton
          label={isAmbienceOn ? "Matikan suara latar" : "Nyalakan suara latar"}
          tone="onDeep"
          onClick={onToggleAmbience}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {isAmbienceOn && (
                <path
                  d="M16 9a4 4 0 010 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              )}
            </svg>
          }
        />
      </div>
    </div>
  );
}
