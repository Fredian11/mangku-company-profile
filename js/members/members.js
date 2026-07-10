/* ============================================================
   FILE : members.js
   FOLDER : js/members/

   DESKRIPSI :
   Entry Point dan Controller halaman Members.

   RELEASE:
   v0.2.3.6
============================================================ */

/* ============================================================
   [1] MEMBERS INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Controller Loaded");

  initMembersModule();
});

/* ============================================================
   [2] MAIN CONTROLLER
============================================================ */

function initMembersModule() {
  /*
       Urutan loading:

       1. Data siap
       2. Pagination aktif
       3. Render pertama
       4. Module lain aktif

    */

  if (typeof loadMembers === "function") {
    loadMembers();
  }

  if (typeof initPagination === "function") {
    initPagination();
  }

  if (typeof initMemberSearch === "function") {
    initMemberSearch();
  }

  if (typeof initDeleteMember === "function") {
    initDeleteMember();
  }

  if (typeof initMemberModal === "function") {
    initMemberModal();
  }
}
