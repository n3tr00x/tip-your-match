import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
		alias: { 'server-only': fileURLToPath(new URL('./test/empty-module.ts', import.meta.url)) },
	},
	test: {
		projects: [
			{
				test: {
					name: 'unit',
					environment: 'node',
					include: ['lib/**/*.test.ts', 'app/**/*.test.ts'],
				},
			},
			{
				test: {
					name: 'components',
					environment: 'jsdom',
					include: ['components/**/*.test.tsx'],
					setupFiles: ['./test/setup-components.ts'],
				},
			},
		],
		coverage: {
			provider: 'v8',
			include: ['lib/**', 'components/**'],
			exclude: ['components/ui/**', '**/*.test.*'],
		},
	},
});
