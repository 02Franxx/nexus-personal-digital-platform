'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Registration failed.');
      window.location.href = '/login';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 420, margin: '6rem auto', padding: '2rem' }}>
      <h1>Create your NEXUS account</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <label>Display name<input required maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
        <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        {message && <p role="alert">{message}</p>}
      </form>
      <p>Already registered? <Link href="/login">Sign in</Link></p>
    </main>
  );
}
