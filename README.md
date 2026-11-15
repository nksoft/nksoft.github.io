# IPTV — app showcase site

A single-page showcase site for the **IPTV** Android app ([Google Play listing](https://play.google.com/store/apps/details?id=com.nksoft.iptv)), built as plain HTML, CSS and vanilla JS so it can be hosted on GitHub Pages with no build step.

## What's inside

```
index.html            the whole page (copy, sections, structure)
assets/css/style.css  styling — dark theme tuned to match the app's Material 3 UI
assets/js/main.js     gallery carousel, lightbox, scroll reveal, nav highlighting
assets/img/           app icon, full-size screenshots, w600 thumbnails, official Google Play badge
.nojekyll            tells GitHub Pages to serve files as-is
```

All screenshots and the icon are stored in the repo, so the page works offline and loads fast (thumbnails for cards, full-size for the zoom view).

## Deploy to GitHub Pages

1. Create a new repo (e.g. `iptv-showcase`).
2. Upload these files to the repo root (including `.nojekyll`).
3. In the repo: **Settings → Pages → Source: Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
4. Your site is live at `https://<your-username>.github.io/iptv-showcase/`.

Relative asset paths (`assets/...`) work for both project pages and user pages, so no path changes are needed.

## Tweak it

- **Colours**: edit the CSS variables at the top of `assets/css/style.css` (`--accent`, `--bg`, `--surface`, …).
- **Copy**: everything readable lives in `index.html` (hero text, feature cards, FAQ, footer).
- **Screenshots**: drop new images into `assets/img/` and `assets/img/thumbs/`, then add a `.shot` figure block in the gallery. Keep phone screenshots at 9:20 (e.g. 1080×2400); the CSS crops the Android status bar automatically.
- **Social preview**: set `og:image` in `index.html` to your published URL once it is live.
- **Play badge**: `assets/img/play-badge-dark.png` is the official "Get it on Google Play" badge, stored in the repo so it works offline. It is sized by height in CSS (`.play-badge img`), so its aspect ratio is never distorted. Size it by changing `height` there (nav 38px, hero 56px, CTA band 66px).
- **Play link**: the Google Play URL appears in the nav, hero, CTA band and footer — search the file for `com.nksoft.iptv` to change it.

## Local preview

```
python -m http.server 8080
```

then open `http://localhost:8080`.

## Disclaimer note

The app supplies no channels: the site states this clearly in the "How it works" section, and the footer notes the page is not affiliated with Google Play. Keep that wording if you edit the copy.
