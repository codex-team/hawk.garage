module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: ['codex', 'plugin:vue/essential'],
  plugins: [ 'import' ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  }
};
