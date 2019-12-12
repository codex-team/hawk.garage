module.exports = {
  root: true,

  env: {
    browser: true
  },

  rules: {
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: false
    } ],
    'multiline-comment-style': ['error', 'starred-block']
  },

  plugins: [ 'import' ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  extends: [
    'codex',
    'plugin:vue/recommended',
    '@vue/typescript'
  ]
};
