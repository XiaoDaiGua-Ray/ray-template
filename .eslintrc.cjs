/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  extends: [
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'prettier',
    './unplugin/.eslintrc-auto-import.json',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    defineOptions: 'readonly',
    defineModel: 'readonly',
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
    ], // 强制导入类型显示标注 `import type xxx from 'xxx'`
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    'accessor-pairs': 2, // 强制同时存在 `get` 与 `set`
    'constructor-super': 0, // 强制子类构造函数中使用 `super` 调用父类的构造函数
    'default-case': 2, // `switch` 中强制含有 `default`
    eqeqeq: [2, 'allow-null'], // 强制使用严格判断 `===`
    'no-alert': 0, // 禁止使用 `alert`、`confirm`
    'no-array-constructor': 2, // 禁止使用数组构造器
    'no-bitwise': 0, // 禁止使用按位运算符
    'no-caller': 1, // 禁止使用 `arguments.caller`、`arguments.callee`
    'no-catch-shadow': 2, // 禁止 `catch` 子句参数与外部作用域变量同名
    'no-class-assign': 2, // 禁止给类赋值
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, // 禁止修改 `const` 声明的变量
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 `if(true)`、`if(1)`
    'no-dupe-keys': 2, // 在创建对象字面量时不允许 `key` 重复
    'no-dupe-args': 2, // 函数参数不能重复
    'no-duplicate-case': 2, // `switch` 中的 `case` 标签不能重复
    'no-eval': 1, // 禁止使用 `eval`
    'no-ex-assign': 2, // 禁止给 `catch` 语句中的异常参数赋值
    'no-extend-native': 2, // 禁止扩展 `native` 对象
    'no-extra-bind': 2, // 禁止不必要的函数绑定
    'no-extra-boolean-cast': [
      'error',
      {
        enforceForLogicalOperands: true,
      },
    ], // 禁止不必要的 `bool` 转换
    'no-extra-parens': 0, // 禁止非必要的括号
    semi: [
      'error',
      'never',
      {
        beforeStatementContinuationChars: 'always',
      },
    ],
    'no-fallthrough': 1, // 禁止 `switch` 穿透
    'no-func-assign': 2, // 禁止重复的函数声明
    'no-implicit-coercion': [
      'error',
      {
        allow: ['!!', '~'],
      },
    ], // 禁止隐式转换
    'no-implied-eval': 2, // 禁止使用隐式 `eval`
    'no-invalid-regexp': 2, // 禁止无效的正则表达式
    'no-invalid-this': 2, // 禁止无效的 `this`
    'no-irregular-whitespace': 2, // 禁止含有不合法空格
    'no-iterator': 2, // 禁止使用 `__iterator__ ` 属性
    'no-label-var': 2, // `label` 名不能与 `var` 声明的变量名相同
    'no-labels': 2, // 禁止标签声明
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-multi-spaces': 1, // 禁止使用多余的空格
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ], // 空行最多不能超过 `2` 行
    'no-new-func': 2, // 禁止使用 `new Function`
    'no-new-object': 2, // 禁止使用 `new Object`
    'no-new-require': 2, // 禁止使用 `new require`
    'no-sparse-arrays': 2, // 禁止稀疏数组
    'no-trailing-spaces': 1, // 一行结束后面不要有空格
    'no-unreachable': 2, // 禁止有无法执行的代码
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
        enforceForJSX: true,
      },
    ], // 禁止无用的表达式
    'no-useless-call': 2, // 禁止不必要的 `call` 和 `apply`
    'no-var': 'error', // 禁用 `var`
    'no-with': 2, // 禁用 `with`
    'use-isnan': 2, // 强制使用 isNaN 判断 NaN
    'no-multi-assign': 2, // 禁止连续声明变量
    'prefer-arrow-callback': 2, // 强制使用箭头函数作为回调
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
  },
}
