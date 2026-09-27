import Dashboard from '../src/Dashboard';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return <Dashboard displayName={user.displayName ?? user.email.split('@')[0]} />;
}
