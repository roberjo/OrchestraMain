import { useEffect, useRef } from 'react';
import { useStore } from '@/store/index.ts';
import { computeLayout } from '@/engine/layoutEngine.ts';

/**
 * Hook that automatically recomputes layout when roster or layout config changes.
 */
export function useAutoLayout() {
  const musicians = useStore((s) => s.musicians);
  const layoutConfig = useStore((s) => s.layoutConfig);
  const layoutType = useStore((s) => s.layoutType);
  const setSeatPositions = useStore((s) => s.setSeatPositions);
  const seatPositions = useStore((s) => s.seatPositions);

  const prevMusicianCount = useRef(0);
  const prevLayoutType = useRef(layoutType);

  useEffect(() => {
    const musicianList = Object.values(musicians);
    const currentCount = musicianList.length;
    const layoutChanged = prevLayoutType.current !== layoutType;

    // Only recompute if musicians changed or layout type changed
    if (currentCount === 0) {
      if (Object.keys(seatPositions).length > 0) {
        setSeatPositions({});
      }
      prevMusicianCount.current = 0;
      prevLayoutType.current = layoutType;
      return;
    }

    const needsRecompute =
      currentCount !== prevMusicianCount.current ||
      layoutChanged ||
      Object.keys(seatPositions).length === 0;

    if (needsRecompute) {
      const config = { ...layoutConfig, layoutType };
      const newPositions = computeLayout(musicianList, config);

      // Preserve manually placed seats
      for (const [id, pos] of Object.entries(seatPositions)) {
        if (pos.isManuallyPlaced && newPositions[id]) {
          newPositions[id] = { ...pos };
        }
      }

      setSeatPositions(newPositions);
    }

    prevMusicianCount.current = currentCount;
    prevLayoutType.current = layoutType;
  }, [musicians, layoutConfig, layoutType, setSeatPositions, seatPositions]);
}
