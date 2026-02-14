import { useStore } from '@/store/index.ts';
import { SeatProperties } from './SeatProperties.tsx';
import { LayoutSettings } from './LayoutSettings.tsx';

export function PropertiesPanel() {
  const selectedSeatIds = useStore((s) => s.selectedSeatIds);
  const musicians = useStore((s) => s.musicians);

  // Get first selected musician
  const selectedMusician = selectedSeatIds.length > 0 ? musicians[selectedSeatIds[0]] : null;

  return (
    <aside className="no-print w-72 border-l border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--color-border-light)] px-6 py-4">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Properties</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {selectedMusician ? (
          <SeatProperties musician={selectedMusician} />
        ) : (
          <LayoutSettings />
        )}
      </div>
    </aside>
  );
}
