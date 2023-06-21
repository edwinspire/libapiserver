import {  Application } from "./models.js";
//import dbsequelize from "./sequelize.js";
import { getUserById } from "./user.js";
//import { Route, Method } from "./models.js";
//import { upsertRoute } from "./route.js";
//import { upsertMethod } from "./method.js";


// READ
export const getAppById = async (
  /** @type {import("sequelize").Identifier} */ idapp
) => {
  try {
    const app = await Application.findByPk(idapp, {
      attributes: ["idapp", "app", "rowkey", "data"],
    });
    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};

export const getAllApps = async () => {
  try {
    const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    return apps;
  } catch (error) {
    console.error("Error retrieving apps:", error);
    throw error;
  }
};


// UPSERT
export const upsertApp = async (
  /** @type {import("sequelize").Optional<any, string>} */ appData,
  /** @type {undefined} */ transaction
) => {
  try {
    let [app, create] = await Application.upsert(appData, transaction);

    //console.log('XXXX>>> [app, create] ', app, create);

    let data = app.dataValues;
    console.log(data);
    /*
    if (data.idapp <= 0) {
      // No hay idapp se intenta obtenerlo de acuerdo con el nombre
      let d2 = await getAppById(data.idapp);
      data.idapp = d2.idapp;
    }
    */

    return data;
  } catch (error) {
    console.error("Error performing UPSERT on app:", error);
    throw error;
  }
};

/*
// Usage examples
const runExample = async () => {
  try {
    // Create an app
    const newApp = await createApp({
      name: 'MyApp',
      version: '1.0.0',
      description: 'My awesome app',
    })
    console.log('New app created:', newApp)

    // Get an app by ID
    const appById = await getAppById(newApp.id)
    console.log('App by ID:', appById)

    // Get all apps
    const allApps = await getAllApps()
    console.log('All apps:', allApps)

    // Update an app
    const updatedApp = await updateApp(newApp.id, {
      description: 'Updated description',
    })
    console.log('Updated app:', updatedApp)

    // Delete an app
    const deleted = await deleteApp(newApp.id)
    console.log('App deleted:', deleted)

    // Upsert an app
    const upsertedApp = await upsertApp({
      name: 'MyApp',
      version: '1.0.1',
      description: 'Updated app',
    })
    console.log('Upserted app:', upsertedApp)
  } catch (error) {
    console.error('Example error:', error)
  }
}

runExample()
*/


