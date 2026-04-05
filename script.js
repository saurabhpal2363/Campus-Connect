// avatar
function pickAvatar(inp) {
  if (!inp.files?.[0]) return;
  const img = document.getElementById('avImg');
  img.src = URL.createObjectURL(inp.files[0]);
  img.style.display = 'block';
  document.getElementById('avEmoji').style.display = 'none';
}

// chips
function toggleChip(el) {
  el.classList.toggle('on');
  const n = document.querySelectorAll('.chip.on').length;
  document.getElementById('skillCount').textContent = n + ' selected';
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

function vPw(inp) {
  const v = inp.value;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const pct = [0, 25, 50, 75, 100][s];
  document.getElementById('sfill').style.width = pct + '%';
  inp.classList.toggle('ok', s === 4);
}

function vSelect(sel) {
  sel.classList.toggle('ok', sel.value !== '');
}

function togglePw(btn) {
  const inp = document.getElementById('password');
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

function updateChar(ta) {
  document.getElementById('charCount').textContent = ta.value.length + ' / 200';
}

// ── Submit ──────────────────────────────────────────────
async function doSubmit() {
  const fullName   = document.getElementById('fullName').value.trim();
  const email      = document.getElementById('email').value.trim();
  const password   = document.getElementById('password').value;
  const college    = document.getElementById('college').value.trim();
  const branch     = document.getElementById('branch').value;
  const year       = document.getElementById('year').value;
  const rollNumber = document.querySelector('input[placeholder="e.g. 21CS1001"]').value.trim();
  const bio        = document.getElementById('bio').value.trim();
  const skills     = [...document.querySelectorAll('.chip.on')]
                       .map(c => c.textContent.trim());

  if (!fullName || !email || !password || !college) {
    alert('Please fill all required fields.');
    return;
  }

  const btn = document.getElementById('ctaBtn');
  btn.disabled = true;
  btn.querySelector('.cta-inner').textContent = 'Creating account…';

  try {
    const res = await fetch('http://localhost/CampusConnect/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, college, branch, year, rollNumber, bio, skills })
    });

    const data = await res.json();

    if (data.success) {
      alert('🎉 Account created! Welcome to CampusConnect.');
      window.location.href = 'Dashboard/dashboard.html';
    } else {
      alert('Error: ' + data.error);
      btn.disabled = false;
      btn.querySelector('.cta-inner').innerHTML = 'Find my people <span class="cta-arrow">→</span>';
    }
  } catch (err) {
    alert('Could not reach server. Make sure XAMPP Apache is running.');
    btn.disabled = false;
    btn.querySelector('.cta-inner').innerHTML = 'Find my people <span class="cta-arrow">→</span>';
  }
}

// expose to HTML
window.doSubmit    = doSubmit;
window.pickAvatar  = pickAvatar;
window.toggleChip  = toggleChip;
window.togglePw    = togglePw;
window.vBasic      = vBasic;
window.vEmail      = vEmail;
window.vPw         = vPw;
window.vSelect     = vSelect;
window.updateChar  = updateChar;