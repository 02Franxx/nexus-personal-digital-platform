import styles from '../dashboard.module.css';
import { PanelHeading } from './ContentOverview';
const orders = [['NEXUS Field Notes', '$32.00', '#NX-2084 · Sep 21', 'Shipped'], ['Digital Workspace Kit', '$18.00', '#NX-2081 · Sep 19', 'Delivered'], ['Focus Soundscapes', '$12.00', '#NX-2078 · Sep 17', 'Delivered']];
export default function StoreOverview() { return <section className={styles.panel}><PanelHeading title="Store overview" sub="Your latest orders" right="See store →"/>{orders.map(([name, price, id, status]) => <div className={styles.order} key={id}><span className={styles.product}>N</span><div><b>{name}　 {price}</b><small>{id}</small></div><em>{status}</em></div>)}</section>; }
