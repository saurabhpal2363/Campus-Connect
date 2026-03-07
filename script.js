// avatar
function pickAvatar(inp) {
  if (!inp.files?.[0]) return;
  const img = document.getElementById('avImg');
  img.src = URL.createObjectURL(inp.files[0]);
  img.style.display = 'block';
  document.getElementById('avEmoji').style.display = 'none';
  document.querySelector('.av-ring').style.cssText += ';border:2px solid var(--g);box-shadow:0 0 0 4px var(--gbg)';
}

// chips
function toggleChip(el) {
  el.classList.toggle('on');
  const n = document.querySelectorAll('.chip.on').length;
  const el2 = document.getElementById('skillCount');
  el2.textContent = n + ' selected';
}

// validation
function vBasic(inp) {
  inp.classList.toggle('ok', inp.value.trim().length > 1);
  inp.classList.remove('err');
}
function vEmail(inp) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
  inp.classList.toggle('ok', ok);
  inp.classList.toggle('err', inp.value.length > 4 && !ok);
}
function vSelect(sel) {
  sel.style.borderColor = sel.value ? 'var(--g)' : '';
  sel.style.boxShadow   = sel.value ? '0 0 0 4px rgba(0,200,150,.1)' : '';
}
function vPw(inp) {
  const v = inp.value; let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const pct  = [0,25,50,75,100][s];
  const cols = ['','#F87171','#FBBF24','#34D399','#00C896'];
  const msgs = ['','Weak — add uppercase letters','Fair — add numbers or symbols','Good — almost there!','Strong password ✓'];
  document.getElementById('sfill').style.cssText = `width:${pct}%;background:${cols[s]}`;
  const m = document.getElementById('smsg');
  m.textContent = msgs[s]; m.style.color = cols[s];
  inp.classList.toggle('ok', s===4);
}
function togglePw(btn) {
  const inp = document.getElementById('password');
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

// char counter
function updateChar(ta) {
  const n = ta.value.length;
  const el = document.getElementById('charCount');
  el.textContent = n + ' / 200';
  el.classList.toggle('near', n > 160);
}

// submit
let signupComplete = false;
function doSubmit() {
    if (signupComplete) {
        window.open("Dashboard/dashboard.html", "_self"); // change to your file
        return;
    }
  const ids = ['fullName','email','password','college'];
  let valid = true;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('err');
      el.style.animation = 'shake .4s ease';
      setTimeout(() => el.style.animation = '', 450);
      valid = false;
    }
  });
  if (!valid) return;

  const btn = document.getElementById('ctaBtn');
  btn.querySelector('.cta-inner').innerHTML = '<span style="opacity:.75;font-size:15px">Setting up your account…</span>';
  btn.style.pointerEvents = 'none';

  setTimeout(() => { markDone('s1','b1'); setActive('s2'); }, 700);
  setTimeout(() => {
    markDone('s2','b2'); setActive('s3');
    btn.querySelector('.cta-inner').innerHTML = '🎉 Welcome to CampusConnect!';
    btn.style.pointerEvents = 'auto';
    btn.style.background = 'linear-gradient(130deg,#00C896,#0EA5E9)';
    btn.style.boxShadow  = '0 12px 36px rgba(0,200,150,.35)';
    signupComplete = true;
  }, 1800);
}

function markDone(sid, bid) {
  const d = document.getElementById(sid);
  d.classList.remove('active'); d.classList.add('done');
  d.textContent = '✓';
  if (bid) document.getElementById(bid).classList.add('done');
}
function setActive(sid) {
  document.getElementById(sid).classList.add('active');
}

// inject shake
document.head.insertAdjacentHTML('beforeend',
  '<style>@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}</style>');