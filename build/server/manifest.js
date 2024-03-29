const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt","svelte-welcome.png","svelte-welcome.webp"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.lwglXVkP.js","app":"_app/immutable/entry/app.SPn2EVJr.js","imports":["_app/immutable/entry/start.lwglXVkP.js","_app/immutable/chunks/scheduler.aTojFtUW.js","_app/immutable/chunks/singletons.KnXQmTRs.js","_app/immutable/chunks/index.UaLPdvMp.js","_app/immutable/entry/app.SPn2EVJr.js","_app/immutable/chunks/scheduler.aTojFtUW.js","_app/immutable/chunks/index.VwvfgrWf.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-NXxPxFqI.js')),
			__memo(() => import('./chunks/1-3-fx_F5W.js')),
			__memo(() => import('./chunks/3-oRDxaQP0.js'))
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
