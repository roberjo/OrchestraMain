import Konva from 'konva';
import type { LayoutConfig } from '@/types/layout.ts';

export function drawStageBackground(layer: Konva.Layer, config: LayoutConfig) {
  const stageColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-tertiary').trim() || '#f3f4f6';
  const arcColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border-medium').trim() || '#d1d5db';

  // Stage outline
  const stageRect = new Konva.Rect({
    x: -config.stageWidth / 2,
    y: -config.stageHeight / 2,
    width: config.stageWidth,
    height: config.stageHeight,
    fill: stageColor,
    stroke: arcColor,
    strokeWidth: 2,
  });
  layer.add(stageRect);

  // Arc guides - calculate from innerRadius and rowSpacing
  const arcRadii = [
    config.innerRadius,
    config.innerRadius + config.rowSpacing,
    config.innerRadius + config.rowSpacing * 2,
  ];

  for (const radius of arcRadii) {
    const arc = new Konva.Circle({
      x: config.conductorX,
      y: config.conductorY,
      radius,
      stroke: arcColor,
      strokeWidth: 1,
      opacity: 0.3,
    });
    layer.add(arc);
  }
}
