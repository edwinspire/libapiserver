// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";

export const createFunction = (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";

  if (app_vars && typeof app_vars === "object") {
    app_vars_string = `const $_VARS_APP = ${JSON.stringify(app_vars, null, 2)}`;
  }

  let codefunction = `
${app_vars_string}  
const {$_REQUEST_, $_UFETCH_} = $_VARS_;
let $_RETURN_DATA_ = {};
${code}
return $_RETURN_DATA_;
`;

//console.log(codefunction);

  return new Function("$_VARS_", codefunction);
};

export const jsFunction = (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    let $_UFETCH_ = new uFetch();
    /*
    let codefunction = `
const {$_REQUEST_, $_UFETCH_} = $_VARS_;
let $_RETURN_DATA_ = {};
${method.code}
return $_RETURN_DATA_;
`;
*/

    let f;

    if (method.jsFn) {
      console.log("Usa jsFn creada");
      f = method.jsFn;
    } else {
      console.log("Crea nueva jsFn");
      f = createFunction(method.code);
    }

    response
      .status(200)
      .json(f({ $_REQUEST_: $_REQUEST_, $_UFETCH_: $_UFETCH_ }));
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
