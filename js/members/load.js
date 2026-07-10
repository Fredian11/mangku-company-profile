/* ============================================================
   FILE : load.js
   FOLDER : js/members/
   DESKRIPSI :
   Mengatur loading dan rendering data Members.

   STATUS:
   Dummy Data (sebelum Supabase)
============================================================ */

/* ============================================================
   [1] DUMMY MEMBERS DATA

   Nanti diganti:
   Supabase SELECT members
============================================================ */

window.membersData = [
  {
    id: 1,

    nama: "Budi Santoso",

    jabatan: "Ketua",

    divisi: "Management",

    status: "Aktif",

    bergabung: "2025-01-10",

    foto: "",
  },

  {
    id: 2,

    nama: "Andi Wijaya",

    jabatan: "Administrator",

    divisi: "IT",

    status: "Aktif",

    bergabung: "2025-02-15",

    foto: "",
  },

  {
    id: 3,

    nama: "Rina Maharani",

    jabatan: "Member",

    divisi: "Creative",

    status: "Non Aktif",

    bergabung: "2025-03-20",

    foto: "",
  },

  {
    id: 4,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 5,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 6,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 7,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 8,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 9,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 10,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
  {
    id: 11,
    nama: "YUTIA",
    jabatan: "Ceo",
    divisi: "Masak",
    status: "Aktif",
    bergabung: "2025-06-22",
  },
];

/* ============================================================
   [2] LOAD MEMBERS INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Load Module Loaded");

  loadMembers();
});

/* ============================================================
   [3] LOAD MEMBERS
============================================================ */

function loadMembers() {
  window.membersData = membersData;

  console.log("✅ Members Data Loaded:", window.membersData.length);

  updateMemberStatistics(window.membersData);
}

/* ============================================================
   [4] RENDER TABLE
============================================================ */

function renderMembers(data) {
  const tableBody = document.getElementById("membersTableBody");

  if (!tableBody) {
    console.warn("⚠️ Members table tidak ditemukan");

    return;
  }

  // Jika data kosong

  if (data.length === 0) {
    tableBody.innerHTML = `

            <tr>

                <td 
                    colspan="7"
                    class="empty-table"
                >

                    <div class="empty-state">

                        <i class="fa-solid fa-users"></i>

                        <h3>
                            Belum ada data anggota
                        </h3>

                        <p>
                            Klik tombol 
                            <strong>
                                Add Member
                            </strong>
                            untuk menambahkan anggota baru.
                        </p>

                    </div>


                </td>

            </tr>

        `;

    return;
  }

  // Render Data

  tableBody.innerHTML = "";

  data.forEach((member) => {
    const row = document.createElement("tr");

    row.innerHTML = `


            <td>

                ${
                  member.foto
                    ? `<img src="${member.foto}" width="50">`
                    : `<i class="fa-solid fa-user"></i>`
                }

            </td>



            <td>

                ${member.nama}

            </td>



            <td>

                ${member.jabatan}

            </td>



            <td>

                ${member.divisi}

            </td>



            <td>

                <span class="member-status">

                    ${member.status}

                </span>

            </td>



            <td>

                ${member.bergabung}

            </td>



            <td>


                <button class="btn-edit-member">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button class="btn-delete-member">

                    <i class="fa-solid fa-trash"></i>

                </button>


            </td>



        `;

    tableBody.appendChild(row);
  });
}

/* ============================================================
   [5] UPDATE STATISTICS
============================================================ */

function updateMemberStatistics(data) {
  const total = data.length;

  const aktif = data.filter((member) => member.status === "Aktif").length;

  const nonAktif = data.filter(
    (member) => member.status === "Non Aktif",
  ).length;

  const totalElement = document.getElementById("totalMember");

  const activeElement = document.getElementById("activeMember");

  const inactiveElement = document.getElementById("inactiveMember");

  if (totalElement) {
    totalElement.textContent = total;
  }

  if (activeElement) {
    activeElement.textContent = aktif;
  }

  if (inactiveElement) {
    inactiveElement.textContent = nonAktif;
  }

  const countElement = document.getElementById("memberCount");

  if (countElement) {
    countElement.textContent = `Total : ${total} Member`;
  }
}
