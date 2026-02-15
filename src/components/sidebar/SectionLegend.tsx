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
  instruments: Map<string, { name: string; count: number }>;
}

export function SectionLegend() {
  const musicians = useStore((s) => s.musicians);

  const sections = useMemo(() => {
    const sectionMap = new Map<InstrumentFamily, SectionInfo>();

    for (const m of Object.values(musicians)) {
      if (!sectionMap.has(m.section)) {
        sectionMap.set(m.section, {
          family: m.section,
          displayName: SECTION_DISPLAY_NAMES[m.section] ?? m.section,
          color: SECTION_COLORS[m.section] ?? SECTION_COLORS.other,
          musicianCount: 0,
          instruments: new Map(),
        });
      }

      const section = sectionMap.get(m.section)!;
      section.musicianCount++;

      const instrName = INSTRUMENTS[m.instrument]?.name ?? m.instrument;
      if (!section.instruments.has(m.instrument)) {
        section.instruments.set(m.instrument, { name: instrName, count: 0 });
      }
      section.instruments.get(m.instrument)!.count++;
    }

    const familyOrder: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];
    return Array.from(sectionMap.values()).sort(
      (a, b) => familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family),
    );
  }, [musicians]);

  if (sections.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[var(--color-text-tertiary)]">No musicians loaded</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {sections.map((section) => (
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
            <span className="rounded-full bg-[var(--color-bg-primary)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-secondary)]">
              {section.musicianCount}
            </span>
          </div>
          <div className="px-3 py-2 space-y-1 bg-[var(--color-bg-primary)]">
            {Array.from(section.instruments.values()).map((instr) => (
              <div key={instr.name} className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>{instr.name}</span>
                <span className="font-medium">{instr.count}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="rounded-lg bg-[var(--color-bg-tertiary)] px-3 py-2 text-center">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          Total: {sections.reduce((sum, s) => sum + s.musicianCount, 0)} musicians
        </span>
      </div>
    </div>
  );
}
