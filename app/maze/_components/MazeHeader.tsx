'use client';

import Link from 'next/link';
import styles from './MazeHeader.module.css';

export default function MazeHeader({ score }: { score: number }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.backArrow}>
        ← Back
      </Link>
      <div className={styles.score}>Score: {score}</div>
    </header>
  );
}
