import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9FdL9prmhI_bmf-LHYH9jbOLN13hExig",
  authDomain: "campusconnect-aa958.firebaseapp.com",
  projectId: "campusconnect-aa958",
  storageBucket: "campusconnect-aa958.firebasestorage.app",
  messagingSenderId: "222364712523",
  appId: "1:222364712523:web:9c970c248ee698cae8d7ce"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };