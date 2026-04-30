# AGENTS.md — CoT Interp meeting notes

You are about to add a new entry to a private collection of research-meeting notes published at `cybershiptrooper.github.io/meetings/cot_interp/<YYYY-MM-DD>/`. The collection is not linked from anywhere and is `noindex,nofollow` per page.

**Read this whole file before writing any code.** Then mirror the workflow in `2026-04-21/index.html` (the more featureful template) — it shows every reusable widget pattern in one place.

---

## Workflow

1. **Pick the slug.** Use the meeting's calendar date in `YYYY-MM-DD` format.
2. **Create the folder:** `meetings/cot_interp/<slug>/`.
3. **Copy images** the meeting will use into `meetings/cot_interp/<slug>/images/`. Sub-folders inside `images/` are fine. Reference them as `images/foo.png` (relative).
4. **Write `<slug>/index.html`** — see "Page skeleton" below.
5. **Register the meeting** by prepending an entry to the `MEETINGS` array at the top of `assets/shell.js` (newest first):
   ```js
   { slug: "<YYYY-MM-DD>", date: "<D Month YYYY>", short: "<D Mon YYYY>",
     title: "<headline>", sub: "<one-line description for sidebar>" }
   ```
   Only `slug` and `sub` are visible in the sidebar after the recent change; keep `title` filled anyway, future variants may use it.
6. **Smoke-test locally:**
   ```bash
   cd cybershiptrooper.github.io && python3 -m http.server 4567
   # then open http://127.0.0.1:4567/meetings/cot_interp/<slug>/
   ```
7. **Don't commit or push** unless explicitly asked. Publishing is the user's call.

---

## Page skeleton (copy from `2026-04-21/index.html`)

Required pieces, in order:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">       <!-- mandatory -->
  <meta name="referrer" content="no-referrer">          <!-- mandatory -->
  <title><headline> — <D Month YYYY></title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Source+Serif+4:opsz,wght@8..60,300..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../assets/theme.css">     <!-- shared -->

  <script>window.MathJax = { … };</script>               <!-- only if math -->
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</head>

<body data-slug="<YYYY-MM-DD>">                          <!-- mandatory -->

<button class="nav-toggle" type="button" aria-label="Open meetings menu">≡</button>
<div class="nav-scrim" aria-hidden="true"></div>

<div class="app">
  <aside class="sidebar" aria-label="Meeting navigation"></aside>

  <main class="content">
    <div class="shell">                                  <!-- add `narrow` class if no wide panels -->

      <header class="masthead">
        <div class="kicker">Research log · RL interpretability</div>
        <h1>Headline with optional <em>italic</em>.</h1>
        <p class="deck">One- to two-sentence deck setting up the meeting.</p>
        <div class="byline">
          <span><D Month YYYY></span> <span class="dot"></span>
          <span>Meeting notes</span>  <span class="dot"></span>
          <span>Reading time ~ N min</span>
        </div>
      </header>

      <div class="tabs-wrap">
        <div class="tabs" role="tablist">
          <button class="tab-btn" role="tab" aria-selected="true"  data-target="tab1"><span class="num">01</span>…</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-target="tab2"><span class="num">02</span>…</button>
          <button class="tab-btn" role="tab" aria-selected="false" data-target="tab3"><span class="num">03</span>…</button>
        </div>
      </div>

      <section class="panel" id="tab1" role="tabpanel" data-active="true"> … </section>
      <section class="panel" id="tab2" role="tabpanel"> … </section>
      <section class="panel" id="tab3" role="tabpanel"> … </section>
      <!-- Add `wide-panel` class to a panel that needs full grid width
           (e.g. for a sens-grid, side-by-side comparison, or wide widget). -->

      <div class="endnote">End of notes · DD · IV · YYYY</div>
    </div>
  </main>
</div>

<script src="../assets/shell.js"></script>

<!-- page-specific JS only (data + DOM construction for any inline widget) -->
<script> … </script>

