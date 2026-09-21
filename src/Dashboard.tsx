'use client';
import { useState } from 'react';
import styles from './dashboard.module.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatCard from './components/StatCard';
import ContentOverview from './components/ContentOverview';
import RecentActivity from './components/RecentActivity';
import TopPost from './components/TopPost';
import StoreOverview from './components/StoreOverview';
import type { Activity, NavItem, Stat } from './components/types';
const navItems: NavItem[] = [['▦','Overview'],['◉','Explore'],['▱','My Content'],['✎','Create Post'],['♧','Community']].map(([icon,label]) => ({ icon, label }));
const manageItems: NavItem[] = [['♧','Notifications'],['⌕','Search'],['▱','My Files'],['▣','Store']].map(([icon,label]) => ({ icon, label }));
const stats: Stat[] = [{icon:'✎',label:'Total posts',value:'248',trend:'↗ 12.5%'},{icon:'♧',label:'Community reach',value:'12.8k',trend:'↗ 8.2%'},{icon:'♡',label:'Engagement',value:'4.62k',trend:'↗ 18.4%'},{icon:'▣',label:'Store revenue',value:'$2,840',trend:'— 0.8%'}];
const activities: Activity[] = [{icon:'♥',title:'Alexander liked your post',detail:'The future of calm interfaces',time:'12 min ago'},{icon:'◌',title:'Mia commented on your post',detail:'“This is such a thoughtful take.”',time:'38 min ago'},{icon:'▣',title:'Order #NX-2084 shipped',detail:'Your order is on the way',time:'2 hrs ago'},{icon:'◈',title:'Security check completed',detail:'No unusual activity detected',time:'Yesterday'}];
export default function Dashboard() { const [active,setActive] = useState('Overview'); const [created,setCreated] = useState(false); return <div className={styles.shell}><Sidebar active={active} items={navItems} manageItems={manageItems} onSelect={setActive}/><main className={styles.main}><Topbar page={active}/><section className={styles.content}><div className={styles.welcome}><div><p className={styles.eyebrow}>MONDAY, SEPTEMBER 22, 2025</p><h1>Good morning, Alex <span>✦</span></h1><p className={styles.subtitle}>Here’s what’s happening across your digital space.</p></div><button className={styles.primary} onClick={() => setCreated(true)}>{created ? '✓ Draft started' : '+ Create post'}</button></div><div className={styles.stats}>{stats.map((stat) => <StatCard key={stat.label} stat={stat}/>)}</div><div className={styles.grid}><ContentOverview/><RecentActivity activities={activities}/></div><div className={styles.grid}><TopPost/><StoreOverview/></div></section></main></div>; }
