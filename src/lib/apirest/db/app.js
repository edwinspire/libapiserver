import {App} from "./models.js"

// CREATE
const createApp = async (appData) => {
  try {
    const newApp = await App.create(appData);
    return newApp;
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
};

// READ
const getAppById = async (appId) => {
  try {
    const app = await App.findByPk(appId);
    return app;
  } catch (error) {
    console.error('Error retrieving app:', error);
    throw error;
  }
};

const getAllApps = async () => {
  try {
    const apps = await App.findAll();
    return apps;
  } catch (error) {
    console.error('Error retrieving apps:', error);
    throw error;
  }
};

// UPDATE
const updateApp = async (appId, appData) => {
  try {
    const app = await App.findByPk(appId);
    if (app) {
      await app.update(appData);
      return app;
    }
    return null; // App not found
  } catch (error) {
    console.error('Error updating app:', error);
    throw error;
  }
};

// DELETE
const deleteApp = async (appId) => {
  try {
    const app = await App.findByPk(appId);
    if (app) {
      await app.destroy();
      return true; // Deletion successful
    }
    return false; // App not found
  } catch (error) {
    console.error('Error deleting app:', error);
    throw error;
  }
};

// UPSERT
const upsertApp = async (appData) => {
  try {
    const [app, created] = await App.upsert(appData);
    return { app, created };
  } catch (error) {
    console.error('Error performing UPSERT on app:', error);
    throw error;
  }
};

// Usage examples
const runExample = async () => {
  try {
    // Create an app
    const newApp = await createApp({
      name: 'MyApp',
      version: '1.0.0',
      description: 'My awesome app',
    });
    console.log('New app created:', newApp);

    // Get an app by ID
    const appById = await getAppById(newApp.id);
    console.log('App by ID:', appById);

    // Get all apps
    const allApps = await getAllApps();
    console.log('All apps:', allApps);

    // Update an app
    const updatedApp = await updateApp(newApp.id, {
      description: 'Updated description',
    });
    console.log('Updated app:', updatedApp);

    // Delete an app
    const deleted = await deleteApp(newApp.id);
    console.log('App deleted:', deleted);

    // Upsert an app
    const upsertedApp = await upsertApp({
      name: 'MyApp',
      version: '1.0.1',
      description: 'Updated app',
    });
    console.log('Upserted app:', upsertedApp);
  } catch (error) {
    console.error('Example error:', error);
  }
};

runExample();
