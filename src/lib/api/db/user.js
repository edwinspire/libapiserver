import { User } from './models.js'

export const upsertUser = async (
  /** @type {import("sequelize").Optional<any, string>} */ userData,
) => {
  try {
    const [user, created] = await User.upsert(userData)
    return { user, created }
  } catch (error) {
    console.error('Error performing UPSERT on user:', error)
    throw error
  }
}

/*
// CREATE
const createUser = async ( userData) => {
  try {
    const newUser = await User.create(userData)
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
*/

// READ
export const getUserById = async (
  /** @type {import("sequelize").Identifier | undefined} */ userId,
) => {
  try {
    const user = await User.findByPk(userId)
    return user
  } catch (error) {
    console.error('Error retrieving user:', error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const users = await User.findAll()
    return users
  } catch (error) {
    console.error('Error retrieving users:', error)
    throw error
  }
}

/*
// UPDATE
const updateUser = async ( userData) => {
  try {
    const user = await User.findByPk(userId)
    if (user) {
      await user.update(userData)
      return user
    }
    return null // User not found
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
*/

// DELETE
export const deleteUser = async (
  /** @type {import("sequelize").Identifier | undefined} */ userId,
) => {
  try {
    const user = await User.findByPk(userId)
    if (user) {
      await user.destroy()
      return true // Deletion successful
    }
    return false // User not found
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Usage examples
export const defaultUser = async () => {
  try {
    // Create a user
    const newUser = await upsertUser({
      username: 'admin',
      first_name: 'admin',
      last_name: 'admin',
      email: 'admin@example.com',
    })
    console.log('New user created:', newUser)

    // Get a user by ID
    // @ts-ignore
  //  const userById = await getUserById(newUser.iduser)
  //  console.log('User by ID:', userById)

    // Get all users
    const allUsers = await getAllUsers()
    console.log('All users:', allUsers)
/*
    // Update a user
    // @ts-ignore
    const updatedUser = await upsertUser({
      first_name: 'John Updated',
    })
    console.log('Updated user:', updatedUser)

    // Delete a user
    // @ts-ignore
    const deleted = await deleteUser(newUser.iduser)
    console.log('User deleted:', deleted)
*/
} catch (error) {
    console.error('Example error:', error)
  }
}

//runExample()
