const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/bulma/bulma-rtl.css","css/bulma/bulma-rtl.css.map","css/bulma/bulma-rtl.min.css","css/bulma/bulma.css","css/bulma/bulma.css.map","css/bulma/bulma.min.css","css/fontawesome/css/all.css","css/fontawesome/css/all.min.css","css/fontawesome/css/brands.css","css/fontawesome/css/brands.min.css","css/fontawesome/css/fontawesome.css","css/fontawesome/css/fontawesome.min.css","css/fontawesome/css/regular.css","css/fontawesome/css/regular.min.css","css/fontawesome/css/solid.css","css/fontawesome/css/solid.min.css","css/fontawesome/css/svg-with-js.css","css/fontawesome/css/svg-with-js.min.css","css/fontawesome/css/v4-font-face.css","css/fontawesome/css/v4-font-face.min.css","css/fontawesome/css/v4-shims.css","css/fontawesome/css/v4-shims.min.css","css/fontawesome/css/v5-font-face.css","css/fontawesome/css/v5-font-face.min.css","css/fontawesome/webfonts/fa-brands-400.ttf","css/fontawesome/webfonts/fa-brands-400.woff2","css/fontawesome/webfonts/fa-regular-400.ttf","css/fontawesome/webfonts/fa-regular-400.woff2","css/fontawesome/webfonts/fa-solid-900.ttf","css/fontawesome/webfonts/fa-solid-900.woff2","css/fontawesome/webfonts/fa-v4compatibility.ttf","css/fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.7fff696c.js","app":"_app/immutable/entry/app.9710cb57.js","imports":["_app/immutable/entry/start.7fff696c.js","_app/immutable/chunks/index.479db95b.js","_app/immutable/chunks/singletons.082d760a.js","_app/immutable/chunks/index.194f26b9.js","_app/immutable/entry/app.9710cb57.js","_app/immutable/chunks/index.479db95b.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-068ceafe.js'),
			() => import('./chunks/1-8902bb9f.js'),
			() => import('./chunks/3-6de1fa5b.js')
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
};

const prerendered = new Set(["/"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
