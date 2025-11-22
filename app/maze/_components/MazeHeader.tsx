'use client';

import Link from 'next/link';
import styles from './MazeHeader.module.css';

export default function MazeHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.backArrow}>
        ← Back
      </Link>
      {/* Later you can add stats here */}
    </header>
  );
}
