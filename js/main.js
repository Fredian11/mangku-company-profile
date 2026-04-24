"use strict";

/* ============================================================
  UTILS
============================================================ */

/** Shortcut getElementById */
const $ = (id) => document.getElementById(id);

/** Jalankan callback sekali per frame (rAF throttle) */
function rafThrottle(fn) {
  let ticking = false;
  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
      ticking = true;
    }
  };
}

/* ============================================================
  [1] ELEMENT REFERENCES
============================================================ */
const pageLoader = $("pageLoader");
const scrollProgress = $("scrollProgress");
const menuToggle = $("menuToggle");
const overlay = $("overlay");
const sidebar = $("sidebar");
const menuHighlight = $("menuHighlight");
const darkToggle = $("darkToggle");
const backToTop = $("backToTop");
const toast = $("toast");
const toastMsg = $("toastMsg");
const clickSound = $("clickSound");
const typingText = $("typingText");
const contactForm = $("contactForm");

// Gallery
const galleryTrack = $("galleryTrack");
const galleryPrev = $("galleryPrev");
const galleryNext = $("galleryNext");
const galleryDotsCont = $("galleryDots");
const galleryProgressBar = $("galleryProgressBar");

// Lightbox
const lightboxModal = $("lightboxModal");
const lightboxImg = $("lightboxImg");
const closeLightbox = $("closeLightbox");
const lightboxPrev = $("lightboxPrev");
const lightboxNext = $("lightboxNext");
const zoomInBtn = $("zoomInBtn");
const zoomOutBtn = $("zoomOutBtn");
const zoomResetBtn = $("zoomResetBtn");
const fullscreenBtn = $("fullscreenBtn");
const lightboxThumbs = $("lightboxThumbs");
const lightboxCounter = $("lightboxCounter");

// Sidebar nav
const sidebarLinks = document.querySelectorAll(".menu-link.sidebar-link");
const pageSections = document.querySelectorAll("section[id]");
const navIndicator = document.querySelector(".nav-indicator");
const allMenuLinks = document.querySelectorAll(".menu-link");

/* ============================================================
  [2] CLICK SOUND
============================================================ */
function playClickSound() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {}); // silently ignore autoplay policy
}

/* ============================================================
  [3] PAGE LOADER
============================================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader?.classList.add("hide");
    createGalleryDots();
    updateGalleryDots();
    startGalleryAutoSlide();
    initReveal();
  }, 600);
});

/* ============================================================
  [4] LAZY LOAD (single IntersectionObserver)
============================================================ */
const lazyImages = document.querySelectorAll(".lazy-img");

if (lazyImages.length) {
  const imgObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.onload = () => img.classList.add("loaded");
        obs.unobserve(img);
      });
    },
    { rootMargin: "200px" },
  );

  lazyImages.forEach((img) => imgObserver.observe(img));
}

/* ============================================================
  [5] SIDEBAR TOGGLE (MOBILE)
============================================================ */
function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}

menuToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  playClickSound();
});

overlay?.addEventListener("click", closeSidebar);

/* ============================================================
  [6] MENU LINKS — SMOOTH SCROLL + CLOSE SIDEBAR
============================================================ */
allMenuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    closeSidebar();
    playClickSound();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ============================================================
  [7] NAVBAR — ACTIVE SECTION DETECTION
============================================================ */
function getActiveSectionId() {
  let current = "";
  pageSections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  return current;
}

function updateActiveMenu() {
  const id = getActiveSectionId();
  if (!id) return;

  sidebarLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    if (isActive) moveIndicator(link);
  });
}

/* ============================================================
  [8] NAVBAR — SLIDING INDICATOR
============================================================ */
function moveIndicator(targetLink) {
  if (!navIndicator || !targetLink) return;
  navIndicator.style.top = targetLink.offsetTop + "px";
  navIndicator.style.height = targetLink.offsetHeight + "px";
  navIndicator.style.opacity = "1";
}

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(link);

    // bounce effect
    link.classList.add("bounce-active");
    setTimeout(() => link.classList.remove("bounce-active"), 400);
  });
});

/* ============================================================
  [9] UNIFIED SCROLL HANDLER (single rAF — replaces 3 duplicates)
  Bug lama: ada 3 window.addEventListener("scroll") terpisah untuk
  scroll progress, back-to-top, dan active menu. Digabung satu.
============================================================ */
function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = scrollPercent + "%";
  if (backToTop) backToTop.classList.toggle("show", scrollTop > 400);

  updateActiveMenu();
}

