import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/index.ts';
import { StageCanvas } from '@/components/canvas/StageCanvas.tsx';
import { PropertiesPanel } from '@/components/properties/PropertiesPanel.tsx';
import { Sidebar } from '@/components/sidebar/Sidebar.tsx';
import { useAutoLayout } from '@/hooks/useAutoLayout.ts';
import { EXAMPLE_ORCHESTRAS } from '@/utils/exampleData.ts';

export function AppLayout() {
  const musicianCount = useStore((s) => Object.keys(s.musicians).length);
  const openModal = useStore((s) => s.openModal);
  const setProjectName = useStore((s) => s.setProjectName);
  const loadExample = useStore((s) => s.loadExample);

  const layoutConfig = useStore((s) => s.layoutConfig);
  const setStageOffset = useStore((s) => s.setStageOffset);
  const setZoom = useStore((s) => s.setZoom);
  const zoomLevel = useStore((s) => s.zoomLevel);
  const hasCentered = useRef(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });

  // Trigger auto-layout whenever musicians change
  useAutoLayout();

  // Measure canvas container dimensions
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      setContainerDimensions({ width, height });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Auto zoom-to-fit when musicians are loaded or layout changes
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || musicianCount === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width <= 0 || height <= 0) return;

    // Calculate zoom to fit the entire stage within the viewport with padding
    const padding = 60;
    const scaleX = (width - padding * 2) / layoutConfig.stageWidth;
    const scaleY = (height - padding * 2) / layoutConfig.stageHeight;
    const fitScale = Math.min(scaleX, scaleY, 1.0); // Don't zoom in beyond 1:1

    // Center the stage in the viewport
    const offsetX = (width - layoutConfig.stageWidth * fitScale) / 2;
    const offsetY = (height - layoutConfig.stageHeight * fitScale) / 2;

    setZoom(fitScale);
    setStageOffset(offsetX, offsetY);
    hasCentered.current = true;
  }, [musicianCount, layoutConfig.stageWidth, layoutConfig.stageHeight, setZoom, setStageOffset]);

  const handleLoadExample = (key: 'american' | 'band' | 'chamber') => {
    loadExample(EXAMPLE_ORCHESTRAS[key]);
    setProjectName(EXAMPLE_ORCHESTRAS[key].name);
    hasCentered.current = false;
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Canvas */}
      <main className="flex flex-1 min-w-0 items-center justify-center bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]" ref={canvasContainerRef}>
        {musicianCount === 0 ? (
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg-primary)] p-8 shadow-xl border border-[var(--color-border-light)]">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-primary-500)]">
                <span className="text-3xl">🎼</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">Get Started</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Import musicians or try an example to generate your orchestra layout
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openModal('import')}
                className="w-full rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] px-6 py-3 font-semibold text-white hover:shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-[0]"
              >
                Import Musicians
              </button>

              <div className="relative mx-4 my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border-medium)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[var(--color-bg-primary)] px-2 text-[var(--color-text-tertiary)]">or try an example</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleLoadExample('american')}
                  className="w-full rounded-lg border-2 border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] transition-all"
                >
                  <div className="font-bold">🎻 American Symphony</div>
                  <div className="text-xs text-[var(--color-text-tertiary)] mt-1">46 orchestra members</div>
                </button>
                <button
                  onClick={() => handleLoadExample('chamber')}
                  className="w-full rounded-lg border-2 border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] transition-all"
                >
                  <div className="font-bold">🎺 Chamber Orchestra</div>
                  <div className="text-xs text-[var(--color-text-tertiary)] mt-1">28 intimate ensemble</div>
                </button>
                <button
                  onClick={() => handleLoadExample('band')}
                  className="w-full rounded-lg border-2 border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] transition-all"
                >
                  <div className="font-bold">🎷 Concert Band</div>
                  <div className="text-xs text-[var(--color-text-tertiary)] mt-1">34 wind band members</div>
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-primary-50)] p-4 border border-[var(--color-accent-200)]">
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                Load an example to see the app in action immediately!
              </p>
            </div>
          </div>
        ) : (
          <StageCanvas width={containerDimensions.width} height={containerDimensions.height} />
        )}
      </main>

      {/* Right Properties Panel */}
      {musicianCount > 0 && <PropertiesPanel />}
    </div>
  );
}
