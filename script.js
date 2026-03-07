// Password toggle
  document.getElementById('togglePw').addEventListener('click', () => {
    const pw = document.getElementById('password');
    pw.type = pw.type === 'password' ? 'text' : 'password';
  });

  // Tag selection
  function setupTags(wrapId) {
    const wrap = document.getElementById(wrapId);
    wrap.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => tag.classList.toggle('active'));
    });
  }
  setupTags('skills-wrap');
  setupTags('interests-wrap');

  function getSelected(wrapId) {
    return [...document.querySelectorAll(`#${wrapId} .tag.active`)].map(t => t.dataset.val);
  }

  // Toast
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
  }

  // Validate
  function validate() {
    let ok = true;
    const checks = [
      ['fullname',  v => v.trim().length > 1,          'err-fullname'],
      ['email',     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'err-email'],
      ['password',  v => v.length >= 6,                 'err-password'],
      ['college',   v => v.trim().length > 1,           'err-college'],
      ['year',      v => v !== '',                       'err-year'],
      ['branch',    v => v !== '',                       'err-branch'],
      ['roll',      v => v.trim().length > 0,            'err-roll'],
    ];
    checks.forEach(([id, test, errId]) => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(errId);
      const pass = test(el.value);
      errEl.style.display = pass ? 'none' : 'block';
      el.style.borderColor = pass ? '' : '#f87171';
      if (!pass) ok = false;
    });

    const skills = getSelected('skills-wrap');
    const errS = document.getElementById('err-skills');
    errS.style.display = skills.length ? 'none' : 'block';
    if (!skills.length) ok = false;

    const interests = getSelected('interests-wrap');
    const errI = document.getElementById('err-interests');
    errI.style.display = interests.length ? 'none' : 'block';
    if (!interests.length) ok = false;

    return ok;
  }

  document.getElementById('submitBtn').addEventListener('click', () => {
    if (!validate()) { showToast('⚠️ Please fill all required fields'); return; }

    const profile = {
      fullname:   document.getElementById('fullname').value.trim(),
      email:      document.getElementById('email').value.trim(),
      college:    document.getElementById('college').value.trim(),
      year:       document.getElementById('year').value,
      branch:     document.getElementById('branch').value,
      roll:       document.getElementById('roll').value.trim(),
      skills:     getSelected('skills-wrap'),
      interests:  getSelected('interests-wrap'),
      joined:     new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };

    localStorage.setItem('campusconnect_profile', JSON.stringify(profile));
    document.getElementById('submitBtn').textContent = '✅ Profile saved! Redirecting…';
    setTimeout(() => { window.location.href = 'Dashboard/dashboard.html'; }, 900);
  });