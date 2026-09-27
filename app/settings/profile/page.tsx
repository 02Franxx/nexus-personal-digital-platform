'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [sessions, setSessions] = useState<Array<{ id: string; createdAt: string; expiresAt: string; current: boolean }>>([]);

  useEffect(() => {
    fetch('/api/auth/profile').then((response) => response.json()).then((payload) => {
      if (payload.data?.user) { setDisplayName(payload.data.user.displayName ?? ''); setBio(payload.data.user.bio ?? ''); }
    }).catch(() => setMessage('Unable to load profile.'));
  }, []);

  useEffect(() => {
    fetch('/api/auth/sessions').then((response) => response.json()).then((payload) => {
      if (payload.data?.sessions) setSessions(payload.data.sessions);
    }).catch(() => setMessage('Unable to load active sessions.'));
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/auth/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName, bio }) });
    const payload = await response.json();
    setMessage(response.ok ? 'Profile updated.' : payload.error?.message ?? 'Update failed.');
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/auth/password', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
    const payload = await response.json();
    setMessage(response.ok ? 'Password changed. Please sign in again.' : payload.error?.message ?? 'Password change failed.');
    if (response.ok) { setCurrentPassword(''); setNewPassword(''); }
  }

  async function deleteAccount() {
    const password = window.prompt('Enter your password to delete this account:');
    if (!password || !window.confirm('This permanently deletes your account. Continue?')) return;
    const response = await fetch('/api/auth/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, confirmation: 'DELETE_ACCOUNT' }) });
    const payload = await response.json();
    if (response.ok) window.location.href = '/register';
    else setMessage(payload.error?.message ?? 'Account deletion failed.');
  }

  async function revokeSessions() {
    const response = await fetch('/api/auth/sessions', { method: 'DELETE' });
    const payload = await response.json();
    setMessage(response.ok ? 'All active sessions were revoked.' : payload.error?.message ?? 'Unable to revoke sessions.');
    if (response.ok) setSessions([]);
  }

  return <main style={{ maxWidth: 560, margin: '4rem auto', padding: '2rem', display: 'grid', gap: '2rem' }}>
    <p><Link href="/">← Back to workspace</Link></p><h1>Profile settings</h1>
    <form onSubmit={updateProfile} style={{ display: 'grid', gap: '1rem' }}><h2>Profile</h2><label>Display name<input required maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label>Bio<textarea maxLength={500} rows={4} value={bio} onChange={(event) => setBio(event.target.value)} /></label><button type="submit">Save profile</button></form>
    <form onSubmit={changePassword} style={{ display: 'grid', gap: '1rem' }}><h2>Password</h2><input type="password" required minLength={12} placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><input type="password" required minLength={12} placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button type="submit">Change password</button></form>
    <section style={{ display: 'grid', gap: '0.75rem' }}><h2>Active sessions</h2>{sessions.map((session) => <p key={session.id}>{session.current ? 'This device' : 'Other device'} · created {new Date(session.createdAt).toLocaleString()} · expires {new Date(session.expiresAt).toLocaleDateString()}</p>)}<button type="button" onClick={() => void revokeSessions()} disabled={sessions.length === 0}>Sign out all devices</button></section>
    <section><h2>Danger zone</h2><button type="button" onClick={() => void deleteAccount()}>Delete account</button></section>
    {message && <p role="status">{message}</p>}
  </main>;
}
