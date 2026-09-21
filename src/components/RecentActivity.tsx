import styles from '../dashboard.module.css';
import type { Activity } from './types';
import { PanelHeading } from './ContentOverview';
export default function RecentActivity({ activities }: { activities: Activity[] }) { return <section className={styles.panel}><PanelHeading title="Recent activity" sub="Stay up to date" right="View all →"/><div className={styles.activity}>{activities.map((activity) => <div className={styles.activityRow} key={activity.title}><span className={styles.activityIcon}>{activity.icon}</span><div><b>{activity.title}</b><small>{activity.detail}</small></div><time>{activity.time}</time></div>)}</div></section>; }
