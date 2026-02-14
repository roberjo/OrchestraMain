import { Circle, Text, Group } from 'react-konva';

interface ConductorMarkerProps {
  x: number;
  y: number;
}

export function ConductorMarker({ x, y }: ConductorMarkerProps) {
  return (
    <Group x={x} y={y}>
      <Circle radius={10} fill="#333" />
      <Circle radius={6} fill="#fff" />
      <Circle radius={3} fill="#333" />
      <Text
        text="Conductor"
        fontSize={11}
        fill="#555"
        align="center"
        y={14}
        width={80}
        x={-40}
      />
    </Group>
  );
}
