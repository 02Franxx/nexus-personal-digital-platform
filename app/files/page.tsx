'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

type FileRecord = { id: string; name: string; mimeType: string; sizeBytes: number; storageKey: string; createdAt: string };

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [form, setForm] = useState({ name: '', mimeType: 'application/pdf', sizeBytes: '', storageKey: '' });
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/files');
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load files.');
    setFiles(payload.data.files);
  }
  useEffect(() => { void load().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load files.')); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/files', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sizeBytes: Number(form.sizeBytes) }) });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error?.message ?? 'Unable to register file.'); return; }
    setMessage('File metadata registered.'); setForm({ name: '', mimeType: 'application/pdf', sizeBytes: '', storageKey: '' }); await load();
  }

  return <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}><p><Link href="/">← Back to workspace</Link></p><h1>Files</h1>
    <form onSubmit={submit} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}><h2>Register file metadata</h2><input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input required placeholder="Storage key" value={form.storageKey} onChange={(event) => setForm({ ...form, storageKey: event.target.value })} /><input required placeholder="MIME type" value={form.mimeType} onChange={(event) => setForm({ ...form, mimeType: event.target.value })} /><input required type="number" min="1" placeholder="Size in bytes" value={form.sizeBytes} onChange={(event) => setForm({ ...form, sizeBytes: event.target.value })} /><button type="submit">Register metadata</button></form>
    {message && <p role="status">{message}</p>}<ul>{files.map((file) => <li key={file.id}>{file.name} · {file.mimeType} · {file.sizeBytes} bytes</li>)}</ul>
  </main>;
}
