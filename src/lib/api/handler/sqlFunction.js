import { Sequelize, QueryTypes } from "sequelize";

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);

    console.log("Config sqlFunction", paramsSQL, request.method);

    // Verificar las configuraciones minimas
    if (paramsSQL && paramsSQL.config.options && paramsSQL.query) {
      const sequelize = new Sequelize(
        paramsSQL.config.database,
        paramsSQL.config.username,
        paramsSQL.config.password,
        paramsSQL.config.options
      );

      let data_bind = {};

      if (request.method == "GET") {
        // Obtiene los datos del query
        for (let param in request.query) {
          if (request.query.hasOwnProperty(param)) {
            const valor = request.query[param];
            console.log(`Clave: ${param}, Valor: ${valor}`);
            // @ts-ignore
            data_bind[param] = valor;
          }
        }
      } else if (request.method == "POST") {
        // Obtiene los datos del body
        for (let param in request.body) {
          if (request.body.hasOwnProperty(param)) {
            const valor = request.body[param];
            console.log(`Clave: ${param}, Valor: ${valor}`);
            // @ts-ignore
            data_bind[param] = valor;
          }
        }
      }

//      console.log(config);

      let result_query = await sequelize.query(paramsSQL.query, {
        // @ts-ignore
        bind: data_bind,
        // @ts-ignore
        type: QueryTypes.SELECT,
      });

      //let data;

      // data = result_query;

      // @ts-ignore
      response.status(200).json(result_query);
    } else {
      response
        .status(500)
        .json({ error: "Params configuration is not complete" });
    }
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
