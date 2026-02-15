import { useRef } from 'react';
import { useStore } from '@/store/index.ts';
import { LAYOUT_PRESETS } from '@/engine/layoutPresets.ts';
import { EXAMPLE_ORCHESTRAS } from '@/utils/exampleData.ts';
import { ThemeToggle } from '@/components/shared/ThemeToggle.tsx';
import { serializeProject, exportProjectAsJSON, downloadJSON, getDownloadFilename, deserializeProject } from '@/utils/projectSerializer.ts';
import type { LayoutType } from '@/types/layout.ts';

export function AppHeader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectName = useStore((s) => s.projectName);
  const layoutType = useStore((s) => s.layoutType);
  const setProjectName = useStore((s) => s.setProjectName);
  const setLayoutType = useStore((s) => s.setLayoutType);
  const openModal = useStore((s) => s.openModal);
  const musicianCount = useStore((s) => Object.keys(s.musicians).length);
  const loadExample = useStore((s) => s.loadExample);
  const importMusicians = useStore((s) => s.importMusicians);
  const setSeatPositions = useStore((s) => s.setSeatPositions);
  const updateLayoutConfig = useStore((s) => s.updateLayoutConfig);
  const musicians = useStore((s) => s.musicians);
  const seatPositions = useStore((s) => s.seatPositions);
  const layoutConfig = useStore((s) => s.layoutConfig);
  const wedges = useStore((s) => s.wedges);
  const setWedges = useStore((s) => s.setWedges);

  const handleLoadExample = (key: 'american' | 'band' | 'chamber') => {
    loadExample(EXAMPLE_ORCHESTRAS[key]);
    setProjectName(EXAMPLE_ORCHESTRAS[key].name);
  };

  const handleSaveProject = () => {
    try {
      const snapshot = serializeProject(projectName, layoutType, musicians, seatPositions, layoutConfig, wedges);
      const json = exportProjectAsJSON(snapshot);
      const filename = getDownloadFilename(projectName);
      downloadJSON(filename, json);
    } catch (error) {
      alert(`Failed to save project: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleLoadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const snapshot = deserializeProject(content);

        setProjectName(snapshot.name);
        setLayoutType(snapshot.layoutType as LayoutType);
        importMusicians(snapshot.musicians);
        setSeatPositions(snapshot.seatPositions);
        updateLayoutConfig(snapshot.layoutConfig);
        if (snapshot.wedges) {
          setWedges(snapshot.wedges);
        }
      } catch (error) {
        alert(`Failed to load project: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="no-print flex h-14 items-center gap-3 border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 shadow-sm transition-all duration-300">
      {/* Logo + Title */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl">🎵</span>
        <h1 className="text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap hidden lg:block">Orchestra Layout Builder</h1>
        <h1 className="text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap lg:hidden">OLB</h1>
      </div>

      <div className="h-6 w-px bg-[var(--color-border-medium)] shrink-0" />

      {/* Project name */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="min-w-0 w-36 rounded border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-2 py-1.5 text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] hover:border-[var(--color-border-medium)] focus:border-[var(--color-primary-500)] focus:outline-none"
        aria-label="Project name"
      />

      {/* Layout selector */}
      <select
        value={layoutType}
        onChange={(e) => setLayoutType(e.target.value as LayoutType)}
        className="rounded border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-2 py-1.5 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-border-medium)] focus:border-[var(--color-primary-500)] focus:outline-none shrink-0"
        aria-label="Layout type"
      >
        {Object.values(LAYOUT_PRESETS).map((preset) => (
          <option key={preset.type} value={preset.type}>
            {preset.displayName}
          </option>
        ))}
      </select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Musician count badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-100)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary-700)] shrink-0">
        <span>🎼</span>
        {musicianCount}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => openModal('import')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] px-3 py-1.5 text-xs font-semibold text-white hover:shadow-lg transition-all"
          title="Import Musicians"
        >
          <span>📤</span>
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          onClick={handleSaveProject}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] px-3 py-1.5 text-xs font-semibold text-white hover:shadow-lg transition-all"
          title="Save Project"
        >
          <span>💾</span>
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          title="Load Project"
        >
          <span>📂</span>
          <span className="hidden sm:inline">Load</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadProject}
          className="hidden"
          aria-label="Load project file"
        />
        <button
          onClick={() => openModal('export')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          title="Export Layout"
        >
          <span>📥</span>
          <span className="hidden sm:inline">Export</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
