import { Role } from "./models.js";

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
              consume: [],
            },
          ],
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
