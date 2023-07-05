/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    './.eslintrc.js',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['vue'],
}
