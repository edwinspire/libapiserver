import { Endpoint } from './models.js';
import { endpoins_demo } from './demo_values.js';

export const upsertEndpoint = async (
	/** @type {import("sequelize").Optional<any, string>} */ data
) => {
	try {
		const [result, created] = await Endpoint.upsert(data, { returning: true });
		return { result, created };
	} catch (error) {
		console.error('Error retrieving:', error);
		throw error;
	}
};

// READ
export const getEndpointById = async (
	/** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
	try {
		const endpoint = await Endpoint.findByPk(idendpoint);
		return endpoint;
	} catch (error) {
		console.error('Error retrieving user:', error);
		throw error;
	}
};

export const getAllEndpoints = async () => {
	try {
		const endpoints = await Endpoint.findAll();
		return endpoints;
	} catch (error) {
		console.error('Error retrieving:', error);
		throw error;
	}
};

// DELETE
export const deleteEndpoint = async (
	/** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
	try {
		const ep = await Endpoint.findByPk(idendpoint);
		if (ep) {
			await ep.destroy();
			return true; // Deletion successful
		}
		return false; // User not found
	} catch (error) {
		console.error('Error deleting idendpoint:', error);
		throw error;
	}
};

// READ
export const getEndpointByApp = async (
	/** @type {import("sequelize").Identifier | undefined} */ appname
) => {
	try {
		const endpoints = await Endpoint.findAll({ where: { appname: appname } });
		return endpoints;
	} catch (error) {
		console.error('Error retrieving user:', error);
		throw error;
	}
};

export const demoEndpoints = async () => {
	try {
		await Endpoint.bulkCreate(endpoins_demo, {
			ignoreDuplicates: true
		});
		console.log('Bulk upsert completado con éxito.');
	} catch (error) {
		console.error('Error durante el bulk upsert:', error);
	}
};
