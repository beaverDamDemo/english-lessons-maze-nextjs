'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const THEME_KEY = 'playland-theme';

type ThemeMode = 'light' | 'dark';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
}

export default function ThemeToggle() {
  const isHydratedClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return getSystemTheme();
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  if (!isHydratedClient) return null;

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span aria-hidden="true" className="themeToggleIcon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
