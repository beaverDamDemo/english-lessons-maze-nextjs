'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './settings.module.css';

type UserRow = {
  id: number;
  username: string;
  created_at: string;
  total_events: number;
  first_event_at: string | null;
  last_event_at: string | null;
};

type SettingsResponse = {
  ok: boolean;
  totalUsers: number;
  users: UserRow[];
  error?: string;
};

export default function SettingsPage() {
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch('/api/settings/overview', { cache: 'no-store' });
        const json = (await response.json()) as SettingsResponse;
        if (!response.ok || !json.ok) {
          setError(json.error ?? 'Failed to load settings.');
          return;
        }
        if (!cancelled) {
          setData(json);
        }
      } catch {
        if (!cancelled) {
          setError('Network error while loading settings.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Settings</h1>
        <Link href="/" className={styles.backLink}>
          Back to Home
        </Link>
      </div>

      {loading ? <p className={styles.note}>Loading...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {data ? (
        <>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Database Overview</h2>
            <p className={styles.metric}>Total users: {data.totalUsers}</p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Users Analytics</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Registered</th>
                    <th>Total Events</th>
                    <th>First Event</th>
                    <th>Last Event</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{new Date(user.created_at).toLocaleString()}</td>
                      <td>{user.total_events}</td>
                      <td>
                        {user.first_event_at
                          ? new Date(user.first_event_at).toLocaleString()
                          : '-'}
                      </td>
                      <td>
                        {user.last_event_at
                          ? new Date(user.last_event_at).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
