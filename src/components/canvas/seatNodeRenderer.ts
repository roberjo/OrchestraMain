import Konva from 'konva';
import type { Musician } from '@/types/musician.ts';
import type { SeatPosition } from '@/types/layout.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { SECTION_COLORS } from '@/utils/colorPalette.ts';

/**
 * Create a smart abbreviated label that fits the seat.
 * Prioritizes: instrument abbreviation + chair number.
 */
function getSeatLabel(musician: Musician, seatRadius: number): { line1: string; line2: string } {
  const instrument = INSTRUMENTS[musician.instrument];
  const instrumentName = instrument?.name ?? musician.instrument;

  // For larger seats (radius >= 24), show more text
  if (seatRadius >= 24) {
    const maxChars = Math.floor(seatRadius / 3.5);
    const name = musician.name.length > maxChars
      ? musician.name.slice(0, maxChars - 1) + '…'
      : musician.name;
    const chair = musician.chair ? `#${musician.chair}` : '';
    return { line1: name, line2: chair };
  }

  // For medium seats (18-23), show abbreviated instrument + chair
  if (seatRadius >= 18) {
    const abbr = getInstrumentAbbr(instrumentName);
    const chair = musician.chair ? ` ${musician.chair}` : '';
    return { line1: abbr + chair, line2: '' };
  }

  // For small seats, just show initial + chair
  const initial = instrumentName.charAt(0);
  const chair = musician.chair ? `${musician.chair}` : '';
  return { line1: initial + chair, line2: '' };
}

/** Get a short abbreviation for an instrument name */
function getInstrumentAbbr(name: string): string {
  const abbrMap: Record<string, string> = {
    '1st Violin': 'Vln1',
    '2nd Violin': 'Vln2',
    'Viola': 'Vla',
    'Cello': 'Vcl',
    'Double Bass': 'Bass',
    'Harp': 'Harp',
    'Flute': 'Fl',
    'Piccolo': 'Picc',
    'Oboe': 'Ob',
    'English Horn': 'EH',
    'Clarinet': 'Cl',
    'Bass Clarinet': 'BCl',
    'Bassoon': 'Bsn',
    'Contrabassoon': 'CBsn',
    'Saxophone': 'Sax',
    'French Horn': 'Hn',
    'Trumpet': 'Tpt',
    'Cornet': 'Cor',
    'Trombone': 'Tbn',
    'Bass Trombone': 'BTbn',
    'Tuba': 'Tba',
    'Euphonium': 'Euph',
    'Timpani': 'Timp',
    'Snare Drum': 'SD',
    'Bass Drum': 'BD',
    'Cymbals': 'Cym',
    'Xylophone': 'Xyl',
    'Marimba': 'Mar',
    'Glockenspiel': 'Glk',
    'Chimes': 'Chm',
    'Percussion': 'Perc',
    'Piano': 'Pno',
    'Celeste': 'Cel',
    'Organ': 'Org',
  };
  return abbrMap[name] ?? name.slice(0, 4);
}

export function drawSeatNodes(
  layer: Konva.Layer,
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  selectedSeatIds: Set<string>,
  seatRadius: number,
  onSelect: (musicianId: string) => void,
  onPositionChange: (musicianId: string, x: number, y: number) => void
) {
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border-light').trim() || '#e5e7eb';

  // Shared tooltip reference
  let tooltipGroup: Konva.Group | null = null;

  for (const musician of musicians) {
    const position = positions[musician.id];
    if (!position) continue;

    // Create a group for the seat
    const group = new Konva.Group({
      x: position.x,
      y: position.y,
      draggable: true,
      name: musician.id,
    });

    const isSelected = selectedSeatIds.has(musician.id);
    const sectionColor = SECTION_COLORS[musician.section] || '#9ca3af';

    // Rounded-rect seat
    const size = seatRadius * 2;
    const rect = new Konva.Rect({
      x: -seatRadius,
      y: -seatRadius,
      width: size,
      height: size,
      cornerRadius: Math.max(4, seatRadius * 0.25),
      fill: sectionColor,
      stroke: isSelected ? '#fbbf24' : borderColor,
      strokeWidth: isSelected ? 3 : 1.5,
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowBlur: isSelected ? 10 : 4,
      shadowOpacity: isSelected ? 0.4 : 0.2,
      shadowOffsetY: 2,
      opacity: 0.92,
    });
    group.add(rect);

    // Dynamic font size
    const fontSize = Math.max(8, Math.min(14, Math.floor(seatRadius * 0.5)));
    const label = getSeatLabel(musician, seatRadius);

    // Primary label
    const nameText = new Konva.Text({
      x: -seatRadius + 3,
      y: label.line2 ? -fontSize * 0.8 : -fontSize / 2,
      text: label.line1,
      fontSize: fontSize,
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
      fill: '#ffffff',
      shadowColor: 'rgba(0,0,0,0.6)',
      shadowBlur: 2,
      shadowOffsetY: 1,
      width: size - 6,
      align: 'center',
      wrap: 'none',
      ellipsis: true,
      listening: false,
    });
    group.add(nameText);

    // Secondary label (chair number)
    if (label.line2) {
      const chairText = new Konva.Text({
        x: -seatRadius + 3,
        y: fontSize * 0.4,
        text: label.line2,
        fontSize: Math.max(7, fontSize - 2),
        fontFamily: 'Inter, Arial, sans-serif',
        fill: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowBlur: 2,
        shadowOffsetY: 1,
        width: size - 6,
        align: 'center',
        opacity: 0.85,
        listening: false,
      });
      group.add(chairText);
    }

    // Event handlers
    group.on('click', (e) => {
      e.cancelBubble = true;
      onSelect(musician.id);
    });

    group.on('dragstart', () => {
      group.moveToTop();
    });

    group.on('dragend', () => {
      onPositionChange(musician.id, group.x(), group.y());
    });

    // Tooltip on hover
    const instrument = INSTRUMENTS[musician.instrument];
    const instrumentName = instrument?.name ?? musician.instrument;
    const tooltipText = `${musician.name}\n${instrumentName}${musician.chair ? ' #' + musician.chair : ''}`;

    group.on('mouseenter', () => {
      if (tooltipGroup) {
        tooltipGroup.destroy();
        tooltipGroup = null;
      }

      const padding = 8;
      const tipFontSize = 12;
      const lines = tooltipText.split('\n');
      const tipWidth = Math.max(...lines.map(l => l.length * 7)) + padding * 2;
      const tipHeight = lines.length * (tipFontSize + 4) + padding * 2;

      tooltipGroup = new Konva.Group({
        x: group.x(),
        y: group.y() - seatRadius - tipHeight - 6,
        listening: false,
      });

      const bg = new Konva.Rect({
        x: -tipWidth / 2,
        y: 0,
        width: tipWidth,
        height: tipHeight,
        fill: '#1f2937',
        cornerRadius: 4,
        opacity: 0.95,
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 6,
        shadowOffsetY: 2,
      });
      tooltipGroup.add(bg);

      const text = new Konva.Text({
        x: -tipWidth / 2 + padding,
        y: padding,
        text: tooltipText,
        fontSize: tipFontSize,
        fontFamily: 'Inter, Arial, sans-serif',
        fill: '#f9fafb',
        width: tipWidth - padding * 2,
        lineHeight: 1.4,
        listening: false,
      });
      tooltipGroup.add(text);

      layer.add(tooltipGroup);
      layer.batchDraw();
    });

    group.on('mouseleave', () => {
      if (tooltipGroup) {
        tooltipGroup.destroy();
        tooltipGroup = null;
        layer.batchDraw();
      }
    });

    layer.add(group);
  }
}
