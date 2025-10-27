# Kateiso Personal Site

## Purpose
- Build a digital home that blends digital media art perspectives with forward-looking tech thinking.
- Start with a blog-centric layout while reserving space for future case studies and interactive experiments.
- Establish a foundation that is easy to host on GitHub Pages and flexible enough to migrate to a VPS when needed.

## Initial Content Structure
- Landing hero with positioning statement, quick intro, and primary call-to-action pointing to the blog feed.
- About section summarizing academic background (Beijing Jiaotong University × Lancaster University, Interaction Design) and the mission of the platform.
- Capabilities & focus areas highlighting the mix of creativity, systems thinking, and intelligent tooling.
- Blog preview grid with latest posts and a link to the dedicated blog index.
- Contact strip with the `C.yibo2@gmail.com` address and social placeholders.
- Footer with links for future portfolio, lab/experiments, and newsletter sign-up.

## Future Expansion Hooks
- Dedicated "Works" section to showcase projects once portfolio entries are ready.
- "Lab" for prototypes, tools, and experiments tying into the future-tech narrative.
- Optional bilingual support (English/Chinese) if the audience mix evolves.
- Newsletter or mailing list integration to nurture the creative community.

## Technical Approach
- Static HTML/CSS/vanilla JS so the site deploys cleanly on GitHub Pages without build tooling.
- Semantic markup to keep accessibility high and ease future migration to frameworks like Astro or Next.js.
- Responsive layout with CSS custom properties for quick theming adjustments.
- Modular file structure so additional pages (e.g., portfolio) can slot in without reworking the home page.

## File Map (planned)
```
.
├── index.html           # Landing page with sections listed above
├── blog/
│   ├── index.html       # Blog landing page
│   └── posts/
│       ├── first-post.html
│       └── ...          # Future posts live here
├── assets/
│   ├── css/
│   │   └── styles.css   # Global styles and section-specific rules
│   ├── js/
│   │   └── site.js      # Navigation toggles, theming hooks, micro-interactions
│   └── media/           # Placeholder for images/graphics
└── README.md
```

## Content Voice Guidelines
- Blend articulate strategic thinking with approachable maker energy.
- Use concise paragraphs, highlight actionable insights, and keep jargon light.
- Emphasize how creative expression and intelligent systems reinforce one another.

## Next Steps
1. Implement the static pages and baseline styling.
2. Populate with sample content and clearly marked TODOs for future updates.
3. Prepare deployment instructions for GitHub Pages and custom domain mapping (`kateiso.dev`).

## Deployment

### Deploy to GitHub Pages
1. Create a new GitHub repository (either `kateiso.github.io` for an account site or a named repo if you plan to use a custom domain exclusively).
2. In this project folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin git@github.com:<username>/<repo>.git
   git push -u origin main
   ```
3. In the GitHub repository settings, enable Pages by selecting the `main` branch and `/ (root)` folder. GitHub will build and publish automatically.

### Connect `kateiso.dev`
1. Keep the `CNAME` file with the single line `kateiso.dev` in the repository root (already added here).
2. In your DNS provider, point the apex domain to GitHub Pages by adding four A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Add a CNAME record for `www` pointing to your GitHub Pages hostname (e.g., `kateiso.github.io`).
4. Once DNS propagates, open the GitHub Pages settings and set the custom domain to `kateiso.dev`, then enforce HTTPS.

### Optional VPS Hosting
- Upload the contents of this folder to your server’s web root (e.g., via `rsync` or `scp`).
- Ensure the server (Nginx/Apache) is configured to serve the static files and redirect `www` to the apex domain if desired.
- Consider using a CI run (GitHub Actions, Render, etc.) later so publishing from the repo stays automated.
