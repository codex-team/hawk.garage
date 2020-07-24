module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-rational-order'
  ],
  rules: {
    'plugin/rational-order': [ true ],
    'selector-type-no-unknown': [true, {
      ignoreTypes: [ /\^/ ]
    } ],
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['mixin', 'define-mixin']
    }]
  }
};
