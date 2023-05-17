import { Sequelize } from "sequelize";

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    var sequelize = new Sequelize({
      dialect: "mssql",
      dialectModulePath: "sequelize-msnodesqlv8",
      dialectOptions: {
        connectionString:
          "Server=localhostMSSQLSERVER01;Database=master; Trusted_Connection=yes;",
      },
    });

    let data;
    let query = "SELECT GETDATE();";

    try {
      let data = await sequelize.query(query, {
        bind: [1], // Valor del parámetro de búsqueda
        type: Sequelize.QueryTypes.SELECT,
      });
    } catch (error) {
      // @ts-ignore
      console.log({ error: error.message });
    }

    response.status(200).json(data);
  } catch (error) {
    // @ts-ignore
    response.status(500).json({ error: error.message });
  }
};
