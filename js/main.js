/* ============================================================
  [1] GET ELEMENTS — GLOBAL
============================================================ */
const sections      = document.querySelectorAll(".section");
const menuLinks     = document.querySelectorAll(".menu-link");
const sidebar       = document.getElementById("sidebar");
const menuToggle    = document.getElementById("menuToggle");
const overlay       = document.getElementById("overlay");
const menuHighlight = document.getElementById("menuHighlight");

/* ============================================================
  [2] CLICK SOUND EFFECT
============================================================ */
const clickSound = document.getElementById("clickSound");

function playClickSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

/* ============================================================
  [3] PAGE LOADER
============================================================ */
const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader.classList.add("hide");
    /* Inisiasi gallery setelah halaman penuh terbaca */
    createGalleryDots();
    updateGalleryDots();
    startGalleryAutoSlide();
  }, 600);
});

/* ============================================================
  [4] LAZY LOAD IMAGE (INTERSECTION OBSERVER)
  FIX: file asli mendeklrasikan lazyImages dan imageObserver
  DUA KALI (baris 776 & 986) — menyebabkan SyntaxError
  "Identifier 'lazyImages' has already been declared".
============================================================ */
const lazyImages = document.querySelectorAll(".lazy-img");

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.onload = () => img.classList.add("loaded");
    observer.unobserve(img);
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));

/* ============================================================
  [5] SIDEBAR TOGGLE (MOBILE)
============================================================ */
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  playClickSound();
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

/* ============================================================
  [6] CLOSE SIDEBAR + SMOOTH SCROLL ON MENU CLICK
============================================================ */
menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    playClickSound();
    const target = document.querySelector(link.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ============================================================
  [7] ACTIVE MENU ON SCROLL (updateActiveMenu)
============================================================ */
function updateActiveMenu() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 200;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });

  menuLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
      if (menuHighlight) menuHighlight.style.top = link.offsetTop + "px";
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load",   updateActiveMenu);

/* ============================================================
  [8] NAVBAR ACTIVE UNDERLINE + SCROLL SECTION DETECTION
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
    const sectionTop    = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });
  if (currentSection) setActiveLink(currentSection);
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

/* ============================================================
  [9] NAVBAR SLIDING INDICATOR
============================================================ */
const navIndicator = document.querySelector(".nav-indicator");

function moveIndicator(targetLink) {
  if (!navIndicator || !targetLink) return;
  navIndicator.style.top     = targetLink.offsetTop + "px";
  navIndicator.style.height  = targetLink.offsetHeight + "px";
  navIndicator.style.opacity = "1";
}

window.addEventListener("load", () => {
  const activeLink = document.querySelector(".menu-link.sidebar-link.active");
  if (activeLink) moveIndicator(activeLink);
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => moveIndicator(link));
});

window.addEventListener("scroll", () => {
  const activeLink = document.querySelector(".menu-link.sidebar-link.active");
  if (activeLink) moveIndicator(activeLink);
});

/* ============================================================
  [10] NAVBAR CLICK BOUNCE EFFECT
============================================================ */
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    link.classList.add("bounce-active");
    setTimeout(() => link.classList.remove("bounce-active"), 400);
  });
});

/* ============================================================
  [11] SCROLL PROGRESS BAR (TOP)
============================================================ */
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop     = window.scrollY;
  const docHeight     = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";
});

/* ============================================================
  [12] COUNTER ANIMATION (HOME STATS)
============================================================ */
const counters     = document.querySelectorAll(".count");
let counterStarted = false;

function startCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((counter) => {
    const target    = +counter.dataset.target;
    let current     = 0;
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
  (entries) => { if (entries[0].isIntersecting) startCounters(); },
  { threshold: 0.5 }
);

counterObserver.observe(homeSection);

/* ============================================================
  [13] TYPING ANIMATION LOOPING
============================================================ */
const typingText = document.getElementById("typingText");

const words = [
  "Mangku Group",
  "Komunitas WhatsApp",
  "Tempat Nongkrong Online",
  "Tempat Sharing & Adu Nasip",
];

let wordIndex  = 0;
let charIndex  = 0;
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
      wordIndex  = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typingLoop, isDeleting ? 50 : 80);
}

typingLoop();

/* ============================================================
  [14] MEMBER MODAL
============================================================ */
const memberCards      = document.querySelectorAll(".member-card");
const memberModal      = document.getElementById("memberModal");
const closeMemberModal = document.getElementById("closeMemberModal");
const modalImg         = document.getElementById("modalImg");
const modalName        = document.getElementById("modalName");
const modalRole        = document.getElementById("modalRole");
const modalDesc        = document.getElementById("modalDesc");

