import { Method } from './models.js'

// CREATE
const createMethod = async (/** @type {import("sequelize").Optional<any, string> | undefined} */ methodData) => {
  try {
    const newMethod = await Method.create(methodData)
    return newMethod
  } catch (error) {
    console.error('Error creating method:', error)
    throw error
  }
}

// READ
const getMethodById = async (/** @type {import("sequelize").Identifier | undefined} */ methodId) => {
  try {
    const method = await Method.findByPk(methodId)
    return method
  } catch (error) {
    console.error('Error retrieving method:', error)
    throw error
  }
}

const getAllMethods = async () => {
  try {
    const methods = await Method.findAll()
    return methods
  } catch (error) {
    console.error('Error retrieving methods:', error)
    throw error
  }
}

// UPDATE
const updateMethod = async (/** @type {import("sequelize").Identifier | undefined} */ methodId, /** @type {{ [x: string]: any; }} */ methodData) => {
  try {
    const method = await Method.findByPk(methodId)
    if (method) {
      await method.update(methodData)
      return method
    }
    return null // Method not found
  } catch (error) {
    console.error('Error updating method:', error)
    throw error
  }
}

// DELETE
const deleteMethod = async (/** @type {import("sequelize").Identifier | undefined} */ methodId) => {
  try {
    const method = await Method.findByPk(methodId)
    if (method) {
      await method.destroy()
      return true // Deletion successful
    }
    return false // Method not found
  } catch (error) {
    console.error('Error deleting method:', error)
    throw error
  }
}

// UPSERT
export const upsertMethod = async (/** @type {import("sequelize").Optional<any, string>} */ methodData, /** @type {import("sequelize").UpsertOptions<any> | undefined} */ transaction) => {
  try {
    return await Method.upsert(methodData, transaction)
  } catch (error) {
    console.error('Error performing UPSERT on method:', error, methodData)
    throw error
  }
}

// Usage examples
const runExample = async () => {
  try {
    // Create a method
    const newMethod = await createMethod({
      idroute: 1,
      env: 'dev',
      method: 'GET',
      version: 1,
      handler: 'getUserList',
    })
    console.log('New method created:', newMethod)

    // Get a method by ID
    // @ts-ignore
    const methodById = await getMethodById(newMethod.idmethod)
    console.log('Method by ID:', methodById)

    // Get all methods
    const allMethods = await getAllMethods()
    console.log('All methods:', allMethods)

    // Update a method
    // @ts-ignore
    const updatedMethod = await updateMethod(newMethod.idmethod, {
      handler: 'updatedHandler',
    })
    console.log('Updated method:', updatedMethod)

    // Delete a method
    // @ts-ignore
    const deleted = await deleteMethod(newMethod.idmethod)
    console.log('Method deleted:', deleted)

    // Upsert a method
    const upsertedMethod = await upsertMethod({
      idroute: 2,
      env: 'prod',
      method: 'POST',
      version: 2,
      handler: 'createUser',
    })
    console.log('Upserted method:', upsertedMethod)
  } catch (error) {
    console.error('Example error:', error)
  }
}

runExample()
