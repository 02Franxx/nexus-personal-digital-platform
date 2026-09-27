'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

type Order = { id: string; totalCents: number; currency: string; status: string; createdAt: string };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCents, setTotalCents] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/orders'); const payload = await response.json();
    if (!response.ok) throw new Error(payload.error?.message ?? 'Unable to load orders.');
    setOrders(payload.data.orders);
  }
  useEffect(() => { void load().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load orders.')); }, []);

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ totalCents: Number(totalCents), currency: 'USD' }) });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error?.message ?? 'Unable to create order.'); return; }
    setTotalCents(''); setMessage('Order created and awaiting payment.'); await load();
  }

  return <main style={{ maxWidth: 760, margin: '4rem auto', padding: '2rem' }}><p><Link href="/">← Back to workspace</Link></p><h1>Orders</h1>
    <form onSubmit={createOrder} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}><input required type="number" min="1" placeholder="Amount in cents" value={totalCents} onChange={(event) => setTotalCents(event.target.value)} /><button type="submit">Create order</button></form>
    {message && <p role="status">{message}</p>}<ul>{orders.map((order) => <li key={order.id}>{order.currency} {(order.totalCents / 100).toFixed(2)} · {order.status} · {new Date(order.createdAt).toLocaleDateString()}</li>)}</ul>
  </main>;
}
