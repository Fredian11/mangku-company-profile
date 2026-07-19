/* ============================================================
   FILE     : members.js
   FOLDER   : js/members/

   DESKRIPSI:
   Controller utama halaman Members.

   RELEASE:
   v0.2.3.6-D

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
        Urutan module:

        1. Load data
        2. Pagination
        3. Search
        4. Modal
        5. Delete

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

  if (typeof initMemberModal === "function") {
    initMemberModal();
  }

  if (typeof initDeleteMember === "function") {
    initDeleteMember();
  }
}
