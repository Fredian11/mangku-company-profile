/* ============================================================
   FILE : modal.js
   FOLDER : js/members/
   DESKRIPSI :
   Mengatur tampilan modal Members.
   
   FUNGSI:
   - Open modal
   - Close modal
   - Reset form
============================================================ */

/* ============================================================
   [1] MEMBERS MODAL INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Members Modal Loaded");

  initMemberModal();
});

/* ============================================================
   [2] INIT MODAL
============================================================ */

function initMemberModal() {
  // ==========================================
  // ELEMENT
  // ==========================================

  const modal = document.getElementById("memberModal");

  const openBtn = document.getElementById("openMemberModal");

  const closeBtn = document.getElementById("closeMemberModal");

  const cancelBtn = document.getElementById("cancelMemberModal");

  const form = document.getElementById("memberForm");

  // ==========================================
  // VALIDATION ELEMENT
  // ==========================================

  if (!modal) {
    console.warn("⚠️ Member Modal tidak ditemukan");

    return;
  }

  // ==========================================
  // OPEN MODAL
  // ==========================================

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  }

  // ==========================================
  // CLOSE MODAL BUTTON X
  // ==========================================

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeMemberModal();
    });
  }

  // ==========================================
  // CANCEL BUTTON
  // ==========================================

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closeMemberModal();
    });
  }

  // ==========================================
  // CLICK OUTSIDE MODAL
  // ==========================================

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeMemberModal();
    }
  });

  // ==========================================
  // FORM SUBMIT SEMENTARA
  // Nanti diganti Supabase CRUD
  // ==========================================

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      console.log("📌 Form Member Submit");
    });
  }
}

/* ============================================================
   [3] CLOSE MODAL FUNCTION
============================================================ */

function closeMemberModal() {
  const modal = document.getElementById("memberModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");

  resetMemberForm();
}

/* ============================================================
   [4] RESET FORM
============================================================ */

function resetMemberForm() {
  const form = document.getElementById("memberForm");

  if (form) {
    form.reset();
  }

  // Reset Judul Modal

  const modalTitle = document.getElementById("memberModalTitle");

  if (modalTitle) {
    modalTitle.innerHTML = `

            <i class="fa-solid fa-user-plus"></i>

            Tambah Member

        `;
  }
}
