module.exports = {
  extends: [
    'codex',
    'plugin:vue/recommended',
    '@vue/typescript'
  ],
  rules: {
    "no-shadow": ["error", {
      /**
       * Adjust for vuex
       */
      "allow": ["state", "getters"]
    }],
  }
};
