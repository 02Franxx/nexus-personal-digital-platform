'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = { id: string; title: string; content: string; createdAt: string; author: { id: string; displayName: string | null } };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts').then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load posts.');
      setPosts(payload.data.posts);
      setNextCursor(payload.data.nextCursor);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load posts.'))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?cursor=${encodeURIComponent(nextCursor)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load more posts.');
      setPosts((current) => [...current, ...payload.data.posts]);
      setNextCursor(payload.data.nextCursor);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to load more posts.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}>
      <p><Link href="/">← Back to workspace</Link></p>
      <h1>Posts</h1>
      {error && <p role="alert">{error}</p>}
      <section style={{ display: 'grid', gap: '1.5rem' }}>
        {posts.map((post) => <article key={post.id} style={{ padding: '1.5rem', border: '1px solid #ddd' }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>{post.author.displayName ?? 'NEXUS member'} · {new Date(post.createdAt).toLocaleDateString()}</small>
        </article>)}
        {!error && !loading && posts.length === 0 && <p>No published posts yet.</p>}
      </section>
      {nextCursor && <button type="button" onClick={loadMore} disabled={loading}>{loading ? 'Loading…' : 'Load more'}</button>}
    </main>
  );
}
