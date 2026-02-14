import { useState } from 'react';
import { Modal } from '@/components/shared/Modal.tsx';
import { Button } from '@/components/shared/Button.tsx';
import { FileUploader } from './FileUploader.tsx';
import { ColumnMapper } from './ColumnMapper.tsx';
import { ManualEntryForm } from './ManualEntryForm.tsx';
import { ImportPreview } from './ImportPreview.tsx';
import { useFileImport, processImport } from '@/hooks/useFileImport.ts';
import { useStore } from '@/store/index.ts';
import type { Musician } from '@/types/musician.ts';

type ImportMode = 'choose' | 'file' | 'manual';
type Step = 'source' | 'map' | 'preview';

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportWizard({ isOpen, onClose }: ImportWizardProps) {
  const [mode, setMode] = useState<ImportMode>('choose');
  const [step, setStep] = useState<Step>('source');
  const [manualMusicians, setManualMusicians] = useState<Musician[]>([]);

  const importMusicians = useStore((s) => s.importMusicians);
  const {
    parsedData,
    mapping,
    importResult,
    isLoading,
    error,
    parseFile,
    updateMapping,
    reset: resetFileImport,
  } = useFileImport();

  const handleClose = () => {
    setMode('choose');
    setStep('source');
    setManualMusicians([]);
    resetFileImport();
    onClose();
  };

  const handleFileSelected = async (file: File) => {
    await parseFile(file);
    setStep('map');
  };

  const handleConfirmImport = () => {
    if (mode === 'file' && importResult) {
      importMusicians(importResult.musicians);
    } else if (mode === 'manual') {
      importMusicians(manualMusicians);
    }
    handleClose();
  };

  const handleManualConfirm = () => {
    importMusicians(manualMusicians);
    handleClose();
  };

  const title =
    step === 'source'
      ? 'Import Musicians'
      : step === 'map'
        ? 'Map Columns'
        : 'Preview Import';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} width="max-w-3xl">
      {/* Step 1: Choose source */}
      {step === 'source' && mode === 'choose' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            How would you like to add musicians?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('file')}
              className="rounded-lg border-2 border-gray-200 p-6 text-center hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="mb-2 text-2xl">📄</div>
              <div className="text-sm font-semibold text-gray-700">Upload File</div>
              <div className="mt-1 text-xs text-gray-500">CSV or Excel spreadsheet</div>
            </button>
            <button
              onClick={() => setMode('manual')}
              className="rounded-lg border-2 border-gray-200 p-6 text-center hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="mb-2 text-2xl">✏️</div>
              <div className="text-sm font-semibold text-gray-700">Manual Entry</div>
              <div className="mt-1 text-xs text-gray-500">Add musicians one by one</div>
            </button>
          </div>
        </div>
      )}

      {/* File upload mode */}
      {step === 'source' && mode === 'file' && (
        <div className="space-y-4">
          <FileUploader onFileSelected={handleFileSelected} isLoading={isLoading} />
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <Button onClick={() => setMode('choose')}>Back</Button>
        </div>
      )}

      {/* Manual entry mode */}
      {mode === 'manual' && (
        <div className="space-y-4">
          <ManualEntryForm
            onAddMusician={(m) => setManualMusicians((prev) => [...prev, m])}
            musicians={manualMusicians}
          />
          <div className="flex justify-between">
            <Button
              onClick={() => {
                setMode('choose');
                setManualMusicians([]);
              }}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleManualConfirm}
              disabled={manualMusicians.length === 0}
            >
              Import {manualMusicians.length} Musicians
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Column mapping */}
      {step === 'map' && mode === 'file' && parsedData && (
        <div className="space-y-4">
          <ColumnMapper
            headers={parsedData.headers}
            mapping={mapping}
            onMappingChange={(m) => {
              updateMapping(m);
            }}
          />

          {/* Show sample rows */}
          <div className="max-h-32 overflow-auto rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {parsedData.headers.map((h) => (
                    <th key={h} className="px-2 py-1 text-left font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 3).map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {row.map((cell, j) => (
                      <td key={j} className="px-2 py-0.5 text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => {
                setStep('source');
                resetFileImport();
              }}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (parsedData && mapping.nameColumn && mapping.instrumentColumn) {
                  const result = processImport(parsedData.headers, parsedData.rows, mapping);
                  // The hook already updated importResult via updateMapping, but ensure we have latest
                  updateMapping(mapping);
                  if (result.musicians.length > 0 || result.warnings.length > 0) {
                    setStep('preview');
                  }
                }
              }}
              disabled={!mapping.nameColumn || !mapping.instrumentColumn}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && importResult && (
        <ImportPreview
          result={importResult}
          onConfirm={handleConfirmImport}
          onBack={() => setStep('map')}
        />
      )}
    </Modal>
  );
}
