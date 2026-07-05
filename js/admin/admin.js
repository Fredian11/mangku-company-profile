/* ============================================================
   [1] SUPABASE LOGIN
============================================================ */

const db = window.__supabaseClient;

/* ============================================================
   [1.1] SESSION CHECK
============================================================ */

async function checkSession() {
  const {
    data: { session },
  } = await db.auth.getSession();

  if (session) {
    window.location.href = "dashboard.html";
  }
}

checkSession();

/* ============================================================
   [2] DOM
============================================================ */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

/* ============================================================
   [3] LOGIN
============================================================ */

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginMessage.textContent = "";

  loginBtn.disabled = true;
  loginBtn.textContent = "Loading...";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await db.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginMessage.textContent = error.message;

    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';

    return;
  }

  loginMessage.style.color = "#16a34a";
  loginMessage.textContent = "Login berhasil...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});
