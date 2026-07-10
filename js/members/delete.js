/* ============================================================
   FILE : delete.js
   FOLDER : js/members/

   DESKRIPSI :
   Mengatur proses penghapusan data Members.

   STATUS:
   Dummy Data
   (akan diganti Supabase DELETE)
============================================================ */

/* ============================================================
   [1] DELETE INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Delete Loaded");

  initDeleteMember();
});

/* ============================================================
   [2] INIT DELETE EVENT
============================================================ */

function initDeleteMember() {
  const tableBody = document.getElementById("membersTableBody");

  if (!tableBody) {
    console.warn("⚠️ Table Members tidak ditemukan");

    return;
  }

  /*
       Menggunakan Event Delegation

       Karena row dibuat dinamis
       oleh load.js
    */

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-delete-member");

    if (!button) {
      return;
    }

    deleteMember(button);
  });
}

/* ============================================================
   [3] DELETE PROCESS
============================================================ */

function deleteMember(button) {
  const row = button.closest("tr");

  if (!row) {
    return;
  }

  const rows = Array.from(row.parentElement.children);

  const index = rows.indexOf(row);

  const member = window.membersData[index];

  if (!member) {
    console.warn("⚠️ Data member tidak ditemukan");

    return;
  }

  const confirmDelete = confirm(`Hapus member ${member.nama}?`);

  if (!confirmDelete) {
    return;
  }

  /*
       Hapus dari dummy data

       Nanti diganti:
       
       supabase
       .from("members")
       .delete()
    */

  window.membersData = window.membersData.filter(
    (item) => item.id !== member.id,
  );

  // Render ulang table

  if (typeof renderMembers === "function") {
    renderMembers(window.membersData);
  }

  // Update statistik

  if (typeof updateMemberStatistics === "function") {
    updateMemberStatistics(window.membersData);
  }

  console.log(`✅ Member ${member.nama} berhasil dihapus`);
}
