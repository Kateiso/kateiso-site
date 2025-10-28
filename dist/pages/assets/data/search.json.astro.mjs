import { g as getCollection } from '../../../chunks/_astro_content_DdtllX2B.mjs';
export { renderers } from '../../../renderers.mjs';

async function GET() {
  const posts = await getCollection("posts");
  const items = posts.map((p) => ({
    slug: `/blog/posts/${p.slug}.html`,
    title: p.data.title,
    summary: p.data.summary || p.data.description,
    type: p.data.type,
    date: p.data.date instanceof Date ? p.data.date.toISOString() : String(p.data.date),
    tags: p.data.tags || []
  }));
  const about = {
    slug: "/about/",
    title: "About",
    summary: "About Kateiso — bio, focus, and contact.",
    type: "Page",
    date: "",
    tags: ["about"]
  };
  return new Response(JSON.stringify({ items: [...items, about] }), {
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
