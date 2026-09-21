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
import { activities, manageItems, navItems, stats } from './data/dashboard';
export default function Dashboard() { const [active,setActive] = useState('Overview'); const [created,setCreated] = useState(false); return <div className={styles.shell}><Sidebar active={active} items={navItems} manageItems={manageItems} onSelect={setActive}/><main className={styles.main}><Topbar page={active}/><section className={styles.content}><div className={styles.welcome}><div><p className={styles.eyebrow}>MONDAY, SEPTEMBER 22, 2025</p><h1>Good morning, Alex <span>✦</span></h1><p className={styles.subtitle}>Here’s what’s happening across your digital space.</p></div><button className={styles.primary} onClick={() => setCreated(true)}>{created ? '✓ Draft started' : '+ Create post'}</button></div><div className={styles.stats}>{stats.map((stat) => <StatCard key={stat.label} stat={stat}/>)}</div><div className={styles.grid}><ContentOverview/><RecentActivity activities={activities}/></div><div className={styles.grid}><TopPost/><StoreOverview/></div></section></main></div>; }
