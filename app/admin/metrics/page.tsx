'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Metrics = { service: string; timestamp: string; uptimeSeconds: number; nodeVersion: string; memory: { rssBytes: number; heapUsedBytes: number; heapTotalBytes: number } };

function formatBytes(value: number): string {
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/health/metrics').then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load service metrics.');
      setMetrics(payload.data);
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load service metrics.'));
  }, []);

  return (
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}>
      <p><Link href="/admin">← Back to admin</Link></p>
      <h1>Runtime metrics</h1>
      {message && <p role="alert">{message}</p>}
      {metrics && <section style={{ display: 'grid', gap: '1rem' }}>
        <p>Service: {metrics.service}</p>
        <p>Node.js: {metrics.nodeVersion}</p>
        <p>Uptime: {Math.round(metrics.uptimeSeconds / 60)} minutes</p>
        <p>Memory: {formatBytes(metrics.memory.heapUsedBytes)} / {formatBytes(metrics.memory.heapTotalBytes)}</p>
        <small>Collected {new Date(metrics.timestamp).toLocaleString()}</small>
      </section>}
    </main>
  );
}
