module.exports = {
  devServer: {
    watchOptions: {
      poll: true
    }
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/sign-up',
        '/login',
        '/docs'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
};
