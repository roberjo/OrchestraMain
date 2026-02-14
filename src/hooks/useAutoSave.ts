import { useEffect } from 'react';
import { useStore } from '@/store/index.ts';
import { serializeProject } from '@/utils/projectSerializer.ts';

const STORAGE_KEY = 'orchestra-project-autosave';
const STORAGE_INTERVAL = 10000; // Auto-save every 10 seconds

/**
 * Automatically save project state to localStorage
 */
export function useAutoSave(enabled = true) {
  const projectName = useStore((s) => s.projectName);
  const layoutType = useStore((s) => s.layoutType);
  const musicians = useStore((s) => s.musicians);
  const seatPositions = useStore((s) => s.seatPositions);
  const layoutConfig = useStore((s) => s.layoutConfig);

  useEffect(() => {
    if (!enabled || Object.keys(musicians).length === 0) {
      return;
    }

    const saveProject = () => {
      try {
        const snapshot = serializeProject(projectName, layoutType, musicians, seatPositions, layoutConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch (error) {
        console.warn('Failed to auto-save project:', error);
      }
    };

    // Save immediately on mount if there are musicians
    saveProject();

    // Save periodically
    const intervalId = setInterval(saveProject, STORAGE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [projectName, layoutType, musicians, seatPositions, layoutConfig, enabled]);
}

/**
 * Load last auto-saved project from localStorage
 */
export function loadAutoSavedProject() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to load auto-saved project:', error);
    return null;
  }
}

/**
 * Clear auto-saved project
 */
export function clearAutoSave() {
  localStorage.removeItem(STORAGE_KEY);
}
