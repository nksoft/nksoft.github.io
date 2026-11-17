/* ============ WhenDidI? showcase interactions ============ */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky header shadow ---------- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- reveal on scroll ---------- */
  const revealables = Array.from(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- scroll spy for nav links ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const spyTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) =>
              link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    spyTargets.forEach((section) => spy.observe(section));
  }

  /* ---------- screenshot carousel (scroll-snap based) ---------- */
  const track = document.querySelector(".gallery-track");
  const slides = Array.from(track.querySelectorAll(".gallery-slide"));
  const dotsWrap = document.querySelector(".gallery-dots");
  const prevBtn = document.querySelector(".gallery-arrow.prev");
  const nextBtn = document.querySelector(".gallery-arrow.next");

  const activeIndex = { i: 0 };

  // Slides are left-aligned (scroll-snap-align: start), so the first
  // screenshot sits flush at the left edge with no leading whitespace.

  // Build dots.
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Show screenshot " + (i + 1));
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  function setActive(i) {
    activeIndex.i = i;
    dots.forEach((d, k) => {
      d.classList.toggle("active", k === i);
      d.setAttribute("aria-selected", k === i ? "true" : "false");
    });
  }

  function goTo(i) {
    const target = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[target].offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    setActive(target);
  }

  // Sync dots when the user scrolls / swipes: the slide nearest the left
  // edge of the track is the active one.
  let scrollTimer = null;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft - track.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    }, 120);
  }, { passive: true });

  prevBtn.addEventListener("click", () => {
    goTo(activeIndex.i === 0 ? slides.length - 1 : activeIndex.i - 1);
  });
  nextBtn.addEventListener("click", () => {
    goTo(activeIndex.i === slides.length - 1 ? 0 : activeIndex.i + 1);
  });

  // Keyboard arrows while the gallery is focused.
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); nextBtn.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prevBtn.click(); }
  });

  // Re-align the current slide on resize.
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goTo(activeIndex.i);
    }, 150);
  });

  // Start at first slide, flush with the left edge.
  goTo(0);

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
