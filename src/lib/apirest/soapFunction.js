//import { uFetch } from "@edwinspire/universal-fetch";

export const soapFunction = (req, code) => {


/**
 * 
  console.log("SOAPGenericClient", SOAPParameters);

    try {
      if (
        SOAPParameters &&
        SOAPParameters.wsdl &&
        SOAPParameters.wsdl.length > 0
      ) {
        if (
          SOAPParameters.FunctionName &&
          SOAPParameters.FunctionName.length > 0
        ) {
          //      console.log("SOAPGenericClient createClient", wsdl);
          //         console.log("SOAPGenericClient createClient", wsdl);

          let client = await soap.createClientAsync(SOAPParameters.wsdl);

          if (
            SOAPParameters.BasicAuthSecurity &&
            SOAPParameters.BasicAuthSecurity.User
          ) {
            client.setSecurity(
              new soap.BasicAuthSecurity(
                SOAPParameters.BasicAuthSecurity.User,
                SOAPParameters.BasicAuthSecurity.Password
              )
            );
          }

          //console.log("SOAPGenericClient createClient", client);
          let result = await client[SOAPParameters.FunctionName + "Async"](
            SOAPParameters.RequestArgs
          );
          let r = await result;
          console.log("SOAPGenericClient result", r);
          return r[0];
        } else {
          return { error: "No se ha definido la funcion SOAP" };
        }
      } else {
        return { error: "No se ha definido la URL del WSDL" };
      }
    } catch (error) {
      console.trace(error);
      return { error: error.message };
    }

 */




  try {
    let codefunction = `
let RETURN_DATA = {};
${code}
return RETURN_DATA;
`;
    let f = new Function("req", "res", "next", codefunction);

    let Return = f(req, res, next);

    res.status(200).json(Return);
  } catch (error) {
    console.trace(error);
    res.status(500).json({ error: error.message });
  }

  ////
};
