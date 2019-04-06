module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: ['codex', 'plugin:vue/essential'],
  plugins: ['import'],
  parser: 'vue-eslint-parser'
};
