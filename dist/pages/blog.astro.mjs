import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BGfnt9Ef.mjs';
import { g as getCollection } from '../chunks/_astro_content_DdtllX2B.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("posts")).sort((a, b) => a.data.date < b.data.date ? 1 : -1);
  const pageTitle = "Journal \xB7 Kateiso";
  const pageDesc = "Journal entries on intelligent creative systems, XR, and workflow design.";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": pageTitle, "description": pageDesc }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="section__intro"> <h1>Journal</h1> <p class="section__lede">Essays, field notes, and toolkits documenting how creative systems and intelligent workflows come together.</p> </div> <div class="section__intro section__intro--split"> <input id="search" type="search" placeholder="Search posts and About…" style="padding:0.7rem 1rem;border:1px solid var(--color-border);border-radius:12px;width:min(480px, 100%);"> <span aria-live="polite" id="search-count" style="color:var(--color-text-muted)"></span> </div> <div class="blog-list" id="results"> ${posts.map((p) => renderTemplate`<article class="blog-card"> <p class="blog-card__meta">${new Date(p.data.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })} · ${p.data.type}</p> <h2><a${addAttribute(`/blog/posts/${p.slug}.html`, "href")}>${p.data.title}</a></h2> <p class="blog-card__summary">${p.data.summary}</p> </article>`)} </div> </section>  ` })}`;
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/index.astro", void 0);

const $$file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/index.astro";
const $$url = "/blog.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
