/* ============================================================
   FILE : pagination.js
   FOLDER : js/members/

   DESKRIPSI :
   Mengatur pagination data Members.

   FUNGSI:
   - Next page
   - Previous page
   - Render data berdasarkan halaman

   STATUS:
   Dummy Data
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

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Pagination Loaded");

  initPagination();
});

/* ============================================================
   [3] INIT PAGINATION
============================================================ */

function initPagination(){


    console.log(
        "Pagination initialized"
    );


    updatePagination();


    const prevButton =
        document.getElementById(
            "prevPage"
        );

    const nextButton =
        document.getElementById(
            "nextPage"
        );
}


/* ============================================================
   [4] GET TOTAL PAGE
============================================================ */

function getTotalPages() {
  const data = window.membersData || [];

  return Math.ceil(data.length / membersPerPage);
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

  const pageText = document.getElementById("currentPage");

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

  if (prevButton) {
    prevButton.disabled = currentPage === 1;
  }

  if (nextButton) {
    nextButton.disabled = currentPage >= totalPage;
  }
}

/* ============================================================
   [7] PAGINATION FROM SEARCH
============================================================ */

function setPaginationData(data) {
  filteredMembersData = data;

  currentPage = 1;

  updatePagination();
}
