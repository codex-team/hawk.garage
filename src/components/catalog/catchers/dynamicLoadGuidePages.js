let component;

export default {
  /**
   * Vue router navigation guard. Using for fetching instruction page
   *
   * @param {Route} to - route to which the user goes
   * @param {Route} _from - the route from which the user goes
   * @param {Function} next - next router guard
   */
  async beforeRouteEnter(to, _from, next) {
    const hasSeparatePage = [
      'javascript',
      'sentry',
    ];

    let view = 'common';

    if (hasSeparatePage.includes(to.params.page)) {
      view = to.params.page;
    }

    component = (await import(/* webpackChunkName: 'catcher-instructions-[request]' */ './guides/' + view)).default;
    next();
  },
  render: h => h(component),
};
