import { useCallback } from 'react';
import { useStore } from '@/store/index.ts';

export function useDragSeat() {
  const setSeatPosition = useStore((s) => s.setSeatPosition);
  const seatPositions = useStore((s) => s.seatPositions);
  const wedges = useStore((s) => s.wedges);

  const handleDragEnd = useCallback((musicianId: string, x: number, y: number) => {
    // Check if this seat belongs to a locked wedge
    let parentWedge = null;
    for (const wedge of Object.values(wedges)) {
      if (wedge.locked && wedge.seatIds.includes(musicianId)) {
        parentWedge = wedge;
        break;
      }
    }

    if (parentWedge) {
      // Move all seats in the wedge by the same delta
      const oldPos = seatPositions[musicianId];
      if (oldPos) {
        const dx = x - oldPos.x;
        const dy = y - oldPos.y;

        for (const seatId of parentWedge.seatIds) {
          const pos = seatPositions[seatId];
          if (pos) {
            setSeatPosition(seatId, {
              x: pos.x + dx,
              y: pos.y + dy,
              isManuallyPlaced: true,
            });
          }
        }
      }
    } else {
      // Single seat drag
      setSeatPosition(musicianId, {
        x,
        y,
        isManuallyPlaced: true,
      });
    }
  }, [setSeatPosition, seatPositions, wedges]);

  return {
    handleDragEnd,
  };
}
