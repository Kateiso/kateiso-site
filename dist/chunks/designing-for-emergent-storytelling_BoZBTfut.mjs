import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate } from './astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Emergent storytelling requires designing constraints and affordances that invite variation while preserving theme. Think of systems where rules create possibilities—and editors shape meaning.</p>\n<p>Guiding questions: What persists as context changes? Where can agency safely expand? What feedback nudges stories toward coherence?</p>";

				const frontmatter = {"title":"Designing for Emergent Storytelling","description":"What interaction design can borrow from game design and speculative fiction to build adaptive narratives.","type":"Essay","date":"2024-02-01T00:00:00.000Z","summary":"Narrative scaffolds that adapt to new inputs without losing cohesion.","tags":["design","narrative"]};
				const file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/designing-for-emergent-storytelling.md";
				const url = undefined;
				function rawContent() {
					return "\nEmergent storytelling requires designing constraints and affordances that invite variation while preserving theme. Think of systems where rules create possibilities—and editors shape meaning.\n\nGuiding questions: What persists as context changes? Where can agency safely expand? What feedback nudges stories toward coherence?\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
