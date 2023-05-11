import {Route} from "./models.js":
// CREATE
const createRoute = async (routeData) => {
  try {
    const newRoute = await Route.create(routeData);
    return newRoute;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

// READ
const getRouteById = async (routeId) => {
  try {
    const route = await Route.findByPk(routeId);
    return route;
  } catch (error) {
    console.error('Error retrieving route:', error);
    throw error;
  }
};

const getAllRoutes = async () => {
  try {
    const routes = await Route.findAll();
    return routes;
  } catch (error) {
    console.error('Error retrieving routes:', error);
    throw error;
  }
};

// UPDATE
const updateRoute = async (routeId, routeData) => {
  try {
    const route = await Route.findByPk(routeId);
    if (route) {
      await route.update(routeData);
      return route;
    }
    return null; // Route not found
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

// DELETE
const deleteRoute = async (routeId) => {
  try {
    const route = await Route.findByPk(routeId);
    if (route) {
      await route.destroy();
      return true; // Deletion successful
    }
    return false; // Route not found
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error;
  }
};

// UPSERT
const upsertRoute = async (routeData) => {
  try {
    const [route, created] = await Route.upsert(routeData);
    return { route, created };
  } catch (error) {
    console.error('Error performing UPSERT on route:', error);
    throw error;
  }
};

// Usage examples
const runExample = async () => {
  try {
    // Create a route
    const newRoute = await createRoute({
      path: '/users',
      method: 'GET',
      handler: 'getUserList',
    });
    console.log('New route created:', newRoute);

    // Get a route by ID
    const routeById = await getRouteById(newRoute.id);
    console.log('Route by ID:', routeById);

    // Get all routes
    const allRoutes = await getAllRoutes();
    console.log('All routes:', allRoutes);

    // Update a route
    const updatedRoute = await updateRoute(newRoute.id, {
      handler: 'updatedHandler',
    });
    console.log('Updated route:', updatedRoute);

    // Delete a route
    const deleted = await deleteRoute(newRoute.id);
    console.log('Route deleted:', deleted);

    // Upsert a route
    const upsertedRoute = await upsertRoute({
      path: '/users',
      method: 'POST',
      handler: 'createUser',
    });
    console.log('Upserted route:', upsertedRoute);
  } catch (error) {
    console.error('Example error:', error);
  }
};

runExample();
