import Konva from 'konva';

export function drawConductorMarker(layer: Konva.Layer, x: number, y: number) {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim() || '#111827';

  // Conductor circle
  const circle = new Konva.Circle({
    x,
    y,
    radius: 8,
    fill: primaryColor,
    stroke: textColor,
    strokeWidth: 2,
  });
  layer.add(circle);

  // Conductor label
  const label = new Konva.Text({
    x: x - 15,
    y: y + 12,
    text: '🎵',
    fontSize: 12,
    fontFamily: 'Arial',
  });
  layer.add(label);
}
