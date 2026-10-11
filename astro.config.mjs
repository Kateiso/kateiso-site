import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kateiso.dev',
  trailingSlash: 'never',
  outDir: './docs',
  build: { format: 'file' },
  integrations: [sitemap({
    // Astro's file output needs the same .html URLs as the canonical links.
    filter: (page) => new URL(page).pathname !== '/en',
    serialize: (item) => {
      const url = new URL(item.url);
      if (url.pathname === '/') url.pathname = '/index.html';
      else if (!url.pathname.endsWith('.html')) url.pathname += '.html';
      return { ...item, url: url.toString() };
    },
  })],
});
