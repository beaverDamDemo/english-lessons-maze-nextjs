'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const FONT_SIZE_KEY = 'playland-font-size';

type FontSizeMode = 'normal' | 'large' | 'extra-large';

const FONT_SIZE_VALUES: Record<FontSizeMode, number> = {
  normal: 100,
  large: 125,
  'extra-large': 150,
};

function applyFontSize(mode: FontSizeMode) {
  const root = document.documentElement;
  root.setAttribute('data-font-size', mode);
  root.style.fontSize = `${FONT_SIZE_VALUES[mode]}%`;
}

export default function FontSizeToggle() {
  const isHydratedClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    if (typeof window === 'undefined') return 'normal';
    const saved = window.localStorage.getItem(FONT_SIZE_KEY);
    if (saved === 'normal' || saved === 'large' || saved === 'extra-large') {
      return saved as FontSizeMode;
    }
    return 'normal';
  });

  useEffect(() => {
    applyFontSize(fontSize);
    window.localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  function cycleFontSize() {
    const modes: FontSizeMode[] = ['normal', 'large', 'extra-large'];
    const currentIndex = modes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFontSize(modes[nextIndex]);
  }

  if (!isHydratedClient) return null;

  const getIcon = () => {
    switch (fontSize) {
      case 'normal':
        return 'A';
      case 'large':
        return 'A+';
      case 'extra-large':
        return 'A++';
    }
  };

  return (
    <button
      type="button"
      className="fontSizeToggle"
      onClick={cycleFontSize}
      aria-label={`Font size: ${fontSize}. Click to change.`}
      title={`Font size: ${fontSize} (${FONT_SIZE_VALUES[fontSize]}%). Click to change.`}
    >
      <span aria-hidden="true" className="fontSizeToggleIcon">
        {getIcon()}
      </span>
    </button>
  );
}
