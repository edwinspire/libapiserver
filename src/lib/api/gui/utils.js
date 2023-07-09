// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
import { writable } from "svelte/store";

//export const tokenStore = writable('');
export const userStore = writable({});
export const listMethodStore = writable({});
export const listHandlerStore = writable({});

export const getListHandler = async (/** @type {string} */ token) => {
    let f = new uFetch();
    f.addHeader("api-token", token);
    try {
      let fr = await f.get("/api/system/handler");
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
    let fr = await f.get("/api/methods");
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
