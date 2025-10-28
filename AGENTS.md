# AGENTS — Authoring and Maintenance Guide (Astro SSG)

Important: Agents must write in English. Include concise, actionable steps.

Scope
- Applies to the entire `kateiso-site/` repository. This guide defines the authoring model, structure, styling, and safe upgrade practices using Astro (static site generation).

Goals
- Keep current URLs stable: `/index.html`, `/blog/index.html`, `/blog/posts/<slug>.html`.
- Author posts in Markdown with frontmatter. Generate listings, RSS, sitemap, and a lightweight search index at build time.

Stack
- Astro (static), Node.js ≥ 18
- Integrations: `@astrojs/sitemap` for sitemap, `@astrojs/rss` for RSS
- Search: build-time JSON at `/assets/data/search.json` consumed by client JS on the blog index
- Deploy: GitHub Pages; site URL `https://kateiso.dev`

Media Inbox Workflow
- Drop photos (and Apple Live Photo pairs) into the repo `inbox/` folder. Supported: `.jpg/.jpeg/.png/.webp/.heic` and optional paired `.mov`.
- On `npm run media:inbox` or during `npm run build` (via `prebuild`), files are moved to `public/assets/media/gallery/` and a manifest is written to `public/assets/data/gallery.json`.
- Date labeling uses EXIF capture time when available; falls back to file creation time (birthtime) if EXIF is missing.
- Live Photos: when an image and a `.mov` share the same base filename, they are paired; the gallery uses the image as poster and can show the motion clip (muted) when supported.
- Captions: the original filename (without extension) is treated as the photo caption and displayed on the site.

Inbox Posts (Markdown → Content collection)
- You can drop Markdown posts into `inbox/` or `inbox/posts/` using the template at `templates/post.md`.
- On `npm run media:inbox` (pre-build), valid posts are moved to `src/content/posts/<slug>.md` (slug from filename). The frontmatter is preserved.
- Required frontmatter: `title`, `description`, `type`, `date` (ISO), `summary`, `tags` (array). Images should live in `public/assets/media/posts/<slug>/`.

Project Layout
- `src/layouts/Base.astro` — shared layout and metadata
- `src/layouts/PostLayout.astro` — article layout
- `src/pages/index.astro` — Home
- `src/pages/about.astro` — About page (included in search)
- `src/pages/blog/index.astro` — Blog index with search
- `src/pages/blog/posts/[slug].astro` — Post route (generated from content collection)
- `src/pages/assets/data/search.json.ts` — Search index endpoint (static JSON)
- `src/pages/rss.xml.ts` — RSS feed endpoint
- `src/content/` — Markdown posts and content config
- `public/assets/` — CSS, JS, media (mirrors current `assets/`)
- `public/CNAME` — `kateiso.dev`

URL Strategy
- `trailingSlash: "never"` and `build.format: "file"` ensure `.html` output.
- Post links resolve to `/blog/posts/<slug>.html`.

Authoring (Markdown)
1) Create `src/content/posts/<slug>.md` (slug: lowercase words joined by hyphens).
2) Frontmatter fields:
   - `title`: string (≤ 60; used in `<title>` suffix as ` · Kateiso`)
   - `description`: 140–160 chars
   - `type`: `Essay|Note|Case|Lab|Guide|Field note|Toolkit`
   - `date`: ISO (e.g., `2025-10-12`)
   - `summary`: short paragraph for cards
   - `cover`: `assets/media/posts/<slug>/cover.webp` (optional)
   - `tags`: string[]
3) Images live in `public/assets/media/posts/<slug>/` with proper `alt`.

Styling and Semantics
- BEM class names (e.g., `site-header__inner`, `journal-card__summary`).
- Colors/spacing via `:root` CSS variables in `public/assets/css/styles.css`.
- Semantic HTML: `main`, `article`, `section`, `nav`, `footer`. Heading order `h1 → h2 → h3`.
 - Design direction: Apple‑like minimalism — calm typography, generous whitespace, soft depth (subtle shadows), and smooth, unobtrusive motion. Favor physics‑based easing (e.g., ease-in-out, 200–250ms). Respect reduced‑motion preferences.

Search
- Build time: generate `/assets/data/search.json` from posts and the About page.
- Client: blog index ships a small script to filter cards. Fallback shows all when JS is disabled.

SEO
- Each page sets unique `<title>` and `<meta name="description">`.
- Sitemap via `@astrojs/sitemap`. RSS via `@astrojs/rss` at `/rss.xml`.

Analytics
- Plausible snippet is included and deferred for `kateiso.dev`. Replace with GA4 if preferred (see Base layout comment).

Branches and Commits
- Branches: `feature/post-<slug>`, `chore/style-tuning`.
- Messages: `post: <slug> + listings`, `style: tune spacing/contrast`, `content: update about/focus`.

Avoid
- Changing `public/assets/` hierarchy or the blog route structure.
- Large uncompressed images; missing `alt`.
- Blocking third-party scripts.

Upgrade Path
- Add tags page, pagination, and RSS enhancements.
- Optional analytics switch (GA4) and feed/OG enrichment.

Home Gallery
- The home page renders a “Recent moments” gallery from `/assets/data/gallery.json` (recent 9 items). Titles derive from filenames; keep base names human-readable.
- Visuals are minimal and artistic; images live under `public/assets/media/gallery/`.

Photos Page and Filters
- `/photos/` lists all items from the same manifest with year filters (query `?year=YYYY`).
- Clicking a photo opens a lightbox for zoom; videos (Live Photos) can autoplay muted inside the lightbox.
