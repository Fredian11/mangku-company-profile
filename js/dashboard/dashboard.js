/* ============================================================
   [1] AMBIL CLIENT SUPABASE
============================================================ */

const db = window.__supabaseClient;

/* ============================================================
   [2] CEK SESSION LOGIN
============================================================ */

async function checkSession() {
  const {
    data: { session },
    error,
  } = await db.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  // Jika belum login
  if (!session) {
    window.location.href = "admin.html";
    return;
  }

  // Ambil data profile
  await loadProfile(session.user.id);
}


/* ============================================================
   [4] LOGOUT
============================================================ */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin logout?");

    if (!confirmLogout) return;

    const { error } = await db.auth.signOut();

    if (error) {
      console.error(error);

      alert("Logout gagal.");

      return;
    }

    alert("Logout berhasil.");

    window.location.href = "admin.html";
  });
}

/* ============================================================
   [5] JALANKAN
============================================================ */

checkSession();

console.log(db);
