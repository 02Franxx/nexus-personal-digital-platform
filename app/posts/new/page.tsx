'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, published }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to create post.');
      window.location.href = '/posts';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create post.');
    } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}>
      <p><Link href="/posts">← Back to posts</Link></p>
      <h1>Create a post</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
        <label>Title<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Content<textarea required maxLength={100000} rows={12} value={content} onChange={(event) => setContent(event.target.value)} /></label>
        <label><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish immediately</label>
        <button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create post'}</button>
        {message && <p role="alert">{message}</p>}
      </form>
    </main>
  );
}
