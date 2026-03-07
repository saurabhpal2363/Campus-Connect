// ── TAB SWITCH ──
function switchTab(el){
  document.querySelectorAll('.reel-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

// ── PLAY / PAUSE TOGGLE ──
let currentPlaying = '1';
let progressIntervals = {};

function togglePlay(card){
  const id = card.dataset.id;
  const btn = document.getElementById('btn-'+id);
  const isPlaying = card.classList.contains('playing');

  // Stop all
  document.querySelectorAll('.reel-card').forEach(c=>{
    c.classList.remove('playing');
    const b = document.getElementById('btn-'+c.dataset.id);
    if(b) b.textContent = '▶';
  });
  Object.values(progressIntervals).forEach(clearInterval);
  progressIntervals = {};

  if(!isPlaying){
    card.classList.add('playing');
    btn.textContent = '⏸';
    currentPlaying = id;
    startProgress(id);
  }
}

function startProgress(id){
  const bar = document.getElementById('prog-'+id);
  if(!bar) return;
  let pct = parseFloat(bar.style.width)||0;
  progressIntervals[id] = setInterval(()=>{
    pct += 0.15;
    if(pct >= 100){
      pct = 0;
      // Auto-advance
      clearInterval(progressIntervals[id]);
      advanceToNext(id);
    }
    bar.style.width = pct+'%';
  }, 80);
}

function advanceToNext(id){
  const cards = [...document.querySelectorAll('.reel-card')];
  const idx = cards.findIndex(c=>c.dataset.id===String(id));
  const next = cards[idx+1];
  if(next){
    next.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>togglePlay(next), 400);
  }
}

// Auto-start first reel
window.addEventListener('DOMContentLoaded', ()=>{
  startProgress('1');
});

// Intersection Observer — auto-play when card scrolls into view
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && !entry.target.classList.contains('playing')){
      const anyPlaying = document.querySelector('.reel-card.playing');
      if(!anyPlaying){
        togglePlay(entry.target);
      }
    }
  });
},{threshold:0.6});

document.querySelectorAll('.reel-card').forEach(c=>observer.observe(c));

// ── LIKE TOGGLE ──
function toggleLike(e, btn){
  e.stopPropagation();
  const liked = btn.classList.toggle('liked');
  const text = btn.textContent;
  const match = text.match(/(\d+)/);
  if(match){
    const n = parseInt(match[1]);
    btn.textContent = (liked ? '❤️ ' : '🤍 ') + (liked ? n+1 : n-1);
  }
}

// ── CONNECT ──
function connectUser(btn){
  if(btn.textContent === '+ Connect'){
    btn.textContent = '✓ Connected';
    btn.style.background = 'var(--sage)';
    btn.style.color = '#fff';
  } else {
    btn.textContent = '+ Connect';
    btn.style.background = '';
    btn.style.color = '';
  }
}