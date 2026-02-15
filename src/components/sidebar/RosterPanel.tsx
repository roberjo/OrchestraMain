import { useState, useMemo } from 'react';
import { useStore } from '@/store/index.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { SECTION_COLORS, SECTION_DISPLAY_NAMES } from '@/utils/colorPalette.ts';
import type { Musician, InstrumentFamily } from '@/types/musician.ts';

export function RosterPanel() {
  const musicians = useStore((s) => s.musicians);
  const selectedSeatIds = useStore((s) => s.selectedSeatIds);
  const selectSeat = useStore((s) => s.selectSeat);
  const removeMusician = useStore((s) => s.removeMusician);
  const openModal = useStore((s) => s.openModal);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<InstrumentFamily | 'all'>('all');

  const musicianList = useMemo(() => {
    let list = Object.values(musicians);

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          (INSTRUMENTS[m.instrument]?.name ?? m.instrument).toLowerCase().includes(query),
      );
    }

    // Filter by section
    if (filterSection !== 'all') {
      list = list.filter((m) => m.section === filterSection);
    }

    // Sort by section, then instrument sort order, then chair
    const familyOrder: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];
    list.sort((a, b) => {
      const sectionDiff = familyOrder.indexOf(a.section) - familyOrder.indexOf(b.section);
      if (sectionDiff !== 0) return sectionDiff;
      const instrA = INSTRUMENTS[a.instrument]?.sortOrder ?? 99;
      const instrB = INSTRUMENTS[b.instrument]?.sortOrder ?? 99;
      if (instrA !== instrB) return instrA - instrB;
      return (a.chair ?? 999) - (b.chair ?? 999);
    });

    return list;
  }, [musicians, searchQuery, filterSection]);

  // Detect which sections are present
  const activeSections = useMemo(() => {
    const sections = new Set<InstrumentFamily>();
    for (const m of Object.values(musicians)) {
      sections.add(m.section);
    }
    return Array.from(sections);
  }, [musicians]);

  if (Object.keys(musicians).length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="mb-3 text-sm text-[var(--color-text-tertiary)]">No musicians loaded</p>
        <button
          onClick={() => openModal('import')}
          className="rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] px-4 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all"
        >
          Import Musicians
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and filter */}
      <div className="p-3 space-y-2 border-b border-[var(--color-border-light)]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search musicians..."
          className="w-full rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-primary-500)] focus:outline-none"
        />
        {activeSections.length > 1 && (
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value as InstrumentFamily | 'all')}
            className="w-full rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)]"
          >
            <option value="all">All Sections</option>
            {activeSections.map((s) => (
              <option key={s} value={s}>{SECTION_DISPLAY_NAMES[s]}</option>
            ))}
          </select>
        )}
      </div>

      {/* Musician list */}
      <div className="flex-1 overflow-y-auto">
        {musicianList.length === 0 ? (
          <p className="p-4 text-center text-xs text-[var(--color-text-tertiary)]">
            No musicians match your search
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-border-light)]">
            {musicianList.map((m) => (
              <MusicianRow
                key={m.id}
                musician={m}
                isSelected={selectedSeatIds.includes(m.id)}
                onSelect={() => selectSeat(m.id)}
                onRemove={() => removeMusician(m.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer count */}
      <div className="border-t border-[var(--color-border-light)] px-4 py-2 text-xs text-[var(--color-text-tertiary)]">
        {musicianList.length} of {Object.keys(musicians).length} shown
      </div>
    </div>
  );
}

function MusicianRow({
  musician,
  isSelected,
  onSelect,
  onRemove,
}: {
  musician: Musician;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const instrumentName = INSTRUMENTS[musician.instrument]?.name ?? musician.instrument;
  const sectionColor = SECTION_COLORS[musician.section] ?? SECTION_COLORS.other;

  return (
    <li
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-[var(--color-primary-100)] border-l-3 border-[var(--color-primary-500)]'
          : 'hover:bg-[var(--color-bg-tertiary)]'
      }`}
    >
      <span
        className="flex-shrink-0 h-3 w-3 rounded-full"
        style={{ backgroundColor: sectionColor }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
          {musician.name}
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] truncate">
          {instrumentName}
          {musician.chair ? ` (Chair ${musician.chair})` : ''}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex-shrink-0 text-[var(--color-text-tertiary)] hover:text-red-500 opacity-0 group-hover:opacity-100 text-xs px-1"
        title="Remove musician"
      >
        ✕
      </button>
    </li>
  );
}
