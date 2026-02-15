import { useStore } from '@/store/index.ts';
import { SECTION_COLORS, SECTION_DISPLAY_NAMES } from '@/utils/colorPalette.ts';
import type { InstrumentFamily } from '@/types/musician.ts';

export function LayoutSettings() {
  const layoutConfig = useStore((s) => s.layoutConfig);
  const layoutType = useStore((s) => s.layoutType);
  const setLayoutType = useStore((s) => s.setLayoutType);
  const seatPositions = useStore((s) => s.seatPositions);
  const musicians = useStore((s) => s.musicians);

  const musicianCount = Object.keys(musicians).length;
  const manualPlacedCount = Object.values(seatPositions).filter((p) => p.isManuallyPlaced).length;

  const layoutOptions = [
    { value: 'american-orchestra', label: '🎻 American' },
    { value: 'german-orchestra', label: '🎺 German' },
    { value: 'concert-band', label: '🎷 Band' },
  ] as const;

  // Build section summary
  const sectionCounts = new Map<InstrumentFamily, number>();
  for (const m of Object.values(musicians)) {
    sectionCounts.set(m.section, (sectionCounts.get(m.section) ?? 0) + 1);
  }

  return (
    <div className="space-y-3">
      {/* Layout Type Selector */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Layout
        </label>
        <select
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value as typeof layoutType)}
          className="mt-1.5 w-full rounded px-2.5 py-1.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[var(--color-text-primary)]"
        >
          {layoutOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Orchestra
        </label>
        <div className="mt-1.5 space-y-1.5 p-2.5 rounded bg-[var(--color-bg-primary)] text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Total</span>
            <span className="font-bold text-[var(--color-text-primary)]">{musicianCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Manual</span>
            <span className="font-semibold text-[var(--color-accent-500)]">{manualPlacedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Auto</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{musicianCount - manualPlacedCount}</span>
          </div>
        </div>
      </div>

      {/* Section breakdown */}
      {sectionCounts.size > 0 && (
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
            Sections
          </label>
          <div className="mt-1.5 space-y-1 p-2.5 rounded bg-[var(--color-bg-primary)]">
            {Array.from(sectionCounts.entries()).map(([family, count]) => (
              <div key={family} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SECTION_COLORS[family] }}
                />
                <span className="flex-1 text-[var(--color-text-secondary)] capitalize">{SECTION_DISPLAY_NAMES[family] ?? family}</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Config */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Canvas
        </label>
        <div className="mt-1.5 space-y-1 text-xs text-[var(--color-text-tertiary)] p-2.5 rounded bg-[var(--color-bg-primary)]">
          <div className="flex justify-between">
            <span>Stage</span>
            <span>{layoutConfig.stageWidth}×{layoutConfig.stageHeight}</span>
          </div>
          <div className="flex justify-between">
            <span>Seat ⌀</span>
            <span>{layoutConfig.seatRadius * 2}px</span>
          </div>
          <div className="flex justify-between">
            <span>Row gap</span>
            <span>{layoutConfig.rowSpacing.toFixed(0)}px</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-2.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border-medium)]">
        <p className="text-xs text-[var(--color-text-secondary)]">
          💡 Click a seat to select. Drag to move. Use the Sections tab to group seats as wedges that move together.
        </p>
      </div>
    </div>
  );
}
