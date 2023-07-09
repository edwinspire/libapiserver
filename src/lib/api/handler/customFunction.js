// @ts-ignore

export const customFunction = (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method,
  /** @type {{ [x: string]: (arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void; }} */ appFunctions
) => {
  try {
    if (appFunctions && appFunctions[method.code]) {
      appFunctions[method.code]($_REQUEST_, response);
    } else {
      response
        .status(404)
        .json({ error: `Function ${method.code} not found.` });
    }
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
