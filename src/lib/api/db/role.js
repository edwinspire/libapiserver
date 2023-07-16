import { Role } from "./models.js";
import { Application } from "./models.js";
import { AppToTable } from "../db/utils.js";
import { getAllMethods } from "../db/method.js";

export const defaultRoles = async () => {
  try {
    console.log(" defaultRoles >>>>>> ");

    // create super user
    const r0 = await Role.findOne({
      where: { role: "none" },
    });
    if (!r0) {
      await Role.upsert({
        idrole: 0,
        role: "none",
        type: 0, // 0 sin privilegios, 1 superadmin (acceso total, configuraciones no aplican), 2 user (Aplican configuraciones)
        enabled: false,
        attrs: {
          users: {
            read: false,
            delete: false,
            create: false,
            update: false,
            types: [],
          },
          endpoints: [],
        },
      });
    }

    // create super user
    const r1 = await Role.findOne({
      where: { role: "super" },
    });
    if (!r1) {
      await Role.upsert({
        idrole: 1,
        role: "super",
        type: 1, // 0 sin privilegios, 1 superadmin (acceso total, configuraciones no aplican), 2 user (Aplican configuraciones)
        enabled: true,
        attrs: {
          apps: { create: true, read: true, delete: true, update: true },
          users: {
            read: true,
            delete: true,
            create: true,
            update: true,
            types: [0, 1, 2],
          },
          endpoints: ["*"],
        },
      });
    }

    /*
    // create admin user
    const r2 = await Role.findOne({
      where: { role: "admin" },
    });
    if (!r2) {
      await Role.create({
        role: "admin",
        type: 2, // 0 sin privilegios, 1 superadmin (acceso total, configuraciones no aplican), 2 user (Aplican configuraciones)
        enabled: true,
        attrs: {
          users: {
            read: true,
            delete: true,
            create: true,
            update: true,
            types: [0, 2],
          },
          endpoints: [
            {
              endpoint: "*",
              methods: {
                read: true,
                delete: true,
                create: true,
                update: true,
                upgrade: true,
              },
              consume: ["*"],
            },
          ],
        },
      });
    }
    */

    /*
    const r3 = await Role.findOne({
      where: { role: "public" },
    });
    if (!r3) {
      await Role.create({
        role: "public",
        type: 2, // 0 sin privilegios, 1 superadmin (acceso total, configuraciones no aplican), 2 user (Aplican configuraciones)
        enabled: true,
        attrs: {
          users: {
            read: false,
            delete: false,
            create: false,
            update: false,
            types: [],
          },
          endpoints: [
            {
              endpoint: "*",
              methods: {
                read: false,
                delete: false,
                create: false,
                update: false,
                upgrade: false,
              },
              consume: ["*"],
            },
          ],
        },
      });
    }
*/

    return;
  } catch (error) {
    console.error("Example error:", error);
    return;
  }
};

export const getAllEndpoints = async () => {
  try {
    // @ts-ignore
    let defaultMethods = {};
    const mtds = await getAllMethods();

    if (mtds && Array.isArray(mtds) && mtds.length > 0) {
      for (let i = 0; i < mtds.length; i++) {
        let m = mtds[i];
        // @ts-ignore
        defaultMethods[m.method] = {
          // @ts-ignore
          //method: m.method,
          // @ts-ignore
          //enabled: m.enabled,
          consume: false,
          create: false,
          read: false,
          update: false,
          delete: false,
          upgrade: false,
        };
        /*
        // @ts-ignore
        defaultMethods[mtds[i].label] = {
          consume: false,
          create: false,
          read: false,
          update: false,
          delete: false,
          upgrade: false,
        };
        */
      }
    }

    // console.log("-->>>>> defaultMethods >>>", defaultMethods);

    const apps = await Application.findAll();

    let appDataTable = apps
      .map((a) => {
        return AppToTable(a);
      })
      .flat()
      .map((endp) => {
        let endpointAttr = {
          url: endp.url,
          enabled: endp.enabled,
          // @ts-ignore
          methods: defaultMethods,
        };

        return endpointAttr;
      });
    //console.log("======> ", appDataTable);

    return appDataTable;
  } catch (error) {
    console.error("Error retrieving apps:", error);
    throw error;
  }
};

export const getRoleById = async (
  /** @type {import("sequelize").Identifier} */ idrole,
  /** @type {boolean} */ onlyData
) => {
  try {
    const role = await Role.findByPk(idrole, {
      attributes: ["idrole", "enabled", "role", "type", "attrs"],
    });

    if (role) {
      // @ts-ignore
      let attrs = role.attrs;
      // @ts-ignore
      if (attrs && attrs.endpoints && Array.isArray(attrs.endpoints)) {
        let AllEndpoints = await getAllEndpoints();

        let attrEndpoints = [...attrs.endpoints];
        // @ts-ignore
        role.attrs.endpoints = [];

        //       console.log("-------------- > attrEndpoints > ", attrEndpoints);

        for (let i = 0; i < AllEndpoints.length; i++) {
          let nendpoint = { ...AllEndpoints[i] };

          let k = Object.keys(nendpoint.methods);

          if (attrEndpoints.some((element) => element == "*")) {
            //console.log("++++++++++", nendpoint);
            for (let i = 0; i < k.length; i++) {
              // @ts-ignore
              nendpoint.methods[k[i]] = {
                consume: true,
                create: true,
                read: true,
                update: true,
                delete: true,
                upgrade: true,
              };
            }

            // @ts-ignore
            role.attrs.endpoints.push(nendpoint);
          } else {
            let ef = attrEndpoints.find((el) => {
              return el.url == nendpoint.url;
            });

            if (ef) {
  //            console.log(" Encontrado URL >>>", ef);
              //let km = Object.keys(ef.methods);
              for (let i = 0; i < k.length; i++) {
                let valueM = ef.methods[k[i]] || {};

                let newM = {
                  consume: valueM.consume || false,
                  create: valueM.create || false,
                  read: valueM.read || false,
                  update: valueM.update || false,
                  delete: valueM.delete || false,
                  upgrade: valueM.upgrade || false,
                };

                //let vM = Object.values(newM);
                //let existsTrue = vM.some((eM) => eM == true);

                // @ts-ignore
                nendpoint.methods[km[i]] = newM;
              }

              // @ts-ignore
              role.attrs.endpoints.push(nendpoint);
            } else {
//              console.log(" NO Encontrado URL >>>", nendpoint.url);
              // @ts-ignore
              role.attrs.endpoints.push(nendpoint);
            }

            // @ts-ignore
            //role.attrs.endpoints.push(AllEndpoints[i]);
          }
        }
      }
    }

    if (onlyData) {
      //console.log('+++++> role.attrs.endpoints', role.attrs.endpoints);

      //Filtra solo los endpoints que unicamente tienen al menos un atributo del método en true
      // @ts-ignore
      role.attrs.endpoints = role.attrs.endpoints.filter((ep) => {
        let vM = Object.values(ep.methods);
       // console.log("+++++> role.attrs.endpoints VM", vM);
        return vM.some((eM) => {
          return Object.values(eM).some((att) => att == true);
        });
      });
    }

    return role;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};
