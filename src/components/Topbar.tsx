'use client';

import { useRouter } from 'next/navigation';
import styles from '../dashboard.module.css';

export default function Topbar({ page }: { page: string }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return <header className={styles.topbar}>
    <div className={styles.breadcrumb}>Workspace <span>/</span> <b>{page}</b></div>
    <div className={styles.topActions}>
      ⌕　♧ <span className={styles.avatar}>AK</span>
      <button type="button" onClick={logout} aria-label="Sign out">Sign out</button>
    </div>
  </header>;
}
