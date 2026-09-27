'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = { users: number; posts: number; orders: number; files: number; unreadNotifications: number };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats').then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load admin statistics.');
      setStats(payload.data);
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load statistics.'));
  }, []);

  return <main style={{ maxWidth: 900, margin: '4rem auto', padding: '2rem' }}><p><Link href="/">← Back to workspace</Link></p><h1>Admin overview</h1>
    {message && <p role="alert">{message}</p>}
    {stats && <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>{Object.entries(stats).map(([label, value]) => <article key={label} style={{ border: '1px solid #ddd', padding: '1rem' }}><strong>{label}</strong><p style={{ fontSize: '2rem', margin: 0 }}>{value}</p></article>)}</section>}
    <nav style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}><Link href="/admin/users">Users</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/audit">Audit log</Link><Link href="/notifications">Notifications</Link><Link href="/settings/profile">Profile</Link></nav>
  </main>;
}
