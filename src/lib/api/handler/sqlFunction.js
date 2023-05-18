import { Sequelize, QueryTypes } from "sequelize";

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let config = JSON.parse(method.code);

    console.log("Config sqlFunction", config, request.method);

    // Verificar las configuraciones minimas
    if (config && config.options && config.query) {
      const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.options
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

      let result_query = await sequelize.query(config.query, {
        // @ts-ignore
        bind: data_bind,
        // @ts-ignore
        type: QueryTypes.SELECT,
      });

      let data;

      data = result_query;

      // @ts-ignore
      response.status(200).json(data);
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
