import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, e as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BGfnt9Ef.mjs';
import fs from 'node:fs/promises';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://kateiso.dev");
const $$Photos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Photos;
  const pageTitle = "Photos \xB7 Kateiso";
  const pageDesc = "A minimal, artistic photo stream with year filters.";
  let items = [];
  try {
    const raw = await fs.readFile("public/assets/data/gallery.json", "utf8");
    const json = JSON.parse(raw);
    items = json.items || [];
  } catch {
  }
  const years = Array.from(new Set(items.map((i) => (i.date || "").slice(0, 4)))).filter(Boolean).sort((a, b) => a < b ? 1 : -1);
  const url = new URL(Astro2.request.url);
  const activeYear = url.searchParams.get("year");
  const filtered = activeYear ? items.filter((i) => (i.date || "").startsWith(activeYear)) : items;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": pageTitle, "description": pageDesc }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="section photos-page"> <div class="section__intro section__intro--split"> <div> <h1>Photos</h1> <p class="section__lede">Enjoy Life, Enjoy with U.</p> </div> <nav aria-label="Year filter" class="photos-filter"> <a href="/photos.html"', ">All</a> ", " </nav> </div> <!-- Featured large media --> ", ' <div class="gallery-grid gallery--masonry" id="gallery"> ', ' </div> </section> <div class="lightbox" id="lightbox" hidden> <button class="lightbox__backdrop" data-action="close" aria-label="Close"></button> <div class="lightbox__inner" role="dialog" aria-modal="true"> <figure> <div id="lightbox-media"></div> <figcaption class="lightbox__caption"><span id="lightbox-date"></span> \xB7 <span id="lightbox-title"></span></figcaption> </figure> <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">\u2039</button> <button class="lightbox__nav lightbox__nav--next" aria-label="Next">\u203A</button> <button class="lightbox__close" data-action="close" aria-label="Close">\u2715</button> </div> </div>  <script type="application/json" id="photos-data">{JSON.stringify(filtered)}<\/script> '])), maybeRenderHead(), addAttribute(activeYear ? "" : "is-active", "class"), years.map((y) => renderTemplate`<a${addAttribute(`/photos.html?year=${y}`, "href")}${addAttribute(activeYear === y ? "is-active" : "", "class")}>${y}</a>`), filtered.length > 0 && renderTemplate`<section class="photos-featured" aria-label="Featured photo"> <div class="photos-featured__inner"> ${filtered[0].video ? renderTemplate`<video class="photos-featured__media"${addAttribute(filtered[0].video, "src")}${addAttribute(filtered[0].image, "poster")} muted playsinline controls preload="metadata"></video>` : renderTemplate`<img class="photos-featured__media"${addAttribute(filtered[0].image, "src")}${addAttribute(filtered[0].title, "alt")}>`} <div class="photos-featured__meta"> <span class="photos-featured__date">${filtered[0].date}</span> <span aria-hidden="true">·</span> <span class="photos-featured__title">${filtered[0].title}</span> <button class="photos-featured__open" data-index="0" aria-label="Open in lightbox">Open</button> </div> <button class="photos-featured__nav photos-featured__nav--prev" aria-label="Previous">‹</button> <button class="photos-featured__nav photos-featured__nav--next" aria-label="Next">›</button> </div> </section>`, filtered.map((it) => renderTemplate`<figure class="gallery-item"> <button class="gallery-item__btn"${addAttribute(it.image, "data-image")}${addAttribute(it.video || "", "data-video")}${addAttribute(it.title, "data-title")}${addAttribute(it.date, "data-date")}${addAttribute(`Open ${it.title}`, "aria-label")}${addAttribute(filtered.indexOf(it), "data-index")}> ${it.video ? renderTemplate`<video class="gallery-item__media"${addAttribute(it.video, "src")}${addAttribute(it.image, "poster")} muted playsinline preload="metadata" loop></video>` : renderTemplate`<img class="gallery-item__media"${addAttribute(it.image, "src")}${addAttribute(it.title, "alt")} loading="lazy">`} <figcaption class="gallery-item__meta"> <span class="gallery-item__date">${it.date}</span> <span aria-hidden="true">·</span> <span class="gallery-item__title">${it.title}</span> </figcaption> </button> </figure>`)) })}`;
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/photos.astro", void 0);

const $$file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/photos.astro";
const $$url = "/photos.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Photos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
