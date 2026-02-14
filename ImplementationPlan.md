Implementation Phases
Phase 1: Project Scaffolding + Data Models
Create: Vite project, all config files (tsconfig, tailwind, eslint, prettier, .gitignore), all TypeScript type definitions, instrument taxonomy with 40+ instruments and 60+ aliases, layout presets (American/German/Concert Band), color palette, Zustand store with 5 empty slices, empty App shell with 3-panel grid layout.
Verify: npm run dev shows empty 3-panel layout with header.
Phase 2: Import System
Create: CSV parser (PapaParse wrapper), XLSX parser (SheetJS wrapper), useFileImport hook with instrument fuzzy-matching, ImportWizard modal (3-step: source -> map columns -> preview), FileUploader drag-drop zone, ColumnMapper with auto-detection, ManualEntryForm, ImportPreview with validation warnings, shared Modal/Button components.
Modify: rosterSlice (implement CRUD), uiSlice (modal state), AppHeader (Import button).
Verify: Drop a CSV, map columns, preview with warnings, confirm. Musicians load into store.
Phase 3: Layout Algorithm + Static Rendering
Create: arcGeometry.ts (polar math), sectionAssigner.ts, spacingCalculator.ts, layoutEngine.ts (main computeLayout()), useAutoLayout hook, StageCanvas with react-konva, StageBackground (arc guides), ConductorMarker, SeatNode (static, not yet draggable), SectionGroup, Sidebar, RosterPanel, SectionLegend.
Modify: layoutSlice (implement recalculateLayout), AppLayout (wire sidebar + canvas).
Verify: Import 60 musicians. Canvas shows color-coded seats in concentric arcs. Switching layout type re-arranges.
Phase 4: Interactive Canvas
Create: useDragSeat, useStageZoom, useKeyboardShortcuts, useUndoRedo, SelectionRect (rubber-band), CanvasControls (zoom, fit-to-view, re-layout), PropertiesPanel, SeatProperties, LayoutSettings, Tooltip.
Modify: SeatNode (add draggable, onClick, hover effects, selection styling), StageCanvas (zoom/pan/keyboard), uiSlice (selection), layoutSlice (isManuallyPlaced), historySlice (undo/redo), RosterPanel (click-to-select sync).
Verify: Drag seats, undo/redo, multi-select, zoom/pan, edit properties, fit-to-view.
Phase 5: Save/Load + Persistence
Create: projectSerializer.ts (serialize/deserialize with version), useAutoSave (debounced localStorage).
Modify: projectSlice (newProject, loadProject), AppHeader (Save JSON, Load JSON, New Project, inline project name edit), App.tsx (auto-restore from localStorage on mount).
Verify: Save to JSON, close browser, reopen and load JSON. All positions restored including manual placements.
Phase 6: Export (PDF, PNG, Print)
Create: ExportPanel modal, PdfDocument (@react-pdf/renderer Document), PdfSeatMap (draws seats on PDF Canvas), PrintView (hidden div with print CSS), canvasExporter.ts (Konva -> PNG).
Modify: AppHeader (Export button), globals.css (@media print styles).
Verify: Export PDF with labeled seats and section legend. Export PNG at 2x resolution. Browser print produces clean stage plot.

Section Color Palette
SectionColorHexStringsBlue#4A90D9WoodwindsGreen#50B86CBrassGold#E8A838PercussionRed#D94A4AKeyboardPurple#9B59B6OtherGray#95A5A6

Key Architectural Decisions

react-konva over SVG/DOM — Canvas-based rendering handles 100+ draggable seats efficiently; built-in drag-drop; PNG export for free
localStorage-first persistence — Zero infrastructure cost, works offline, no auth needed. JSON export/import provides portability. Supabase can layer on later
Separate PDF rendering path — @react-pdf/renderer cannot render Konva directly; shares same position data from store but draws via PDF Canvas API
Snapshot-based undo/redo — Simpler than command pattern; position data for 100 musicians is small (~10KB per snapshot); 50-entry stack cap
Instrument alias map — 60+ common abbreviations (e.g., "vln 1" -> violin-1) for robust CSV import matching


Verification Plan
After each phase, verify end-to-end:

Phase 1: npm run dev starts, empty 3-panel layout renders
Phase 2: Import sample CSV (Name, Instrument, Chair columns), musicians appear in roster
Phase 3: Auto-layout renders 60+ musicians in correct arc positions with section colors
Phase 4: Drag seats, undo/redo works, zoom/pan smooth, properties panel edits apply
Phase 5: Save project JSON, reload from JSON, localStorage auto-restore works
Phase 6: PDF export readable with all labels, PNG export high-res, print layout clean

Sample test CSV (to create during Phase 2 verification):
csvName,Instrument,Chair
Jane Smith,1st Violin,1
John Doe,1st Violin,2