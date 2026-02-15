import Konva from 'konva';
import type { LayoutConfig } from '@/types/layout.ts';

export function drawStageBackground(
  layer: Konva.Layer,
  config: LayoutConfig,
  stageColor: string,
  arcColor: string
) {
  // Stage outline
  const stageRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: config.stageWidth,
    height: config.stageHeight,
    fill: stageColor,
    stroke: arcColor,
    strokeWidth: 2,
    cornerRadius: 8,
  });
  layer.add(stageRect);

  // Draw arc guides - show all used rows (0 through 6)
  const maxRows = 7;
  for (let row = 0; row < maxRows; row++) {
    const radius = config.innerRadius + row * config.rowSpacing;
    // Draw as semicircular arc (not full circle) facing up from conductor
    const arc = new Konva.Arc({
      x: config.conductorX,
      y: config.conductorY,
      innerRadius: radius - 1,
      outerRadius: radius + 1,
      angle: 200, // slightly wider than layout arc span
      rotation: -190, // centered above conductor
      fill: arcColor,
      opacity: row < 3 ? 0.15 : 0.08,
    });
    layer.add(arc);
  }

  // Draw a subtle "AUDIENCE" label at top
  const audienceLabel = new Konva.Text({
    x: config.conductorX - 60,
    y: 30,
    text: 'AUDIENCE',
    fontSize: 14,
    fontFamily: 'Inter, Arial, sans-serif',
    fill: arcColor,
    opacity: 0.4,
    letterSpacing: 4,
    width: 120,
    align: 'center',
  });
  layer.add(audienceLabel);

  // Draw "STAGE" label near conductor
  const stageLabel = new Konva.Text({
    x: config.conductorX - 30,
    y: config.conductorY + 35,
    text: 'STAGE',
    fontSize: 11,
    fontFamily: 'Inter, Arial, sans-serif',
    fill: arcColor,
    opacity: 0.3,
    letterSpacing: 3,
    width: 60,
    align: 'center',
  });
  layer.add(stageLabel);
}
