/* ============================================================
   FILE : auth.js
   FOLDER : js/dashboard/
   DESKRIPSI :
   Mengelola autentikasi dan pengecekan session Dashboard Admin.
============================================================ */

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
