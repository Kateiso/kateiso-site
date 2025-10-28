import { b as createAstro, c as createComponent, m as maybeRenderHead, d as renderSlot, a as renderTemplate, r as renderComponent } from '../../../chunks/astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../../../chunks/Base_BGfnt9Ef.mjs';
import 'clsx';
import { g as getCollection } from '../../../chunks/_astro_content_DdtllX2B.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$1 = createAstro("https://kateiso.dev");
const $$PostLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PostLayout;
  const { title, description, meta } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<layout:fragment> <section class="article"> <article> <header class="article__header"> <p class="article__meta">${meta}</p> <h1>${title}</h1> <p class="article__summary">${description}</p> </header> ${renderSlot($$result, $$slots["default"])} <footer class="article__footer"> <p>Questions or collaborations? Email <a href="mailto:C.yibo2@gmail.com">C.yibo2@gmail.com</a>.</p> </footer> </article> </section> </layout:fragment>`;
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/layouts/PostLayout.astro", void 0);

const $$Astro = createAstro("https://kateiso.dev");
async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { post } = Astro2.props;
  const { Content } = await post.render();
  const pageTitle = `${post.data.title} \xB7 Kateiso`;
  const pageDesc = post.data.description;
  const meta = `${post.data.type || "Essay"} \xB7 ${new Date(post.data.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": pageTitle, "description": pageDesc }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PostLayout", $$PostLayout, { "title": post.data.title, "description": post.data.summary || post.data.description, "meta": meta }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, {})} ` })} ` })}`;
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/posts/[slug].astro", void 0);

const $$file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/posts/[slug].astro";
const $$url = "/blog/posts/[slug].html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
