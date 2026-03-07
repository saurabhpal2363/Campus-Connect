// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────
const pageTitles = {
  feed:'Feed', explore:'Explore', network:'My Network',
  ideas:'Ideas', projects:'Projects', upload:'Upload Reel',
  events:'Events', messages:'Messages'
};

function nav(el) {
  const page = el.dataset.page;
  if (!page) return;

  // Pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  // Sidebar nav
  document.querySelectorAll('.sidebar .nav-item').forEach(i => i.classList.remove('active'));
  const si = document.querySelector(`.sidebar .nav-item[data-page="${page}"]`);
  if (si) si.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.bn-item').forEach(i => i.classList.remove('active'));
  const bi = document.querySelector(`.bn-item[data-page="${page}"]`);
  if (bi) bi.classList.add('active');

  document.getElementById('pageTitle').textContent = pageTitles[page] || page;
  closeSidebar();
}

// ─────────────────────────────────────────
// SIDEBAR MOBILE
// ─────────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sideOverlay');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sideOverlay').classList.remove('show');
}

// ─────────────────────────────────────────
// REEL PLAY / PAUSE
// ─────────────────────────────────────────
let playIntervals = {};

function toggleReel(card) {
  const id = card.dataset.vid;
  const wasPlaying = card.classList.contains('now-playing');

  // Stop all
  document.querySelectorAll('.reel-card').forEach(c => {
    c.classList.remove('now-playing');
    const b = document.getElementById('prb-' + c.dataset.vid);
    if (b) b.textContent = '▶';
  });
  Object.values(playIntervals).forEach(clearInterval);
  playIntervals = {};

  if (!wasPlaying) {
    card.classList.add('now-playing');
    const btn = document.getElementById('prb-' + id);
    if (btn) btn.textContent = '⏸';
    tickProgress(id);
  }
}

function tickProgress(id) {
  const bar = document.getElementById('pf-' + id);
  if (!bar) return;
  let pct = parseFloat(bar.style.width) || 0;
  playIntervals[id] = setInterval(() => {
    pct += 0.12;
    if (pct >= 100) {
      pct = 0;
      clearInterval(playIntervals[id]);
      autoAdvance(id);
    }
    bar.style.width = pct + '%';
  }, 80);
}

function autoAdvance(id) {
  const cards = [...document.querySelectorAll('.reel-card')];
  const idx = cards.findIndex(c => c.dataset.vid === String(id));
  const next = cards[idx + 1];
  if (next) {
    next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => toggleReel(next), 400);
  }
}

// Auto-start first reel
window.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.reel-card');
  if (first) tickProgress(first.dataset.vid);
});

// IntersectionObserver auto-play
const rio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !document.querySelector('.reel-card.now-playing')) {
      toggleReel(e.target);
    }
  });
}, { threshold: 0.65 });
document.querySelectorAll('.reel-card').forEach(c => rio.observe(c));

// ─────────────────────────────────────────
// LIKE
// ─────────────────────────────────────────
function like(e, btn) {
  e.stopPropagation();
  const liked = btn.classList.toggle('liked');
  const n = parseInt(btn.textContent.replace(/\D/g, ''));
  btn.textContent = (liked ? '❤️ ' : '🤍 ') + (liked ? n + 1 : n - 1);
}

// ─────────────────────────────────────────
// CONNECT
// ─────────────────────────────────────────
function connect(btn) {
  if (btn.textContent.includes('Connect') || btn.textContent === '+ Connect') {
    btn.textContent = '✓ Connected';
    btn.classList.add('connected');
  } else {
    btn.textContent = '+ Connect';
    btn.classList.remove('connected');
  }
}

// ─────────────────────────────────────────
// TABS
// ─────────────────────────────────────────
function fTab(el) {
  el.closest('.feed-tabs').querySelectorAll('.f-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function nTab(el) {
  el.closest('.network-tabs').querySelectorAll('.n-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function toggleChip(el) {
  document.querySelectorAll('.i-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}
function pfBtn(el) {
  el.closest('.proj-filters').querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ─────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────
function joinProj(btn) {
  btn.classList.toggle('joined');
  btn.textContent = btn.classList.contains('joined') ? '✓ Joined' : 'Join →';
}

// ─────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────
function goEvent(btn) {
  btn.classList.add('going');
  btn.textContent = '✓ Going';
}

// ─────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────
function triggerUpload() {
  document.getElementById('fileInput').click();
}
function fileSelected(input) {
  if (input.files && input.files[0]) {
    const name = input.files[0].name;
    document.getElementById('uzIcon').textContent = '🎬';
    document.getElementById('uzTitle').textContent = name;
    document.getElementById('uzSub').textContent = 'Video ready · Click to change';
  }
}
function startUpload() {
  const box = document.getElementById('uploadProgress');
  const fill = document.getElementById('upFill');
  const pct = document.getElementById('upPct');
  const status = document.getElementById('upStatus');
  box.style.display = 'block';
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 8 + 2;
    if (p >= 100) { p = 100; clearInterval(t); status.textContent = '✅ Published!'; }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 200);
}

// ─────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────
function openChat(row, name, initials, gradient, statusText) {
  document.querySelectorAll('.conv-row').forEach(r => r.classList.remove('active'));
  row.classList.add('active');
  document.getElementById('chatAv').textContent = initials;
  document.getElementById('chatAv').style.background = `linear-gradient(135deg,${gradient})`;
  document.getElementById('chatName').textContent = name;
  document.getElementById('chatStatus').textContent = statusText === 'Online' ? '● Online' : statusText === 'Away' ? '● Away' : '○ Offline';
  document.getElementById('chatStatus').style.color = statusText === 'Online' ? 'var(--green)' : statusText === 'Away' ? 'var(--amber)' : 'var(--ink3)';
}

function sendMsg(e) {
  if (e.key !== 'Enter') return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg-bubble msg-out';
  div.innerHTML = text + '<span class="msg-time">Just now</span>';
  msgs.appendChild(div);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  // Simulated reply
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'msg-bubble msg-in';
    reply.innerHTML = 'That sounds great! 👍<span class="msg-time">Just now</span>';
    msgs.appendChild(reply);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1200);
}