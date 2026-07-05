/* ============================================================
   FILE : profile.js
   FOLDER : js/dashboard/
   DESKRIPSI :
   Mengambil dan menampilkan data profil administrator.
============================================================ */

/* ============================================================
   [2] LOAD PROFILE ADMIN
============================================================ */

async function loadProfile(userId) {
  const { data, error } = await db
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  /* ======================
         DEBUG
  ====================== */

  console.log("User ID :", userId);
  console.log("Profile :", data);
  console.log("Error :", error);

  /* ====================== */

  if (error) {
    console.error(error);

    document.getElementById("adminName").textContent = "Unknown";

    document.getElementById("adminRole").textContent = "No Role";

    return;
  }

  document.getElementById("adminName").textContent =
    data.full_name || "Administrator";

  document.getElementById("adminRole").textContent = data.role || "Admin";
}
