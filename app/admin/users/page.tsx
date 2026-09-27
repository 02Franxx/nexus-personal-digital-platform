'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = { id: string; email: string; displayName: string | null; role: 'USER' | 'ADMIN'; createdAt: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/admin/users'); const payload = await response.json();
    if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load users.');
    setUsers(payload.data.users);
  }
  useEffect(() => { void load().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load users.')); }, []);

  async function changeRole(user: User) {
    const role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const response = await fetch(`/api/admin/users?userId=${encodeURIComponent(user.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error?.message ?? 'Unable to change role.'); return; }
    setMessage('Role updated.'); await load();
  }

  return <main style={{ maxWidth: 900, margin: '4rem auto', padding: '2rem' }}><p><Link href="/admin">← Admin overview</Link></p><h1>Users</h1>{message && <p role="status">{message}</p>}<table><thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.email}</td><td>{user.displayName ?? '—'}</td><td>{user.role}</td><td><button type="button" onClick={() => void changeRole(user)}>Make {user.role === 'ADMIN' ? 'user' : 'admin'}</button></td></tr>)}</tbody></table></main>;
}
