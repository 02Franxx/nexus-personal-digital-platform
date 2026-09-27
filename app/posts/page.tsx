'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = { id: string; title: string; content: string; category: string | null; tags: string[]; createdAt: string; author: { id: string; displayName: string | null } };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  async function loadFirstPage(search = '', selectedCategory = category, selectedTag = tag) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedTag) params.set('tag', selectedTag);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/posts${suffix}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load posts.');
      setPosts(payload.data.posts);
      setNextCursor(payload.data.nextCursor);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to load posts.');
    } finally {
      setLoading(false);
    }
  }

  // The initial request must run once; search/filter changes are explicit form submissions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadFirstPage(); }, []);

  async function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    setActiveQuery(normalized);
    await loadFirstPage(normalized, category.trim(), tag.trim());
  }

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ cursor: nextCursor });
      if (activeQuery) params.set('q', activeQuery);
      if (category.trim()) params.set('category', category.trim());
      if (tag.trim()) params.set('tag', tag.trim());
      const response = await fetch(`/api/posts?${params.toString()}`);
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
      <p><Link href="/">← Back to workspace</Link> · <Link href="/favorites">Saved posts</Link></p>
      <h1>Posts</h1>
      <form onSubmit={submitSearch} style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 2rem' }}>
        <input aria-label="Search posts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts" />
        <input aria-label="Filter category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
        <input aria-label="Filter tag" value={tag} onChange={(event) => setTag(event.target.value)} placeholder="Tag" />
        <button type="submit" disabled={loading}>Search</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <section style={{ display: 'grid', gap: '1.5rem' }}>
        {posts.map((post) => <article key={post.id} style={{ padding: '1.5rem', border: '1px solid #ddd' }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {(post.category || post.tags.length > 0) && <small>{post.category ?? 'Uncategorized'}{post.tags.length > 0 ? ` · ${post.tags.join(', ')}` : ''}</small>}
          <small>{post.author.displayName ?? 'NEXUS member'} · {new Date(post.createdAt).toLocaleDateString()}</small>
        </article>)}
        {!error && !loading && posts.length === 0 && <p>{activeQuery ? 'No matching posts found.' : 'No published posts yet.'}</p>}
      </section>
      {nextCursor && <button type="button" onClick={loadMore} disabled={loading}>{loading ? 'Loading…' : 'Load more'}</button>}
    </main>
  );
}
