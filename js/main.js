/* ===============================
   GET ELEMENTS
================================ */
const sections = document.querySelectorAll(".section");
const menuLinks = document.querySelectorAll(".menu-link");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");

const menuHighlight = document.getElementById("menuHighlight");

/* ===============================
   CLICK SOUND EFFECT
================================ */
const clickSound = document.getElementById("clickSound");

function playClickSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

/* ===============================
   SIDEBAR TOGGLE (MOBILE)
================================ */
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  playClickSound();
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

/* ===============================
   CLOSE SIDEBAR WHEN CLICK MENU (MOBILE)
================================ */
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    playClickSound();
  });
});

/* ===============================
   SMOOTH SCROLL MENU
================================ */
menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ===============================
   ACTIVE MENU + HIGHLIGHT FOLLOW
================================ */
function updateActiveMenu() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  menuLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");

      if (menuHighlight) {
        menuHighlight.style.top = link.offsetTop + "px";
      }
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load", updateActiveMenu);

/* ===============================
   SIDEBAR AUTO HIDE (DESKTOP ONLY)
================================ */
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) return;

  if (window.scrollY > lastScrollY) {
    sidebar.classList.add("hide");
  } else {
    sidebar.classList.remove("hide");
  }

  lastScrollY = window.scrollY;
});

/* ===============================
   MEMBER MODAL (DETAIL MEMBER)
================================ */
const memberCards = document.querySelectorAll(".member-card");
const memberModal = document.getElementById("memberModal");
const closeMemberModal = document.getElementById("closeMemberModal");

const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalRole = document.getElementById("modalRole");
const modalDesc = document.getElementById("modalDesc");

memberCards.forEach((card) => {
  card.addEventListener("click", () => {
    modalImg.src = card.dataset.img;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;
    modalDesc.textContent = card.dataset.desc;

    memberModal.classList.add("show");
  });
});

closeMemberModal.addEventListener("click", () => {
  memberModal.classList.remove("show");
});

memberModal.addEventListener("click", (e) => {
  if (e.target === memberModal) {
    memberModal.classList.remove("show");
  }
});

/* ===============================
   PROJECT MODAL (DETAIL PROJECT)
================================ */
const projectCards = document.querySelectorAll(".project-card");
const projectModal = document.getElementById("projectModal");
const closeProjectModal = document.getElementById("closeProjectModal");

const projectImg = document.getElementById("projectImg");
const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");

projectCards.forEach((card) => {
  const btn = card.querySelector(".btn-detail");

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      projectImg.src = card.dataset.img;
      projectTitle.textContent = card.dataset.title;
      projectDesc.textContent = card.dataset.desc;

      projectModal.classList.add("show");
    });
  }
});

closeProjectModal.addEventListener("click", () => {
  projectModal.classList.remove("show");
});

projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove("show");
  }
});

/* ===============================
   GALLERY LIGHTBOX MODAL
================================ */
const galleryImages = document.querySelectorAll(".gallery-img");
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

let isLightboxOpen = false;

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxModal.classList.add("show");

    isLightboxOpen = true;
    stopGalleryAutoSlide();
  });
});

closeLightbox.addEventListener("click", () => {
  lightboxModal.classList.remove("show");

  isLightboxOpen = false;
  startGalleryAutoSlide();
});

lightboxModal.addEventListener("click", (e) => {
  if (e.target === lightboxModal) {
    lightboxModal.classList.remove("show");

    isLightboxOpen = false;
    startGalleryAutoSlide();
  }
});

/* ===============================
   GALLERY SLIDER BUTTON
================================ */
const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

galleryNext.addEventListener("click", () => {
  galleryTrack.scrollLeft += 320;
  updateGalleryDots();

  resetProgress();
  startProgress();
});

galleryPrev.addEventListener("click", () => {
  galleryTrack.scrollLeft -= 320;
  updateGalleryDots();

  resetProgress();
  startProgress();
});

/* ===============================
   DOT INDICATOR GALLERY
================================ */
const galleryDotsContainer = document.getElementById("galleryDots");
let galleryDots = [];

function createGalleryDots() {
  galleryDotsContainer.innerHTML = "";
  galleryDots = [];

  const items = document.querySelectorAll(".gallery-item");

  items.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("gallery-dot");

    dot.addEventListener("click", () => {
      galleryTrack.scrollTo({
        left: index * 315,
        behavior: "smooth",
      });

      setTimeout(updateGalleryDots, 200);

      resetProgress();
      startProgress();
    });

    galleryDotsContainer.appendChild(dot);
    galleryDots.push(dot);
  });

  updateGalleryDots();
}

function updateGalleryDots() {
  if (galleryDots.length === 0) return;

  const index = Math.round(galleryTrack.scrollLeft / 315);

  galleryDots.forEach((dot) => dot.classList.remove("active"));

  if (galleryDots[index]) {
    galleryDots[index].classList.add("active");
  }
}

galleryTrack.addEventListener("scroll", () => {
  updateGalleryDots();
});

