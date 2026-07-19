/* ============================================================
   FILE     : pagination.js
   FOLDER   : js/members/
   DESKRIPSI: Mengatur pagination data Members.
   STATUS   : Dummy Data
============================================================ */

/* ============================================================
   [1] PAGINATION CONFIG
============================================================ */
let currentPage = 1;
const membersPerPage = 5;
let filteredMembersData = [];

/* ============================================================
   [2] PAGINATION INITIALIZATION
============================================================ */
function initPagination() {
  console.log("✅ Members Pagination Ready");
  bindPaginationButtons();
}

/* ============================================================
   [3] BIND PAGINATION BUTTONS
============================================================ */
function bindPaginationButtons() {
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  if (!prevButton || !nextButton) {
    console.warn("⚠️ Tombol pagination tidak ditemukan di DOM");
    return;
  }

  prevButton.addEventListener("click", () => {
    if (currentPage <= 1) return;
    currentPage--;
    updatePagination();
  });

  nextButton.addEventListener("click", () => {
    const totalPages = getTotalPages();
    if (currentPage >= totalPages) return;
    currentPage++;
    updatePagination();
  });
}

/* ============================================================
   [4] GET TOTAL PAGES
============================================================ */
function getTotalPages() {
  const data =
    filteredMembersData.length > 0
      ? filteredMembersData
      : window.membersData || [];

  return Math.max(1, Math.ceil(data.length / membersPerPage));
}

/* ============================================================
   [5] UPDATE PAGINATION
============================================================ */
function updatePagination() {
  const data =
    filteredMembersData.length > 0
      ? filteredMembersData
      : window.membersData || [];

  const start = (currentPage - 1) * membersPerPage;
  const end = start + membersPerPage;
  const pageData = data.slice(start, end);

  if (typeof renderMembers === "function") {
    renderMembers(pageData);
  }

  // FIX: id yang benar adalah "pageNumber" (sesuai members.html baris 295)
  const pageText = document.getElementById("pageNumber");
  if (pageText) {
    pageText.textContent = currentPage;
  }

  updatePaginationButton(data.length);
}

/* ============================================================
   [6] UPDATE BUTTON STATE
============================================================ */
function updatePaginationButton(totalData) {
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  const totalPage = Math.ceil(totalData / membersPerPage);

  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage >= totalPage;
}

/* ============================================================
   [7] SET PAGINATION DATA (dipanggil dari search.js)
============================================================ */
function setPaginationData(data) {
  filteredMembersData = Array.isArray(data) ? data : [];
  currentPage = 1;
  updatePagination();
}
