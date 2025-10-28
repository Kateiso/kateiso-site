const id = "installing-comet-with-clash-proxy-windows.md";
						const collection = "posts";
						const slug = "installing-comet-with-clash-proxy-windows";
						const body = "\nWhen running Comet behind Clash for Windows, the installer may fail to fetch dependencies. The simplest workaround is to launch PowerShell with temporary proxy variables so only the installation session is proxied.\n\n## Steps\n\n1. Open PowerShell (Admin) and export proxy variables:\n\n```powershell\n$env:HTTP_PROXY = \"http://127.0.0.1:7890\"\n$env:HTTPS_PROXY = \"http://127.0.0.1:7890\"\n```\n\n2. Run the Comet installer from the same session.\n\n3. Clear variables after install:\n\n```powershell\nRemove-Item Env:\\HTTP_PROXY; Remove-Item Env:\\HTTPS_PROXY\n```\n\nThis isolates proxy effects and avoids system‑wide changes.\n\n";
						const data = {title:"Installing Comet on Windows with Clash Proxy",description:"Install Comet reliably behind Clash for Windows by running the installer through temporary PowerShell proxy variables and avoiding common connection pitfalls.",type:"Guide",date:new Date(1759276800000),summary:"Run the Comet installer behind Clash for Windows by setting temporary PowerShell proxy vars and avoiding common connection pitfalls.",tags:["windows","proxy","tools"]};
						const _internal = {
							type: 'content',
							filePath: "/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/installing-comet-with-clash-proxy-windows.md",
							rawData: undefined,
						};

export { _internal, body, collection, data, id, slug };
