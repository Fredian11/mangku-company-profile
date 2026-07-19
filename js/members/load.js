/* ============================================================
   FILE     : load.js
   FOLDER   : js/members/

   RELEASE  : v0.2.4-B

   DESKRIPSI:
   Mengatur loading dan rendering data Members
   dari Supabase Database.

============================================================ */

/* ============================================================
   [1] GLOBAL MEMBERS DATA

   Data awal kosong.

   Data akan diisi melalui:
   Supabase -> loadMembers()
============================================================ */

window.membersData = [];

/* ============================================================
   [2] MODULE READY
============================================================ */

console.log("✅ Members Load.js Ready");

/* ============================================================
   [3] INITIALIZATION

   Tunggu seluruh DOM selesai dibuat.

   Setelah itu:
   jalankan loadMembers()

============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadMembers();
});

/* ============================================================
   [4] LOAD MEMBERS FROM SUPABASE

   Flow:

   config.js
        |
        ↓
   window.db
        |
        ↓
   members table
        |
        ↓
   window.membersData

============================================================ */

async function loadMembers() {
  console.log("🔄 Loading Members From Supabase...");

  const { data, error } = await window.db
    .from("members")
    .select("*")
    .order("id", {
      ascending: true,
    });

  /* ========================================================
       [4.1] ERROR HANDLING
    ========================================================= */

  if (error) {
    console.error("❌ Failed Load Members:", error);

    return;
  }

  /* ========================================================
       [4.2] SIMPAN DATA GLOBAL

       Supabase response:
       data = array members

    ========================================================= */

  window.membersData = data || [];

  console.log("✅ Members Data Loaded:", window.membersData.length);

  /* ========================================================
       [4.3] UPDATE STATISTIC CARD
    ========================================================= */

  updateMemberStatistics(window.membersData);

  /* ========================================================
       [4.4] UPDATE TABLE

       Pagination akan mengambil data
       dari window.membersData

    ========================================================= */

  if (typeof updatePagination === "function") {
    updatePagination();
  } else {
    renderMembers(window.membersData);
  }
}

/* ============================================================
   [5] UPDATE MEMBER STATISTICS

   Mengupdate:
   - Total Member
   - Aktif
   - Non Aktif

============================================================ */

function updateMemberStatistics(data) {
  if (!Array.isArray(data)) {
    return;
  }

  const total = data.length;

  const aktif = data.filter((member) => member.status === "Aktif").length;

  const nonAktif = data.filter(
    (member) => member.status === "Non Aktif",
  ).length;

  const totalEl = document.getElementById("totalMember");

  const activeEl = document.getElementById("activeMember");

  const inactiveEl = document.getElementById("inactiveMember");

  const countEl = document.getElementById("memberCount");

  if (totalEl) {
    totalEl.textContent = total;
  }

  if (activeEl) {
    activeEl.textContent = aktif;
  }

  if (inactiveEl) {
    inactiveEl.textContent = nonAktif;
  }

  if (countEl) {
    countEl.textContent = `Total : ${total} Member`;
  }

  console.log("📊 Statistics Updated", {
    total,
    aktif,
    nonAktif,
  });
}

/* ============================================================
   [6] RENDER MEMBERS TABLE

   Deskripsi:
   Menampilkan data members ke dalam tabel.

   Sumber data:
   - Supabase
   - Pagination

   Input:
   data = array members

============================================================ */

function renderMembers(data) {
  const tableBody = document.getElementById("membersTableBody");

  if (!tableBody) {
    console.warn("⚠️ membersTableBody tidak ditemukan");

    return;
  }

  /* ========================================================
     EMPTY DATA STATE

  ========================================================= */

  if (!Array.isArray(data) || data.length === 0) {
    tableBody.innerHTML = `

      <tr>

        <td colspan="7" class="empty-table">

          <div class="empty-state">

            <i class="fa-solid fa-users"></i>

            <h3>
              Belum ada data anggota
            </h3>


            <p>
              Klik tombol 
              <strong>Add Member</strong>
              untuk menambahkan anggota baru.
            </p>


          </div>

        </td>

      </tr>

    `;

    return;
  }

  /* ========================================================
     RENDER DATA

  ========================================================= */

  tableBody.innerHTML = "";

  data.forEach((member) => {
    const tanggal = member.bergabung
      ? new Date(member.bergabung).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    const fotoHTML = member.foto
      ? `
      <img 
        src="${member.foto}"
        width="50"
        height="50"
        style="
          border-radius:50%;
          object-fit:cover;
        "
        alt="${member.nama}"
      >
      `
      : `
      <i 
        class="fa-solid fa-user"
        style="
          font-size:1.8rem;
          color:#aaa;
        "
      ></i>
      `;

    const statusClass = member.status === "Aktif" ? "aktif" : "nonaktif";

    const row = document.createElement("tr");

    row.dataset.id = member.id;

    row.innerHTML = `

      <td class="td-foto">

        ${fotoHTML}

      </td>


      <td>

        ${member.nama || "-"}

      </td>


      <td>

        ${member.jabatan || "-"}

      </td>


      <td>

        ${member.divisi || "-"}

      </td>


      <td>

        <span class="
          member-status
          status-${statusClass}
        ">

          ${member.status || "-"}

        </span>

      </td>


      <td>

        ${tanggal}

      </td>


      <td>


        <button
          class="btn-edit-member"
          data-id="${member.id}"
          title="Edit"
        >

          <i class="fa-solid fa-pen"></i>

        </button>



        <button
          class="btn-delete-member"
          data-id="${member.id}"
          title="Hapus"
        >

          <i class="fa-solid fa-trash"></i>

        </button>


      </td>

    `;

    tableBody.appendChild(row);
  });

  console.log("✅ Members Table Rendered:", data.length);
}
