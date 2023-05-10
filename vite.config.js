import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl'

/** @type {import('vite').UserConfig} */
const config = {
	server: {https: false},
	plugins: [sveltekit(), basicSsl()]
};

export default config;
