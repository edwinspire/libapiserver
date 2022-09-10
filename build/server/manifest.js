export const manifest = {
	appDir: "_app",
	assets: new Set(["css/bulma/bulma-rtl.css","css/bulma/bulma-rtl.css.map","css/bulma/bulma-rtl.min.css","css/bulma/bulma.css","css/bulma/bulma.css.map","css/bulma/bulma.min.css","css/fontawesome/css/all.css","css/fontawesome/css/all.min.css","css/fontawesome/css/brands.css","css/fontawesome/css/brands.min.css","css/fontawesome/css/fontawesome.css","css/fontawesome/css/fontawesome.min.css","css/fontawesome/css/regular.css","css/fontawesome/css/regular.min.css","css/fontawesome/css/solid.css","css/fontawesome/css/solid.min.css","css/fontawesome/css/svg-with-js.css","css/fontawesome/css/svg-with-js.min.css","css/fontawesome/css/v4-font-face.css","css/fontawesome/css/v4-font-face.min.css","css/fontawesome/css/v4-shims.css","css/fontawesome/css/v4-shims.min.css","css/fontawesome/css/v5-font-face.css","css/fontawesome/css/v5-font-face.min.css","css/fontawesome/webfonts/fa-brands-400.ttf","css/fontawesome/webfonts/fa-brands-400.woff2","css/fontawesome/webfonts/fa-regular-400.ttf","css/fontawesome/webfonts/fa-regular-400.woff2","css/fontawesome/webfonts/fa-solid-900.ttf","css/fontawesome/webfonts/fa-solid-900.woff2","css/fontawesome/webfonts/fa-v4compatibility.ttf","css/fontawesome/webfonts/fa-v4compatibility.woff2","favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".css":"text/css",".map":"application/json",".ttf":"font/ttf",".woff2":"font/woff2",".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		entry: {"file":"_app/immutable/start-82e7b762.js","imports":["_app/immutable/start-82e7b762.js","_app/immutable/chunks/index-b1fe9a41.js","_app/immutable/chunks/index-4fdc4e88.js","_app/immutable/chunks/singletons-eca981c1.js"],"stylesheets":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/4.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "about",
				pattern: /^\/about\/?$/,
				names: [],
				types: [],
				path: "/about",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				id: "todos",
				pattern: /^\/todos\/?$/,
				names: [],
				types: [],
				path: "/todos",
				shadow: () => import('./entries/endpoints/todos/index.ts.js'),
				a: [0,4],
				b: [1]
			},
			{
				type: 'endpoint',
				id: "apirest/[environment]/[app]/[route]/[version]",
				pattern: /^\/apirest\/([^/]+?)\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				names: ["environment","app","route","version"],
				types: [null,null,null,null],
				load: () => import('./entries/endpoints/apirest/_environment_/_app_/_route_/_version_.js')
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
