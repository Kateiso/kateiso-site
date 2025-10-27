import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Kateiso Journal',
    description: 'Essays and notes on intelligent creative systems',
    site: context.site,
    items: posts.map((p) => ({
      link: `/blog/posts/${p.slug}.html`,
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.date),
    })),
  });
}

