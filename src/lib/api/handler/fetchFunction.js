// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";

export const fetchFunction = async (
  /** @type {{
	  url(url, init): unknown method?: any; headers: any; body: any; query: any; 
}} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  //console.log(uFetch);

  try {
    let req_headers = { ...request.headers };
    delete req_headers["content-length"];
    delete req_headers["host"];
    delete req_headers["connection"];

    let init = {
      headers: req_headers, // Usar los headers de la peticion
      body: request.body, // Usar los body de la peticion
      query: request.query, // Usar los query de la peticion
    };

    console.log(init);

    const FData = new uFetch();
    let resp = await FData[request.method](method.code, init);

    let r = await resp.json();
    response.status(resp.status).json(r);
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