memberCards.forEach((card) => {
  card.addEventListener("click", () => {
    modalImg.src          = card.dataset.img;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;
    modalDesc.textContent = card.dataset.desc;
    memberModal.classList.add("show");
  });
});

closeMemberModal.addEventListener("click", () => memberModal.classList.remove("show"));
memberModal.addEventListener("click", (e) => {
  if (e.target === memberModal) memberModal.classList.remove("show");
});

/* ============================================================
  [15] PROJECT MODAL
============================================================ */
const projectCards      = document.querySelectorAll(".project-card");
const projectModal      = document.getElementById("projectModal");
const closeProjectModal = document.getElementById("closeProjectModal");
const projectImg        = document.getElementById("projectImg");
const projectTitle      = document.getElementById("projectTitle");
const projectDesc       = document.getElementById("projectDesc");

projectCards.forEach((card) => {
  const btn = card.querySelector(".btn-detail");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      projectImg.src           = card.dataset.img;
      projectTitle.textContent = card.dataset.title;
      projectDesc.textContent  = card.dataset.desc;
      projectModal.classList.add("show");
    });
  }
});

closeProjectModal.addEventListener("click", () => projectModal.classList.remove("show"));
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) projectModal.classList.remove("show");
});

/* ============================================================
  [16] GALLERY SLIDER — PREV / NEXT BUTTONS
============================================================ */
const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev  = document.getElementById("galleryPrev");
const galleryNext  = document.getElementById("galleryNext");

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

/* ============================================================
  [17] GALLERY — DOT INDICATOR
============================================================ */
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
      galleryTrack.scrollTo({ left: index * 315, behavior: "smooth" });
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
  if (galleryDots[index]) galleryDots[index].classList.add("active");
}

galleryTrack.addEventListener("scroll", updateGalleryDots);

/* ============================================================
  [18] GALLERY — SWIPE GESTURE (MOBILE)
============================================================ */
let galTouchStartX = 0;
let galTouchEndX   = 0;

galleryTrack.addEventListener("touchstart", (e) => {
  galTouchStartX = e.changedTouches[0].screenX;
});

galleryTrack.addEventListener("touchend", (e) => {
  galTouchEndX = e.changedTouches[0].screenX;
  if (galTouchEndX < galTouchStartX - 40) galleryTrack.scrollLeft += 320;
  if (galTouchEndX > galTouchStartX + 40) galleryTrack.scrollLeft -= 320;
  setTimeout(updateGalleryDots, 200);
});

/* ============================================================
  [19] GALLERY — AUTO SLIDE + PROGRESS BAR
============================================================ */
const galleryProgressBar = document.getElementById("galleryProgressBar");

let galleryAutoSlide;
let progressInterval;
let progressValue = 0;

const slideDuration = 3000;
const progressStep  = 100 / (slideDuration / 50);

function resetProgress() {
  progressValue = 0;
  if (galleryProgressBar) galleryProgressBar.style.width = "0%";
}

function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    progressValue += progressStep;
    if (progressValue >= 100) progressValue = 100;
    if (galleryProgressBar) galleryProgressBar.style.width = progressValue + "%";
  }, 50);
}

function stopProgress() {
  clearInterval(progressInterval);
}

