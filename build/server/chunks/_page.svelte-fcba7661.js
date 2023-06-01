import { c as create_ssr_component, d as createEventDispatcher, f as add_attribute, v as validate_component } from './index2-a5cf0d2b.js';
import uFetch from '@edwinspire/universal-fetch';
import 'events';

const css = {
  code: '@import "bulma/css/bulma.min.css";.container.svelte-osrx57{max-width:400px;margin:0 auto;padding:2rem;margin-top:10vh;border:1px solid #ccc;border-radius:4px}.form.svelte-osrx57{margin-bottom:1rem}',
  map: null
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let username = "";
  let password = "";
  new uFetch();
  $$result.css.add(css);
  return `<div class="container svelte-osrx57"><h1 class="title is-4">Iniciar sesión</h1>
  <form class="form svelte-osrx57"><div class="field"><label class="label">Nombre de usuario</label>
      <div class="control"><input class="input" type="text" placeholder="Nombre de usuario" required${add_attribute("value", username, 0)}></div></div>
    <div class="field"><label class="label">Contraseña</label>
      <div class="control"><input class="input" type="password" placeholder="Contraseña" required${add_attribute("value", password, 0)}></div></div>
    <div class="field"><div class="control"><button class="button is-primary" type="submit">Iniciar sesión</button></div></div></form>
</div>`;
});

const Gui = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${`${validate_component(Login, "Login").$$render($$result, {}, {}, {})}`}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Gui, "APIServerGUI").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-fcba7661.js.map
