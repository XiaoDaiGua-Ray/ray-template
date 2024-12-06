import vue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import parser from 'vue-eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      'dist/*',
      'node_modules/*',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      '**/.gitignore',
      '**/.vscode',
      '**/public',
      '**/yarn.*',
      '**/vite-env.*',
      '**/.prettierrc.*',
      '**/visualizer.*',
      '**/visualizer.html',
      '**/.env.*',
      'src/locales/lang',
      '**/.depcheckrc',
      'src/app-config/echart-themes/**/*.json',
      '**/*.md',
      'src/icons/*.svg',
    ],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.vue'],
  },
  ...compat.extends(
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'prettier',
    './unplugin/.eslintrc-auto-import.json',
  ),
  {
    plugins: {
      vue,
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineOptions: 'readonly',
        defineModel: 'readonly',
      },
      parser: parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
    },
    rules: {
      'no-undefined': ['error'],
      'linebreak-style': ['error', 'unix'],
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true,
        },
      ],
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
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
      'no-catch-shadow': 2,
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
      'no-new-object': 2,
      'no-new-require': 2,
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
      'vue/component-tags-order': [
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
        {
          blankLine: 'always',
          prev: ['import'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'import',
          next: 'import',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'export',
        },
        {
          blankLine: 'any',
          prev: 'export',
          next: 'export',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'if',
            'class',
            'for',
            'do',
            'while',
            'switch',
            'try',
            'with',
            'function',
            'block',
            'block-like',
            'break',
            'case',
            'continue',
            'return',
            'throw',
            'debugger',
          ],
        },
        {
          blankLine: 'always',
          prev: [
            'if',
            'class',
            'for',
            'do',
            'while',
            'switch',
            'try',
            'with',
            'function',
            'block',
            'block-like',
            'break',
            'case',
            'continue',
            'return',
            'throw',
            'debugger',
          ],
          next: '*',
        },
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
]
