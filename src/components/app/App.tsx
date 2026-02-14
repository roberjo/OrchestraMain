import { AppHeader } from './AppHeader.tsx';
import { AppLayout } from './AppLayout.tsx';
import { ImportWizard } from '@/components/import/ImportWizard.tsx';
import { useStore } from '@/store/index.ts';

export function App() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);

  return (
    <div className="flex h-full flex-col bg-white">
      <AppHeader />
      <AppLayout />
      <ImportWizard isOpen={activeModal === 'import'} onClose={closeModal} />
    </div>
  );
}
