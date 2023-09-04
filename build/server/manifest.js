const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/bulma/bulma-rtl.css","css/bulma/bulma-rtl.css.map","css/bulma/bulma-rtl.min.css","css/bulma/bulma.css","css/bulma/bulma.css.map","css/bulma/bulma.min.css","css/fontawesome/css/all.css","css/fontawesome/css/all.min.css","css/fontawesome/css/brands.css","css/fontawesome/css/brands.min.css","css/fontawesome/css/fontawesome.css","css/fontawesome/css/fontawesome.min.css","css/fontawesome/css/regular.css","css/fontawesome/css/regular.min.css","css/fontawesome/css/solid.css","css/fontawesome/css/solid.min.css","css/fontawesome/css/svg-with-js.css","css/fontawesome/css/svg-with-js.min.css","css/fontawesome/css/v4-font-face.css","css/fontawesome/css/v4-font-face.min.css","css/fontawesome/css/v4-shims.css","css/fontawesome/css/v4-shims.min.css","css/fontawesome/css/v5-font-face.css","css/fontawesome/css/v5-font-face.min.css","css/fontawesome/webfonts/fa-brands-400.ttf","css/fontawesome/webfonts/fa-brands-400.woff2","css/fontawesome/webfonts/fa-regular-400.ttf","css/fontawesome/webfonts/fa-regular-400.woff2","css/fontawesome/webfonts/fa-solid-900.ttf","css/fontawesome/webfonts/fa-solid-900.woff2","css/fontawesome/webfonts/fa-v4compatibility.ttf","css/fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.8b89aedb.js","app":"_app/immutable/entry/app.3f2550b4.js","imports":["_app/immutable/entry/start.8b89aedb.js","_app/immutable/chunks/scheduler.009eed4a.js","_app/immutable/chunks/singletons.b302e8cc.js","_app/immutable/chunks/index.2058b505.js","_app/immutable/entry/app.3f2550b4.js","_app/immutable/chunks/scheduler.009eed4a.js","_app/immutable/chunks/index.cf223af7.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-d4d24fc2.js')),
			__memo(() => import('./chunks/1-a5238306.js')),
			__memo(() => import('./chunks/3-511de985.js'))
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
