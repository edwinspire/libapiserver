//import { uFetch } from "@edwinspire/universal-fetch";
import soap from "soap";

export const soapFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    console.log('method.code -----> ', method.code);

    let SOAPParameters = JSON.parse(method.code);

//    console.log(SOAPParameters);

    if (!SOAPParameters.RequestArgs) {
      if ($_REQUEST_.method == "GET") {
        // Obtiene los datos del query
        SOAPParameters.RequestArgs = $_REQUEST_.query;
      } else if ($_REQUEST_.method == "POST") {
        // Obtiene los datos del body
        SOAPParameters.RequestArgs = $_REQUEST_.body;
      }
    }

    let soap_response = await SOAPGenericClient(SOAPParameters);

    response.status(200).json(soap_response);
  } catch (error) {
    console.trace(error);
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }

  ////
};

const SOAPGenericClient = async (
  /** @type {{ wsdl: string; FunctionName: string | any[]; BasicAuthSecurity: { User: any; Password: any; }; RequestArgs: any; }} */ SOAPParameters
) => {
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
    // @ts-ignore
    return { error: error.message };
  }
};

const DriverGenericSOAP = async (
  /** @type {{ body: { args: {}; SOAP: any; }; }} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: any): void; new (): any; }; }; }} */ res
) => {
  //    let wsdl = pgdata.wsdl || req.body.wsdl || pgdata.SOAP.wsdl || req.body.SOAP.wsdl;
  let args_data = req.body.args || {};
  /*
  let Soapfunction = pgdata.SOAPFunction || pgdata.SOAP.Function || req.body.SOAPFunction || req.body.SOAP.Function || {};
*/
  let SOAPParameters = req.body.SOAP || {};
  SOAPParameters.RequestArgs = args_data;

  try {
    let soap_response = await SOAPGenericClient(SOAPParameters);
    res.status(200).json(soap_response);
  } catch (error) {
    // @ts-ignore
    res.status(500).json(error.message);
  }
};
