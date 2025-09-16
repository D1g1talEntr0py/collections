import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import typeScriptEslint from '@typescript-eslint/eslint-plugin';
import eslintPluginCompat from 'eslint-plugin-compat';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({ ignores: [ 'node_modules/**', 'tests/**', 'dist/**', '*.config.[tj]s', 'benchmark/**' ] }, {
	extends: [
		eslint.configs.recommended,
		...tsEslint.configs.recommended,
		...tsEslint.configs.recommendedTypeChecked,
		jsdoc.configs['flat/recommended-typescript'],
		eslintPluginCompat.configs['flat/recommended']
	],
	// @ts-expect-error - ESLint Flat Config types do not yet include `plugins`?
	plugins: { eslintPluginCompat, typeScriptEslint, jsdoc },
	languageOptions: {
		globals: { ...globals['shared-node-browser'] },
		parserOptions: {
			project: true,
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { impliedStrict: true }
			},
			tsconfigRootDir: import.meta.dirname,
			allowAutomaticSingleRunInference: true,
			warnOnUnsupportedTypeScriptVersion: false
		}
	},
	settings: {
		jsdoc: {
			mode: 'typescript',
			structuredTags: {
				template: {
					name: 'namepath-defining',
					type: true
				}
			}
		}
	},
	rules: {
		'jsdoc/no-types': [ 'error', { contexts: ['any'] } ],
		'jsdoc/check-param-names': [ 'error', { checkDestructured: false	}	],
		'jsdoc/require-param': [ 'error',	{ checkDestructured: false } ],
		'jsdoc/tag-lines': 0,
		'jsdoc/no-defaults': 0,
		'jsdoc/require-jsdoc': [ 'error',	{
				exemptEmptyConstructors: true,
				require: {
					ArrowFunctionExpression: true,
					ClassDeclaration: true,
					FunctionExpression: true,
					MethodDefinition: true
				}
			}
		],
		indent:  ['error', 'tab', { SwitchCase: 1 } ],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always', {
			omitLastInOneLineBlock: true,
			omitLastInOneLineClassBody: true
		}],
		'@typescript-eslint/unbound-method': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		"@typescript-eslint/method-signature-style": ["error", "property"],
		'@typescript-eslint/no-unused-vars': ['error', {
			args: 'all',
			argsIgnorePattern: '^_',
			caughtErrors: 'all',
			caughtErrorsIgnorePattern: '^_',
			destructuredArrayIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			ignoreRestSiblings: true
		}]
	}
});