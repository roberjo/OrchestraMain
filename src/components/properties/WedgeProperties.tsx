import { useStore } from '@/store/index.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import type { Wedge } from '@/types/layout.ts';

interface WedgePropertiesProps {
  wedge: Wedge;
}

export function WedgeProperties({ wedge }: WedgePropertiesProps) {
  const musicians = useStore((s) => s.musicians);
  const updateWedge = useStore((s) => s.updateWedge);
  const removeWedge = useStore((s) => s.removeWedge);
  const selectWedge = useStore((s) => s.selectWedge);

  const wedgeMusicians = wedge.seatIds
    .map((id) => musicians[id])
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Name
        </label>
        <input
          type="text"
          value={wedge.name}
          onChange={(e) => updateWedge(wedge.id, { name: e.target.value })}
          className="mt-1.5 w-full rounded px-2.5 py-1.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[var(--color-text-primary)]"
        />
      </div>

      {/* Lock toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Move Together
        </label>
        <button
          onClick={() => updateWedge(wedge.id, { locked: !wedge.locked })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            wedge.locked
              ? 'bg-[var(--color-primary-500)]'
              : 'bg-[var(--color-border-medium)]'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              wedge.locked ? 'translate-x-4.5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Color
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <input
            type="color"
            value={wedge.color}
            onChange={(e) => updateWedge(wedge.id, { color: e.target.value })}
            className="h-7 w-7 cursor-pointer rounded border border-[var(--color-border-light)]"
          />
          <span className="text-xs text-[var(--color-text-tertiary)]">{wedge.color}</span>
        </div>
      </div>

      {/* Stats */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Members
        </label>
        <div className="mt-1.5 space-y-1 p-2.5 rounded bg-[var(--color-bg-primary)] text-xs max-h-40 overflow-y-auto">
          {wedgeMusicians.map((m) => {
            const instrName = INSTRUMENTS[m.instrument]?.name ?? m.instrument;
            return (
              <div key={m.id} className="flex justify-between text-[var(--color-text-secondary)]">
                <span>{m.name}</span>
                <span className="text-[var(--color-text-tertiary)]">
                  {instrName}{m.chair ? ` #${m.chair}` : ''}
                </span>
              </div>
            );
          })}
          {wedgeMusicians.length === 0 && (
            <span className="text-[var(--color-text-tertiary)]">No members</span>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => {
          removeWedge(wedge.id);
          selectWedge(null);
        }}
        className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
      >
        Remove Wedge
      </button>
    </div>
  );
}
