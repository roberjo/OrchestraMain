import type { ColumnMapping } from '@/types/import.ts';

interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
}

const FIELDS: Array<{ key: keyof ColumnMapping; label: string; required: boolean }> = [
  { key: 'nameColumn', label: 'Name', required: true },
  { key: 'instrumentColumn', label: 'Instrument', required: true },
  { key: 'chairColumn', label: 'Chair/Stand #', required: false },
];

export function ColumnMapper({ headers, mapping, onMappingChange }: ColumnMapperProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Map your file columns to the required fields:</p>
      {FIELDS.map(({ key, label, required }) => (
        <div key={key} className="flex items-center gap-3">
          <label className="w-32 text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
          <select
            value={mapping[key] ?? ''}
            onChange={(e) =>
              onMappingChange({ ...mapping, [key]: e.target.value || null })
            }
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">-- Select column --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {mapping[key] && (
            <span className="text-xs text-green-600">Mapped</span>
          )}
        </div>
      ))}
    </div>
  );
}
