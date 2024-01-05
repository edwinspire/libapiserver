const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/_bulma/bulma-rtl.css","css/_bulma/bulma-rtl.css.map","css/_bulma/bulma-rtl.min.css","css/_bulma/bulma.css","css/_bulma/bulma.css.map","css/_bulma/bulma.min.css","css/_fontawesome/css/all.css","css/_fontawesome/css/all.min.css","css/_fontawesome/css/brands.css","css/_fontawesome/css/brands.min.css","css/_fontawesome/css/fontawesome.css","css/_fontawesome/css/fontawesome.min.css","css/_fontawesome/css/regular.css","css/_fontawesome/css/regular.min.css","css/_fontawesome/css/solid.css","css/_fontawesome/css/solid.min.css","css/_fontawesome/css/svg-with-js.css","css/_fontawesome/css/svg-with-js.min.css","css/_fontawesome/css/v4-font-face.css","css/_fontawesome/css/v4-font-face.min.css","css/_fontawesome/css/v4-shims.css","css/_fontawesome/css/v4-shims.min.css","css/_fontawesome/css/v5-font-face.css","css/_fontawesome/css/v5-font-face.min.css","css/_fontawesome/webfonts/fa-brands-400.ttf","css/_fontawesome/webfonts/fa-brands-400.woff2","css/_fontawesome/webfonts/fa-regular-400.ttf","css/_fontawesome/webfonts/fa-regular-400.woff2","css/_fontawesome/webfonts/fa-solid-900.ttf","css/_fontawesome/webfonts/fa-solid-900.woff2","css/_fontawesome/webfonts/fa-v4compatibility.ttf","css/_fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.8YbVnx2w.js","app":"_app/immutable/entry/app.dO7oVOTr.js","imports":["_app/immutable/entry/start.8YbVnx2w.js","_app/immutable/chunks/scheduler.aTojFtUW.js","_app/immutable/chunks/singletons.D2XZhUs-.js","_app/immutable/chunks/index.UaLPdvMp.js","_app/immutable/entry/app.dO7oVOTr.js","_app/immutable/chunks/scheduler.aTojFtUW.js","_app/immutable/chunks/index.VwvfgrWf.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-NXxPxFqI.js')),
			__memo(() => import('./chunks/1-T9HgasnP.js')),
			__memo(() => import('./chunks/3-ORPpgPYp.js'))
		],
		routes: [
			{
				id: "/apiserver",
				pattern: /^\/apiserver\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set(["/"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
