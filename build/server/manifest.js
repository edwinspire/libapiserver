const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/bulma/bulma-rtl.css","css/bulma/bulma-rtl.css.map","css/bulma/bulma-rtl.min.css","css/bulma/bulma.css","css/bulma/bulma.css.map","css/bulma/bulma.min.css","css/fontawesome/css/all.css","css/fontawesome/css/all.min.css","css/fontawesome/css/brands.css","css/fontawesome/css/brands.min.css","css/fontawesome/css/fontawesome.css","css/fontawesome/css/fontawesome.min.css","css/fontawesome/css/regular.css","css/fontawesome/css/regular.min.css","css/fontawesome/css/solid.css","css/fontawesome/css/solid.min.css","css/fontawesome/css/svg-with-js.css","css/fontawesome/css/svg-with-js.min.css","css/fontawesome/css/v4-font-face.css","css/fontawesome/css/v4-font-face.min.css","css/fontawesome/css/v4-shims.css","css/fontawesome/css/v4-shims.min.css","css/fontawesome/css/v5-font-face.css","css/fontawesome/css/v5-font-face.min.css","css/fontawesome/webfonts/fa-brands-400.ttf","css/fontawesome/webfonts/fa-brands-400.woff2","css/fontawesome/webfonts/fa-regular-400.ttf","css/fontawesome/webfonts/fa-regular-400.woff2","css/fontawesome/webfonts/fa-solid-900.ttf","css/fontawesome/webfonts/fa-solid-900.woff2","css/fontawesome/webfonts/fa-v4compatibility.ttf","css/fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.f982abbd.js","app":"_app/immutable/entry/app.4a5f8efd.js","imports":["_app/immutable/entry/start.f982abbd.js","_app/immutable/chunks/index.4457990f.js","_app/immutable/chunks/singletons.9a23d665.js","_app/immutable/chunks/index.6850ff3f.js","_app/immutable/entry/app.4a5f8efd.js","_app/immutable/chunks/index.4457990f.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-44dc8922.js'),
			() => import('./chunks/1-0de639c6.js'),
			() => import('./chunks/3-99238c51.js')
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
