import { Method } from './models.js'

// UPSERT
export const upsertMethod = async (/** @type {import("sequelize").Optional<any, string>} */ methodData, /** @type {import("sequelize").UpsertOptions<any> | undefined} */ transaction) => {
  try {
    return await Method.upsert(methodData, transaction)
  } catch (error) {
    console.error('Error performing UPSERT on method:', error, methodData)
    throw error
  }
}

