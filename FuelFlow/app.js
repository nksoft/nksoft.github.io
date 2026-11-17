/* FuelFlow showcase interactions */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  var menuBtn = $("#menuBtn");
  var mobileNav = $("#mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", mobileNav).forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- active nav link ---------- */
  var navLinks = $$(".nav a, .mobile-nav a").filter(function (a) { return a.getAttribute("href").charAt(0) === "#"; });
  var sectionIds = navLinks.map(function (a) { return a.getAttribute("href").slice(1); });
  var sectionEls = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window && sectionEls.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href").slice(1) === e.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sectionEls.forEach(function (el) { spy.observe(el); });
  }

  /* ---------- screenshots carousel ---------- */
  var track = $("#carTrack");
  var carousel = $("#carousel");
  var prevBtn = $("#carPrev");
  var nextBtn = $("#carNext");
  var dotsWrap = $("#carDots");
  var slides = track ? $$(".slide", track) : [];

  var index = 0;
  var dots = [];

  function slideLeft(i) {
    return slides[i].offsetLeft - track.offsetLeft;
  }

  function setIndex(i, scroll) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    if (scroll) {
      track.scrollTo({ left: slideLeft(index), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    syncDots();
    syncButtons();
  }

  function currentIndex() {
    var left = track.scrollLeft + track.clientLeft;
    var best = 0, bestDist = Infinity;
    for (var i = 0; i < slides.length; i++) {
      var d = Math.abs(slideLeft(i) - left);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function syncDots() {
    dots.forEach(function (d, i) {
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function syncButtons() {
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  }

  if (slides.length) {
    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Screenshot " + (i + 1));
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", function () { setIndex(i, true); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var i = currentIndex();
        if (i !== index) { index = i; syncDots(); syncButtons(); }
      });
    }, { passive: true });

    prevBtn.addEventListener("click", function () { setIndex(index - 1, true); });
    nextBtn.addEventListener("click", function () { setIndex(index + 1, true); });

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { setIndex(index + 1, true); e.preventDefault(); }
      if (e.key === "ArrowLeft") { setIndex(index - 1, true); e.preventDefault(); }
    });

    syncButtons();
    window.addEventListener("resize", function () { syncButtons(); });
  }

  /* ---------- lightbox ---------- */
  var lightbox = $("#lightbox");
  var lbImg = $("#lbImg");
  var lbCap = $("#lbCap");
  var lbClose = $("#lbClose");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lastFocus = null;

  var captions = slides.map(function (s) {
    var cap = $(".cap", s);
    if (!cap) return "";
    var tag = $(".tag", cap);
    var label = tag ? tag.textContent.replace(/\s+/g, " ").trim() + " — " : "";
    var rest = cap.textContent.slice(tag ? tag.textContent.length : 0).replace(/\s+/g, " ").trim();
    return label + rest;
  });
  var alts = slides.map(function (s) {
    var img = $("img", s);
    return img ? img.getAttribute("alt") : "";
  });
  var sources = slides.map(function (s) { return $("img", s).getAttribute("src"); });
  var lbIndex = 0;

  function showLb(i) {
    lbIndex = (i + sources.length) % sources.length;
    lbImg.src = sources[lbIndex];
    lbImg.alt = alts[lbIndex];
    lbCap.textContent = captions[lbIndex] + "  ·  " + (lbIndex + 1) + " of " + sources.length;
  }

  function openLb(i) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    showLb(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLb() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  slides.forEach(function (slide, i) {
    slide.addEventListener("click", function () { openLb(i); });
    slide.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { openLb(i); e.preventDefault(); }
    });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLb);
    lbPrev.addEventListener("click", function () { showLb(lbIndex - 1); });
    lbNext.addEventListener("click", function () { showLb(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    });
  }
})();
