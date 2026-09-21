import './style.css';

const activities = [
  { icon: 'heart', tone: 'pink', title: 'Alexander liked your post', time: '12 min ago', detail: 'The future of calm interfaces' },
  { icon: 'message', tone: 'blue', title: 'Mia commented on your post', time: '38 min ago', detail: '“This is such a thoughtful take.”' },
  { icon: 'shopping-bag', tone: 'orange', title: 'Order #NX-2084 shipped', time: '2 hrs ago', detail: 'Your order is on the way' },
  { icon: 'shield', tone: 'green', title: 'Security check completed', time: 'Yesterday', detail: 'No unusual activity detected' },
];

const icon = (name, size = 18) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z"/>',
    layers: '<path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"/><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
    pen: '<path d="m4 20 .8-4.1L15.8 4.9a2.1 2.1 0 0 1 3 3L7.8 18.9 4 20Z"/><path d="m13.8 6.9 3.3 3.3"/>',
    users: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3"/><path d="M22 20v-1.5a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    folder: '<path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-10Z"/>',
    store: '<path d="M4 10v9h16v-9M3 5h18l-1 5H4L3 5ZM9 14h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.1v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1A1.7 1.7 0 0 0 9 15a1.7 1.7 0 0 0-1.5-1H7.3v-2.1h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V6h2.1v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1 1-1.8 1.3-1.8 2.8M12 17h.01"/>',
    heart: '<path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.5 4.5 0 0 1 12 6.4a4.5 4.5 0 0 1 8.8 2.4Z"/>',
    message: '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.5-.7L4 20l1.7-3.8A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>',
    'shopping-bag': '<path d="M5 8h14l1 12H4L5 8ZM9 8V6a3 3 0 0 1 6 0v2"/>',
    shield: '<path d="M12 3 20 6v5.5c0 4.7-3.2 7.8-8 9.5-4.8-1.7-8-4.8-8-9.5V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
};

const navItems = [
  ['Overview', 'grid'], ['Explore', 'compass'], ['My Content', 'layers'], ['Create Post', 'pen'], ['Community', 'users']
];
const manageItems = [['Notifications', 'bell'], ['Search', 'search'], ['My Files', 'folder'], ['Store', 'store']];