window.addEventListener("scroll", rafThrottle(handleScroll), { passive: true });

// Init on load
window.addEventListener("load", () => {
  handleScroll();
  const active = document.querySelector(".menu-link.sidebar-link.active");
  if (active) moveIndicator(active);
});

/* ============================================================
  [10] COUNTER ANIMATION
============================================================ */
const counters = document.querySelectorAll(".count");
let counterStarted = false;

function startCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((counter) => {
    const target = +counter.dataset.target || 0;
    const increment = Math.ceil(target / 60);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = current;
      }
    }, 30);
  });
}

const homeSection = document.querySelector("#home");
if (homeSection) {
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startCounters();
    },
    { threshold: 0.5 },
  ).observe(homeSection);
}

/* ============================================================
  [11] TYPING ANIMATION
============================================================ */
const typingWords = [
  "Mangku Group",
  "Komunitas WhatsApp",
  "Tempat Nongkrong Online",
  "Tempat Sharing & Adu Nasip",
];

let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typingLoop() {
  if (!typingText) return;
  const word = typingWords[wordIdx];

  if (!isDeleting) {
    typingText.textContent = word.slice(0, ++charIdx);
    if (charIdx === word.length) {
      isDeleting = true;
      return setTimeout(typingLoop, 1200);
    }
  } else {
    typingText.textContent = word.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % typingWords.length;
    }
  }

  setTimeout(typingLoop, isDeleting ? 50 : 80);
}

typingLoop();

/* ============================================================
  [12] SCROLL REVEAL (single observer — replaces 2 duplicates)
  Bug lama: ada 2 IntersectionObserver untuk .reveal, satu pakai
  class "show" dan satu pakai class "active" — keduanya berjalan
  bersamaan, CSS hanya mengenal "active", sehingga "show" tidak
  melakukan apa-apa dan elemen reveal tidak selalu muncul.
============================================================ */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  ).observe = (() => {
    // override observe untuk bulk register
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return observer.observe.bind(observer);
  })();
}

/* ============================================================
  [13] MODAL HELPER
============================================================ */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("show");
  modalEl.focus?.();
}

function closeModal(modalEl) {
  modalEl?.classList.remove("show");
}

/* Close on backdrop click */
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

/* ============================================================
  [14] MEMBER MODAL
============================================================ */
const memberModal = $("memberModal");

document.querySelectorAll(".member-card").forEach((card) => {
  card.addEventListener("click", () => {
    $("modalImg").src = card.dataset.img || "";
    $("modalName").textContent = card.dataset.name || "";
    $("modalRole").textContent = card.dataset.role || "";
    $("modalDesc").textContent = card.dataset.desc || "";
    openModal(memberModal);
  });
});

$("closeMemberModal")?.addEventListener("click", () => closeModal(memberModal));

/* ============================================================
  [15] PROJECT MODAL
============================================================ */
const projectModal = $("projectModal");

document.querySelectorAll(".project-card").forEach((card) => {
  card.querySelector(".btn-detail")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("projectImg").src = card.dataset.img || "";
    $("projectTitle").textContent = card.dataset.title || "";
    $("projectDesc").textContent = card.dataset.desc || "";
    openModal(projectModal);
  });
});

$("closeProjectModal")?.addEventListener("click", () =>
  closeModal(projectModal),
);

/* ============================================================
  [16] GALLERY SLIDER
============================================================ */
const SLIDE_WIDTH = 320;

function scrollGallery(dir) {
  galleryTrack.scrollLeft += dir * SLIDE_WIDTH;
  updateGalleryDots();
  resetProgress();
  startProgress();
}

galleryNext?.addEventListener("click", () => scrollGallery(1));
galleryPrev?.addEventListener("click", () => scrollGallery(-1));

/* ============================================================
  [17] GALLERY — DOT INDICATOR
============================================================ */
let galleryDots = [];

function createGalleryDots() {
  if (!galleryDotsCont) return;
  galleryDotsCont.innerHTML = "";
  galleryDots = [];

  document.querySelectorAll(".gallery-item").forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("gallery-dot");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);

    dot.addEventListener("click", () => {
      galleryTrack.scrollTo({ left: i * 315, behavior: "smooth" });
      setTimeout(updateGalleryDots, 200);
      resetProgress();
      startProgress();
    });

    galleryDotsCont.appendChild(dot);
    galleryDots.push(dot);
  });

  updateGalleryDots();
}

