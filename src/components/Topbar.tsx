import styles from '../dashboard.module.css';
export default function Topbar({ page }: { page: string }) { return <header className={styles.topbar}><div className={styles.breadcrumb}>Workspace <span>/</span> <b>{page}</b></div><div className={styles.topActions}>⌕　♧ <span className={styles.avatar}>AK</span></div></header>; }
