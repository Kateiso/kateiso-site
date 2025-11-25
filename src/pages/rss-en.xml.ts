import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('postsEn');
  return rss({
    title: 'Kateiso Journal · English',
    description: 'English essays on HACM, XR systems, and agent tooling.',
    site: context.site,
    items: posts.map((p) => ({
      link: `/en/blog/posts/${p.slug}.html`,
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.date),
    })),
  });
}