function updateGalleryDots() {
  if (!galleryDots.length) return;
  const idx = Math.round(galleryTrack.scrollLeft / 315);
  galleryDots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

galleryTrack?.addEventListener("scroll", rafThrottle(updateGalleryDots), {
  passive: true,
});

/* ============================================================
  [18] GALLERY — TOUCH SWIPE
============================================================ */
let galSwipeStart = 0;

galleryTrack?.addEventListener(
  "touchstart",
  (e) => {
    galSwipeStart = e.changedTouches[0].screenX;
  },
  { passive: true },
);

galleryTrack?.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].screenX - galSwipeStart;
    if (Math.abs(delta) < 40) return;
    scrollGallery(delta < 0 ? 1 : -1);
  },
  { passive: true },
);

/* ============================================================
  [19] GALLERY — AUTO SLIDE + PROGRESS BAR
============================================================ */
const SLIDE_DURATION = 3000;
const PROGRESS_STEP = 100 / (SLIDE_DURATION / 50);

let galleryAutoSlide;
let progressIntervalId;
let progressValue = 0;

function resetProgress() {
  progressValue = 0;
  if (galleryProgressBar) galleryProgressBar.style.width = "0%";
}

function startProgress() {
  stopProgress();
  progressIntervalId = setInterval(() => {
    progressValue = Math.min(progressValue + PROGRESS_STEP, 100);
    if (galleryProgressBar)
      galleryProgressBar.style.width = progressValue + "%";
  }, 50);
}

function stopProgress() {
  clearInterval(progressIntervalId);
}

function autoNextSlide() {
  const maxLeft = galleryTrack.scrollWidth - galleryTrack.clientWidth;
  galleryTrack.scrollLeft =
    galleryTrack.scrollLeft >= maxLeft - 5
      ? 0
      : galleryTrack.scrollLeft + SLIDE_WIDTH;
  updateGalleryDots();
}

function startGalleryAutoSlide() {
  if (isLightboxOpen) return;
  stopGalleryAutoSlide();
  resetProgress();
  startProgress();
  galleryAutoSlide = setInterval(() => {
    autoNextSlide();
    resetProgress();
    startProgress();
  }, SLIDE_DURATION);
}

function stopGalleryAutoSlide() {
  clearInterval(galleryAutoSlide);
  stopProgress();
}

// Pause on hover
galleryTrack?.addEventListener("mouseenter", stopGalleryAutoSlide);
galleryTrack?.addEventListener("mouseleave", startGalleryAutoSlide);

/* ============================================================
  [20] LIGHTBOX — STATE
============================================================ */
let isLightboxOpen = false;
let currentZoom = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let velocityX = 0;
let velocityY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let momentumFrame;
let isImmersive = false;
let uiHideTimer;
let keyRepeatInterval;
let lastTap = 0;
let isPinching = false;
let pinchStartDist = 0;

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.4;

const galleryImgEls = document.querySelectorAll(".gallery-item img");
const galleryArr = Array.from(galleryImgEls);
let currentImgIdx = 0;

/* ============================================================
  [21] LIGHTBOX — ZOOM
============================================================ */
function applyZoom() {
  if (!lightboxImg) return;
  lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
  lightboxImg.style.transition = "transform 0.15s ease";
}

function resetZoom() {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  cancelAnimationFrame(momentumFrame);
  velocityX = 0;
  velocityY = 0;
  if (lightboxImg) {
    lightboxImg.style.transform = "none";
    lightboxImg.style.transition = "transform 0.25s ease";
  }
}

function zoomToPoint(cx, cy, factor) {
  if (!lightboxImg) return;
  const rect = lightboxImg.getBoundingClientRect();
  const px = (cx - rect.left) / rect.width - 0.5;
  const py = (cy - rect.top) / rect.height - 0.5;
  const prevZoom = currentZoom;
  currentZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * factor));
  const scale = currentZoom / prevZoom;
  translateX -= px * rect.width * (scale - 1);
  translateY -= py * rect.height * (scale - 1);
  applyZoom();
}

/* ============================================================
  [22] LIGHTBOX — CLAMP & BOUNCE
============================================================ */
function getBounds() {
  if (!lightboxImg) return { maxX: 0, maxY: 0 };
  const rect = lightboxImg.getBoundingClientRect();
  return {
    maxX: Math.max(0, (rect.width * (currentZoom - 1)) / 2),
    maxY: Math.max(0, (rect.height * (currentZoom - 1)) / 2),
  };
}

