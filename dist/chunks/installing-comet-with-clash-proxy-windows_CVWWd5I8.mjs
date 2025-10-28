import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate } from './astro/server_BnWXTheT.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>When running Comet behind Clash for Windows, the installer may fail to fetch dependencies. The simplest workaround is to launch PowerShell with temporary proxy variables so only the installation session is proxied.</p>\n<h2 id=\"steps\">Steps</h2>\n<ol>\n<li>Open PowerShell (Admin) and export proxy variables:</li>\n</ol>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"powershell\"><code><span class=\"line\"><span style=\"color:#E1E4E8\">$</span><span style=\"color:#79B8FF\">env:</span><span style=\"color:#E1E4E8\">HTTP_PROXY </span><span style=\"color:#F97583\">=</span><span style=\"color:#9ECBFF\"> \"http://127.0.0.1:7890\"</span></span>\n<span class=\"line\"><span style=\"color:#E1E4E8\">$</span><span style=\"color:#79B8FF\">env:</span><span style=\"color:#E1E4E8\">HTTPS_PROXY </span><span style=\"color:#F97583\">=</span><span style=\"color:#9ECBFF\"> \"http://127.0.0.1:7890\"</span></span>\n<span class=\"line\"></span></code></pre>\n<ol start=\"2\">\n<li>\n<p>Run the Comet installer from the same session.</p>\n</li>\n<li>\n<p>Clear variables after install:</p>\n</li>\n</ol>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"powershell\"><code><span class=\"line\"><span style=\"color:#79B8FF\">Remove-Item</span><span style=\"color:#E1E4E8\"> Env:\\HTTP_PROXY; </span><span style=\"color:#79B8FF\">Remove-Item</span><span style=\"color:#E1E4E8\"> Env:\\HTTPS_PROXY</span></span>\n<span class=\"line\"></span></code></pre>\n<p>This isolates proxy effects and avoids system‑wide changes.</p>";

				const frontmatter = {"title":"Installing Comet on Windows with Clash Proxy","description":"Install Comet reliably behind Clash for Windows by running the installer through temporary PowerShell proxy variables and avoiding common connection pitfalls.","type":"Guide","date":"2025-10-01T00:00:00.000Z","summary":"Run the Comet installer behind Clash for Windows by setting temporary PowerShell proxy vars and avoiding common connection pitfalls.","tags":["windows","proxy","tools"]};
				const file = "/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/installing-comet-with-clash-proxy-windows.md";
				const url = undefined;
				function rawContent() {
					return "\nWhen running Comet behind Clash for Windows, the installer may fail to fetch dependencies. The simplest workaround is to launch PowerShell with temporary proxy variables so only the installation session is proxied.\n\n## Steps\n\n1. Open PowerShell (Admin) and export proxy variables:\n\n```powershell\n$env:HTTP_PROXY = \"http://127.0.0.1:7890\"\n$env:HTTPS_PROXY = \"http://127.0.0.1:7890\"\n```\n\n2. Run the Comet installer from the same session.\n\n3. Clear variables after install:\n\n```powershell\nRemove-Item Env:\\HTTP_PROXY; Remove-Item Env:\\HTTPS_PROXY\n```\n\nThis isolates proxy effects and avoids system‑wide changes.\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"steps","text":"Steps"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
