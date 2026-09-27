'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Notification = { id: string; type: string; message: string; readAt: string | null; createdAt: string };

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/notifications');
    const payload = await response.json();
    if (!response.ok) { setError(payload.error?.message ?? 'Unable to load notifications.'); return; }
    setItems(payload.data.notifications);
    setUnreadCount(payload.data.unreadCount);
  }

  useEffect(() => { void load(); }, []);

  async function markRead(id: string) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) });
    await load();
  }

  async function markAllRead() {
    const response = await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    if (!response.ok) { const payload = await response.json(); setError(payload.error?.message ?? 'Unable to mark notifications as read.'); return; }
    await load();
  }

  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '2rem' }}>
      <p><Link href="/">← Back to workspace</Link></p>
      <h1>Notifications</h1>
      <p>{unreadCount} unread {unreadCount > 0 && <button type="button" onClick={() => void markAllRead()}>Mark all as read</button>}</p>
      {error && <p role="alert">{error}</p>}
      <ul style={{ display: 'grid', gap: '1rem', padding: 0, listStyle: 'none' }}>
        {items.map((item) => <li key={item.id} style={{ padding: '1rem', border: '1px solid #ddd', opacity: item.readAt ? 0.65 : 1 }}>
          <strong>{item.type}</strong><p>{item.message}</p>
          {!item.readAt && <button type="button" onClick={() => void markRead(item.id)}>Mark as read</button>}
        </li>)}
      </ul>
    </main>
  );
}
