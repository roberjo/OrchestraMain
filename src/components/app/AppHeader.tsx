import { useStore } from '@/store/index.ts';
import { LAYOUT_PRESETS } from '@/engine/layoutPresets.ts';
import { EXAMPLE_ORCHESTRAS } from '@/utils/exampleData.ts';
import { ThemeToggle } from '@/components/shared/ThemeToggle.tsx';
import type { LayoutType } from '@/types/layout.ts';

export function AppHeader() {
  const projectName = useStore((s) => s.projectName);
  const layoutType = useStore((s) => s.layoutType);
  const setProjectName = useStore((s) => s.setProjectName);
  const setLayoutType = useStore((s) => s.setLayoutType);
  const openModal = useStore((s) => s.openModal);
  const musicianCount = useStore((s) => Object.keys(s.musicians).length);
  const loadExample = useStore((s) => s.loadExample);

  const handleLoadExample = (key: 'american' | 'band' | 'chamber') => {
    loadExample(EXAMPLE_ORCHESTRAS[key]);
    setProjectName(EXAMPLE_ORCHESTRAS[key].name);
  };

  return (
    <header className="no-print flex h-16 items-center gap-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-6 shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎵</span>
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">Orchestra Layout Builder</h1>
      </div>

      <div className="h-8 w-px bg-[var(--color-border-medium)]" />

      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] hover:border-[var(--color-border-medium)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
        aria-label="Project name"
      />

      <select
        value={layoutType}
        onChange={(e) => setLayoutType(e.target.value as LayoutType)}
        className="rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-border-medium)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
        aria-label="Layout type"
      >
        {Object.values(LAYOUT_PRESETS).map((preset) => (
          <option key={preset.type} value={preset.type}>
            {preset.displayName}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-100)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary-700)]">
        <span className="text-lg">🎼</span>
        {musicianCount}
      </span>

      <div className="flex items-center gap-2">
        {musicianCount === 0 && (
          <div className="relative group">
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--color-success-600)] to-[var(--color-success-700)] px-3 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[0]">
              Examples
              <span className="text-xs">▼</span>
            </button>
            <div className="absolute right-0 mt-0 w-56 bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleLoadExample('american')}
                className="block w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-primary-100)] border-b border-[var(--color-border-light)] transition-colors"
              >
                <div className="font-semibold">🎻 American Symphony</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">60 orchestra members</div>
              </button>
              <button
                onClick={() => handleLoadExample('chamber')}
                className="block w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-primary-100)] border-b border-[var(--color-border-light)] transition-colors"
              >
                <div className="font-semibold">🎺 Chamber Orchestra</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">28 intimate ensemble</div>
              </button>
              <button
                onClick={() => handleLoadExample('band')}
                className="block w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-primary-100)] transition-colors"
              >
                <div className="font-semibold">🎷 Concert Band</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">50 wind band members</div>
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => openModal('import')}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] px-4 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[0]"
        >
          <span>📤</span>
          Import
        </button>
        <button
          onClick={() => openModal('export')}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <span>📥</span>
          Export
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
