import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BGfnt9Ef.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "About \xB7 Kateiso";
  const pageDesc = "About Kateiso \u2014 an ENTJ studying at BJTU and Lancaster University; diving into XR; curious about Web3 and restaurant digitalization.";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": pageTitle, "description": pageDesc }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="section__intro"> <h1>About</h1> <p class="section__lede">Enjoy Life, Enjoy with U.</p> </div> <div class="about-grid"> <article class="about-grid__item"> <h2>Bio</h2> <p>An ENTJ studying at BJTU and Lancaster University; diving into XR; curious about Web3 and restaurant digitalization.</p> </article> <article class="about-grid__item"> <h2>Focus</h2> <p>First Principle · One more step · System thinking.</p> </article> <article class="about-grid__item"> <h2>Contact</h2> <p>
Email: <a href="mailto:C.yibo2@gmail.com">C.yibo2@gmail.com</a><br>
Twitter: <a href="https://x.com/KateisoCao" target="_blank" rel="noopener">@KateisoCao</a><br>
Douyin: <a href="https://www.douyin.com/user/MS4wLjABAAAAHCcB9BtLlZP-iSutvkW8oHPPHeSj_IR9rBa5uIq0L3drZDGzCcLmAaTFCozmXLH5?from_tab_name=main" target="_blank" rel="noopener">@Kateiso</a> </p> </article> </div> </section> ` })}`;
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/about.astro", void 0);

const $$file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/about.astro";
const $$url = "/about.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
