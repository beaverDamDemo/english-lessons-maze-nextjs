// app/map/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/map.module.css';
import { useState, useEffect } from 'react';

export default function MapPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1200; // Reference width
      const baseHeight = 800; // Reference height
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scaleByWidth = windowWidth / baseWidth;
      const scaleByHeight = windowHeight / baseHeight;

      const newScale = Math.min(scaleByWidth, scaleByHeight);
      setScale(Math.max(newScale, 0.5)); // Minimum 50% scale
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1200px',
          height: '800px',
        }}
      >
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
      </div>
    </div>
  );
}
