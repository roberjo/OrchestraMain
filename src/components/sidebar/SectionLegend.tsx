import { useMemo } from 'react';
import { useStore } from '@/store/index.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { SECTION_COLORS, SECTION_DISPLAY_NAMES } from '@/utils/colorPalette.ts';
import type { InstrumentFamily } from '@/types/musician.ts';

interface SectionInfo {
  family: InstrumentFamily;
  displayName: string;
  color: string;
  musicianCount: number;
  musicianIds: string[];
  instruments: Map<string, { name: string; count: number; musicianIds: string[] }>;
}

export function SectionLegend() {
  const musicians = useStore((s) => s.musicians);
  const wedges = useStore((s) => s.wedges);
  const addWedge = useStore((s) => s.addWedge);
  const removeWedge = useStore((s) => s.removeWedge);
  const selectWedge = useStore((s) => s.selectWedge);
  const selectedWedgeId = useStore((s) => s.selectedWedgeId);

  const sections = useMemo(() => {
    const sectionMap = new Map<InstrumentFamily, SectionInfo>();

    for (const m of Object.values(musicians)) {
      if (!sectionMap.has(m.section)) {
        sectionMap.set(m.section, {
          family: m.section,
          displayName: SECTION_DISPLAY_NAMES[m.section] ?? m.section,
          color: SECTION_COLORS[m.section] ?? SECTION_COLORS.other,
          musicianCount: 0,
          musicianIds: [],
          instruments: new Map(),
        });
      }

      const section = sectionMap.get(m.section)!;
      section.musicianCount++;
      section.musicianIds.push(m.id);

      const instrName = INSTRUMENTS[m.instrument]?.name ?? m.instrument;
      if (!section.instruments.has(m.instrument)) {
        section.instruments.set(m.instrument, { name: instrName, count: 0, musicianIds: [] });
      }
      const instrInfo = section.instruments.get(m.instrument)!;
      instrInfo.count++;
      instrInfo.musicianIds.push(m.id);
    }

    const familyOrder: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];
    return Array.from(sectionMap.values()).sort(
      (a, b) => familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family),
    );
  }, [musicians]);

  // Find which wedge covers a given section (if any)
  const wedgeList = useMemo(() => Object.values(wedges), [wedges]);

  const findWedgeForSection = (sectionMusicianIds: string[]) => {
    // A wedge "covers" a section if all section musicians are in the wedge
    return wedgeList.find((w) => {
      const wedgeSet = new Set(w.seatIds);
      return sectionMusicianIds.every((id) => wedgeSet.has(id));
    });
  };

  const findWedgeForInstrument = (instrumentMusicianIds: string[]) => {
    return wedgeList.find((w) => {
      const wedgeSet = new Set(w.seatIds);
      return instrumentMusicianIds.length > 0 &&
        instrumentMusicianIds.every((id) => wedgeSet.has(id)) &&
        w.seatIds.length === instrumentMusicianIds.length;
    });
  };

  const handleGroupSection = (section: SectionInfo) => {
    addWedge(section.displayName, section.musicianIds, section.color);
  };

  const handleGroupInstrument = (instrName: string, musicianIds: string[], color: string) => {
    addWedge(instrName, musicianIds, color);
  };

  if (sections.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[var(--color-text-tertiary)]">No musicians loaded</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            for (const section of sections) {
              if (!findWedgeForSection(section.musicianIds)) {
                addWedge(section.displayName, section.musicianIds, section.color);
              }
            }
          }}
          className="flex-1 rounded-lg bg-[var(--color-primary-100)] px-2 py-1.5 text-xs font-semibold text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)] transition-colors"
        >
          Group All Sections
        </button>
        {wedgeList.length > 0 && (
          <button
            onClick={() => {
              for (const w of wedgeList) {
                removeWedge(w.id);
              }
            }}
            className="rounded-lg border border-[var(--color-border-medium)] px-2 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            Ungroup All
          </button>
        )}
      </div>

      {sections.map((section) => {
        const sectionWedge = findWedgeForSection(section.musicianIds);

        return (
          <div key={section.family} className="rounded-lg border border-[var(--color-border-light)] overflow-hidden">
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ backgroundColor: section.color + '20' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {section.displayName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-[var(--color-bg-primary)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-secondary)]">
                  {section.musicianCount}
                </span>
                {sectionWedge ? (
                  <button
                    onClick={() => {
                      removeWedge(sectionWedge.id);
                      if (selectedWedgeId === sectionWedge.id) selectWedge(null);
                    }}
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold border transition-colors"
                    style={{
                      borderColor: section.color,
                      color: section.color,
                    }}
                    title="Ungroup this section wedge"
                  >
                    Ungr.
                  </button>
                ) : (
                  <button
                    onClick={() => handleGroupSection(section)}
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white transition-colors"
                    style={{ backgroundColor: section.color }}
                    title="Group section as wedge"
                  >
                    Group
                  </button>
                )}
              </div>
            </div>
            <div className="px-3 py-2 space-y-1 bg-[var(--color-bg-primary)]">
              {Array.from(section.instruments.values()).map((instr) => {
                const instrWedge = findWedgeForInstrument(instr.musicianIds);
                return (
                  <div key={instr.name} className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span className="flex-1">{instr.name}</span>
                    <span className="font-medium mr-2">{instr.count}</span>
                    {instr.count > 1 && !sectionWedge && (
                      instrWedge ? (
                        <button
                          onClick={() => {
                            removeWedge(instrWedge.id);
                            if (selectedWedgeId === instrWedge.id) selectWedge(null);
                          }}
                          className="rounded px-1 py-0.5 text-[9px] font-semibold border transition-colors"
                          style={{
                            borderColor: section.color,
                            color: section.color,
                          }}
                          title={`Ungroup ${instr.name}`}
                        >
                          Ungr.
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGroupInstrument(instr.name, instr.musicianIds, section.color)}
                          className="rounded px-1 py-0.5 text-[9px] font-semibold text-white transition-colors"
                          style={{ backgroundColor: section.color }}
                          title={`Group ${instr.name} as wedge`}
                        >
                          Grp
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Wedge summary */}
      {wedgeList.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border-light)] overflow-hidden">
          <div className="px-3 py-2 bg-[var(--color-bg-tertiary)]">
            <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">
              Active Wedges ({wedgeList.length})
            </span>
          </div>
          <div className="px-3 py-2 space-y-1.5 bg-[var(--color-bg-primary)]">
            {wedgeList.map((wedge) => (
              <div
                key={wedge.id}
                className={`flex items-center justify-between text-xs rounded px-2 py-1.5 cursor-pointer transition-colors ${
                  selectedWedgeId === wedge.id
                    ? 'bg-[var(--color-primary-100)] ring-1 ring-[var(--color-primary-500)]'
                    : 'hover:bg-[var(--color-bg-tertiary)]'
                }`}
                onClick={() => selectWedge(selectedWedgeId === wedge.id ? null : wedge.id)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: wedge.color }}
                  />
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {wedge.name}
                  </span>
                </div>
                <span className="text-[var(--color-text-tertiary)]">
                  {wedge.seatIds.length} seats
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="rounded-lg bg-[var(--color-bg-tertiary)] px-3 py-2 text-center">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          Total: {sections.reduce((sum, s) => sum + s.musicianCount, 0)} musicians
        </span>
      </div>
    </div>
  );
}
