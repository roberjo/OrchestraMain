import { useStore } from '@/store/index.ts';
import { SeatProperties } from './SeatProperties.tsx';
import { LayoutSettings } from './LayoutSettings.tsx';
import { WedgeProperties } from './WedgeProperties.tsx';

export function PropertiesPanel() {
  const selectedSeatIds = useStore((s) => s.selectedSeatIds);
  const musicians = useStore((s) => s.musicians);
  const selectedWedgeId = useStore((s) => s.selectedWedgeId);
  const wedges = useStore((s) => s.wedges);

  // Get first selected musician
  const selectedMusician = selectedSeatIds.length > 0 ? musicians[selectedSeatIds[0]] : null;
  const selectedWedge = selectedWedgeId ? wedges[selectedWedgeId] : null;

  // Determine what to show: seat > wedge > layout
  const showSeat = !!selectedMusician;
  const showWedge = !showSeat && !!selectedWedge;

  const headerText = showSeat
    ? 'Seat Properties'
    : showWedge
      ? 'Wedge Properties'
      : 'Layout Settings';

  return (
    <aside className="no-print shrink-0 w-64 border-l border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[var(--color-border-light)] px-4 py-3">
        <h2 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">
          {headerText}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showSeat ? (
          <SeatProperties musician={selectedMusician!} />
        ) : showWedge ? (
          <WedgeProperties wedge={selectedWedge!} />
        ) : (
          <LayoutSettings />
        )}
      </div>
    </aside>
  );
}
