'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/profile').then((response) => response.json()).then((payload) => {
      if (payload.data?.user) setDisplayName(payload.data.user.displayName ?? '');
    }).catch(() => setMessage('Unable to load profile.'));
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/auth/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName }) });
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

  return <main style={{ maxWidth: 560, margin: '4rem auto', padding: '2rem', display: 'grid', gap: '2rem' }}>
    <p><Link href="/">← Back to workspace</Link></p><h1>Profile settings</h1>
    <form onSubmit={updateProfile} style={{ display: 'grid', gap: '1rem' }}><h2>Profile</h2><label>Display name<input required maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><button type="submit">Save profile</button></form>
    <form onSubmit={changePassword} style={{ display: 'grid', gap: '1rem' }}><h2>Password</h2><input type="password" required minLength={12} placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><input type="password" required minLength={12} placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button type="submit">Change password</button></form>
    <section><h2>Danger zone</h2><button type="button" onClick={() => void deleteAccount()}>Delete account</button></section>
    {message && <p role="status">{message}</p>}
  </main>;
}
