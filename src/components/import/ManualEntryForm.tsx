import { useState } from 'react';
import { getInstrumentOptions } from '@/engine/instrumentTaxonomy.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { generateId } from '@/utils/idGenerator.ts';
import { Button } from '@/components/shared/Button.tsx';
import type { Musician } from '@/types/musician.ts';

interface ManualEntryFormProps {
  onAddMusician: (musician: Musician) => void;
  musicians: Musician[];
}

const instrumentOptions = getInstrumentOptions();

export function ManualEntryForm({ onAddMusician, musicians }: ManualEntryFormProps) {
  const [name, setName] = useState('');
  const [instrumentId, setInstrumentId] = useState('violin-1');
  const [chair, setChair] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    const instrument = INSTRUMENTS[instrumentId];
    onAddMusician({
      id: generateId('m'),
      name: name.trim(),
      instrument: instrumentId,
      chair: chair ? parseInt(chair, 10) : null,
      section: instrument.family,
    });
    setName('');
    setChair('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };



  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Musician name"
          className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
          autoFocus
        />
        <select
          value={instrumentId}
          onChange={(e) => setInstrumentId(e.target.value)}
          className="w-44 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          {instrumentOptions.map((opt, index) => {
            const prevFamily = index > 0 ? instrumentOptions[index - 1].family : '';
            const showGroup = opt.family !== prevFamily;
            return (
              <option key={opt.id} value={opt.id}>
                {showGroup ? `── ${opt.family.toUpperCase()} ── ` : ''}
                {opt.name}
              </option>
            );
          })}
        </select>
        <input
          type="number"
          value={chair}
          onChange={(e) => setChair(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Chair #"
          className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm"
          min={1}
        />
        <Button variant="primary" onClick={handleAdd} disabled={!name.trim()}>
          Add
        </Button>
      </div>

      {musicians.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Name</th>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Instrument</th>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Chair</th>
              </tr>
            </thead>
            <tbody>
              {musicians.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-3 py-1">{m.name}</td>
                  <td className="px-3 py-1">{INSTRUMENTS[m.instrument]?.name ?? m.instrument}</td>
                  <td className="px-3 py-1">{m.chair ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
