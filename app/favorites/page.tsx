'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Favorite = { createdAt: string; post: { id: string; title: string; content: string; createdAt: string; author: { displayName: string | null } } };

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/favorites').then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load saved posts.');
      setFavorites(payload.data.favorites);
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load saved posts.'));
  }, []);

  return <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}>
    <p><Link href="/posts">← Back to posts</Link></p><h1>Saved posts</h1>
    {message && <p role="alert">{message}</p>}
    {favorites.length === 0 && !message && <p>No saved posts yet.</p>}
    <section style={{ display: 'grid', gap: '1rem' }}>{favorites.map(({ post }) => <article key={post.id} style={{ border: '1px solid #ddd', padding: '1rem' }}><h2><Link href={`/posts/${post.id}`}>{post.title}</Link></h2><p>{post.content.slice(0, 180)}{post.content.length > 180 ? '…' : ''}</p><small>{post.author.displayName ?? 'NEXUS member'}</small></article>)}</section>
  </main>;
}
