import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import vue from 'eslint-plugin-vue'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import autoImports from './unplugin/.eslintrc-auto-import.json' with { type: 'json' }

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.ai-local/**',
    '**/public/**',
    'unplugin/**',
    '**/*.d.ts',
    '**/.husky/_/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...vue.configs['flat/recommended'],
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
        ...autoImports.globals,
      },
    },
    rules: {
      'no-undefined': ['error'],
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true,
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
        },
      ],
      'accessor-pairs': 2,
      'constructor-super': 0,
      'default-case': 2,
      eqeqeq: [2, 'allow-null'],
      'no-alert': 0,
      'no-array-constructor': 2,
      'no-bitwise': 0,
      'no-caller': 1,
      'no-class-assign': 2,
      'no-cond-assign': 2,
      'no-const-assign': 2,
      'no-constant-condition': 2,
      'no-dupe-keys': 2,
      'no-dupe-args': 2,
      'no-duplicate-case': 2,
      'no-eval': 1,
      'no-ex-assign': 2,
      'no-extend-native': 2,
      'no-extra-bind': 2,
      'no-extra-boolean-cast': [
        'error',
        {
          enforceForLogicalOperands: true,
        },
      ],
      'no-extra-parens': 0,
      semi: [
        'error',
        'never',
        {
          beforeStatementContinuationChars: 'always',
        },
      ],
      'no-fallthrough': 1,
      'no-func-assign': 2,
      'no-implicit-coercion': [
        'error',
        {
          allow: ['!!', '~'],
        },
      ],
      'no-implied-eval': 2,
      'no-invalid-regexp': 2,
      'no-invalid-this': 2,
      'no-irregular-whitespace': 2,
      'no-iterator': 2,
      'no-label-var': 2,
      'no-labels': 2,
      'no-lone-blocks': 2,
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
        },
      ],
      'no-new-func': 2,
      'no-sparse-arrays': 2,
      'no-trailing-spaces': 1,
      'no-unreachable': 2,
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: true,
        },
      ],
      'no-useless-call': 2,
      'no-var': 'error',
      'no-with': 2,
      'use-isnan': 2,
      'no-multi-assign': 2,
      'prefer-arrow-callback': 2,
      curly: ['error', 'all'],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: [],
        },
      ],
      'vue/no-use-v-if-with-v-for': [
        'error',
        {
          allowUsingIterationVar: false,
        },
      ],
      'vue/require-v-for-key': ['error'],
      'vue/require-valid-default-prop': ['error'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/v-on-event-hyphenation': ['error', 'never'],
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/no-v-html': ['error'],
      'vue/no-v-text': ['error'],
      'vue/component-api-style': [
        'error',
        ['script-setup', 'composition', 'composition-vue2'],
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],
      'vue/no-unused-refs': ['error'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/attribute-hyphenation': [
        'error',
        'never',
        {
          ignore: [],
        },
      ],
      'vue/no-restricted-static-attribute': [
        'error',
        {
          key: 'key',
          message: 'Disallow using key as a custom attribute',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='deprecated']",
          message: 'Using deprecated API is not allowed.',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'for' },
        { blankLine: 'always', prev: 'for', next: '*' },
        { blankLine: 'always', prev: '*', next: 'while' },
        { blankLine: 'always', prev: 'while', next: '*' },
        { blankLine: 'always', prev: '*', next: 'class' },
        { blankLine: 'always', prev: 'class', next: '*' },
        { blankLine: 'always', prev: '*', next: 'try' },
        { blankLine: 'always', prev: 'try', next: '*' },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
          allowObjectTypes: 'always',
        },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  // Formatting belongs to Prettier; keep ESLint focused on code and Vue correctness.
  prettier,
])
