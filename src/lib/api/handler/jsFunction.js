export const jsFunction = (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method,
) => {
  try {
    let codefunction = `
let RETURN_DATA = {};
${method.code}
return RETURN_DATA;
`
//JSON.stringify
//    console.log(method.code)

    let f = new Function('request', codefunction)

    response.status(200).json(f(request))
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message })
  }
}
