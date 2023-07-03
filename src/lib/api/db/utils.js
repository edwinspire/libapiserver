/**
 * @param {any} json
 */
export function AppToTable(json) {
  //console.log(json);

  /**
   * @type {any[]}
   */
  let result = [];

  const { idapp, app, rowkey, data } = json;
  let baseRow = {
    idapp,
    enabled: json.data.enabled,
    app,
    rowkey,
    description: json.data.description,
  };
  //console.warn("Inicila => ", idapp, app, rowkey, data);//
  let ns = data.namespaces;

  // Recorrer los datos para construir la matriz
  for (const d in ns) {
    // console.warn("->", d, ns[d]);

    for (const iname in ns[d].names) {
      const name = ns[d].names[iname];
      for (const iversion in name.versions) {
        const version = name.versions[iversion];
        let row = {
          url: `/api/${baseRow.app}/${ns[d].namespace}/${name.name}/v${version.version}/environment`,
          ...baseRow,
          namespace: ns[d].namespace,
          name: name.name,
          version: version.version,
          dev: version.dev,
          qa: version.qa,
          prd: version.prd,
        };

        result.push(row);
      }
    }
  }

  console.log("AppToTable = ", result);
  return result;
}

/**
 * @param {any[]} objeto
 */
export function TableToApp(objeto) {
  let nuevoObjeto = {
    idapp: objeto[0].idapp,
    app: objeto[0].app,
    rowkey: objeto[0].rowkey,
    data: {
      description: objeto[0].description,
      enabled: objeto[0].enabled || false,
      namespaces: [],
    },
  };

  for (let i = 0; i < objeto.length; i++) {
    let row = objeto[i];
    //  console.log("row>", row);

    // Buscamos el namespace, sino existe se la crea
    let ns = nuevoObjeto.data.namespaces.find(
      // @ts-ignore
      (element) => element.namespace == row.namespace
    );

    if (ns) {
      //      console.log("existe > ", ns);

      // Verifica si existe o no el name

      // @ts-ignore
      if (ns.names) {
        // Existe names
        // console.log("names >> EXISTE", ns.names);

        // @ts-ignore
        let name = ns.names.find(
          // @ts-ignore
          (element) => element.name == row.name
        );

        if (name) {
          //  console.log("MANE ", name);

          if (!name.versions) {
            name.versions = [];
          }

          let version = name.versions.find(
            // @ts-ignore
            (element) => element.version == row.version
          );

          if (!version) {
            name.versions.push({
              version: row.version,
              dev: row.dev,
              qa: row.qa,
              prd: row.prd,
            });
          }
        } else {
          let version = {
            version: row.version,
            dev: row.dev,
            qa: row.qa,
            prd: row.prd,
          };
          // @ts-ignore
          ns.names.push({ name: row.name, versions: [version] });
        }
      } else {
        // Buscamos el namespace, sino existe se la crea
        let version = {
          version: row.version,
          dev: row.dev,
          qa: row.qa,
          prd: row.prd,
        };
        // @ts-ignore
        ns.names.push({ name: row.name, versions: [version] });
      }
    } else {
      // @ts-ignore
      ns = { namespace: row.namespace, names: [] };
      let version = {
        version: row.version,
        dev: row.dev,
        qa: row.qa,
        prd: row.prd,
      };
      // @ts-ignore
      ns.names.push({ name: row.name, versions: [version] });

      // @ts-ignore
      nuevoObjeto.data.namespaces.push(ns);
    }
  }
  //   console.log(" nuevoObjeto>>> ", nuevoObjeto);

  return nuevoObjeto;
}
