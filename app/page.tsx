// app/map/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/map.module.css';

export default function MapPage() {
  return (
    <div className={styles.mapContainer}>
      <Image
        src="/assets/tinified/map-with-8-clickable-locations.png"
        alt="Game Map"
        fill
        priority
      />
      <Link href="/maze/lesson1" className={styles.location1} />
      <Link href="/maze/lesson2" className={styles.location2} />
      <Link href="/maze/lesson3" className={styles.location3} />
      <Link href="/maze/lesson4" className={styles.location4} />
      <Link href="/maze/lesson5" className={styles.location5} />
      <Link href="/maze/lesson6" className={styles.location6} />
      <Link href="/maze/lesson7" className={styles.location7} />
      <Link href="/maze/lesson8" className={styles.location8} />
    </div>
  );
}
