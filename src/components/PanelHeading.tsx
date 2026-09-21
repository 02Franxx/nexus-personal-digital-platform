import styles from '../dashboard.module.css';

type PanelHeadingProps = { title: string; sub: string; right: string };

export default function PanelHeading({ title, sub, right }: PanelHeadingProps) {
  return <div className={styles.heading}><div><h2>{title}</h2><p>{sub}</p></div><button>{right}</button></div>;
}
