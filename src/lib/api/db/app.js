import { App } from './models.js'
import dbsequelize from './sequelize.js'
import { getUserById } from './user.js'
import { Route, Method } from './models.js'
import { upsertRoute } from './route.js'
import { upsertMethod } from './method.js'

// CREATE
const createApp = async (
  /** @type {import("sequelize").Optional<any, string> | undefined} */ appData,
) => {
  try {
    const newApp = await App.create(appData)
    return newApp
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

// READ
const getAppById = async (
  /** @type {import("sequelize").Identifier | undefined} */ appId,
) => {
  try {
    const app = await App.findByPk(appId)
    return app
  } catch (error) {
    console.error('Error retrieving app:', error)
    throw error
  }
}

const getAllApps = async () => {
  try {
    const apps = await App.findAll()
    return apps
  } catch (error) {
    console.error('Error retrieving apps:', error)
    throw error
  }
}

// UPDATE
const updateApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ appId,
  /** @type {{ [x: string]: any; }} */ appData,
) => {
  try {
    const app = await App.findByPk(appId)
    if (app) {
      await app.update(appData)
      return app
    }
    return null // App not found
  } catch (error) {
    console.error('Error updating app:', error)
    throw error
  }
}

// DELETE
const deleteApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ appId,
) => {
  try {
    const app = await App.findByPk(appId)
    if (app) {
      await app.destroy()
      return true // Deletion successful
    }
    return false // App not found
  } catch (error) {
    console.error('Error deleting app:', error)
    throw error
  }
}

// UPSERT
const upsertApp = async (
  /** @type {import("sequelize").Optional<any, string>} */ appData,
  /** @type {undefined} */ transaction,
) => {
  try {
    return await App.upsert(appData, transaction)
    //console.log(app, created);
    //return { app, created: created||[] }
  } catch (error) {
    console.error('Error performing UPSERT on app:', error)
    throw error
  }
}

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

export async function defaultExamples() {
  let ExampleJs = {
    description: 'Test 01 Handlers',
    app: 'test001',
    enabled: true,
    iduser: 1,
    route: [
      {
        route: 'javascript',
        enabled: true,
        method: [
          {
            env: 'dev',
            method: 'GET',
            enabled: true,
            version: 0.01,
            description: 'Test 01',
            handler: 'jsFunction',
            code: "RETURN_DATA = {funciona: 'mundo funciona bien'};",
          },
        ],
      },
      {
        route: 'fetch',
        enabled: true,
        method: [
          {
            env: 'dev',
            method: 'GET',
            enabled: true,
            version: 0.02,
            description: 'Test Fetch',
            handler: 'fetchFunction',
            code: 'https://api.github.com/users/edwinspire',
          },
        ],
      },
    ],
  }

  return await saveApp(ExampleJs)
}

/**
 * @param {import("sequelize").Optional<any, string>} appData
 */
export async function saveApp(appData) {
  const transaction = await dbsequelize.transaction()

  try {
    // Verificar si el usuario existe
    let user = await getUserById(appData.iduser)

    if (user && user.enabled) {
      let [app, create] = await upsertApp(appData, { transaction })
      appData.idapp = appData.idapp || app.idapp

      if (appData.idapp < 1) {
        // trata de obtener el idapp
        let app1 = await App.findAll({ where: { app: appData.app } })

        if (
          app1 &&
          Array.isArray(app1) &&
          app1.length > 0 &&
          app1[0].idapp > 0
        ) {
          appData.idapp = app1[0].idapp
        } else {
          console.log('No se pudo obtener el idapp')
        }
      }

      if (appData.idapp > 0) {
        if (
          appData.route &&
          Array.isArray(appData.route) &&
          appData.route.length > 0
        ) {
          // Ingresamos las rutas
          console.log('Ingresamos las rutas para la idapp ' + appData.idapp)
          for (let index = 0; index < appData.route.length; index++) {
            let route = { ...appData.route[index] }
            let route_result = await upsertRoute(appData.idapp, route, {
              transaction,
            })
            //    console.log('route_result ++++++++++>++++>++>', route_result)

            if (
              route_result &&
              Array.isArray(route_result) &&
              route_result.length > 0 &&
              route_result[0].idroute > 0
            ) {
              route.idroute = route_result[0].idroute

              // Ingresamos los métodos
              if (route && route.method && Array.isArray(route.method)) {
                for (let indexm = 0; indexm < route.method.length; indexm++) {
                  let method = {
                    ...route.method[indexm],
                    idroute: route.idroute,
                  }
                  await upsertMethod(method, { transaction })
                }
              }
            } else {
              //await transaction.rollback()
              console.log('route_result no Encontrado', route_result)
              //return { error: 'Method not found' }
            }
          }
        }
      } else {
        await transaction.rollback()
        return { error: 'idapp Not Found' }
      }

      // Confirmar la transacción
      await transaction.commit()
      console.log('Transacción completada con éxito')

      let outData = await getFullApp(appData.idapp)

      return { data: outData }
    } else {
      return { error: 'User not found' }
    }
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await transaction.rollback()

    console.error('Error en la transacción:', error)
    // @ts-ignore
    return { error: error.message }
  }
}

/**
 * @param {import("sequelize").Identifier | Number} idapp
 */
export async function getFullApp(idapp) {
  try {
    let dataApp = await getAppById(idapp)

    //    console.log(dataApp)

    let outApp = dataApp?.dataValues

    if (outApp && outApp.idapp && outApp.idapp > 0) {
      let routes = await Route.findAll({ where: { idapp: idapp } })

      if (routes && Array.isArray(routes) && routes.length > 0) {
        for (let index = 0; index < routes.length; index++) {
          // @ts-ignore
          routes[index].method = []
          routes[index] = routes[index].dataValues
          let methods = await Method.findAll({
            // @ts-ignore
            where: { idroute: routes[index].idroute },
          })

          // @ts-ignore
          routes[index].method = methods.map((m) => {
            return m.dataValues
          })

          /*
          for (let indexm = 0; indexm < methods.length; indexm++) {
            const element = methods[indexm];
            routes.push();
          }
          */
        }
      }
      outApp.route = routes
    }

    /*
    if (outApp == null || outApp == undefined) {
      throw `${idapp} not found`
    }
    */

    return outApp
  } catch (error) {
    return { error: error.message }
  }
}
