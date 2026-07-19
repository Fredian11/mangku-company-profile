/* ============================================================
   FILE     : load.js
   FOLDER   : js/members/
   DESKRIPSI:
   Mengatur loading dan rendering data Members
   dari Supabase.

   RELEASE :
   v0.2.4-B.2-A
============================================================ */

/* ============================================================
   [1] GLOBAL MEMBERS DATA
============================================================ */

window.membersData = [];

/* ============================================================
   [2] MODULE READY
============================================================ */

console.log("✅ Members Load.js Ready");

/* ============================================================
   [3] LOAD MEMBERS FROM SUPABASE
============================================================ */

async function loadMembers() {
  /* ========================================================
     [3.1] VALIDASI SUPABASE CLIENT
  ========================================================= */

  if (!window.db) {
    console.error("❌ Supabase Client belum tersedia.");
    return;
  }

  console.log("🔄 Loading Members From Supabase...");

  try {
    /* ========================================================
       [3.2] GET DATA FROM SUPABASE
    ========================================================= */

    const { data, error } = await window.db
      .from("members")
      .select("*")
      .order("id", {
        ascending: true,
      });

    /* ========================================================
       [3.3] ERROR HANDLING
    ========================================================= */

    if (error) {
      console.error("❌ Failed Load Members");
      console.error(error);
      return;
    }

    /* ========================================================
       [3.4] SAVE GLOBAL DATA
    ========================================================= */

    window.membersData = data || [];

    console.log("✅ Members berhasil disimpan ke Global State");
    console.log("✅ Members Data Loaded:", window.membersData.length);

    /* ========================================================
       [3.5] UPDATE STATISTICS
    ========================================================= */

    updateMemberStatistics(window.membersData);

    /* ========================================================
       [3.6] UPDATE TABLE
    ========================================================= */

    if (typeof updatePagination === "function") {
      updatePagination();
    } else {
      renderMembers(window.membersData);
    }
  } catch (err) {
    console.error("❌ Unexpected Error");
    console.error(err);
  }
}

/* ============================================================
   [4] RENDER MEMBERS TABLE
============================================================ */

function renderMembers(data) {
  const tableBody = document.getElementById("membersTableBody");

  if (!tableBody) {
    console.warn("⚠️ #membersTableBody tidak ditemukan.");
    return;
  }

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table">
          <div class="empty-state">
            <i class="fa-solid fa-users"></i>
            <h3>Belum ada data anggota</h3>
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

  tableBody.innerHTML = "";

  data.forEach((member) => {
    const fotoHTML = member.foto
      ? `
        <img
          src="${member.foto}"
          width="50"
          height="50"
          style="border-radius:50%;object-fit:cover;"
          alt="${member.nama}"
        >
      `
      : `
        <i
          class="fa-solid fa-user"
          style="font-size:1.8rem;color:#aaa;"
        ></i>
      `;

    const tanggal = member.bergabung
      ? new Date(member.bergabung).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    const row = document.createElement("tr");

    row.dataset.id = member.id;

    row.innerHTML = `
      <td>${fotoHTML}</td>

      <td>${member.nama ?? "-"}</td>

      <td>${member.jabatan ?? "-"}</td>

      <td>${member.divisi ?? "-"}</td>

      <td>
        <span class="member-status status-${member.status === "Aktif" ? "aktif" : "nonaktif"}">
          ${member.status}
        </span>
      </td>

      <td>${tanggal}</td>

      <td>

        <button
          class="btn-edit-member"
          data-id="${member.id}"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          class="btn-delete-member"
          data-id="${member.id}"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </td>
    `;

    tableBody.appendChild(row);
  });
}

/* ============================================================
   [5] UPDATE MEMBER STATISTICS
============================================================ */

function updateMemberStatistics(data) {
  if (!data) return;

  const total = data.length;

  const aktif = data.filter((m) => m.status === "Aktif").length;

  const nonAktif = data.filter((m) => m.status === "Non Aktif").length;

  const totalEl = document.getElementById("totalMember");
  const activeEl = document.getElementById("activeMember");
  const inactiveEl = document.getElementById("inactiveMember");
  const countEl = document.getElementById("memberCount");

  if (totalEl) totalEl.textContent = total;
  if (activeEl) activeEl.textContent = aktif;
  if (inactiveEl) inactiveEl.textContent = nonAktif;

  if (countEl) {
    countEl.textContent = `Total : ${total} Member`;
  }
}
