'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

type Post = { id: string; title: string; content: string; createdAt: string; author: { displayName: string | null } };
type Comment = { id: string; content: string; createdAt: string; author: { displayName: string | null } };

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load(id: string) {
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`/api/posts/${id}`), fetch(`/api/posts/${id}/comments`),
    ]);
    const postPayload = await postResponse.json();
    const commentsPayload = await commentsResponse.json();
    if (!postResponse.ok) throw new Error(postPayload.error?.message ?? 'Post not found.');
    if (!commentsResponse.ok) throw new Error(commentsPayload.error?.message ?? 'Unable to load comments.');
    setPost(postPayload.data.post);
    setComments(commentsPayload.data.comments ?? []);
  }

  useEffect(() => { void params.then(({ id }) => load(id)).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load post.')); }, [params]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      const payload = await response.json();
      if (!response.ok) { setMessage(payload.error?.message ?? 'Unable to add comment.'); return; }
      setContent(''); setMessage(''); await load(id);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to add comment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}>
      <p><Link href="/posts">← Back to posts</Link></p>
      {message && !post && <p role="alert">{message}</p>}
      {post && <>
        <article><h1>{post.title}</h1><p>{post.content}</p><small>By {post.author.displayName ?? 'NEXUS member'} · {new Date(post.createdAt).toLocaleDateString()}</small></article>
        <section style={{ marginTop: '3rem' }}><h2>Comments</h2>
          {comments.map((comment) => <article key={comment.id} style={{ padding: '1rem 0', borderBottom: '1px solid #ddd' }}><p>{comment.content}</p><small>{comment.author.displayName ?? 'NEXUS member'}</small></article>)}
          <form onSubmit={submitComment} style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}><textarea required rows={4} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write a comment" /><button type="submit" disabled={submitting}>{submitting ? 'Posting…' : 'Comment'}</button></form>
          {message && <p role="alert">{message}</p>}
        </section>
      </>}
    </main>
  );
}
