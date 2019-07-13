module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    'codex',
    'plugin:vue/essential',
    'plugin:vue/base',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    'prefer-const': ['error', {
      'destructuring': 'all',
      'ignoreReadBeforeAssign': false
    } ],
    'multiline-comment-style': ['error', 'starred-block']
  },
  plugins: [ 'import' ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  }
};
