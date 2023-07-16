// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
import { writable } from "svelte/store";

//export const tokenStore = writable('');
export const userStore = writable({});
export const listMethodStore = writable({});
export const listHandlerStore = writable({});
export const listFunctionStore = writable({});
export const listAppVars = writable({});


export const formatJsonForHtmlCode = (/** @type {any} */ json)=>{
 return JSON.stringify(json, null, 2)
  .replace(/\n/g, "<br/>")
  .replace(/ /g, "&nbsp;")
}

export const getListFunction = async (/** @type {string} */ token, /** @type {string} */ appName) => {
  let f = new uFetch();
  f.addHeader("api-token", token);
  try {
    let fr = await f.get("/system/main/functions", { appName: appName });
    let list = await fr.json();

    if (list && Array.isArray(list)) {
      let data = list.map((fn) => {
        return { id: fn, value: fn };
      });
      listFunctionStore.set(data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getListHandler = async (/** @type {string} */ token) => {
  let f = new uFetch();
  f.addHeader("api-token", token);
  try {
    let fr = await f.get("/system/main/handlers");
    let list = await fr.json();

    if (list && Array.isArray(list)) {
      let data = list.map((m) => {
        return {
          id: m.handler,
          value: m.label,
          enabled: m.enabled,
          description: m.description,
        };
      });
      listHandlerStore.set(data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getListMethods = async (/** @type {string} */ token) => {
  let f = new uFetch();
  f.addHeader("api-token", token);
  try {
    let fr = await f.get("/system/main/methods");
    let list = await fr.json();

    if (list && Array.isArray(list)) {
      let data = list.map((m) => {
        return {
          id: m.method,
          value: m.label,
          enabled: m.enabled,
          description: "",
        };
      });
      listMethodStore.set(data);
    }
  } catch (error) {
    console.error(error);
  }
};
