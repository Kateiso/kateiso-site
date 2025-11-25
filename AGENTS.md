
Purpose

- This file instructs AI agents and contributors on how to maintain and extend the site safely.
- Important: Agents must write in English. Keep instructions concise and actionable.

  Scope

- Repository: kateiso-site/
- Stack: Astro (static SSG), Node ≥ 18
- URL policy: Keep file-format URLs and stable routes:
  - Home: /index.html
  - Photos: /photos.html
  - Blog index: /blog.html
  - Post pages: /blog/posts/`<slug>`.html

  Core Commands

- Develop: npm run dev
- One-time media/post intake: npm run media:inbox
- Build: npm run build
- Preview: npm run preview
- The prebuild hook runs npm run media:inbox automatically.
- Git pushes: prefer SSH remote (git@github.com or ssh.github.com:443) to avoid token prompts; configure once per machine.

  Authoring — Posts (Markdown)

- Location: src/content/posts/*.md
- Required frontmatter (date is coerced; YAML unquoted dates are OK):
  - title: string (≤60; page title suffix “ · Kateiso” is automatic)
  - description: string (140–160 chars)
  - type: string (e.g., Essay | Note | Case | Lab | Guide | Field note | Toolkit)
  - date: 2025-10-27 (coerced to Date by schema)
  - summary: string
  - tags: [string, ...]
  - cover: assets/media/posts/`<slug>`/cover.webp (optional)
- Images for posts live under public/assets/media/posts/`<slug>`/.
- Search JSON serializes dates to ISO strings; don’t change the shape:
  - Endpoint: /assets/data/search.json
  - Includes blog posts only.

  Authoring — Inbox Workflows

- Photos intake (single shared manifest):
  - Drop photos (and optional Live Photo videos) into inbox/. Supported:
    - Images: .jpg .jpeg .png .webp .heic
    - Live Photo video: .mov (same base filename as image)
  - Run npm run media:inbox (or rely on prebuild):
    - Moves files to public/assets/media/gallery/ with YYYY-MM-DD_`<slug>`.`<ext>` names.
    - Captions come from the original filename (without extension) and must display on
      site.
    - Dates come from EXIF capture time (preferred) or file creation time (fallback).
    - Pairs Live Photos automatically (image as poster + muted video).
    - Writes/updates manifest: public/assets/data/gallery.json.
    - If no inbox items: preserves existing manifest; if missing, rebuilds from the gallery
      folder.
  - Do not push an empty manifest unless intended.
- Posts intake:
  - Template: templates/post.md
  - Drop a filled .md into inbox/ or inbox/posts/.
  - The script moves valid posts to src/content/posts/`<slug>`.md (slug from filename).

  Pages and Components

- Home (src/pages/index.astro)
  - Subtle hero (not “PPT cover”).
  - “Recent moments” gallery shows latest items from the shared manifest.
- Photos (src/pages/photos.astro)
  - Uses the same manifest as Home.
  - Masonry-style listing with larger media, no white borders.
  - Featured large item at top with prev/next.
  - Lightbox with keyboard navigation:
    - ESC closes; Left/Right navigate.
    - When lightbox is closed, Left/Right cycle the featured item.
  - Year filter via ?year=YYYY.
- Blog index (src/pages/blog/index.astro)
  - Renders posts from content collection; includes a client-side search field.
- Post pages (src/pages/blog/posts/[slug].astro)
  - Generated from the content collection via frontmatter.

    Design direction: Apple-like minimalism — calm typography, generous whitespace, soft depth, smooth motion, and 	respect for reduced motion.”

- Shared layout: src/layouts/Base.astro (nav/footer, analytics, fonts, styles).
- Global CSS: public/assets/css/styles.css
  - Use CSS variables in :root for color/spacing/width.
  - BEM classes (e.g., block__element--modifier).
- Page-only tweaks:
  - Prefer scoped `<style>` blocks in the .astro page to avoid global impact.
- Navigation links:
  - Use .html for top-level pages (e.g., /photos.html, /blog.html, /contact.html).
  - Keep post links as /blog/posts/`<slug>`.html.

  Data and Integrations

- Sitemap: @astrojs/sitemap, site = https://kateiso.dev
- RSS: /rss.xml via @astrojs/rss
- Analytics: Plausible (deferred). GA4 can replace it if provided a Measurement ID.

  Deployment

- GitHub Pages via .github/workflows/pages.yml.
- Push to main triggers build and deploy.
- CNAME: public/CNAME contains kateiso.dev.

  Editing Guidance

- Minor copy/structure changes: edit specific .astro page (e.g., src/pages/contact.astro).
- Page-only style changes: add a scoped `<style>` in the same .astro file.
- Global adjustments (site-wide): edit public/assets/css/styles.css vars and class rules.
- Do not move or rename:
  - public/assets/ structure
  - src/pages/blog/posts/[slug].astro
  - The blog/posts directory or /blog.html route
- Do not introduce blocking third-party scripts.

  Quality Checklist (pre-push)

- Top-level links use .html (no trailing slash).
- Build passes locally: npm run build
- New media processed: npm run media:inbox (if you added photos/posts to inbox)
- Each page has unique `<title>` and `<meta name="description">`.
- Dates serialized to ISO in /assets/data/search.json.

  Commit/Branch

- Branches:
  - Features: feature/`<short-scope>`
  - Posts: feature/post-`<slug>`
  - Style: chore/style-tuning
- Messages:
  - post: `<slug>` + listings
  - feat(photos): ...
  - fix(routes): use .html links for top-level pages
  - fix(content): coerce post dates to Date and serialize dates in search JSON
