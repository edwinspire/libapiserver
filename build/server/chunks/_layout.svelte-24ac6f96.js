import { c as create_ssr_component } from './index2-41dea004.js';

const css = {
  code: ".app.svelte-8o1gnw.svelte-8o1gnw{display:flex;flex-direction:column;min-height:100vh}main.svelte-8o1gnw.svelte-8o1gnw{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:64rem;margin:0 auto;box-sizing:border-box}footer.svelte-8o1gnw.svelte-8o1gnw{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px}footer.svelte-8o1gnw a.svelte-8o1gnw{font-weight:bold}@media(min-width: 480px){footer.svelte-8o1gnw.svelte-8o1gnw{padding:12px 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-8o1gnw"><main class="svelte-8o1gnw">${slots.default ? slots.default({}) : ``}</main>

	<footer class="svelte-8o1gnw"><p>visit <a href="https://kit.svelte.dev" class="svelte-8o1gnw">kit.svnnnnnnnelte.dev</a> to learn SvelteKit</p></footer>
</div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-24ac6f96.js.map
