import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, j as decodeKey } from './chunks/astro/server_BnWXTheT.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/","adapterName":"","routes":[{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/about.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/assets/data/search.json","links":[],"scripts":[],"styles":[],"routeData":{"route":"/assets/data/search.json","isIndex":false,"type":"endpoint","pattern":"^\\/assets\\/data\\/search\\.json$","segments":[[{"content":"assets","dynamic":false,"spread":false}],[{"content":"data","dynamic":false,"spread":false}],[{"content":"search.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/assets/data/search.json.ts","pathname":"/assets/data/search.json","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/blog.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/photos.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/photos","isIndex":false,"type":"page","pattern":"^\\/photos$","segments":[[{"content":"photos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/photos.astro","pathname":"/photos","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}}],"site":"https://kateiso.dev","base":"/","trailingSlash":"never","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/assets/data/search.json.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/assets/data/search.json@_@ts",{"propagation":"in-tree","containsHead":false}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/blog/posts/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/posts/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/kateiso_cao/Desktop/test/kateiso-site/src/pages/photos.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/assets/data/search.json@_@ts":"pages/assets/data/search.json.astro.mjs","\u0000@astro-page:src/pages/blog/posts/[slug]@_@astro":"pages/blog/posts/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/photos@_@astro":"pages/photos.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_CWM8fUaI.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/designing-for-emergent-storytelling.md?astroContentCollectionEntry=true":"chunks/designing-for-emergent-storytelling_ByKzOb1x.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/installing-comet-with-clash-proxy-windows.md?astroContentCollectionEntry=true":"chunks/installing-comet-with-clash-proxy-windows_Dpdpvfa2.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/orchestrating-creative-systems.md?astroContentCollectionEntry=true":"chunks/orchestrating-creative-systems_B6iLXg9k.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/prototyping-with-generative-media.md?astroContentCollectionEntry=true":"chunks/prototyping-with-generative-media_B9hNKdzU.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/wiring-mcp-and-chrome-devtools-for-creative-workflows.md?astroContentCollectionEntry=true":"chunks/wiring-mcp-and-chrome-devtools-for-creative-workflows_DnQR7pXn.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/designing-for-emergent-storytelling.md?astroPropagatedAssets":"chunks/designing-for-emergent-storytelling_BqzgK8Gt.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/installing-comet-with-clash-proxy-windows.md?astroPropagatedAssets":"chunks/installing-comet-with-clash-proxy-windows_BB_jTf1B.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/orchestrating-creative-systems.md?astroPropagatedAssets":"chunks/orchestrating-creative-systems_BNhmfPo6.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/prototyping-with-generative-media.md?astroPropagatedAssets":"chunks/prototyping-with-generative-media_BQp9xV_l.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/wiring-mcp-and-chrome-devtools-for-creative-workflows.md?astroPropagatedAssets":"chunks/wiring-mcp-and-chrome-devtools-for-creative-workflows_4C7auZ5P.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/designing-for-emergent-storytelling.md":"chunks/designing-for-emergent-storytelling_BoZBTfut.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/installing-comet-with-clash-proxy-windows.md":"chunks/installing-comet-with-clash-proxy-windows_CVWWd5I8.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/orchestrating-creative-systems.md":"chunks/orchestrating-creative-systems_BKdfzljk.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/prototyping-with-generative-media.md":"chunks/prototyping-with-generative-media_Cz-ql8py.mjs","/Users/kateiso_cao/Desktop/test/kateiso-site/src/content/posts/wiring-mcp-and-chrome-devtools-for-creative-workflows.md":"chunks/wiring-mcp-and-chrome-devtools-for-creative-workflows_CDfx1K4m.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.TEKajLPD.js","/astro/hoisted.js?q=1":"_astro/hoisted.DXesJZXO.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/about.html","/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/assets/data/search.json","/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/blog.html","/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/photos.html","/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/rss.xml","/file:///Users/kateiso_cao/Desktop/test/kateiso-site/dist/index.html"],"buildFormat":"file","checkOrigin":false,"serverIslandNameMap":[],"key":"8zOZ/3MQlzb5Sdd8DW9OhFlJJsMLfXrxLaYr4v7ZXJw=","experimentalEnvGetSecretEnabled":false});

export { manifest };
