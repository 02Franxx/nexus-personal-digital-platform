import styles from '../dashboard.module.css';
import PanelHeading from './PanelHeading';
import { orders } from '../data/dashboard';
export default function StoreOverview() { return <section className={styles.panel}><PanelHeading title="Store overview" sub="Your latest orders" right="See store →"/>{orders.map((order) => <div className={styles.order} key={order.id}><span className={styles.product}>N</span><div><b>{order.name}　 {order.price}</b><small>{order.id}</small></div><em>{order.status}</em></div>)}</section>; }
