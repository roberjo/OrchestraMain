import { AppHeader } from './AppHeader.tsx';
import { AppLayout } from './AppLayout.tsx';
import { ImportWizard } from '@/components/import/ImportWizard.tsx';
import { ThemeProvider } from '@/components/shared/ThemeProvider.tsx';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts.ts';
import { useAutoHistory } from '@/hooks/useAutoHistory.ts';
import { useStore } from '@/store/index.ts';

export function App() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);

  // Enable undo/redo keyboard shortcuts
  useKeyboardShortcuts();

  // Automatically capture layout changes to history
  useAutoHistory();

  return (
    <ThemeProvider>
      <div className="flex h-full flex-col bg-[var(--color-bg-primary)]">
        <AppHeader />
        <AppLayout />
        <ImportWizard isOpen={activeModal === 'import'} onClose={closeModal} />
      </div>
    </ThemeProvider>
  );
}
