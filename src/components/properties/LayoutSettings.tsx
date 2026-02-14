import { useStore } from '@/store/index.ts';

export function LayoutSettings() {
  const layoutConfig = useStore((s) => s.layoutConfig);
  const layoutType = useStore((s) => s.layoutType);
  const setLayoutType = useStore((s) => s.setLayoutType);
  const seatPositions = useStore((s) => s.seatPositions);
  const musicians = useStore((s) => s.musicians);

  const musicianCount = Object.keys(musicians).length;
  const manualPlacedCount = Object.values(seatPositions).filter((p) => p.isManuallyPlaced).length;

  const layoutOptions = [
    { value: 'american-orchestra', label: '🎻 American Symphony' },
    { value: 'german-orchestra', label: '🎺 German Orchestra' },
    { value: 'concert-band', label: '🎷 Concert Band' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Layout Type Selector */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Layout Type
        </label>
        <select
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value as typeof layoutType)}
          className="mt-2 w-full rounded px-3 py-2 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[var(--color-text-primary)]"
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
          Orchestra Stats
        </label>
        <div className="mt-2 space-y-2 p-3 rounded bg-[var(--color-bg-primary)] text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Total Musicians:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{musicianCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Manually Placed:</span>
            <span className="font-semibold text-[var(--color-accent-500)]">{manualPlacedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-tertiary)]">Auto-Placed:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{musicianCount - manualPlacedCount}</span>
          </div>
        </div>
      </div>

      {/* Layout Config Info */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Canvas Config
        </label>
        <div className="mt-2 space-y-1 text-xs text-[var(--color-text-tertiary)] p-3 rounded bg-[var(--color-bg-primary)]">
          <div>Stage: {layoutConfig.stageWidth} × {layoutConfig.stageHeight}</div>
          <div>Seat Size: {layoutConfig.seatRadius * 2}</div>
          <div>Inner Radius: {layoutConfig.innerRadius.toFixed(0)}</div>
          <div>Row Spacing: {layoutConfig.rowSpacing.toFixed(0)}</div>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-3 rounded bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-primary-50)] border border-[var(--color-accent-200)]">
        <p className="text-xs font-semibold text-[var(--color-text-primary)]">
          💡 <strong>Tip:</strong> Click any seat to select and drag to reposition. Use Ctrl+Z to undo!
        </p>
      </div>
    </div>
  );
}
