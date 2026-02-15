import { useState } from 'react';
import { RosterPanel } from './RosterPanel.tsx';
import { SectionLegend } from './SectionLegend.tsx';
import { useStore } from '@/store/index.ts';

type SidebarTab = 'roster' | 'sections';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('roster');
  const musicianCount = useStore((s) => Object.keys(s.musicians).length);

  return (
    <aside className="no-print shrink-0 flex w-72 flex-col border-r border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
      {/* Tab header */}
      <div className="flex border-b border-[var(--color-border-light)]">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'roster'
              ? 'border-b-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)] bg-[var(--color-bg-primary)]'
              : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
            }`}
        >
          Roster ({musicianCount})
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'sections'
              ? 'border-b-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)] bg-[var(--color-bg-primary)]'
              : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
            }`}
        >
          Sections
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'roster' ? <RosterPanel /> : <SectionLegend />}
      </div>
    </aside>
  );
}