function activityMarkup(item) {
  return `<div class="activity-row"><div class="activity-icon ${item.tone}">${icon(item.icon, 16)}</div><div class="activity-copy"><strong>${item.title}</strong><span>${item.detail}</span></div><time>${item.time}</time></div>`;
}

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">N</span><span>NEXUS</span></div>
      <div class="workspace"><span class="avatar small">AK</span><div><strong>Alex Kim</strong><span>Personal workspace</span></div><span class="chevron">⌄</span></div>
      <nav class="nav-section"><span class="nav-label">WORKSPACE</span>${navItems.map(([label, ico], i) => `<button class="nav-item ${i === 0 ? 'active' : ''}" data-page="${label}">${icon(ico)}<span>${label}</span>${label === 'Notifications' ? '<em>3</em>' : ''}</button>`).join('')}</nav>
      <nav class="nav-section manage"><span class="nav-label">MANAGE</span>${manageItems.map(([label, ico]) => `<button class="nav-item" data-page="${label}">${icon(ico)}<span>${label}</span>${label === 'Notifications' ? '<em>3</em>' : ''}</button>`).join('')}</nav>
      <div class="sidebar-bottom"><button class="nav-item">${icon('settings')}<span>Settings</span></button><button class="nav-item">${icon('help')}<span>Help center</span></button><div class="profile"><span class="avatar">AK</span><div><strong>Alex Kim</strong><span>alex@nexus.app</span></div>${icon('more')}</div></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><button class="mobile-menu" aria-label="Open menu">☰</button><div class="breadcrumb"><span>Workspace</span><b>/</b><strong>Overview</strong></div><div class="top-actions"><button class="icon-button" aria-label="Search">${icon('search')}</button><button class="icon-button notification" aria-label="Notifications">${icon('bell')}<i></i></button><span class="top-avatar avatar">AK</span></div></header>
      <section class="content-wrap">
        <div class="welcome-row"><div><p class="eyebrow">MONDAY, SEPTEMBER 22, 2025</p><h1>Good morning, Alex <span class="wave">✦</span></h1><p class="subtitle">Here’s what’s happening across your digital space.</p></div><button class="primary-button" id="createBtn">${icon('plus', 17)} Create post</button></div>
        <div class="stats-grid"><article class="stat-card"><div class="stat-top"><span class="stat-icon violet">${icon('pen')}</span><span class="trend up">↗ 12.5%</span></div><span class="stat-label">Total posts</span><strong>248</strong><span class="stat-note">vs. 220 last month</span></article><article class="stat-card"><div class="stat-top"><span class="stat-icon blue">${icon('users')}</span><span class="trend up">↗ 8.2%</span></div><span class="stat-label">Community reach</span><strong>12.8k</strong><span class="stat-note">people reached this month</span></article><article class="stat-card"><div class="stat-top"><span class="stat-icon pink">${icon('heart')}</span><span class="trend up">↗ 18.4%</span></div><span class="stat-label">Engagement</span><strong>4.62k</strong><span class="stat-note">likes & comments</span></article><article class="stat-card"><div class="stat-top"><span class="stat-icon orange">${icon('shopping-bag')}</span><span class="trend neutral">— 0.8%</span></div><span class="stat-label">Store revenue</span><strong>$2,840</strong><span class="stat-note">this month</span></article></div>
        <div class="dashboard-grid"><article class="panel chart-panel"><div class="panel-heading"><div><h2>Content overview</h2><p>Performance across your posts</p></div><div class="chart-controls"><button class="period active">7 days</button><button class="period">30 days</button><button class="more-button">${icon('more')}</button></div></div><div class="legend"><span><i class="dot violet-dot"></i>Views</span><span><i class="dot blue-dot"></i>Engagement</span></div><div class="chart"><div class="y-labels"><span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span></div><div class="chart-area"><div class="gridline g1"></div><div class="gridline g2"></div><div class="gridline g3"></div><div class="gridline g4"></div><div class="gridline g5"></div><svg viewBox="0 0 640 200" preserveAspectRatio="none"><defs><linearGradient id="fillV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9e82ff" stop-opacity=".28"/><stop offset="1" stop-color="#9e82ff" stop-opacity="0"/></linearGradient></defs><path d="M0 159 C35 151 55 162 90 138 S142 120 180 133 S240 82 271 98 S327 109 360 76 S417 101 450 71 S500 54 535 78 S595 38 640 46 L640 200 L0 200Z" fill="url(#fillV)"/><path d="M0 159 C35 151 55 162 90 138 S142 120 180 133 S240 82 271 98 S327 109 360 76 S417 101 450 71 S500 54 535 78 S595 38 640 46" fill="none" stroke="#a78bfa" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="M0 175 C42 167 60 181 94 168 S145 158 180 170 S235 134 271 147 S330 147 360 122 S416 143 450 118 S500 105 535 122 S595 92 640 99" fill="none" stroke="#60a5fa" stroke-width="2" vector-effect="non-scaling-stroke" opacity=".9"/></svg><div class="x-labels"><span>Sep 16</span><span>Sep 17</span><span>Sep 18</span><span>Sep 19</span><span>Sep 20</span><span>Sep 21</span><span>Today</span></div></div></div></article><article class="panel activity-panel"><div class="panel-heading"><div><h2>Recent activity</h2><p>Stay up to date</p></div><button class="link-button">View all ${icon('arrow', 14)}</button></div><div class="activity-list">${activities.map(activityMarkup).join('')}</div></article></div>
        <div class="bottom-grid"><article class="panel post-panel"><div class="panel-heading"><div><h2>Top performing post</h2><p>Your content is resonating</p></div><button class="more-button">${icon('more')}</button></div><div class="post-preview"><div class="post-art"><span>THE<br/><b>QUIET</b><br/>REVOLUTION</span><small>notes on designing<br/>for attention</small></div><div class="post-info"><span class="tag">DESIGN & CULTURE</span><h3>The future of calm interfaces</h3><p>How we can create digital spaces that respect our attention and help us do our best work.</p><div class="post-meta"><span>${icon('heart', 14)} 1,284</span><span>${icon('message', 14)} 86</span><span>3 min read</span></div></div></div></article><article class="panel orders-panel"><div class="panel-heading"><div><h2>Store overview</h2><p>Your latest orders</p></div><button class="link-button">See store ${icon('arrow', 14)}</button></div><div class="order-row"><div class="product-thumb purple-thumb">N</div><div><strong>NEXUS Field Notes</strong><span>#NX-2084 · Sep 21</span></div><b>$32.00</b><span class="status shipped">Shipped</span></div><div class="order-row"><div class="product-thumb blue-thumb">N</div><div><strong>Digital Workspace Kit</strong><span>#NX-2081 · Sep 19</span></div><b>$18.00</b><span class="status delivered">Delivered</span></div><div class="order-row"><div class="product-thumb orange-thumb">N</div><div><strong>Focus Soundscapes</strong><span>#NX-2078 · Sep 17</span></div><b>$12.00</b><span class="status delivered">Delivered</span></div></article></div>
      </section>
    </main>
  </div>`;

document.querySelectorAll('.nav-item[data-page]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.nav-item[data-page]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelector('.breadcrumb strong').textContent = button.dataset.page;
  if (button.dataset.page === 'Create Post') document.querySelector('#createBtn').focus();
}));
document.querySelectorAll('.period').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.period').forEach((item) => item.classList.remove('active')); button.classList.add('active'); }));
document.querySelector('#createBtn').addEventListener('click', () => { document.querySelector('#createBtn').innerHTML = `${icon('pen', 17)} Draft started`; document.querySelector('#createBtn').classList.add('success'); });