function clampToBounds() {
  const { maxX, maxY } = getBounds();
  translateX = Math.max(-maxX, Math.min(maxX, translateX));
  translateY = Math.max(-maxY, Math.min(maxY, translateY));
  if (lightboxImg) {
    lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
  }
}

function applyEdgeBounce() {
  const { maxX, maxY } = getBounds();
  const targetX = Math.max(-maxX, Math.min(maxX, translateX));
  const targetY = Math.max(-maxY, Math.min(maxY, translateY));

  (function animate() {
    const dx = (targetX - translateX) * 0.12;
    const dy = (targetY - translateY) * 0.12;
    translateX += dx;
    translateY += dy;
    if (lightboxImg) {
      lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
    }
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      clampToBounds();
      return;
    }
    requestAnimationFrame(animate);
  })();
}

function startMomentum() {
  (function animate() {
    velocityX *= 0.92;
    velocityY *= 0.92;
    translateX += velocityX * 0.8;
    translateY += velocityY * 0.8;

    const { maxX, maxY } = getBounds();
    const ox = translateX - Math.max(-maxX, Math.min(maxX, translateX));
    const oy = translateY - Math.max(-maxY, Math.min(maxY, translateY));
    translateX = Math.max(-maxX, Math.min(maxX, translateX)) + ox * 0.35;
    translateY = Math.max(-maxY, Math.min(maxY, translateY)) + oy * 0.35;

    if (lightboxImg) {
      lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
    }
    if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
      clampToBounds();
      return;
    }
    momentumFrame = requestAnimationFrame(animate);
  })();
}

/* ============================================================
  [23] LIGHTBOX — UI HIDE TIMER & IMMERSIVE
============================================================ */
function resetUIHideTimer() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove("lightbox-ui-hidden");
  clearTimeout(uiHideTimer);
  uiHideTimer = setTimeout(
    () => lightboxModal.classList.add("lightbox-ui-hidden"),
    2500,
  );
}

["mousemove", "touchstart"].forEach((evt) => {
  lightboxModal?.addEventListener(evt, resetUIHideTimer, { passive: true });
});

function toggleImmersiveMode(force = null) {
  if (!lightboxModal) return;
  isImmersive = force !== null ? force : !isImmersive;
  lightboxModal.classList.toggle("lightbox-immersive", isImmersive);
}

lightboxModal?.addEventListener("click", (e) => {
  if (
    e.target.closest(".lightbox-controls") ||
    e.target.closest(".lightbox-nav") ||
    e.target.closest(".lightbox-thumbs") ||
    e.target.closest(".close")
  )
    return;
  toggleImmersiveMode();
});

/* ============================================================
  [24] LIGHTBOX — OPEN / CLOSE
============================================================ */
function preloadImage(src) {
  if (!src) return;
  new Image().src = src;
}

function openLightbox(src, idx) {
  if (!lightboxModal || !lightboxImg) return;
  currentImgIdx = idx;
  lightboxImg.src = src;
  resetZoom();
  openModal(lightboxModal);
  isLightboxOpen = true;
  toggleImmersiveMode(false);
  stopGalleryAutoSlide();
  generateThumbnails();
  resetUIHideTimer();

  // preload neighbors
  const n = galleryArr.length;
  preloadImage(
    galleryArr[(idx + 1) % n]?.dataset.src || galleryArr[(idx + 1) % n]?.src,
  );
  preloadImage(
    galleryArr[(idx - 1 + n) % n]?.dataset.src ||
      galleryArr[(idx - 1 + n) % n]?.src,
  );
}

function closeLightboxFn() {
  if (!lightboxModal) return;
  closeModal(lightboxModal);
  isLightboxOpen = false;
  clearTimeout(uiHideTimer);
  lightboxModal.classList.remove("lightbox-ui-hidden");
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  toggleImmersiveMode(false);
  resetZoom();
  startGalleryAutoSlide();
}

closeLightbox?.addEventListener("click", closeLightboxFn);

/* ============================================================
  [25] LIGHTBOX — SLIDE TRANSITION
============================================================ */
function changeImage(src, direction) {
  if (!lightboxImg) return;

  const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
  const inClass = direction === "next" ? "slide-in-right" : "slide-in-left";

  lightboxImg.classList.add(outClass);

  setTimeout(() => {
    lightboxImg.src = src;
    resetZoom();
    lightboxImg.classList.remove(outClass);
    lightboxImg.classList.add(inClass);
    void lightboxImg.offsetWidth; // force reflow
    lightboxImg.classList.remove(inClass);
    lightboxImg.classList.add("slide-center");
    setTimeout(() => lightboxImg.classList.remove("slide-center"), 350);
  }, 200);
}

