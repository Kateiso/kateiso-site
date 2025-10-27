import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kateiso.dev',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});

