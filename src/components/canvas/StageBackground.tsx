import { Rect, Arc, Text } from 'react-konva';
import type { LayoutConfig } from '@/types/layout.ts';

interface StageBackgroundProps {
  config: LayoutConfig;
}

export function StageBackground({ config }: StageBackgroundProps) {
  const { stageWidth, stageHeight, conductorX, conductorY, innerRadius, rowSpacing, arcSpanAngle } = config;
  const halfSpanDeg = arcSpanAngle / 2;

  // Draw faint arc guide lines for each row
  const arcGuides = [];
  for (let row = 0; row < 7; row++) {
    const radius = innerRadius + row * rowSpacing;
    // Konva Arc: angle starts from 3 o'clock going clockwise
    // We want arcs above the conductor
    // rotation puts start at 12 o'clock - halfSpan
    const rotationDeg = 270 - halfSpanDeg;
    arcGuides.push(
      <Arc
        key={row}
        x={conductorX}
        y={conductorY}
        innerRadius={radius - 0.5}
        outerRadius={radius + 0.5}
        angle={arcSpanAngle}
        rotation={rotationDeg}
        fill="#e5e7eb"
        listening={false}
      />,
    );
  }

  return (
    <>
      {/* Stage background */}
      <Rect
        x={0}
        y={0}
        width={stageWidth}
        height={stageHeight}
        fill="#f9fafb"
        listening={false}
      />

      {/* Stage floor area */}
      <Rect
        x={40}
        y={20}
        width={stageWidth - 80}
        height={stageHeight - 60}
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth={1}
        cornerRadius={8}
        listening={false}
      />

      {/* Arc guide lines */}
      {arcGuides}

      {/* Audience direction indicator */}
      <Text
        text="▼ AUDIENCE"
        fontSize={11}
        fill="#9ca3af"
        x={conductorX - 35}
        y={stageHeight - 30}
        letterSpacing={2}
        listening={false}
      />
    </>
  );
}
