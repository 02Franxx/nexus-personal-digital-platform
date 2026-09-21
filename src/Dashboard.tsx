'use client';

import { useState } from 'react';
import styles from './dashboard.module.css';

const nav = ['Overview', 'Explore', 'My Content', 'Create Post', 'Community'];
const manage = ['Notifications', 'Search', 'My Files', 'Store'];

export default function Dashboard() {
  const [active, setActive] = useState('Overview');
  const [created, setCreated] = useState(false);
  return <div className={styles.shell}>
    <aside className={styles.sidebar}><div className={styles.brand}><span className={styles.brandMark}>N</span>NEXUS</div>
      <div className={styles.workspace}><span className={styles.avatar}>AK</span><div><b>Alex Kim</b><small>Personal workspace</small></div><span className={styles.chevron}>⌄</span></div>
      <Nav label="WORKSPACE" items={nav} active={active} onSelect={setActive} />
      <Nav label="MANAGE" items={manage} active={active} onSelect={setActive} manage />
      <div className={styles.bottom}><button className={styles.navItem}>⚙<span>Settings</span></button><button className={styles.navItem}>?<span>Help center</span></button><div className={styles.profile}><span className={styles.avatar}>AK</span><div><b>Alex Kim</b><small>alex@nexus.app</small></div></div></div>
    </aside>
    <main className={styles.main}><header className={styles.topbar}><div className={styles.breadcrumb}>Workspace <span>/</span> <b>{active}</b></div><div className={styles.topActions}>⌕　♧ <span className={styles.avatar}>AK</span></div></header>
      <section className={styles.content}><div className={styles.welcome}><div><p className={styles.eyebrow}>MONDAY, SEPTEMBER 22, 2025</p><h1>Good morning, Alex <span>✦</span></h1><p className={styles.subtitle}>Here’s what’s happening across your digital space.</p></div><button className={styles.primary} onClick={() => setCreated(true)}>{created ? '✓ Draft started' : '+ Create post'}</button></div>
        <div className={styles.stats}>{[['✎','Total posts','248','↗ 12.5%'],['♧','Community reach','12.8k','↗ 8.2%'],['♡','Engagement','4.62k','↗ 18.4%'],['▣','Store revenue','$2,840','— 0.8%']].map(([icon,label,value,trend]) => <article className={styles.stat} key={label}><div className={styles.statTop}><span className={styles.statIcon}>{icon}</span><i>{trend}</i></div><small>{label}</small><strong>{value}</strong><em>vs. last month</em></article>)}</div>
        <div className={styles.grid}><section className={styles.panel}><Heading title="Content overview" sub="Performance across your posts" right="7 days　 30 days" /><div className={styles.legend}><span>● Views</span><span>● Engagement</span></div><div className={styles.chart}><div className={styles.chartLines}></div><div className={styles.chartFill}></div><div className={styles.chartLine}></div><div className={styles.days}><span>Sep 16</span><span>Sep 17</span><span>Sep 18</span><span>Sep 19</span><span>Sep 20</span><span>Sep 21</span><span>Today</span></div></div></section>
          <section className={styles.panel}><Heading title="Recent activity" sub="Stay up to date" right="View all →" /><div className={styles.activity}>{[['♥','Alexander liked your post','The future of calm interfaces','12 min ago'],['◌','Mia commented on your post','“This is such a thoughtful take.”','38 min ago'],['▣','Order #NX-2084 shipped','Your order is on the way','2 hrs ago'],['◈','Security check completed','No unusual activity detected','Yesterday']].map(([i,title,detail,time]) => <div className={styles.activityRow} key={title}><span className={styles.activityIcon}>{i}</span><div><b>{title}</b><small>{detail}</small></div><time>{time}</time></div>)}</div></section></div>
        <div className={styles.grid}><section className={styles.panel}><Heading title="Top performing post" sub="Your content is resonating" right="•••" /><div className={styles.post}><div className={styles.postArt}>THE<br/><b>QUIET</b><br/>REVOLUTION<small>notes on designing<br/>for attention</small></div><div><label>DESIGN & CULTURE</label><h2>The future of calm interfaces</h2><p>How we can create digital spaces that respect our attention and help us do our best work.</p><small>♡ 1,284　 ◌ 86　 3 min read</small></div></div></section><section className={styles.panel}><Heading title="Store overview" sub="Your latest orders" right="See store →" />{['NEXUS Field Notes　　$32.00','Digital Workspace Kit　　$18.00','Focus Soundscapes　　　$12.00'].map((item,i)=><div className={styles.order} key={item}><span className={styles.product}>N</span><div><b>{item}</b><small>#NX-208{i+4} · Sep {21-i*2}</small></div><em>{i===0?'Shipped':'Delivered'}</em></div>)}</section></div>
      </section></main></div>;
}

function Nav({ label, items, active, onSelect, manage=false }: { label: string; items: string[]; active: string; onSelect: (item: string) => void; manage?: boolean }) { return <nav className={`${styles.nav} ${manage ? styles.manage : ''}`}><small>{label}</small>{items.map((item,i)=><button key={item} className={`${styles.navItem} ${active===item ? styles.active : ''}`} onClick={() => onSelect(item)}><span>{['▦','◉','▱','✎','♧','♧','⌕','▱','▣'][i + (manage ? 5 : 0)]}</span>{item}{item==='Notifications' && <i>3</i>}</button>)}</nav>; }
function Heading({ title, sub, right }: { title: string; sub: string; right: string }) { return <div className={styles.heading}><div><h2>{title}</h2><p>{sub}</p></div><button>{right}</button></div>; }