function nextSlide() {
  galleryTrack.scrollLeft += 320;
  if (galleryTrack.scrollLeft + galleryTrack.clientWidth >= galleryTrack.scrollWidth - 5) {
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

/* ============================================================
  [20] LIGHTBOX — ELEMENT REFERENCES & STATE
============================================================ */
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg   = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxPrev  = document.getElementById("lightboxPrev");
const lightboxNext  = document.getElementById("lightboxNext");
const zoomInBtn     = document.getElementById("zoomInBtn");
const zoomOutBtn    = document.getElementById("zoomOutBtn");
const zoomResetBtn  = document.getElementById("zoomResetBtn");
/* FIX: typo "fullscreentBtn" (ada huruf 't' ekstra) → "fullscreenBtn" */
const fullscreenBtn = document.getElementById("fullscreenBtn");

let isLightboxOpen = false;
let currentZoom    = 1;
const zoomStep     = 0.2;
const maxZoom      = 3;
const minZoom      = 0.4;

/* Drag state */
let isDragging = false;
let startX     = 0;
let startY     = 0;
let translateX = 0;
let translateY = 0;

/* Inertia state */
let velocityX    = 0;
let velocityY    = 0;
let lastX        = 0;
let lastY        = 0;
let momentumFrame;

/* Image navigation state */
const galleryImages   = document.querySelectorAll(".gallery-item img");
const galleryArray    = Array.from(galleryImages);
let currentImageIndex = 0;

/* ============================================================
  [21] LIGHTBOX — ZOOM FUNCTIONS
============================================================ */
function zoomToPoint(clientX, clientY, zoomFactor) {
  const rect     = lightboxImg.getBoundingClientRect();
  const offsetX  = clientX - rect.left;
  const offsetY  = clientY - rect.top;
  const percentX = offsetX / rect.width;
  const percentY = offsetY / rect.height;

  const prevZoom = currentZoom;
  let newZoom    = currentZoom * zoomFactor;
  if (newZoom > maxZoom) newZoom = maxZoom;
  if (newZoom < minZoom) newZoom = minZoom;

  const scaleChange = newZoom / prevZoom;
  translateX -= (percentX - 0.5) * rect.width  * (scaleChange - 1);
  translateY -= (percentY - 0.5) * rect.height * (scaleChange - 1);

  currentZoom = newZoom;
  applyZoom();
}

function applyZoom() {
  if (!lightboxImg) return;
  lightboxImg.style.transform  = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
  lightboxImg.style.transition = "transform 0.15s ease";
}

/* FIX: resetZoom di file asli menetapkan translateX/Y = 0 DUPLIKA (4 baris
   berulang). Dibersihkan menjadi satu set yang bersih. */
function resetZoom() {
  currentZoom = 1;
  translateX  = 0;
  translateY  = 0;
  cancelAnimationFrame(momentumFrame);
  velocityX = 0;
  velocityY = 0;
  if (lightboxImg) {
    lightboxImg.style.transform  = "scale(1) translate(0,0)";
    lightboxImg.style.transition = "transform 0.25s ease";
  }
}

/* ============================================================
  [22] LIGHTBOX — IMAGE PRELOAD
============================================================ */
function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

/* ============================================================
  [23] LIGHTBOX — OPEN / CLOSE
============================================================ */
function openLightbox(imgSrc) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = imgSrc;
  resetZoom();
  lightboxModal.classList.add("show");
  isLightboxOpen = true;

  /* Preload gambar di sekitar index aktif */
  const nextIdx = (currentImageIndex + 1) % galleryArray.length;
  const prevIdx = (currentImageIndex - 1 + galleryArray.length) % galleryArray.length;
  preloadImage(galleryArray[nextIdx].src);
  preloadImage(galleryArray[prevIdx].src);
}

function closeLightboxFn() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove("show");
  isLightboxOpen = false;
  if (document.fullscreenElement) document.exitFullscreen();
  resetZoom();
}

/* ============================================================
  [24] LIGHTBOX — SLIDE TRANSITION
============================================================ */
function changeImageWithSlide(newSrc, direction = "next") {
  if (!lightboxImg) return;

  const outClass = direction === "next" ? "slide-out-left"  : "slide-out-right";
  const inClass  = direction === "next" ? "slide-in-right"  : "slide-in-left";

  lightboxImg.classList.add(outClass);

  setTimeout(() => {
    lightboxImg.src = newSrc;
    resetZoom();
    lightboxImg.classList.remove(outClass);
    lightboxImg.classList.add(inClass);
    void lightboxImg.offsetWidth; /* paksa repaint */
    lightboxImg.classList.remove(inClass);
    lightboxImg.classList.add("slide-center");

    /* Hapus slide-center setelah transisi agar zoom tidak terkunci */
    setTimeout(() => lightboxImg.classList.remove("slide-center"), 350);
  }, 200);
}

/* ============================================================
  [25] LIGHTBOX — IMAGE NAVIGATION
============================================================ */
function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryArray.length;
  changeImageWithSlide(galleryArray[currentImageIndex].src, "next");
  /* Preload berikutnya */
  preloadImage(galleryArray[(currentImageIndex + 1) % galleryArray.length].src);
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryArray.length) % galleryArray.length;
  changeImageWithSlide(galleryArray[currentImageIndex].src, "prev");
  /* Preload sebelumnya */
  preloadImage(galleryArray[(currentImageIndex - 1 + galleryArray.length) % galleryArray.length].src);
}

/* ============================================================
  [26] LIGHTBOX — TRIGGER BUKA DARI GALLERY
============================================================ */
galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentImageIndex = index;
    /* Gunakan dataset.src (lazy load) bukan img.src (placeholder) */
    openLightbox(img.dataset.src || img.src);
  });
  img.style.cursor = "pointer";
});

