'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type AuditLog = { id: string; action: string; entity: string; entityId: string | null; userId: string | null; createdAt: string };

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [message, setMessage] = useState('');
  useEffect(() => { fetch('/api/admin/audit-logs').then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load audit logs.'); setLogs(payload.data.logs); }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load audit logs.')); }, []);
  return <main style={{ maxWidth: 1000, margin: '4rem auto', padding: '2rem' }}><p><Link href="/admin">← Admin overview</Link></p><h1>Audit log</h1>{message && <p role="alert">{message}</p>}<table><thead><tr><th>Action</th><th>Entity</th><th>Entity ID</th><th>User ID</th><th>Created</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{log.action}</td><td>{log.entity}</td><td>{log.entityId ?? '—'}</td><td>{log.userId ?? '—'}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table></main>;
}
