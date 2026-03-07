// Firebase imports
import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { setDoc, doc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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

function vPw(inp) {
  const v = inp.value;
  let s = 0;

  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;

  const pct = [0,25,50,75,100][s];
  document.getElementById('sfill').style.width = pct + "%";

  inp.classList.toggle('ok', s===4);
}


// password toggle
function togglePw(btn) {
  const inp = document.getElementById('password');
  const show = inp.type === 'password';

  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}


// submit
async function doSubmit() {

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const college = document.getElementById("college").value;

  // NEW fields
  const branch = document.getElementById("branch").value;
  const year = document.getElementById("year").value;

  if(!fullName || !email || !password || !college){
    alert("Please fill all fields");
    return;
  }

  try {

    // create firebase account
    const userCredential =
    await createUserWithEmailAndPassword(auth,email,password);

    const user = userCredential.user;

    // save profile to firestore
    await setDoc(doc(db,"users",user.uid),{

      name: fullName,
      email: email,
      college: college,
      branch: branch,
      year: year

    });

    alert("Signup successful!");

    // redirect to dashboard
    window.location.href = "Dashboard/dashboard.html";

  }

  catch(error){

    alert(error.message);

  }

}


// expose functions for HTML
window.doSubmit = doSubmit;
window.pickAvatar = pickAvatar;
window.toggleChip = toggleChip;
window.togglePw = togglePw;
window.vBasic = vBasic;
window.vEmail = vEmail;
window.vPw = vPw;