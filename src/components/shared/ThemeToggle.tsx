import { useStore } from '@/store/index.ts';

export function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary inline-flex gap-2 px-3 py-1.5"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <span className="text-lg">🌙</span>
          <span className="text-xs font-semibold">Dark</span>
        </>
      ) : (
        <>
          <span className="text-lg">☀️</span>
          <span className="text-xs font-semibold">Light</span>
        </>
      )}
    </button>
  );
}