/* ============================================================
  [27] LIGHTBOX — BUTTON EVENTS (NAV, CLOSE, ZOOM, FULLSCREEN)
============================================================ */
lightboxNext?.addEventListener("click", showNextImage);
lightboxPrev?.addEventListener("click", showPrevImage);

if (closeLightbox) {
  closeLightbox.addEventListener("click", closeLightboxFn);
}

if (lightboxModal) {
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) closeLightboxFn();
  });
}

/* ESC + Arrow keyboard */
document.addEventListener("keydown", (e) => {
  if (!isLightboxOpen) return;
  if (e.key === "Escape")     closeLightboxFn();
  if (e.key === "ArrowRight") showNextImage();
  if (e.key === "ArrowLeft")  showPrevImage();
});

/* Zoom In */
if (zoomInBtn) {
  zoomInBtn.addEventListener("click", () => {
    const rect = lightboxImg.getBoundingClientRect();
    zoomToPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.2);
  });
}

/* Zoom Out */
if (zoomOutBtn) {
  zoomOutBtn.addEventListener("click", () => {
    const rect = lightboxImg.getBoundingClientRect();
    zoomToPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.8);
  });
}

/* Zoom Reset */
if (zoomResetBtn) {
  zoomResetBtn.addEventListener("click", resetZoom);
}

/* Fullscreen */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    lightboxModal.requestFullscreen().catch((err) => console.log("Fullscreen error:", err));
  } else {
    document.exitFullscreen();
  }
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  document.addEventListener("fullscreenchange", () => {
    if (!fullscreenBtn) return;
    fullscreenBtn.innerHTML = document.fullscreenElement
      ? '<i class="fa-solid fa-compress"></i>'
      : '<i class="fa-solid fa-expand"></i>';
  });
}

/* ============================================================
  [28] LIGHTBOX — DOUBLE CLICK ZOOM
============================================================ */
if (lightboxImg) {
  lightboxImg.addEventListener("dblclick", (e) => {
    if (currentZoom === 1) zoomToPoint(e.clientX, e.clientY, 2);
    else                   resetZoom();
  });
}

/* ============================================================
  [29] LIGHTBOX — SCROLL WHEEL ZOOM
============================================================ */
if (lightboxImg) {
  lightboxImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomToPoint(e.clientX, e.clientY, e.deltaY < 0 ? 1.2 : 0.8);
  }, { passive: false });
}

/* ============================================================
  [30] LIGHTBOX — MOUSE DRAG
============================================================ */
if (lightboxImg) {
  lightboxImg.addEventListener("mousedown", (e) => {
    cancelAnimationFrame(momentumFrame);
    velocityX  = 0;
    velocityY  = 0;
    lastX      = e.clientX;
    lastY      = e.clientY;
    isDragging = true;
    startX     = e.clientX - translateX;
    startY     = e.clientY - translateY;
    lightboxImg.style.cursor = "grabbing";
  });
}

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  velocityX = e.clientX - lastX;
  velocityY = e.clientY - lastY;
  lastX     = e.clientX;
  lastY     = e.clientY;

  let newX = e.clientX - startX;
  let newY = e.clientY - startY;

  const rect = lightboxImg.getBoundingClientRect();
  const maxX = (rect.width  * (currentZoom - 1)) / 2;
  const maxY = (rect.height * (currentZoom - 1)) / 2;

  /* Soft resistance di tepi */
  const overflowX  = newX - Math.max(-maxX, Math.min(maxX, newX));
  const overflowY  = newY - Math.max(-maxY, Math.min(maxY, newY));
  const resistance = 0.35;

  translateX = Math.max(-maxX, Math.min(maxX, newX)) + overflowX * resistance;
  translateY = Math.max(-maxY, Math.min(maxY, newY)) + overflowY * resistance;

  lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  if (lightboxImg) lightboxImg.style.cursor = "grab";
  startMomentum();
  setTimeout(applyEdgeBounce, 50);
});

/* ============================================================
  [31] LIGHTBOX — INERTIA / MOMENTUM + EDGE BOUNCE
  FIX: applyEdgeBounce & clampToBounds ada NESTED di dalam
  startMomentum() di file asli, sehingga tidak bisa dipanggil
  dari luar (mouseup memanggil applyEdgeBounce() yang undefined).
  Dipindahkan menjadi fungsi mandiri di scope global.
============================================================ */
function clampToBounds() {
  const rect = lightboxImg.getBoundingClientRect();
  const maxX = (rect.width  * (currentZoom - 1)) / 2;
  const maxY = (rect.height * (currentZoom - 1)) / 2;
  translateX = Math.max(-maxX, Math.min(maxX, translateX));
  translateY = Math.max(-maxY, Math.min(maxY, translateY));
  lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
}

