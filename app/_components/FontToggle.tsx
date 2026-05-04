'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const FONT_KEY = 'playland-font';

type FontMode = 'sans-serif' | 'serif';

function applyFont(mode: FontMode) {
  const root = document.documentElement;
  root.setAttribute('data-font', mode);
}

export default function FontToggle() {
  const isHydratedClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [font, setFont] = useState<FontMode>(() => {
    if (typeof window === 'undefined') return 'sans-serif';
    const saved = window.localStorage.getItem(FONT_KEY);
    if (saved === 'sans-serif' || saved === 'serif') return saved;
    return 'sans-serif';
  });

  useEffect(() => {
    applyFont(font);
    window.localStorage.setItem(FONT_KEY, font);
  }, [font]);

  function toggleFont() {
    const next: FontMode = font === 'sans-serif' ? 'serif' : 'sans-serif';
    setFont(next);
  }

  if (!isHydratedClient) return null;

  return (
    <button
      type="button"
      className="fontToggle"
      onClick={toggleFont}
      aria-label={`Switch to ${font === 'sans-serif' ? 'serif' : 'sans-serif'} font`}
      title={`Switch to ${font === 'sans-serif' ? 'serif' : 'sans-serif'} font`}
    >
      <span aria-hidden="true" className="fontToggleIcon">
        {font === 'sans-serif' ? 'Aa' : '𝐀𝐚'}
      </span>
    </button>
  );
}
