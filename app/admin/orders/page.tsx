'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = { id: string; totalCents: number; currency: string; status: string; createdAt: string; user: { email: string; displayName: string | null } };
const statuses = ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  async function load() { const response = await fetch('/api/admin/orders'); const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load orders.'); setOrders(payload.data.orders); }
  useEffect(() => { void load().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load orders.')); }, []);
  async function update(orderId: string, status: string) { const response = await fetch(`/api/admin/orders?orderId=${encodeURIComponent(orderId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); const payload = await response.json(); if (!response.ok) { setMessage(payload.error?.message ?? 'Update failed.'); return; } setMessage('Order updated.'); await load(); }
  return <main style={{ maxWidth: 1100, margin: '4rem auto', padding: '2rem' }}><p><Link href="/admin">← Admin overview</Link></p><h1>Orders</h1>{message && <p role="status">{message}</p>}<table><thead><tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.user.email}</td><td>{order.currency} {(order.totalCents / 100).toFixed(2)}</td><td>{order.status}</td><td><select value={order.status} onChange={(event) => void update(order.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></main>;
}
