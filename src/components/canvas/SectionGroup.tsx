import { Group } from 'react-konva';
import { SeatNode } from './SeatNode.tsx';
import type { SeatPosition } from '@/types/layout.ts';
import type { Musician } from '@/types/musician.ts';

interface SectionGroupProps {
  musicians: Musician[];
  positions: Record<string, SeatPosition>;
  selectedSeatIds: string[];
  seatRadius: number;
  onSelect: (id: string, multi: boolean) => void;
}

export function SectionGroup({
  musicians,
  positions,
  selectedSeatIds,
  seatRadius,
  onSelect,
}: SectionGroupProps) {
  return (
    <Group>
      {musicians.map((m) => {
        const pos = positions[m.id];
        if (!pos) return null;
        return (
          <SeatNode
            key={m.id}
            position={pos}
            musician={m}
            isSelected={selectedSeatIds.includes(m.id)}
            seatRadius={seatRadius}
            onSelect={onSelect}
          />
        );
      })}
    </Group>
  );
}
