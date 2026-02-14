import { useEffect, useRef, useMemo } from 'react';
import Konva from 'konva';
import { useStore } from '@/store/index.ts';
import { useDragSeat } from '@/hooks/useDragSeat.ts';
import { drawStageBackground } from './stageBackgroundRenderer.ts';
import { drawConductorMarker } from './conductorMarkerRenderer.ts';
import { drawSeatNodes } from './seatNodeRenderer.ts';
import type { InstrumentFamily } from '@/types/musician.ts';

interface StageCanvasProps {
  width: number;
  height: number;
}

export function StageCanvas({ width, height }: StageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

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

  const { handleDragStart, handleDragMove, handleDragEnd } = useDragSeat();

  // Group musicians by section
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

  // Initialize Konva stage
  useEffect(() => {
    if (!containerRef.current) return;

    const stage = new Konva.Stage({
      container: containerRef.current,
      width,
      height,
      draggable: true,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    stageRef.current = stage;
    layerRef.current = layer;

    // Handle wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!stageRef.current) return;

      const oldScale = zoomLevel;
      const pointer = stageRef.current.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stageOffsetX) / oldScale,
        y: (pointer.y - stageOffsetY) / oldScale,
      };

      const direction = e.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.max(0.3, Math.min(3, newScale));

      setZoom(clampedScale);
      setStageOffset(
        pointer.x - mousePointTo.x * clampedScale,
        pointer.y - mousePointTo.y * clampedScale,
      );
    };

    // Handle click to deselect
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === stageRef.current) {
        deselectAll();
      }
    };

    // Handle drag
    const handleDragEnd = () => {
      if (stageRef.current) {
        setStageOffset(stageRef.current.x(), stageRef.current.y());
      }
    };

    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    stage.on('click', handleStageClick);
    stage.on('dragend', handleDragEnd);

    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel);
      stage.off('click', handleStageClick);
      stage.off('dragend', handleDragEnd);
      stage.destroy();
    };
  }, []);

  // Render canvas content
  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;

    // Update stage dimensions and transform
    stage.width(width);
    stage.height(height);
    stage.scaleX(zoomLevel);
    stage.scaleY(zoomLevel);
    stage.x(stageOffsetX);
    stage.y(stageOffsetY);

    // Clear and redraw
    layer.destroyChildren();

    // Draw background and conductor
    drawStageBackground(layer, layoutConfig);
    drawConductorMarker(layer, layoutConfig.conductorX, layoutConfig.conductorY);

    // Draw all seat nodes
    drawSeatNodes(
      layer,
      Array.from(sectionGroups.values()).flat(),
      seatPositions,
      new Set(selectedSeatIds),
      layoutConfig.seatRadius,
      selectSeat,
      handleDragStart,
      handleDragMove,
      handleDragEnd,
    );

    layer.batchDraw();
  }, [width, height, zoomLevel, stageOffsetX, stageOffsetY, sectionGroups, seatPositions, selectedSeatIds, layoutConfig, selectSeat]);

  return <div ref={containerRef} className="w-full h-full" />;
}