/* ===============================
   SWIPE GESTURE (MOBILE)
================================ */
let touchStartX = 0;
let touchEndX = 0;

galleryTrack.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

galleryTrack.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;

  if (touchEndX < touchStartX - 40) {
    galleryTrack.scrollLeft += 320;
  }

  if (touchEndX > touchStartX + 40) {
    galleryTrack.scrollLeft -= 320;
  }

  setTimeout(updateGalleryDots, 200);
});

/* ===============================
   GALLERY AUTO SLIDE + PROGRESS BAR
================================ */
const galleryProgressBar = document.getElementById("galleryProgressBar");

let galleryAutoSlide;
let progressInterval;
let progressValue = 0;

const slideDuration = 3000;
const progressStep = 100 / (slideDuration / 50);

function resetProgress() {
  progressValue = 0;
  if (galleryProgressBar) galleryProgressBar.style.width = "0%";
}

function startProgress() {
  stopProgress();

  progressInterval = setInterval(() => {
    progressValue += progressStep;

    if (progressValue >= 100) progressValue = 100;

    if (galleryProgressBar) {
      galleryProgressBar.style.width = progressValue + "%";
    }
  }, 50);
}

function stopProgress() {
  clearInterval(progressInterval);
}

function nextSlide() {
  galleryTrack.scrollLeft += 320;

  if (
    galleryTrack.scrollLeft + galleryTrack.clientWidth >=
    galleryTrack.scrollWidth - 5
  ) {
    galleryTrack.scrollLeft = 0;
  }

  updateGalleryDots();
}

function startGalleryAutoSlide() {
  if (isLightboxOpen) return;

  stopGalleryAutoSlide();
  resetProgress();
  startProgress();

  galleryAutoSlide = setInterval(() => {
    nextSlide();
    resetProgress();
    startProgress();
  }, slideDuration);
}

function stopGalleryAutoSlide() {
  clearInterval(galleryAutoSlide);
  stopProgress();
}

/* ===============================
   SCROLL PROGRESS BAR (TOP)
================================ */
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  scrollProgress.style.width = scrollPercent + "%";
});

/* ===============================
   BACK TO TOP BUTTON
================================ */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===============================
   TOAST NOTIFICATION
================================ */
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ===============================
   CONTACT FORM VALIDATION
================================ */
const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Nama wajib diisi!";
    valid = false;
  }

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email wajib diisi!";
    valid = false;
  } else if (!emailInput.value.includes("@")) {
    emailError.textContent = "Format email tidak valid!";
    valid = false;
  }

  if (messageInput.value.trim() === "") {
    messageError.textContent = "Pesan wajib diisi!";
    valid = false;
  }

  if (valid) {
    showToast("Pesan berhasil dikirim! Terima kasih 😊");
    contactForm.reset();
  }
});

/* ===============================
   DARK MODE TOGGLE
================================ */
const darkToggle = document.getElementById("darkToggle");

function enableDarkMode() {
  document.body.classList.add("dark");
  localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
  document.body.classList.remove("dark");
  localStorage.setItem("theme", "light");
}

if (localStorage.getItem("theme") === "dark") {
  enableDarkMode();
}

darkToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

/* ===============================
   TYPING ANIMATION LOOPING
================================ */
const typingText = document.getElementById("typingText");

const words = [
  "Mangku Group",
  "Komunitas WhatsApp",
  "Tempat Nongkrong Online",
  "Tempat Sharing & Adu Nasip",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typingLoop() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typingLoop, 1200);
      return;
    }
  } else {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typingLoop, isDeleting ? 50 : 80);
}

typingLoop();

/* ===============================
   COUNTER ANIMATION (HOME STATS)
================================ */
const counters = document.querySelectorAll(".count");
let counterStarted = false;

function startCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    let current = 0;

    const increment = Math.ceil(target / 60);

    const updateCounter = setInterval(() => {
      current += increment;

      if (current >= target) {
        counter.textContent = target;
        clearInterval(updateCounter);
      } else {
        counter.textContent = current;
      }
    }, 30);
  });
}

const homeSection = document.querySelector("#home");

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      startCounters();
    }
  },
  { threshold: 0.5 },
);

counterObserver.observe(homeSection);

/* ===============================
   PAGE LOADER + START GALLERY
================================ */
const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader.classList.add("hide");

    createGalleryDots();
    updateGalleryDots();
    startGalleryAutoSlide();
  }, 600);
});

/* ============================================================
   NAVBAR ACTIVE UNDERLINE + ACTIVE MENU ON SCROLL (CUSTOM JS)
============================================================ */
const sidebarLinks = document.querySelectorAll(".menu-link.sidebar-link");
const PageSections = document.querySelectorAll("section[id]");

function setActiveLink(id) {
  sidebarLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
  if (activeLink) activeLink.classList.add("active");
}

window.addEventListener("scroll", () => {
  let currentSection = "";

  PageSections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  if (currentSection) {
    setActiveLink(currentSection);
  }
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
