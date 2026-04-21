'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

type Mode = 'register' | 'login';

export default function RegisterPage() {
  const [mode, setMode] = useState<Mode>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const endpoint =
    mode === 'register' ? '/api/auth/register' : '/api/auth/login';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.error ?? 'Request failed.');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>Thai English Playland</h1>
        <p className={styles.subtitle}>
          {mode === 'register'
            ? 'Create your account to start.'
            : 'Log in to continue.'}
        </p>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={styles.input}
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            autoComplete={
              mode === 'register' ? 'new-password' : 'current-password'
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'register'
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <button
          className={styles.switchMode}
          type="button"
          onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
        >
          {mode === 'register'
            ? 'Already have an account? Log in'
            : "Don't have an account? Register"}
        </button>
      </section>
    </main>
  );
}
