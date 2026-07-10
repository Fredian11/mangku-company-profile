/* ============================================================
   FILE : search.js
   FOLDER : js/members/
   DESKRIPSI :
   Mengatur pencarian data Members.

   FUNGSI:
   - Search member berdasarkan nama
   - Filter data
   - Render ulang table
============================================================ */

/* ============================================================
   [1] SEARCH INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Search Loaded");

  initMemberSearch();
});

/* ============================================================
   [2] INIT SEARCH
============================================================ */

function initMemberSearch() {
  const searchInput = document.getElementById("searchMember");

  if (!searchInput) {
    console.warn("⚠️ Search input tidak ditemukan");

    return;
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();

    searchMembers(keyword);
  });
}

/* ============================================================
   [3] SEARCH PROCESS
============================================================ */

function searchMembers(keyword) {
  if (!window.membersData) {
    console.warn("⚠️ Data Members belum tersedia");

    return;
  }

  let filteredData;

  // Jika kosong tampilkan semua data

  if (keyword === "") {
    filteredData = window.membersData;
  } else {
    filteredData = window.membersData.filter((member) => {
      return member.nama.toLowerCase().includes(keyword);
    });
  }

  // Render ulang table

  if (typeof renderMembers === "function") {
    renderMembers(filteredData);
  }
}
