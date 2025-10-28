import { b as createAstro, c as createComponent, a as renderTemplate, d as renderSlot, e as addAttribute, i as renderHead } from './astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://kateiso.dev");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title = "Kateiso", description = "Essays, field notes, and toolkits on intelligent creative systems." } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta name="description"', '><link rel="preconnect" href="https://fonts.googleapis.com" crossorigin><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="icon" href="/favicon.jpg" type="image/jpeg"><!-- Plausible analytics (can be swapped for GA4). Data domain: kateiso.dev --><script defer data-domain="kateiso.dev" src="https://plausible.io/js/script.js"><\/script>', "</head> <body", '> <header class="site-header" data-js="nav"> <div class="site-header__inner"> <a class="site-logo" href="/">Kateiso</a> <nav class="site-nav" aria-label="Primary navigation"> <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-menu"> <span class="visually-hidden">Toggle navigation</span> <span class="site-nav__icon" aria-hidden="true"></span> </button> <ul id="site-menu" class="site-nav__list"> <li><a href="/about.html">About</a></li> <li><a href="/photos.html">Photos</a></li> <li><a href="/blog.html">Journal</a></li> <li><a href="/rss.xml">RSS</a></li> </ul> </nav> </div> </header> <main> ', ' </main> <footer class="site-footer"> <div class="site-footer__inner"> <p class="site-footer__brand">\xA9 <span data-js="year"></span> Kateiso. All rights reserved.</p> <nav class="site-footer__nav" aria-label="Secondary navigation"> <a href="/blog.html">Journal</a> <span aria-hidden="true">\xB7</span> <a href="/about.html">About</a> </nav> </div> </footer> <script src="/assets/js/site.js" defer><\/script> </body> </html>'])), title, addAttribute(description, "content"), renderHead(), addAttribute(Astro2.url.pathname.startsWith("/blog") ? "with-subpage-header" : "", "class"), renderSlot($$result, $$slots["default"]));
}, "/Users/kateiso_cao/Desktop/test/kateiso-site/src/layouts/Base.astro", void 0);

export { $$Base as $ };