function applyEdgeBounce() {
  const rect    = lightboxImg.getBoundingClientRect();
  const maxX    = (rect.width  * (currentZoom - 1)) / 2;
  const maxY    = (rect.height * (currentZoom - 1)) / 2;
  let targetX   = Math.max(-maxX, Math.min(maxX, translateX));
  let targetY   = Math.max(-maxY, Math.min(maxY, translateY));
  const ease    = 0.12;

  (function animate() {
    const dx = targetX - translateX;
    const dy = targetY - translateY;
    translateX += dx * ease;
    translateY += dy * ease;
    lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) { clampToBounds(); return; }
    requestAnimationFrame(animate);
  })();
}

function startMomentum() {
  const friction = 0.95;

  (function animate() {
    velocityX *= friction;
    velocityY *= friction;
    translateX += velocityX;
    translateY += velocityY;

    const rect       = lightboxImg.getBoundingClientRect();
    const maxX       = (rect.width  * (currentZoom - 1)) / 2;
    const maxY       = (rect.height * (currentZoom - 1)) / 2;
    const overflowX  = translateX - Math.max(-maxX, Math.min(maxX, translateX));
    const overflowY  = translateY - Math.max(-maxY, Math.min(maxY, translateY));
    const resistance = 0.35;

    translateX = Math.max(-maxX, Math.min(maxX, translateX)) + overflowX * resistance;
    translateY = Math.max(-maxY, Math.min(maxY, translateY)) + overflowY * resistance;

    lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;

    if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) { clampToBounds(); return; }
    momentumFrame = requestAnimationFrame(animate);
  })();
}

/* ============================================================
  [32] LIGHTBOX — TOUCH SWIPE + PINCH ZOOM
============================================================ */
let lbTouchStartX   = 0;
let lbTouchEndX     = 0;
let initialDistance = 0;
let isPinching      = false;

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

if (lightboxImg) {
  lightboxImg.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      isPinching      = true;
      initialDistance = getTouchDistance(e.touches);
    } else {
      lbTouchStartX = e.changedTouches[0].screenX;
    }
  });

  lightboxImg.addEventListener("touchmove", (e) => {
    if (!isPinching || e.touches.length !== 2) return;
    e.preventDefault();

    const currentDistance = getTouchDistance(e.touches);
    let newZoom = currentZoom * (currentDistance / initialDistance);
    if (newZoom > maxZoom) newZoom = maxZoom;
    if (newZoom < minZoom) newZoom = minZoom;

    currentZoom     = newZoom;
    initialDistance = currentDistance;
    applyZoom();
  }, { passive: false });

  /* Satu touchend handler untuk swipe dan pinch */
  lightboxImg.addEventListener("touchend", (e) => {
    if (isPinching) { isPinching = false; return; }
    lbTouchEndX = e.changedTouches[0].screenX;
    if (currentZoom > 1) return;

    const swipeThreshold = 50;
    if (lbTouchEndX < lbTouchStartX - swipeThreshold) showNextImage();
    if (lbTouchEndX > lbTouchStartX + swipeThreshold) showPrevImage();
  });
}

/* ============================================================
  [33] CONTACT FORM VALIDATION
============================================================ */
const contactForm  = document.getElementById("contactForm");
const nameInput    = document.getElementById("name");
const emailInput   = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError    = document.getElementById("nameError");
const emailError   = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;
  nameError.textContent    = "";
  emailError.textContent   = "";
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

/* ============================================================
  [34] DARK MODE TOGGLE
============================================================ */
const darkToggle = document.getElementById("darkToggle");

function enableDarkMode()  { document.body.classList.add("dark");    localStorage.setItem("theme", "dark");  }
function disableDarkMode() { document.body.classList.remove("dark"); localStorage.setItem("theme", "light"); }

if (localStorage.getItem("theme") === "dark") enableDarkMode();

darkToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) disableDarkMode();
  else                                           enableDarkMode();
});

/* ============================================================
  [35] BACK TO TOP BUTTON
============================================================ */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) backToTop.classList.add("show");
  else                       backToTop.classList.remove("show");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
  [36] TOAST NOTIFICATION
============================================================ */
const toast    = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
