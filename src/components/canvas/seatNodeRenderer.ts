import Konva from 'konva';
import type { Musician } from '@/types/musician.ts';
import type { SeatPosition } from '@/types/layout.ts';
import { SECTION_COLORS } from '@/utils/colorPalette.ts';

export function drawSeatNodes(
  layer: Konva.Layer,
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  selectedSeatIds: Set<string>,
  seatRadius: number,
  onSelect: (musicianId: string) => void
) {
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border-light').trim() || '#e5e7eb';

  for (const musician of musicians) {
    const position = positions[musician.id];
    if (!position) continue;

    const sectionColor = SECTION_COLORS[musician.section] || '#9ca3af';
    const isSelected = selectedSeatIds.has(musician.id);

    // Background circle
    const circle = new Konva.Circle({
      x: position.x,
      y: position.y,
      radius: seatRadius,
      fill: sectionColor,
      stroke: isSelected ? '#fbbf24' : borderColor,
      strokeWidth: isSelected ? 3 : 2,
      opacity: 0.85,
    });
    
    circle.on('click', () => {
      onSelect(musician.id);
    });
    
    layer.add(circle);

    // Musician name
    const nameText = new Konva.Text({
      x: position.x - seatRadius + 4,
      y: position.y - seatRadius / 2,
      text: musician.name,
      fontSize: 10,
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      width: seatRadius * 2 - 8,
      align: 'center',
      ellipsis: true,
    });
    layer.add(nameText);

    // Chair number
    if (musician.chair) {
      const chairText = new Konva.Text({
        x: position.x - seatRadius + 4,
        y: position.y + seatRadius / 4,
        text: `#${musician.chair}`,
        fontSize: 8,
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        width: seatRadius * 2 - 8,
        align: 'center',
        opacity: 0.7,
      });
      layer.add(chairText);
    }
  }
}
