/* ==========================================================================
   CoT Interpretability — meeting notes shell
   Sidebar rendering · tab switching · mobile nav.
   ----------------------------------------------------------------------------
   Add a new meeting:
     1. Drop its index.html into  meetings/cot_interp/<slug>/
     2. Add an entry to MEETINGS below (newest first).
   That's it. Every existing page picks the new entry up automatically.
   ========================================================================== */

const COLLECTION = {
  brand: "COT-INTERP",
  title: "Reading <em>chains of</em> thought.",
  subtitle: "Weekly notes from the RL interpretability log."
};

const MEETINGS = [
  {
    slug: "2026-04-21",
    date: "21 April 2026",
    short: "21 Apr 2026",
    title: "Tempering the <em>softmax</em>",
    sub: "IS variants & per-chain sensitivity"
  },
  {
    slug: "2026-04-14",
    date: "14 April 2026",
    short: "14 Apr 2026",
    title: "Long chains break the <em>batch</em>",
    sub: "Forking paths & reward gap collapse"
  }
];

(function () {
  function basePath() {
    const m = location.pathname.match(/^(.*?\/meetings\/cot_interp\/)/);
    return m ? m[1] : "/meetings/cot_interp/";
  }
  function currentSlug() {
    const m = location.pathname.match(/\/meetings\/cot_interp\/([^\/]+)\/?$/);
    if (m) return m[1];
    return document.body?.dataset?.slug || null;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] != null) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children) for (const c of children) if (c) node.appendChild(c);
    return node;
  }

  function renderSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    const slug = currentSlug();

    sidebar.innerHTML = "";

    // brand mark
    sidebar.appendChild(el("div", { class: "brand" }, [
      el("span", { class: "glyph", "aria-hidden": "true" }),
      el("span", { text: COLLECTION.brand })
    ]));

    sidebar.appendChild(el("a", {
      href: basePath(),
      class: "collection-link",
      style: "text-decoration:none;color:inherit;display:block;"
    }, [
      el("h1", { class: "collection-title", html: COLLECTION.title })
    ]));

    sidebar.appendChild(el("p", { class: "collection-sub", html: COLLECTION.subtitle }));

    // meetings header
    sidebar.appendChild(el("div", { class: "meetings-label" }, [
      el("span", { text: "Meetings" }),
      el("span", { class: "count", text: String(MEETINGS.length).padStart(2, "0") })
    ]));

    // meeting list
    const ul = el("ul", { class: "meeting-list" });
    const base = basePath();
    for (const m of MEETINGS) {
      const isCurrent = m.slug === slug;
      const link = el("a", {
        class: "meeting-link",
        href: `${base}${m.slug}/`,
        "aria-current": isCurrent ? "page" : null
      }, [
        el("span", { class: "meeting-date", text: m.short }),
        el("span", { class: "meeting-sub", text: m.sub })
      ]);
      ul.appendChild(el("li", null, [link]));
    }
    sidebar.appendChild(ul);

    sidebar.appendChild(el("div", {
      class: "footer-mark",
      html: "Private log<br/>not indexed"
    }));
  }

  function wireTabs() {
    const tabsRoot = document.querySelector(".tabs");
    if (!tabsRoot) return;
    const buttons = document.querySelectorAll(".tab-btn");
    const panels  = document.querySelectorAll(".panel");
    if (!buttons.length) return;

    function activate(id) {
      buttons.forEach(b => {
        b.setAttribute("aria-selected", b.dataset.target === id ? "true" : "false");
      });
      panels.forEach(p => {
        p.dataset.active = (p.id === id) ? "true" : "false";
      });
      if (location.hash !== "#" + id) {
        history.replaceState(null, "", "#" + id);
      }
      const wrap = document.querySelector(".tabs-wrap");
      if (wrap && wrap.getBoundingClientRect().top < 0) {
        wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    buttons.forEach(b => {
      b.addEventListener("click", () => activate(b.dataset.target));
    });

    const initial = (location.hash || "").replace("#", "");
    if (initial && document.getElementById(initial)) activate(initial);

    tabsRoot.addEventListener("keydown", (e) => {
      const order = Array.from(buttons);
      const idx = order.findIndex(b => b.getAttribute("aria-selected") === "true");
      if (e.key === "ArrowRight") {
        const n = order[(idx + 1) % order.length];
        n.focus(); activate(n.dataset.target);
      } else if (e.key === "ArrowLeft") {
        const n = order[(idx - 1 + order.length) % order.length];
        n.focus(); activate(n.dataset.target);
      }
    });
  }

  function wirePinnedTabs() {
    const wrap = document.querySelector(".tabs-wrap");
    if (!wrap || !("IntersectionObserver" in window)) return;

    // Standard "detect-stuck" trick: observe the wrap with a -1px top rootMargin.
    // While the wrap is fully on-screen the intersection ratio is 1.
    // When it sticks at top:0 the negative rootMargin clips 1px off the top, so
    // the observed ratio drops below 1 — that's when the bar is pinned.
    const observer = new IntersectionObserver(
      ([entry]) => {
        wrap.classList.toggle("is-pinned", entry.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(wrap);
  }

  function wireMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const scrim  = document.querySelector(".nav-scrim");
    if (!toggle) return;

    function close() { document.body.dataset.navOpen = "false"; }
    function open()  { document.body.dataset.navOpen = "true"; }

    toggle.addEventListener("click", () => {
      const open_ = document.body.dataset.navOpen === "true";
      open_ ? close() : open();
    });
    if (scrim) scrim.addEventListener("click", close);

    document.querySelector(".sidebar")?.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(() => {
    renderSidebar();
    wireTabs();
    wirePinnedTabs();
    wireMobileNav();
  });

  window.CotInterp = { COLLECTION, MEETINGS, basePath };
})();
