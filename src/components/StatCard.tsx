import styles from '../dashboard.module.css';
import type { Stat } from './types';
export default function StatCard({ stat }: { stat: Stat }) { return <article className={styles.stat}><div className={styles.statTop}><span className={styles.statIcon}>{stat.icon}</span><i>{stat.trend}</i></div><small>{stat.label}</small><strong>{stat.value}</strong><em>vs. last month</em></article>; }
