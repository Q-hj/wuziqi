import { fileURLToPath, URL } from 'node:url';

import Unocss from 'unocss/vite';

import transformerDirective from '@unocss/transformer-directives';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Unocss({
			transformers: [transformerDirective()],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
