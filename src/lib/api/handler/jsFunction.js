// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";

export const createFunction = (/** @type {string} */ codefunction) => {
  return new Function("$_VARS_", codefunction);
};

export const jsFunction = (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let $_UFETCH_ = new uFetch();
    let codefunction = `
const {$_REQUEST_, $_UFETCH_} = $_VARS_;
let $_RETURN_DATA_ = {};
${method.code}
return $_RETURN_DATA_;
`;

    let f = createFunction(codefunction);

    response
      .status(200)
      .json(f({ $_REQUEST_: $_REQUEST_, $_UFETCH_: $_UFETCH_ }));
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
