/*
 * For reference:
 * https://eslint.org/docs/user-guide/configuring
 */

module.exports = {
  env: {
    es6: true,
    mocha: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  globals: {},

  overrides: [
    {
      env: {
        node: true,
      },

      files: ['./.eslintrc.cjs'],
    },

    {
      files: ['./**/*.spec.js', './**/specs/**/*.js'],

      globals: {
        expect: 'writable',
      },
    },
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  plugins: ['prettier', '@typescript-eslint', 'import', 'promise', 'mocha'],
  root: true,

  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/no-empty-function': 'off',
    'arrow-body-style': 'off',
    'eslint-comments/no-unused-disable': 'error',
    'import/extensions': ['error', 'ignorePackages', {js: 'never', ts: 'never'}],
    'import/no-extraneous-dependencies': ['error', {devDependencies: true}],
    'no-unused-vars': 'off',
    'prefer-arrow-callback': 'off',
  },
}