/* ============================================================
  [26] LIGHTBOX — NAVIGATION
============================================================ */
function showImage(idx) {
  const n = galleryArr.length;
  const prevIdx = currentImgIdx;
  currentImgIdx = ((idx % n) + n) % n;
  const direction =
    currentImgIdx > prevIdx || (prevIdx === n - 1 && currentImgIdx === 0)
      ? "next"
      : "prev";
  const src =
    galleryArr[currentImgIdx]?.dataset.src ||
    galleryArr[currentImgIdx]?.src ||
    "";
  changeImage(src, direction);
  updateActiveThumbnail();
  preloadImage(
    galleryArr[(currentImgIdx + 1) % n]?.dataset.src ||
      galleryArr[(currentImgIdx + 1) % n]?.src,
  );
}

function showNextImage() {
  showImage(currentImgIdx + 1);
}
function showPrevImage() {
  showImage(currentImgIdx - 1);
}

lightboxNext?.addEventListener("click", showNextImage);
lightboxPrev?.addEventListener("click", showPrevImage);

// Gallery item click
galleryImgEls.forEach((img, idx) => {
  img.addEventListener("click", () =>
    openLightbox(img.dataset.src || img.src, idx),
  );
  img.style.cursor = "pointer";
});

/* ============================================================
  [27] LIGHTBOX — THUMBNAILS
============================================================ */
function generateThumbnails() {
  if (!lightboxThumbs) return;
  lightboxThumbs.innerHTML = "";

  galleryArr.forEach((img, idx) => {
    const thumb = document.createElement("img");
    thumb.src = img.dataset.src || img.src;
    thumb.alt = `Thumbnail ${idx + 1}`;
    thumb.addEventListener("click", () => {
      if (idx !== currentImgIdx) showImage(idx);
    });
    lightboxThumbs.appendChild(thumb);
  });

  updateActiveThumbnail();
}

