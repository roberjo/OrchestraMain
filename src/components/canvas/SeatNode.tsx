import { Circle, Text, Group } from 'react-konva';
import type { SeatPosition } from '@/types/layout.ts';
import type { Musician } from '@/types/musician.ts';
import { SECTION_COLORS } from '@/utils/colorPalette.ts';

interface SeatNodeProps {
  position: SeatPosition;
  musician: Musician;
  isSelected: boolean;
  seatRadius: number;
  onSelect: (id: string, multi: boolean) => void;
}

export function SeatNode({ position, musician, isSelected, seatRadius, onSelect }: SeatNodeProps) {
  const color = SECTION_COLORS[musician.section] ?? SECTION_COLORS.other;
  const displayName = musician.name.length > 12
    ? musician.name.substring(0, 11) + '...'
    : musician.name;

  return (
    <Group
      x={position.x}
      y={position.y}
      onClick={(e) => {
        onSelect(musician.id, e.evt.ctrlKey || e.evt.metaKey);
      }}
    >
      {/* Selection ring */}
      {isSelected && (
        <Circle
          radius={seatRadius + 3}
          stroke="#fff"
          strokeWidth={3}
        />
      )}
      {isSelected && (
        <Circle
          radius={seatRadius + 4}
          stroke={color}
          strokeWidth={2}
        />
      )}

      {/* Seat circle */}
      <Circle
        radius={seatRadius}
        fill={color}
        opacity={isSelected ? 1 : 0.75}
        stroke={isSelected ? '#fff' : '#00000020'}
        strokeWidth={isSelected ? 2 : 1}
      />

      {/* Chair number */}
      {musician.chair && seatRadius >= 12 && (
        <Text
          text={String(musician.chair)}
          fontSize={Math.max(8, seatRadius - 4)}
          fill="#fff"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={seatRadius * 2}
          height={seatRadius * 2}
          x={-seatRadius}
          y={-seatRadius}
          listening={false}
        />
      )}

      {/* Name label */}
      <Text
        text={displayName}
        fontSize={9}
        fill="#374151"
        align="center"
        width={80}
        x={-40}
        y={seatRadius + 3}
        listening={false}
      />
    </Group>
  );
}