</body>
</html>
```

Tabs: 1–3 panels is the norm. Panel ids must match `data-target`. `id="tab1"` should be `data-active="true"` initially.

---

## Reusable patterns — use these instead of writing custom CSS

`theme.css` already contains every primitive a meeting needs. Use them. Only invent new CSS when no existing pattern fits, and put it in an inline `<style>` block scoped tightly to the new component.

| Need | Class(es) | Example file |
|---|---|---|
| Numbered figure with caption | `<figure><div class="figure-frame"><img …><figcaption><span class="fig-num">Fig. N</span>…</figcaption></div></figure>` | both |
| Tables | `<div class="table-wrap"><table>…</table></div>` | both |
| Pull-quote / takeaway box | `<div class="aside">…</div>` | both |
| Method definition card | `.method-card`, `.method-tag`, `.method-title`, `.method-eq`, `.method-eq-expand`, `.method-note` | 04-21 tab 1 |
| Method × variants comparison grid | `.sens-grid-header`, `.sens-row`, `.sens-label`, `.sens-cell`, `.sens-cell.empty`, `.sens-cell.reused` | 04-21 tab 2 |
| Interactive widget container | `.widget-frame`, `.widget-body` (2-column), `.widget-legend` | 04-21 tab 3 |
| Selectable list (rank / label / metric) | `.pair-list`, `.pair-list-head`, `.pair-btn` (children: `.pair-rank`, `.pair-label`, `.pair-spread`) | 04-21 tab 3 |
| Detail panel header | `.detail-panel`, `.pair-title`, `.pair-sub` | 04-21 tab 3 |
| Paired text comparison | `.sentence-pair` > `.sentence-block` > `.sent-id` + `.sent-text` | 04-21 tab 3 |
| Horizontal ranked-bar block | `.ranks-block` > `.rank-row` > `.mask-name` + `.rank-bar-track` > `.rank-bar` + `.rank-value` (`.bold-cell` highlights, `.rank-row.sanity` for baseline rows) | 04-21 tab 3 |

Drop caps on the first paragraph of each panel are automatic — don't add markup for them.

Math is autoloaded if MathJax is in the `<head>`. Use `$…$` for inline, `$$…$$` for display.

---

## What NOT to do

- **Don't add YAML front matter** to any HTML file. They must remain Jekyll static files, otherwise they get processed/minified and may end up in `sitemap.xml`.
- **Don't add `robots.txt`** entries for `/meetings/`. That advertises the path.
- **Don't link to the meeting** from any main-site page (e.g. `_tabs/about.md`).
- **Don't change the `MEETINGS` array shape** in `shell.js` without updating the sidebar render + landing index together.
- **Don't change shared classes** (`.tabs-wrap`, `.tab-btn`, `.panel`, `.figure-frame`, `.method-card`, etc.) for one-off tweaks — they're load-bearing across every meeting. If a tweak is needed, override with a more specific selector inside the meeting's inline `<style>`.
- **Don't introduce a build step / framework** — these pages must work as plain static files even if Jekyll fails or is removed.
- **Don't change the palette / fonts** (Fraunces, Source Serif 4, JetBrains Mono, terracotta `#CC785C` accent on warm cream `#F5F0E8`). The aesthetic is the brand.
- **Don't write multi-line code comments** in the meeting's HTML/JS. One-line comments at most, only when intent isn't obvious.

---

## Aesthetic guidance

The notes are editorial. They read like a magazine essay on a research result — kicker, headline (often with one italicised word), deck, byline, then numbered tabs. Inside each tab: drop cap on first paragraph, lots of inline math, occasional figure with terracotta cap-line, asides for one-sentence takeaways.

Prefer:
- Compact prose. Each paragraph carries one idea.
- Inline display math over plain prose for any equation.
- A `.method-card` per definition, not a bulleted list of definitions.
- One `.aside` per major section as a takeaway, not multiple per section.
- Tables with mono headers and serif bodies; bold the column the reader's eye should land on.

Avoid:
- Generic `<div>` wrappers without classes.
- Stock "Material" or "Bootstrap" component patterns.
- Headings deeper than `h3` inside a panel.
- Multiple sticky elements (only `.tabs-wrap` is sticky).