function updateActiveThumbnail() {
  lightboxThumbs?.querySelectorAll("img").forEach((t, i) => {
    t.classList.toggle("active", i === currentImgIdx);
  });

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentImgIdx + 1} / ${galleryArr.length}`;
  }

  // scroll active thumb into view
  const activeThumb = lightboxThumbs?.querySelectorAll("img")[currentImgIdx];
  activeThumb?.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}

/* ============================================================
  [28] LIGHTBOX — ZOOM BUTTONS
============================================================ */
zoomInBtn?.addEventListener("click", () => {
  const r = lightboxImg.getBoundingClientRect();
  zoomToPoint(r.left + r.width / 2, r.top + r.height / 2, 1.2);
});

zoomOutBtn?.addEventListener("click", () => {
  const r = lightboxImg.getBoundingClientRect();
  zoomToPoint(r.left + r.width / 2, r.top + r.height / 2, 0.8);
});

zoomResetBtn?.addEventListener("click", resetZoom);

lightboxImg?.addEventListener("dblclick", (e) => {
  currentZoom === 1 ? zoomToPoint(e.clientX, e.clientY, 2) : resetZoom();
});

lightboxImg?.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    zoomToPoint(e.clientX, e.clientY, e.deltaY < 0 ? 1.2 : 0.8);
  },
  { passive: false },
);

/* ============================================================
  [29] LIGHTBOX — FULLSCREEN
============================================================ */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    lightboxModal?.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

fullscreenBtn?.addEventListener("click", toggleFullscreen);

document.addEventListener("fullscreenchange", () => {
  if (!fullscreenBtn) return;
  fullscreenBtn.innerHTML = document.fullscreenElement
    ? '<i class="fa-solid fa-compress"></i>'
    : '<i class="fa-solid fa-expand"></i>';
  toggleImmersiveMode(!!document.fullscreenElement);
});

/* ============================================================
  [30] LIGHTBOX — MOUSE DRAG
============================================================ */
lightboxImg?.addEventListener("mousedown", (e) => {
  cancelAnimationFrame(momentumFrame);
  velocityX = 0;
  velocityY = 0;
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lightboxImg.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging || !lightboxImg) return;
  velocityX = e.clientX - lastMouseX;
  velocityY = e.clientY - lastMouseY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  const { maxX, maxY } = getBounds();
  const rawX = e.clientX - startX;
  const rawY = e.clientY - startY;
  const ovX = rawX - Math.max(-maxX, Math.min(maxX, rawX));
  const ovY = rawY - Math.max(-maxY, Math.min(maxY, rawY));
  translateX = Math.max(-maxX, Math.min(maxX, rawX)) + ovX * 0.35;
  translateY = Math.max(-maxY, Math.min(maxY, rawY)) + ovY * 0.35;

  lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  if (lightboxImg) lightboxImg.style.cursor = "grab";
  startMomentum();
  setTimeout(applyEdgeBounce, 50);
});

/* ============================================================
  [31] LIGHTBOX — TOUCH (SWIPE + PINCH)
============================================================ */
let lbTouchStartX = 0;

lightboxImg?.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 2) {
      isPinching = true;
      pinchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    } else {
      lbTouchStartX = e.changedTouches[0].screenX;
    }
  },
  { passive: true },
);

lightboxImg?.addEventListener(
  "touchmove",
  (e) => {
    if (!isPinching || e.touches.length !== 2) return;
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY,
    );
    currentZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, currentZoom * (dist / pinchStartDist)),
    );
    pinchStartDist = dist;
    applyZoom();
  },
  { passive: false },
);

lightboxImg?.addEventListener(
  "touchend",
  (e) => {
    if (isPinching) {
      isPinching = false;
      return;
    }

    const endX = e.changedTouches[0].screenX;
    const now = Date.now();
    const tapDelay = now - lastTap;

    // double-tap zoom
    if (tapDelay < 300 && tapDelay > 0) {
      const t = e.changedTouches[0];
      currentZoom === 1 ? zoomToPoint(t.clientX, t.clientY, 2) : resetZoom();
      lastTap = 0;
      return;
    }
    lastTap = now;

    if (currentZoom > 1) return;

    const delta = endX - lbTouchStartX;
    if (Math.abs(delta) > 50) delta < 0 ? showNextImage() : showPrevImage();
  },
  { passive: true },
);

/* ============================================================
  [32] LIGHTBOX — KEYBOARD (ESC + ARROWS with repeat)
  Bug lama: keyInterval dideklarasikan di dalam keydown sehingga
  keyup tidak pernah bisa clearInterval-nya.
============================================================ */
document.addEventListener("keydown", (e) => {
  if (!isLightboxOpen) return;
  if (e.key === "Escape") {
    closeLightboxFn();
    return;
  }
  if (e.key === "ArrowRight") {
    showNextImage();
    clearInterval(keyRepeatInterval);
    keyRepeatInterval = setInterval(showNextImage, 400);
  }
  if (e.key === "ArrowLeft") {
    showPrevImage();
    clearInterval(keyRepeatInterval);
    keyRepeatInterval = setInterval(showPrevImage, 400);
  }
});

document.addEventListener("keyup", () => clearInterval(keyRepeatInterval));

/* ============================================================
  [33] CONTACT FORM VALIDATION
============================================================ */
const nameInput = $("name");
const emailInput = $("email");
const messageInput = $("message");
const nameError = $("nameError");
const emailError = $("emailError");
const messageError = $("messageError");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  [nameError, emailError, messageError].forEach((el) => {
    if (el) el.textContent = "";
  });

  if (!nameInput?.value.trim()) {
    if (nameError) nameError.textContent = "Nama wajib diisi!";
    valid = false;
  }

  if (!emailInput?.value.trim()) {
    if (emailError) emailError.textContent = "Email wajib diisi!";
    valid = false;
  } else if (!EMAIL_RE.test(emailInput.value)) {
    if (emailError) emailError.textContent = "Format email tidak valid!";
    valid = false;
  }

  if (!messageInput?.value.trim()) {
    if (messageError) messageError.textContent = "Pesan wajib diisi!";
    valid = false;
  }

  if (valid) {
    showToast("Pesan berhasil dikirim! Terima kasih 😊");
    contactForm.reset();
  }
});

/* ============================================================
  [34] DARK MODE
============================================================ */
function enableDarkMode() {
  document.body.classList.add("dark");
  localStorage.setItem("theme", "dark");
}
function disableDarkMode() {
  document.body.classList.remove("dark");
  localStorage.setItem("theme", "light");
}

if (localStorage.getItem("theme") === "dark") enableDarkMode();

darkToggle?.addEventListener("click", () => {
  document.body.classList.contains("dark")
    ? disableDarkMode()
    : enableDarkMode();
});

/* ============================================================
  [35] BACK TO TOP
============================================================ */
backToTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* ============================================================
  [36] TOAST
============================================================ */
let toastTimer;

function showToast(msg) {
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
