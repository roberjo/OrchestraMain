import type Konva from 'konva';

/**
 * Export Konva stage to PNG image
 */
export function exportCanvasToPNG(stage: Konva.Stage, filename: string): void {
  try {
    const dataURL = stage.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('Failed to export canvas as PNG');
  }
}

/**
 * Export Konva stage to high-resolution PNG (2x scale)
 */
export function exportCanvasToHighResPNG(stage: Konva.Stage, filename: string, scale: number = 2): void {
  try {
    const originalScale = stage.scaleX();
    const originalX = stage.x();
    const originalY = stage.y();

    // Reset transformation for export
    stage.scaleX(1);
    stage.scaleY(1);
    stage.x(0);
    stage.y(0);

    // Export at higher resolution
    const dataURL = stage.toDataURL({
      pixelRatio: scale,
    });

    // Restore original transformation
    stage.scaleX(originalScale);
    stage.scaleY(originalScale);
    stage.x(originalX);
    stage.y(originalY);

    // Download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export high-res PNG:', error);
    throw new Error('Failed to export canvas as high-resolution PNG');
  }
}

export function getExportFilename(projectName: string, format: 'png' | 'pdf'): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = projectName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  return `orchestra-${safeName || 'layout'}-${timestamp}.${format}`;
}
