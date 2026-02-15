import { useState } from 'react';
import { Modal } from '@/components/shared/Modal.tsx';
import { Button } from '@/components/shared/Button.tsx';
import { useStore } from '@/store/index.ts';
import { getExportFilename } from '@/utils/canvasExporter.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { SECTION_COLORS, SECTION_DISPLAY_NAMES } from '@/utils/colorPalette.ts';
import type { InstrumentFamily, Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'png' | 'pdf' | 'print';

export function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);

  const projectName = useStore((s) => s.projectName);
  const musicians = useStore((s) => s.musicians);
  const seatPositions = useStore((s) => s.seatPositions);
  const layoutConfig = useStore((s) => s.layoutConfig);
  const layoutType = useStore((s) => s.layoutType);

  const musicianCount = Object.keys(musicians).length;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (selectedFormat === 'png') {
        await exportAsPNG(projectName, Object.values(musicians), seatPositions, layoutConfig);
      } else if (selectedFormat === 'pdf') {
        await exportAsPDF(projectName, layoutType, Object.values(musicians), seatPositions, layoutConfig);
      } else if (selectedFormat === 'print') {
        triggerPrint(projectName, layoutType, Object.values(musicians), seatPositions, layoutConfig);
      }
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Layout" width="max-w-xl">
      <div className="space-y-6">
        {/* Format selection */}
        <div className="grid grid-cols-3 gap-3">
          <FormatOption
            format="png"
            label="PNG Image"
            description="High-res image (2x)"
            icon="🖼"
            isSelected={selectedFormat === 'png'}
            onSelect={() => setSelectedFormat('png')}
          />
          <FormatOption
            format="pdf"
            label="PDF Document"
            description="Print-ready stage plot"
            icon="📄"
            isSelected={selectedFormat === 'pdf'}
            onSelect={() => setSelectedFormat('pdf')}
          />
          <FormatOption
            format="print"
            label="Print"
            description="Browser print dialog"
            icon="🖨"
            isSelected={selectedFormat === 'print'}
            onSelect={() => setSelectedFormat('print')}
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-[var(--color-bg-tertiary)] p-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong>{projectName}</strong> &mdash; {musicianCount} musicians
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            {selectedFormat === 'png' && 'Exports the canvas as a high-resolution PNG image at 2x scale.'}
            {selectedFormat === 'pdf' && 'Generates a PDF document with the stage layout, musician names, and section legend.'}
            {selectedFormat === 'print' && 'Opens your browser print dialog with a clean stage plot layout.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleExport} disabled={isExporting || musicianCount === 0}>
            {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function FormatOption({
  format: _format,
  label,
  description,
  icon,
  isSelected,
  onSelect,
}: {
  format: string;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-lg border-2 p-4 text-center transition-all ${
        isSelected
          ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] shadow-sm'
          : 'border-[var(--color-border-light)] hover:border-[var(--color-border-medium)]'
      }`}
    >
      <div className="mb-1 text-2xl">{icon}</div>
      <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
      <div className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{description}</div>
    </button>
  );
}

// ─── Export Implementations ─────────────────────────────────────

async function exportAsPNG(
  projectName: string,
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  config: LayoutConfig,
) {
  const canvas = renderToCanvas(musicians, positions, config, projectName);
  const dataURL = canvas.toDataURL('image/png');
  const filename = getExportFilename(projectName, 'png');

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportAsPDF(
  projectName: string,
  layoutType: string,
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  config: LayoutConfig,
) {
  // Use a Canvas-based approach for PDF (simpler, no @react-pdf/renderer needed at runtime)
  const canvas = renderToCanvas(musicians, positions, config, projectName, layoutType);
  const dataURL = canvas.toDataURL('image/png');
  const filename = getExportFilename(projectName, 'pdf');

  // Create a simple HTML-based PDF using the print approach
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window. Check your popup blocker.');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${projectName} - Stage Plot</title>
      <style>
        @page { size: landscape; margin: 0.5in; }
        body { margin: 0; font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header p { font-size: 12px; color: #666; margin: 4px 0 0; }
        img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
        .footer { text-align: center; margin-top: 10px; font-size: 10px; color: #999; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${projectName}</h1>
        <p>${layoutType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} &mdash; ${musicians.length} musicians &mdash; ${new Date().toLocaleDateString()}</p>
      </div>
      <img src="${dataURL}" />
      <div class="footer">Generated by Orchestra Layout Builder</div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();

  // If the user wants a direct download, use a blob
  // For now, the print dialog in the popup serves as PDF (via "Save as PDF")
  void filename;
}

function triggerPrint(
  projectName: string,
  layoutType: string,
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  config: LayoutConfig,
) {
  const canvas = renderToCanvas(musicians, positions, config, projectName, layoutType);
  const dataURL = canvas.toDataURL('image/png');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window. Check your popup blocker.');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${projectName} - Stage Plot</title>
      <style>
        @page { size: landscape; margin: 0.5in; }
        body { margin: 0; font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header p { font-size: 12px; color: #666; margin: 4px 0 0; }
        img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
        .legend { display: flex; justify-content: center; gap: 20px; margin-top: 15px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        .footer { text-align: center; margin-top: 10px; font-size: 10px; color: #999; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${projectName}</h1>
        <p>${layoutType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} &mdash; ${musicians.length} musicians &mdash; ${new Date().toLocaleDateString()}</p>
      </div>
      <img src="${dataURL}" />
      <div class="legend">
        ${buildLegendHTML(musicians)}
      </div>
      <div class="footer">Generated by Orchestra Layout Builder</div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function buildLegendHTML(musicians: Musician[]): string {
  const sections = new Map<InstrumentFamily, number>();
  for (const m of musicians) {
    sections.set(m.section, (sections.get(m.section) ?? 0) + 1);
  }

  return Array.from(sections.entries())
    .map(([family, count]) => {
      const color = SECTION_COLORS[family];
      const name = SECTION_DISPLAY_NAMES[family];
      return `<div class="legend-item"><span class="legend-dot" style="background-color:${color}"></span>${name} (${count})</div>`;
    })
    .join('');
}

/**
 * Render the stage layout to an HTML Canvas element for export.
 */
function renderToCanvas(
  musicians: Musician[],
  positions: Record<string, SeatPosition>,
  config: LayoutConfig,
  projectName: string,
  _layoutType?: string,
): HTMLCanvasElement {
  const scale = 2; // 2x for high-res export
  const padding = 80;
  const canvasWidth = config.stageWidth + padding * 2;
  const canvasHeight = config.stageHeight + padding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Stage area
  ctx.fillStyle = '#f9fafb';
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(padding - 20, padding - 20, config.stageWidth + 40, config.stageHeight + 40, 8);
  ctx.fill();
  ctx.stroke();

  // Arc guides
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let row = 0; row < 7; row++) {
    const radius = config.innerRadius + row * config.rowSpacing;
    const halfSpan = ((config.arcSpanAngle / 2) * Math.PI) / 180;
    const centerAngle = Math.PI / 2;

    ctx.beginPath();
    ctx.arc(
      config.conductorX + padding,
      config.conductorY + padding,
      radius,
      -(centerAngle + halfSpan),
      -(centerAngle - halfSpan),
    );
    ctx.stroke();
  }

  // Conductor marker
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(config.conductorX + padding, config.conductorY + padding, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#6b7280';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Conductor', config.conductorX + padding, config.conductorY + padding + 22);

  // Seat nodes
  for (const musician of musicians) {
    const pos = positions[musician.id];
    if (!pos) continue;

    const x = pos.x + padding;
    const y = pos.y + padding;
    const color = SECTION_COLORS[musician.section] ?? '#9ca3af';
    const instrumentName = INSTRUMENTS[musician.instrument]?.name ?? musician.instrument;

    // Seat circle
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(x, y, config.seatRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chair number inside circle
    if (musician.chair && config.seatRadius >= 10) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(7, config.seatRadius - 5)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(musician.chair), x, y);
    }

    // Name below circle
    ctx.fillStyle = '#374151';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const displayName = musician.name.length > 14 ? musician.name.substring(0, 13) + '...' : musician.name;
    ctx.fillText(displayName, x, y + config.seatRadius + 3);

    // Instrument name below name (small)
    ctx.fillStyle = '#9ca3af';
    ctx.font = '7px Arial';
    ctx.fillText(instrumentName, x, y + config.seatRadius + 14);
  }

  // Title at top
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(projectName, canvasWidth / 2, 15);

  // Audience indicator
  ctx.fillStyle = '#9ca3af';
  ctx.font = '11px Arial';
  ctx.fillText('AUDIENCE', canvasWidth / 2, canvasHeight - 25);

  // Section legend at bottom
  const legendSections = new Map<InstrumentFamily, number>();
  for (const m of musicians) {
    legendSections.set(m.section, (legendSections.get(m.section) ?? 0) + 1);
  }

  let legendX = canvasWidth / 2 - (legendSections.size * 80) / 2;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const [family, count] of legendSections) {
    const color = SECTION_COLORS[family];
    const name = SECTION_DISPLAY_NAMES[family];

    // Color dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(legendX, canvasHeight - 50, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#4b5563';
    ctx.font = '10px Arial';
    ctx.fillText(`${name} (${count})`, legendX + 10, canvasHeight - 50);

    legendX += 90;
  }

  return canvas;
}
