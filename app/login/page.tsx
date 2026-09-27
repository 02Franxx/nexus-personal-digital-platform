'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Login failed.');
      window.location.href = '/';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 420, margin: '6rem auto', padding: '2rem' }}>
      <h1>Sign in to NEXUS</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        {message && <p role="alert">{message}</p>}
      </form>
      <p>New to NEXUS? <Link href="/register">Create an account</Link></p>
    </main>
  );
}
