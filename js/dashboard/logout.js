/* ============================================================
   FILE : logout.js
   FOLDER : js/dashboard/
   DESKRIPSI :
   Mengelola proses logout administrator.
============================================================ */

/* ============================================================
   [2] LOGOUT
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
