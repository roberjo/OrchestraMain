import { useState } from 'react';
import { useStore } from '@/store/index.ts';
import type { Musician } from '@/types/musician.ts';

interface SeatPropertiesProps {
  musician: Musician;
}

export function SeatProperties({ musician }: SeatPropertiesProps) {
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(musician.name);
  const [chairInput, setChairInput] = useState(String(musician.chair || ''));

  const updateMusician = useStore((s) => s.updateMusician);
  const deselectAll = useStore((s) => s.deselectAll);
  const seatPositions = useStore((s) => s.seatPositions);

  const position = seatPositions[musician.id];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateMusician(musician.id, { name: nameInput.trim() });
      setEditName(false);
    }
  };

  const handleSaveChair = () => {
    const chair = chairInput.trim() ? parseInt(chairInput, 10) : undefined;
    if (!isNaN(Number(chair)) || !chairInput.trim()) {
      updateMusician(musician.id, { chair });
    }
  };

  const handleResetPosition = () => {
    const layoutSlice = useStore.getState();
    layoutSlice.setSeatPosition(musician.id, { isManuallyPlaced: false });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Musician Name
        </label>
        {editName ? (
          <div className="mt-2 flex gap-2">
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') setEditName(false);
              }}
              className="flex-1 rounded px-3 py-2 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[var(--color-text-primary)]"
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-2 text-sm font-semibold bg-[var(--color-primary-500)] text-white rounded hover:bg-[var(--color-primary-600)]"
            >
              Save
            </button>
          </div>
        ) : (
          <div
            onClick={() => setEditName(true)}
            className="mt-2 p-3 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            {musician.name}
          </div>
        )}
      </div>

      {/* Instrument */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Instrument
        </label>
        <div className="mt-2 p-3 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm">
          {musician.instrument}
        </div>
      </div>

      {/* Section */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Section
        </label>
        <div className="mt-2 p-3 rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm capitalize">
          {musician.section}
        </div>
      </div>

      {/* Chair Number */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          Chair Number
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            value={chairInput}
            onChange={(e) => setChairInput(e.target.value)}
            onBlur={handleSaveChair}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveChair();
            }}
            className="flex-1 rounded px-3 py-2 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[var(--color-text-primary)]"
            placeholder="Enter chair #"
          />
        </div>
      </div>

      {/* Position Info */}
      {position && (
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
            Position
          </label>
          <div className="mt-2 space-y-1 text-xs text-[var(--color-text-tertiary)] p-3 rounded bg-[var(--color-bg-primary)]">
            <div>X: {position.x.toFixed(1)}</div>
            <div>Y: {position.y.toFixed(1)}</div>
            {position.isManuallyPlaced && (
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-block w-2 h-2 bg-[var(--color-accent-500)] rounded-full"></span>
                <span className="text-[var(--color-accent-500)]">Manually placed</span>
              </div>
            )}
          </div>
          {position.isManuallyPlaced && (
            <button
              onClick={handleResetPosition}
              className="mt-3 w-full px-3 py-2 text-sm font-semibold bg-[var(--color-border-light)] text-[var(--color-text-primary)] rounded hover:bg-[var(--color-border-medium)] transition-colors"
            >
              Reset Position
            </button>
          )}
        </div>
      )}

      {/* Deselect Button */}
      <button
        onClick={deselectAll}
        className="w-full mt-6 px-4 py-2 text-sm font-semibold rounded border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors"
      >
        Deselect
      </button>
    </div>
  );
}
