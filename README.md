<<<<<<< HEAD
# Hidden Vineyard — landing site

Static HTML/CSS/JS landing page for Hidden Vineyard, an authentic Dão wine-tour brand.
Editorial luxury design · trilingual (EN/PT/DE) · Netlify-ready.

## Stack

- Pure HTML / CSS / vanilla JS — no build step.
- **Swiper** (CDN, ~30 KB) — the only third-party JS.
- **IntersectionObserver** (native) — scroll reveals.
- **Netlify Forms** — booking + waitlist submissions, no backend code.

## File structure

```
/index.html              Main landing page
/tnc.html                Terms & Conditions (10-section template)
/css/style.css           All styles
/js/i18n.js              Translation dictionaries (EN / PT / DE)
/js/main.js              Behaviour: i18n, swiper, reveals, parallax, FAQ, forms, cookie banner
/img/favicon.svg         Standalone favicon (also embedded inline in HTML)
/netlify.toml            Headers, caching, redirects
/robots.txt              Crawl config
/sitemap.xml             Single-page sitemap with hreflang
```

## Deploy on Netlify

1. Drag-and-drop the entire folder into Netlify, **or** connect it to a git repo and let Netlify build (no build command — it's static).
2. Netlify will auto-detect the two forms (`hv-booking`, `hv-waitlist`) at deploy time.
3. Configure form notifications in **Site settings → Forms → Form notifications** to forward submissions to `iamnotdry@hotmail.com`.
4. Custom domain: point `hiddenvineyard.com` (or whichever) to the Netlify site.

## Customization checklist before launch

| Item | Where | Action |
|---|---|---|
| Real testimonials | `js/i18n.js` (`testimonial_*` keys) + remove `testimonials__disclaimer` block in `index.html` | Replace mock quotes, remove "mock" suffix in roles, remove the orange disclaimer banner |
| Real upcoming dates | `index.html` → `<aside class="dates">` | Replace 5 mock dates + remove `dates__disclaimer` line |
| Real images | `index.html` → `.swiper-slide img` + `.hero__bg` URL in `css/style.css` | Swap Unsplash placeholders for Hidden Vineyard's own photography |
| Legal text | `tnc.html` | Each `tnc__placeholder` block must be filled by qualified counsel |
| TripAdvisor URL | `index.html` footer | Replace `https://www.tripadvisor.com/` with the real listing URL when live |
| Domain in metadata | `index.html` (canonical, og:url) + `sitemap.xml` + `robots.txt` | Replace `hiddenvineyard.com` with the actual domain |

## Languages

- Default: **English**.
- Auto-detected from `navigator.language`, otherwise stored choice in cookie `hv_lang` (1 year).
- Language switcher: 3 buttons in the top bar (EN / PT / DE).
- All visible strings live in `js/i18n.js`. To edit copy, edit there — no need to touch HTML.

## Cookies used

- `hv_lang` — stores language preference (1 year).
- `hv_cookie_ack` — remembers cookie banner dismissal (1 year).
- No analytics, no third-party trackers.

## Performance notes

- Fonts loaded with `display=swap` via Google Fonts.
- Images use Unsplash's CDN with `auto=format&fit=crop` — modern formats served automatically.
- Lazy-loading on all carousel images (`loading="lazy"`).
- Swiper loaded with `defer`.
- Hero background uses `background-attachment: fixed` for parallax on desktop, scroll on mobile (handled in CSS).

## Accessibility

- Semantic landmarks (`header`, `main`, `footer`, `aside`, `nav`).
- ARIA labels on icon-only buttons, `aria-expanded` on FAQ toggles and mobile nav toggle.
- `prefers-reduced-motion` honoured: animations disabled, parallax disabled.
- Form fields properly labelled. Honeypot field for spam protection.
- Keyboard navigation works for the carousel.

## Known constraints

- Netlify Forms only resolve on a Netlify deployment. Local file:// preview will let you see the design but the form will not submit.
- The first-time `hv_lang` cookie write happens after the first explicit user click on a language button. Initial render uses browser detection.
=======
# hidden-vineyard
Authentic high‑end tour through a secret Dao sanctuary
>>>>>>> origin/main
