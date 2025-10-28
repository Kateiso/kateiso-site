import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate } from './astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Creative work benefits from clear orchestration layers. Define interfaces, checkpoints, and feedback loops so AI copilots can support—rather than override—human judgment.</p>\n<h3 id=\"three-layers\">Three layers</h3>\n<ul>\n<li>Strategy: goals, constraints, and success signals.</li>\n<li>Orchestration: prompts, tools, and handoffs.</li>\n<li>Execution: content generation, review, and iteration.</li>\n</ul>\n<p>Treat prompts as evolving APIs, not one‑off commands.</p>";

				const frontmatter = {"title":"Orchestrating Creative Systems with AI Copilots","description":"A systems-first approach to working with AI tools, making space for human intuition while automating the heavy lift.","type":"Field note","date":"2024-03-01T00:00:00.000Z","summary":"Pair human intuition with orchestration layers that keep AI helpers aligned.","tags":["systems","ai","workflow"]};
				const file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/orchestrating-creative-systems.md";
				const url = undefined;
				function rawContent() {
					return "\nCreative work benefits from clear orchestration layers. Define interfaces, checkpoints, and feedback loops so AI copilots can support—rather than override—human judgment.\n\n### Three layers\n\n- Strategy: goals, constraints, and success signals.\n- Orchestration: prompts, tools, and handoffs.\n- Execution: content generation, review, and iteration.\n\nTreat prompts as evolving APIs, not one‑off commands.\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":3,"slug":"three-layers","text":"Three layers"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
