import { URL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		typecheck: { enabled: false },
		// types.ts contains only erased type declarations, so it has no runtime coverage obligations.
		coverage: { reporter: [ 'lcov', 'text' ], reportsDirectory: 'tests/coverage', include: [ 'src' ], exclude: [ 'src/index.ts', 'src/types.ts' ] }
	},
	resolve: {
		alias: { '@/': new URL('./', import.meta.url).pathname }
	}
});