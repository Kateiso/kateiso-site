import rss from '@astrojs/rss';
import { g as getCollection } from '../chunks/_astro_content_DdtllX2B.mjs';
export { renderers } from '../renderers.mjs';

async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: "Kateiso Journal",
    description: "Essays and notes on intelligent creative systems",
    site: context.site,
    items: posts.map((p) => ({
      link: `/blog/posts/${p.slug}.html`,
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.date)
    }))
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
