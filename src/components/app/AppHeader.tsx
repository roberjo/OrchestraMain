import { useStore } from '@/store/index.ts';
import { LAYOUT_PRESETS } from '@/engine/layoutPresets.ts';
import type { LayoutType } from '@/types/layout.ts';

export function AppHeader() {
  const projectName = useStore((s) => s.projectName);
  const layoutType = useStore((s) => s.layoutType);
  const setProjectName = useStore((s) => s.setProjectName);
  const setLayoutType = useStore((s) => s.setLayoutType);
  const openModal = useStore((s) => s.openModal);
  const musicianCount = useStore((s) => Object.keys(s.musicians).length);

  return (
    <header className="no-print flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎵</span>
        <h1 className="text-lg font-semibold text-gray-900">Orchestra Layout Builder</h1>
      </div>

      <div className="mx-4 h-6 w-px bg-gray-300" />

      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm font-medium text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
        aria-label="Project name"
      />

      <select
        value={layoutType}
        onChange={(e) => setLayoutType(e.target.value as LayoutType)}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
        aria-label="Layout type"
      >
        {Object.values(LAYOUT_PRESETS).map((preset) => (
          <option key={preset.type} value={preset.type}>
            {preset.displayName}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      <span className="text-sm text-gray-500">
        {musicianCount} musician{musicianCount !== 1 ? 's' : ''}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal('import')}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Import
        </button>
        <button
          onClick={() => openModal('export')}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Export
        </button>
      </div>
    </header>
  );
}
