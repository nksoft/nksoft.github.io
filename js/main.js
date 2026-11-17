/* ============================================================
   nksoft26 app hub — app registry + card rendering
   ------------------------------------------------------------
   To add a new app:
     1. Drop its showcase folder next to this site (e.g. NewApp/).
     2. Add ONE entry to the APPS array below.
   The grid, hero phones and footer links all update automatically.
   ============================================================ */

const APPS = [
  {
    id: "fuelflow",
    name: "FuelFlow",
    tagline: "Fuel receipt log",
    category: "Auto & vehicles",
    desc: "Scan fuel receipts with AI, log every fill-up across multiple vehicles and read your true cost on km/L, MPG and cost-per-km charts. CSV export and Google Drive backup. Free to start, with in-app purchase to unlock every feature.",
    chips: ["AI receipt scanning", "Multi-vehicle", "km/L &amp; MPG charts", "CSV + Drive backup"],
    icon: "FuelFlow/assets/icon.webp",
    shot: "FuelFlow/assets/shots/s1.webp",
    shotAlt: "FuelFlow main screen: fuel log",
    site: "FuelFlow",
    play: "https://play.google.com/store/apps/details?id=com.nksoft.fuelflow",
    accent: "#F1912B",
    status: "live"
  },
  {
    id: "iptv",
    name: "IPTV",
    tagline: "Modern IPTV player",
    category: "Video player",
    desc: "Bring your own M3U / M3U8 playlist, get a full XMLTV program guide, cast straight to your TV with Chromecast and keep watching in a floating Picture-in-Picture window. A clean Material 3 dark interface.",
    chips: ["M3U &amp; M3U8", "XMLTV EPG guide", "Chromecast", "Picture-in-Picture", "Ad-free with in-app purchase"],
    icon: "IPTV/assets/img/app-icon-192.webp",
    shot: "IPTV/assets/img/thumbs/shot06.webp",
    shotAlt: "IPTV main screen: live channel player with program guide",
    site: "IPTV",
    play: "https://play.google.com/store/apps/details?id=com.nksoft.iptv",
    accent: "#2E7DE4",
    status: "live"
  },
  {
    id: "whendidi",
    name: "WhenDidI?",
    tagline: "Event tracker",
    category: "Productivity",
    desc: "Know exactly when you last did anything — car service, dentist visits, furnace filters, pet care. Overdue items jump out in red so nothing slips through. Free, private and works offline; sign-in is optional, only for Google Drive backup.",
    chips: ["Free forever", "Works offline", "Sign-in optional", "Google Drive backup"],
    icon: "WhenDidI/assets/icon.webp",
    shot: "WhenDidI/assets/screenshots/shot1.webp",
    shotAlt: "WhenDidI? main screen: tracker list",
    site: "WhenDidI",
    play: "https://play.google.com/store/apps/details?id=com.nksoft.whendidi",
    accent: "#C29B64",
    status: "live"
  }
  /* ---- Add future apps below. Example:
  {
    id: "newapp",
    name: "NewApp",
    tagline: "One-line pitch",
    category: "Category",
    desc: "Short description shown on the card.",
    chips: ["Feature", "Feature", "Feature"],
    icon: "NewApp/assets/icon.webp",
    shot: "NewApp/assets/shots/shot1.webp",
    shotAlt: "NewApp main screen",
    site: "NewApp/index.html",
    play: "https://play.google.com/store/apps/details?id=com.nksoft.newapp",
    accent: "#6C4BD6",
    status: "live"
  }
  */
];

/* ---------- render ---------- */

function heroPhone(app) {
  return `<a class="hero-phone" href="${app.site}" aria-label="Open the ${app.name} site">
    <div class="phone">
      <div class="phone-screen"><img src="${app.shot}" alt="" loading="eager"></div>
    </div>
    <span class="hero-phone-glow" style="--accent:${app.accent}"></span>
  </a>`;
}

function card(app) {
  const chips = app.chips.map(c => `<li>${c}</li>`).join("");
  return `<article class="card reveal" style="--accent:${app.accent}">
    <div class="card-visual" aria-hidden="true">
      <div class="phone"><div class="phone-screen"><img src="${app.shot}" alt="${app.shotAlt}" loading="lazy"></div></div>
      <img class="card-icon" src="${app.icon}" alt="" width="56" height="56">
    </div>
    <div class="card-body">
      <p class="card-cat">${app.category}</p>
      <h2 class="card-name">${app.name}</h2>
      <p class="card-tagline">${app.tagline}</p>
      <p class="card-desc">${app.desc}</p>
      <ul class="card-chips">${chips}</ul>
      <div class="card-actions">
        <a class="btn btn-primary" href="${app.site}">More details</a>
        <a class="btn btn-outline" href="${app.play}" target="_blank" rel="noopener">Google Play&nbsp;&#8599;</a>
      </div>
    </div>
  </article>`;
}

const grid = document.getElementById("appGrid");
grid.innerHTML = APPS.map(card).join("");

const live = APPS.filter(a => a.status === "live");
document.getElementById("heroPhones").innerHTML = live.map(heroPhone).join("");

document.getElementById("footerApps").innerHTML = live
  .map(a => `<li><a href="${a.site}">${a.name}</a> · <a href="${a.play}" target="_blank" rel="noopener">Google Play</a></li>`)
  .join("");

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- scroll reveal ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = reduceMotion ? [] : document.querySelectorAll(".reveal");

if (targets.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
} else {
  targets.forEach(t => t.classList.add("in"));
}
