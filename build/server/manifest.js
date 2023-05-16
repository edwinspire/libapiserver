const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/bulma/bulma-rtl.css","css/bulma/bulma-rtl.css.map","css/bulma/bulma-rtl.min.css","css/bulma/bulma.css","css/bulma/bulma.css.map","css/bulma/bulma.min.css","css/fontawesome/css/all.css","css/fontawesome/css/all.min.css","css/fontawesome/css/brands.css","css/fontawesome/css/brands.min.css","css/fontawesome/css/fontawesome.css","css/fontawesome/css/fontawesome.min.css","css/fontawesome/css/regular.css","css/fontawesome/css/regular.min.css","css/fontawesome/css/solid.css","css/fontawesome/css/solid.min.css","css/fontawesome/css/svg-with-js.css","css/fontawesome/css/svg-with-js.min.css","css/fontawesome/css/v4-font-face.css","css/fontawesome/css/v4-font-face.min.css","css/fontawesome/css/v4-shims.css","css/fontawesome/css/v4-shims.min.css","css/fontawesome/css/v5-font-face.css","css/fontawesome/css/v5-font-face.min.css","css/fontawesome/webfonts/fa-brands-400.ttf","css/fontawesome/webfonts/fa-brands-400.woff2","css/fontawesome/webfonts/fa-regular-400.ttf","css/fontawesome/webfonts/fa-regular-400.woff2","css/fontawesome/webfonts/fa-solid-900.ttf","css/fontawesome/webfonts/fa-solid-900.woff2","css/fontawesome/webfonts/fa-v4compatibility.ttf","css/fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.26c73e6f.js","app":"_app/immutable/entry/app.12c4088d.js","imports":["_app/immutable/entry/start.26c73e6f.js","_app/immutable/chunks/index.fbfca894.js","_app/immutable/chunks/singletons.bac2ccc9.js","_app/immutable/entry/app.12c4088d.js","_app/immutable/chunks/index.fbfca894.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-692e8f98.js'),
			() => import('./chunks/1-ce15e622.js')
		],
		routes: [
			{
				id: "/apirest/app",
				pattern: /^\/apirest\/app\/?$/,
				params: [],
				page: null,
				endpoint: () => import('./chunks/_server-4d39d843.js')
			},
			{
				id: "/apirest/[environment]/[app]/[route]/[version]",
				pattern: /^\/apirest\/([^/]+?)\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"environment","optional":false,"rest":false,"chained":false},{"name":"app","optional":false,"rest":false,"chained":false},{"name":"route","optional":false,"rest":false,"chained":false},{"name":"version","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: () => import('./chunks/_server-e3d9542e.js')
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
