import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "./firebase-init.js";
import { OWNER_UID } from "./admin-config.js";

const $ = (sel) => document.querySelector(sel);

onAuthStateChanged(auth, (user) => {
  if (user && user.uid === OWNER_UID) {
    window.location.href = "/dashboard.html";
  }
});

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = $("#login-error");
  errEl.hidden = true;
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  try {
    const cred = await signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#password").value);
    if (cred.user.uid !== OWNER_UID) {
      await signOut(auth);
      errEl.textContent = "Akun ini bukan admin. Panel ini cuma buat owner.";
      errEl.hidden = false;
      return;
    }
    window.location.href = "/dashboard.html";
  } catch (err) {
    errEl.textContent = "Email atau password salah.";
    errEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});
