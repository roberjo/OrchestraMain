import { useMemo, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { StageBackground } from './StageBackground.tsx';
import { ConductorMarker } from './ConductorMarker.tsx';
import { SectionGroup } from './SectionGroup.tsx';
import { useStore } from '@/store/index.ts';
import type { InstrumentFamily } from '@/types/musician.ts';

interface StageCanvasProps {
  width: number;
  height: number;
}

export function StageCanvas({ width, height }: StageCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const musicians = useStore((s) => s.musicians);
  const seatPositions = useStore((s) => s.seatPositions);
  const layoutConfig = useStore((s) => s.layoutConfig);
  const selectedSeatIds = useStore((s) => s.selectedSeatIds);
  const selectSeat = useStore((s) => s.selectSeat);
  const deselectAll = useStore((s) => s.deselectAll);
  const zoomLevel = useStore((s) => s.zoomLevel);
  const stageOffsetX = useStore((s) => s.stageOffsetX);
  const stageOffsetY = useStore((s) => s.stageOffsetY);
  const setZoom = useStore((s) => s.setZoom);
  const setStageOffset = useStore((s) => s.setStageOffset);

  // Group musicians by section for rendering
  const sectionGroups = useMemo(() => {
    const groups = new Map<InstrumentFamily, typeof musicianList>();
    const musicianList = Object.values(musicians);

    for (const m of musicianList) {
      if (!groups.has(m.section)) {
        groups.set(m.section, []);
      }
      groups.get(m.section)!.push(m);
    }

    return groups;
  }, [musicians]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = zoomLevel;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stageOffsetX) / oldScale,
      y: (pointer.y - stageOffsetY) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.3, Math.min(3, newScale));

    setZoom(clampedScale);
    setStageOffset(
      pointer.x - mousePointTo.x * clampedScale,
      pointer.y - mousePointTo.y * clampedScale,
    );
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Click on empty area = deselect all
    if (e.target === e.target.getStage()) {
      deselectAll();
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={zoomLevel}
      scaleY={zoomLevel}
      x={stageOffsetX}
      y={stageOffsetY}
      draggable
      onWheel={handleWheel}
      onClick={handleStageClick}
      onDragEnd={(e) => {
        if (e.target === stageRef.current) {
          setStageOffset(e.target.x(), e.target.y());
        }
      }}
    >
      <Layer>
        <StageBackground config={layoutConfig} />
        <ConductorMarker x={layoutConfig.conductorX} y={layoutConfig.conductorY} />

        {Array.from(sectionGroups.entries()).map(([family, musicianList]) => (
          <SectionGroup
            key={family}
            musicians={musicianList}
            positions={seatPositions}
            selectedSeatIds={selectedSeatIds}
            seatRadius={layoutConfig.seatRadius}
            onSelect={selectSeat}
          />
        ))}
      </Layer>
    </Stage>
  );
}
