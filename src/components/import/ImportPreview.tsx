import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { SECTION_COLORS } from '@/utils/colorPalette.ts';
import { Button } from '@/components/shared/Button.tsx';
import type { ImportResult } from '@/types/import.ts';

interface ImportPreviewProps {
  result: ImportResult;
  onConfirm: () => void;
  onBack: () => void;
}

export function ImportPreview({ result, onConfirm, onBack }: ImportPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <span className="rounded bg-green-100 px-2 py-1 text-green-700">
          {result.musicians.length} musicians ready
        </span>
        {result.warnings.length > 0 && (
          <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-700">
            {result.warnings.length} warning{result.warnings.length !== 1 ? 's' : ''}
          </span>
        )}
        {result.errors.length > 0 && (
          <span className="rounded bg-red-100 px-2 py-1 text-red-700">
            {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="max-h-24 overflow-y-auto rounded border border-yellow-200 bg-yellow-50 p-3">
          <p className="mb-1 text-xs font-semibold text-yellow-700">Warnings:</p>
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-yellow-600">{w}</p>
          ))}
        </div>
      )}

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          {result.errors.map((e, i) => (
            <p key={i} className="text-xs text-red-600">{e}</p>
          ))}
        </div>
      )}

      {/* Preview table */}
      {result.musicians.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Name</th>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Instrument</th>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Section</th>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Chair</th>
              </tr>
            </thead>
            <tbody>
              {result.musicians.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-3 py-1">{m.name}</td>
                  <td className="px-3 py-1">{INSTRUMENTS[m.instrument]?.name ?? m.instrument}</td>
                  <td className="px-3 py-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: SECTION_COLORS[m.section] }}
                      />
                      {m.section}
                    </span>
                  </td>
                  <td className="px-3 py-1">{m.chair ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={result.musicians.length === 0}
        >
          Import {result.musicians.length} Musicians
        </Button>
      </div>
    </div>
  );
}
