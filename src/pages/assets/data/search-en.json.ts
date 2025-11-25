import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('postsEn');
  const items = posts.map((p) => ({
    slug: `/en/blog/posts/${p.slug}.html`,
    title: p.data.title,
    summary: p.data.summary || p.data.description,
    type: p.data.type,
    date: p.data.date instanceof Date ? p.data.date.toISOString() : String(p.data.date),
    tags: p.data.tags || [],
  }));

  const about = {
    slug: '/en/about.html',
    title: 'About Kateiso',
    summary: 'English bio focused on HACM, XR collaboration, and research touchpoints.',
    type: 'Page',
    date: '',
    tags: ['about']
  };

  return new Response(JSON.stringify({ items: [...items, about] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
