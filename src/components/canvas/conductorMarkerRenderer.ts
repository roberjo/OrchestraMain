import Konva from 'konva';

export function drawConductorMarker(layer: Konva.Layer, x: number, y: number) {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6';

  // Outer glow ring
  const glow = new Konva.Circle({
    x,
    y,
    radius: 18,
    fill: primaryColor,
    opacity: 0.15,
  });
  layer.add(glow);

  // Conductor circle
  const circle = new Konva.Circle({
    x,
    y,
    radius: 12,
    fill: primaryColor,
    stroke: '#ffffff',
    strokeWidth: 3,
    shadowColor: primaryColor,
    shadowBlur: 8,
    shadowOpacity: 0.4,
  });
  layer.add(circle);

  // Conductor icon (baton/music note)
  const icon = new Konva.Text({
    x: x - 7,
    y: y - 7,
    text: '🎵',
    fontSize: 14,
    fontFamily: 'Arial',
    listening: false,
  });
  layer.add(icon);

  // Label below
  const label = new Konva.Text({
    x: x - 35,
    y: y + 22,
    text: 'Conductor',
    fontSize: 11,
    fontFamily: 'Inter, Arial, sans-serif',
    fill: primaryColor,
    width: 70,
    align: 'center',
    opacity: 0.7,
    listening: false,
  });
  layer.add(label);
}
