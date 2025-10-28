import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate } from './astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Generative tools shine when scoped. Use them to explore breadth quickly (thumbnails, alt takes, style probes), then converge with human editing.</p>\n<p>Tip: version small; archive often; annotate decisions to keep iterations explainable.</p>";

				const frontmatter = {"title":"Prototyping with Generative Media","description":"A starter toolkit for blending generative visuals, audio, and text into rapid prototyping cycles.","type":"Toolkit","date":"2024-01-01T00:00:00.000Z","summary":"Practical ways to integrate generative media into early design loops.","tags":["prototyping","generative"]};
				const file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/prototyping-with-generative-media.md";
				const url = undefined;
				function rawContent() {
					return "\nGenerative tools shine when scoped. Use them to explore breadth quickly (thumbnails, alt takes, style probes), then converge with human editing.\n\nTip: version small; archive often; annotate decisions to keep iterations explainable.\n\n";
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
