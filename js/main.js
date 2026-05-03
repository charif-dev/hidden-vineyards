/* =============================================================
   Hidden Vineyard — main.js
   No dependencies except Swiper (loaded via CDN in <head>).
   ============================================================= */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function getCookie(name) {
    const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : null;
  }
  function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) +
      "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
  }

  /* =============================================================
     1. i18n
     ============================================================= */
  const SUPPORTED = ["en", "pt", "de"];
  const DEFAULT_LANG = "en";
  const translations = window.HV_TRANSLATIONS || {};

  function detectLanguage() {
    const stored = getCookie("hv_lang");
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG];

    // text content
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // attributes (placeholder, aria-label, content, alt)
    const ATTRS = ["placeholder", "aria-label", "content", "alt", "title"];
    ATTRS.forEach((attr) => {
      $$(`[data-i18n-${attr}]`).forEach((el) => {
        const key = el.getAttribute(`data-i18n-${attr}`);
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    // page title
    if (dict.page_title) document.title = dict.page_title;
    document.documentElement.lang = lang;

    // mark active lang button
    $$(".lang-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.lang === lang);
      b.setAttribute("aria-pressed", b.dataset.lang === lang);
    });
  }

  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    setCookie("hv_lang", lang);
    applyTranslations(lang);
  }

  /* =============================================================
     2. Cookie banner
     ============================================================= */
  function initCookieBanner() {
    const banner = $("#cookieBanner");
    if (!banner) return;
    if (getCookie("hv_cookie_ack") === "1") return;

    requestAnimationFrame(() => banner.classList.add("is-visible"));

    $("#cookieAccept")?.addEventListener("click", () => {
      setCookie("hv_cookie_ack", "1");
      banner.classList.remove("is-visible");
      setTimeout(() => banner.remove(), 600);
    });
  }

  /* =============================================================
     3. Top bar scroll state
     ============================================================= */
  function initTopbar() {
    const topbar = $(".topbar");
    if (!topbar) return;
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      topbar.classList.toggle("is-scrolled", y > 50);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =============================================================
     4. Mobile nav
     ============================================================= */
  function initMobileNav() {
    const toggle = $(".nav-toggle");
    const nav = $(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    $$(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });
  }

  /* =============================================================
     5. Swiper carousel
     ============================================================= */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    const el = $(".swiper");
    if (!el) return;

    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,
      loop: true,
      speed: 900,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      keyboard: { enabled: true },
      breakpoints: {
        640:  { spaceBetween: 32 },
        1024: { spaceBetween: 48 },
      },
    });
  }

  /* =============================================================
     6. Reveal on scroll (IntersectionObserver)
     ============================================================= */
  function initReveals() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  /* =============================================================
     7. Parallax cards
     ============================================================= */
  function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = $$(".parallax-card");
    if (!cards.length) return;

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const speed = parseFloat(card.dataset.parallax || "0.08");
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * -speed;
        card.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* =============================================================
     8. FAQ accordion
     ============================================================= */
  function initFAQ() {
    $$(".faq-item__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open);
      });
    });
  }

  /* =============================================================
     9. Smooth scroll
     ============================================================= */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* =============================================================
    10. Form (Netlify Forms via AJAX)
        Netlify intercepts POST to "/" with form-name field.
     ============================================================= */
  function ajaxNetlify(form, statusEl) {
    const dict = translations[document.documentElement.lang] || translations[DEFAULT_LANG];
    statusEl.className = "form__status";
    statusEl.textContent = dict.form_status_sending || "Sending...";

    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((v, k) => params.append(k, v));

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        statusEl.classList.add("is-ok");
        statusEl.textContent = dict.form_status_ok || "Thank you.";
        form.reset();
      })
      .catch(() => {
        statusEl.classList.add("is-err");
        statusEl.textContent = dict.form_status_err || "Error.";
      });
  }

  function initForms() {
    const main = $("#bookingForm");
    if (main) {
      main.addEventListener("submit", (e) => {
        e.preventDefault();
        ajaxNetlify(main, $("#bookingStatus"));
      });
    }
    const wait = $("#waitlistForm");
    if (wait) {
      wait.addEventListener("submit", (e) => {
        e.preventDefault();
        ajaxNetlify(wait, $("#waitlistStatus"));
      });
    }
  }

  /* =============================================================
    11. Lang switcher click handlers
     ============================================================= */
  function initLangSwitcher() {
    $$(".lang-btn").forEach((b) => {
      b.addEventListener("click", () => setLanguage(b.dataset.lang));
    });
  }

  /* =============================================================
     Bootstrap
     ============================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(detectLanguage());
    initLangSwitcher();
    initCookieBanner();
    initTopbar();
    initMobileNav();
    initSwiper();
    initReveals();
    initParallax();
    initFAQ();
    initSmoothScroll();
    initForms();
  });
})();