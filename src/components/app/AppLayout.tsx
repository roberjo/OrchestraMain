export function AppLayout() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="no-print flex w-72 flex-col border-r border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Roster</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-400">Import musicians to get started</p>
        </div>
      </aside>

      {/* Center Canvas */}
      <main className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-2 text-4xl">🎼</div>
          <p className="text-sm text-gray-500">
            Import musicians to generate your orchestra layout
          </p>
        </div>
      </main>

      {/* Right Properties Panel (shown when seat selected) */}
      {/* Will be conditionally rendered in Phase 4 */}
    </div>
  );
}
