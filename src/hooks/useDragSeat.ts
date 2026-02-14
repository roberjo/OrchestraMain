import { useRef } from 'react';
import { useStore } from '@/store/index.ts';

interface DragState {
  musicianId: string | null;
  initialX: number;
  initialY: number;
  lastX: number;
  lastY: number;
}

export function useDragSeat() {
  const dragStateRef = useRef<DragState>({
    musicianId: null,
    initialX: 0,
    initialY: 0,
    lastX: 0,
    lastY: 0,
  });

  const setSeatPosition = useStore((s) => s.setSeatPosition);
  const seatPositions = useStore((s) => s.seatPositions);
  const zoomLevel = useStore((s) => s.zoomLevel);

  const handleDragStart = (musicianId: string, x: number, y: number) => {
    dragStateRef.current = {
      musicianId,
      initialX: x,
      initialY: y,
      lastX: x,
      lastY: y,
    };
  };

  const handleDragMove = (x: number, y: number) => {
    const state = dragStateRef.current;
    if (!state.musicianId) return;

    // Calculate delta from last position
    const deltaX = (x - state.lastX) / zoomLevel;
    const deltaY = (y - state.lastY) / zoomLevel;

    state.lastX = x;
    state.lastY = y;

    // Update the seat position
    const currentPos = seatPositions[state.musicianId];
    if (currentPos) {
      setSeatPosition(state.musicianId, {
        x: currentPos.x + deltaX,
        y: currentPos.y + deltaY,
        isManuallyPlaced: true,
      });
    }
  };

  const handleDragEnd = () => {
    dragStateRef.current = {
      musicianId: null,
      initialX: 0,
      initialY: 0,
      lastX: 0,
      lastY: 0,
    };
  };

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
