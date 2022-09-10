const base = "https://api.svelte.dev";
function api(method, resource, data) {
  return fetch(`${base}/${resource}`, {
    method,
    headers: {
      "content-type": "application/json"
    },
    body: data && JSON.stringify(data)
  });
}
const GET = async ({ locals }) => {
  const response = await api("GET", `todos/${locals.userid}`);
  if (response.status === 404) {
    return {
      body: {
        todos: []
      }
    };
  }
  if (response.status === 200) {
    return {
      body: {
        todos: await response.json()
      }
    };
  }
  return {
    status: response.status
  };
};
const POST = async ({ request, locals }) => {
  const form = await request.formData();
  await api("POST", `todos/${locals.userid}`, {
    text: form.get("text")
  });
  return {};
};
const redirect = {
  status: 303,
  headers: {
    location: "/todos"
  }
};
const PATCH = async ({ request, locals }) => {
  const form = await request.formData();
  await api("PATCH", `todos/${locals.userid}/${form.get("uid")}`, {
    text: form.has("text") ? form.get("text") : void 0,
    done: form.has("done") ? !!form.get("done") : void 0
  });
  return redirect;
};
const DELETE = async ({ request, locals }) => {
  const form = await request.formData();
  await api("DELETE", `todos/${locals.userid}/${form.get("uid")}`);
  return redirect;
};
export {
  DELETE,
  GET,
  PATCH,
  POST
};
