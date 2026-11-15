/* ============================================================
   IPTV showcase — interactions (vanilla JS, no dependencies)
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky nav state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealables.forEach(function (el, i) {
    // stagger siblings inside grids
    el.style.setProperty("--d", (i % 5) * 60 + "ms");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active nav link highlighting ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- screenshot gallery ---------- */
  var track = document.getElementById("gallery-track");
  var shots = track ? Array.prototype.slice.call(track.querySelectorAll(".shot")) : [];
  var dotsWrap = document.getElementById("gal-dots");
  var prevBtn = document.getElementById("gal-prev");
  var nextBtn = document.getElementById("gal-next");
  var activeIndex = 0;

  function indexFromCard(card) { return shots.indexOf(card); }

  // card centre measured in the track's own scrolling space (offsetLeft is
  // relative to the page, so bounding rects + scrollLeft are the reliable way)
  function cardCentre(card) {
    return card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft + card.clientWidth / 2;
  }

  function scrollToIndex(index, smooth) {
    if (!shots.length) return;
    index = Math.max(0, Math.min(shots.length - 1, index));
    var card = shots[index];
    var target = cardCentre(card) - track.clientWidth / 2;
    var max = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    activeIndex = index;
    syncDots();
  }

  function syncDots() {
    if (!dotsWrap) return;
    Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  function nearestIndex() {
    if (!shots.length) return 0;
    var center = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    shots.forEach(function (card, i) {
      var d = Math.abs(cardCentre(card) - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  if (dotsWrap && shots.length) {
    shots.forEach(function (card, i) {
      var dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show screenshot " + (i + 1) + " of " + shots.length);
      dot.addEventListener("click", function () { scrollToIndex(i, true); });
      dotsWrap.appendChild(dot);
    });

    track.addEventListener("scroll", function () {
      var idx = nearestIndex();
      if (idx !== activeIndex) { activeIndex = idx; syncDots(); }
    }, { passive: true });

    prevBtn.addEventListener("click", function () { scrollToIndex(activeIndex - 1, true); });
    nextBtn.addEventListener("click", function () { scrollToIndex(activeIndex + 1, true); });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(activeIndex + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(activeIndex - 1, true); }
    });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbTitle = document.getElementById("lb-title");
  var lbClose = document.getElementById("lb-close");
  var lbPrev = document.getElementById("lb-prev");
  var lbNext = document.getElementById("lb-next");
  var lbIndex = 0;

  function setLb(index) {
    var card = shots[index];
    if (!card) return;
    lbIndex = index;
    lbImg.src = card.getAttribute("data-full");
    lbImg.alt = card.querySelector("img").alt;
    lbTitle.textContent = card.getAttribute("data-title");
  }

  function openLb(index) {
    if (!lightbox) return;
    setLb(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLb() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (shots[lbIndex]) shots[lbIndex].focus({ preventScroll: true });
  }

  shots.forEach(function (card) {
    var i = indexFromCard(card);
    card.addEventListener("click", function () { openLb(i); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); }
    });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLb);
    lbPrev.addEventListener("click", function () { setLb((lbIndex - 1 + shots.length) % shots.length); });
    lbNext.addEventListener("click", function () { setLb((lbIndex + 1) % shots.length); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") setLb((lbIndex + 1) % shots.length);
      if (e.key === "ArrowLeft") setLb((lbIndex - 1 + shots.length) % shots.length);
    });
  }
})();
