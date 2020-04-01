module.exports = {
  stories: [ '../../src/storybook/stories/**/*.(js|jsx|ts|tsx)' ],
  addons: [
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-docs',
      options: {
        babelOptions: {
          presets: [
            [
              '@vue/cli-plugin-babel/preset',
              {
                jsx: false,
              },
            ],
          ],
        },
      },
    },
    '@storybook/addon-knobs',
    '@storybook/addon-links',
  ],
};
