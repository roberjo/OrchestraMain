import type { Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';

export interface ProjectSnapshot {
  version: string;
  name: string;
  layoutType: string;
  timestamp: number;
  musicians: Musician[];
  seatPositions: Record<string, SeatPosition>;
  layoutConfig: LayoutConfig;
}

const CURRENT_VERSION = '1.0.0';

export function serializeProject(
  projectName: string,
  layoutType: string,
  musicians: Record<string, Musician>,
  seatPositions: Record<string, SeatPosition>,
  layoutConfig: LayoutConfig
): ProjectSnapshot {
  return {
    version: CURRENT_VERSION,
    name: projectName,
    layoutType,
    timestamp: Date.now(),
    musicians: Object.values(musicians),
    seatPositions,
    layoutConfig,
  };
}

export function deserializeProject(json: string): ProjectSnapshot {
  try {
    const parsed = JSON.parse(json);

    // Validate version
    if (!parsed.version || parsed.version[0] !== CURRENT_VERSION[0]) {
      throw new Error(`Incompatible version: ${parsed.version}`);
    }

    // Validate required fields
    if (!parsed.name || !parsed.layoutType || !parsed.musicians || !parsed.seatPositions || !parsed.layoutConfig) {
      throw new Error('Invalid project format: missing required fields');
    }

    return parsed as ProjectSnapshot;
  } catch (error) {
    throw new Error(`Failed to deserialize project: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function exportProjectAsJSON(project: ProjectSnapshot): string {
  return JSON.stringify(project, null, 2);
}

export function downloadJSON(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDownloadFilename(projectName: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = projectName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  return `orchestra-${safeName || 'project'}-${timestamp}.json`;
}
