import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize'

// @ts-ignore
const dbsequelize = new Sequelize(process.env.DATABASE_URL_APIREST, {
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}) // Example for postgres

try {
  await dbsequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

export default dbsequelize
